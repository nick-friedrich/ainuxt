// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { defineEventHandler, readValidatedBody, createError } from 'h3';
import { z } from 'zod';
import db from '@layers/database/db';
import { hashPassword } from '../../utils/auth';
import crypto from 'node:crypto';
import { sendEmail } from '@layers/mail/mail';

// Zod schema for registration data, now including locale
const registerBodySchema = z.object({
  email: z.string().email({ message: 'auth.validation.email_invalid' }),
  password: z.string().min(8, { message: 'auth.validation.password_minLength' }),
  locale: z.string().optional().default('en') // Add locale, default to 'en'
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // Access the server-side translation function from the event context
  const serverT = event.context.t;
  if (!serverT) {
    console.error('Server translation function (event.context.t) not found!');
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error: Translation service unavailable'
    });
  }

  // 1. Validate Body
  const bodyResult = await readValidatedBody(event, registerBodySchema.safeParse);

  if (!bodyResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Failed',
      data: bodyResult.error.flatten(),
    });
  }

  // Use validated locale or default
  const { email, password, locale } = bodyResult.data;

  try {
    // 2. Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createError({
        statusCode: 409, // Conflict
        message: 'auth.register.error_email_exists', // Return key for client translation
      });
    }

    // 3. Hash Password
    const hashedPassword = await hashPassword(password);

    // 4. Find default 'USER' role
    const userRole = await db.role.findUnique({
      where: { name: 'USER' },
    });

    if (!userRole) {
      console.error("CRITICAL: Default 'USER' role not found in database.");
      throw createError({ statusCode: 500, message: 'common.error.server_config' });
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token valid for 24 hours

    // 5. Create User, assign role, and set verification token
    const newUser = await db.user.create({
      data: {
        email,
        hashedPassword,
        emailVerifyToken: token,
        emailVerifyTokenExpiresAt: expiresAt,
        roles: {
          create: [
            { roleId: userRole.id },
          ],
        },
      },
      select: { id: true, email: true } // Select only needed fields
    });

    // 6. Send Verification Email using serverT and locale
    console.log('Sending verification email upon registration to:', newUser.email);
    await sendEmail({
      to: newUser.email,
      subject: serverT('auth.email.verify_subject', {}, locale),
      html: `
        <p>${serverT('auth.email.verify_body', {}, locale)}</p>
        <p>
          <a href="${config.public.applicationUrl}/verify-email?token=${token}">
            ${serverT('auth.email.verify_link', {}, locale)}
          </a>
        </p>
      `
    });

    console.log(`Verification token for ${newUser.email}: ${token}`);

    // 7. Return Success (indicate verification email sent)
    return {
      message: 'auth.register.success_verification_sent', // Return key for client translation
      userId: newUser.id
    };

  } catch (error: any) {
    console.error("Registration Error:", error);
    if (error.statusCode) { // Re-throw H3Errors
      throw error;
    }
    throw createError({ statusCode: 500, message: 'auth.register.error_generic' });
  }
}); 