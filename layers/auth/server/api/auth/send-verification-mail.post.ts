// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { getUserFromSession } from '../../utils/auth';
import db from '@layers/database/db';
import crypto from 'node:crypto';
import { sendEmail } from '@layers/mail/mail';

export default defineEventHandler(async (event) => {
  // Get locale from request body for email content only
  const body = await readBody(event).catch(() => ({}));
  const emailLocale = body.locale || 'en'; // Used specifically for the email

  console.log('Sending verification email with locale:', emailLocale);
  const config = useRuntimeConfig();

  // Access the server-side translation function from the event context
  const serverT = event.context.t;
  if (!serverT) {
    console.error('Server translation function (event.context.t) not found!');
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error: Translation service unavailable' // Keep this generic
    });
  }

  try {
    // Get the authenticated user
    const user = await getUserFromSession(event);
    if (!user) {
      // Throw error with the key, client will translate
      throw createError({
        statusCode: 401,
        message: 'auth.profile.unauthorized'
      });
    }

    // Check if email is already verified
    if (user.emailVerifiedAt) {
      console.log('Email already verified');
      // Return message key, client will translate
      return {
        message: 'auth.profile.email_already_verified'
      };
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token valid for 24 hours

    // Update user with new verification token
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken: token,
        emailVerifyTokenExpiresAt: expiresAt
      }
    });

    // Send verification email using context translation function for email content
    console.log('Sending verification email to:', user.email);
    await sendEmail({
      to: user.email,
      subject: serverT('auth.email.verify_subject', {}, emailLocale),
      html: `
      <p>${serverT('auth.email.verify_body', {}, emailLocale)}</p>
      <p>
      <a href="${config.public.applicationUrl}/verify-email?token=${token}">
      ${serverT('auth.email.verify_link', {}, emailLocale)}
      </a>
      </p>
      `
    });

    console.log(`Verification token for ${user.email}: ${token}`);

    // Return success message key, client will translate
    return {
      message: 'auth.profile.verification_email_sent'
    };
  } catch (error: any) {
    if (error.statusCode) {
      // Just re-throw the error; client will handle translation of the message key
      throw error;
    }

    console.error('Email verification error:', error);
    // Throw error with the key, client will translate
    throw createError({
      statusCode: 500,
      message: 'auth.profile.verification_email_error'
    });
  }
}); 