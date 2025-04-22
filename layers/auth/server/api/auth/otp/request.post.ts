import { defineEventHandler, readValidatedBody, createError } from 'h3';
import { z } from 'zod';
import db from '@layers/database/db'; // Changed to default import
import crypto from 'node:crypto';
import { sendEmail } from '@layers/mail/mail'; // Import sendEmail
import { useRuntimeConfig } from '#imports'; // To get base URL for the link

// Zod schema for request body validation
const RequestBodySchema = z.object({
  email: z.string().email('auth.validation.email_invalid'), // Use i18n key
  locale: z.string().optional(), // Add locale to schema
});

// OTP Configuration
const OTP_LENGTH = 32; // Length of the random token string
const OTP_EXPIRY_MINUTES = 15; // OTP validity duration

export default defineEventHandler(async (event) => {
  // Use the custom server-side translation function from context
  const serverT = event.context.t;
  if (!serverT) {
    // Handle case where translation function isn't available
    console.error("Server translation function (event.context.t) not found!");
    throw createError({ statusCode: 500, message: 'Internal Server Error: Translation service unavailable' });
  }

  let email: string;
  let locale: string | undefined;
  try {
    const body = await readValidatedBody(event, RequestBodySchema.safeParse);
    if (!body.success) {
      // Use serverT for validation message translation
      throw createError({ statusCode: 400, statusMessage: serverT(body.error.issues[0].message) });
    }
    email = body.data.email;
    locale = body.data.locale; // Read locale from body
  } catch (error: any) {
    // Handle validation errors or other body reading errors
    if (error.statusCode === 400) throw error;
    console.error('Error reading request body:', error);
    // Use a generic error message key
    throw createError({ statusCode: 500, statusMessage: serverT('common.error.server_config') });
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    // --- Security Note ---
    // Always return a success response regardless of whether the user exists
    // to prevent user enumeration attacks. The actual logic (OTP generation, email)
    // only runs if the user is found.

    if (user) {
      // Generate a secure OTP token
      const otpToken = crypto.randomBytes(OTP_LENGTH).toString('hex');
      const otpTokenExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

      // Store the OTP token and expiry in the database
      // Note: Storing plain token temporarily. Consider hashing in production.
      await db.user.update({
        where: { id: user.id },
        data: {
          otpToken,
          otpTokenExpiresAt,
        },
      });

      // Construct the verification link
      const config = useRuntimeConfig(event);
      // TODO: Determine the correct verification page path
      // Use applicationUrl like in forgot.post.ts
      const verifyUrl = new URL('/verify-login', String(config.public.applicationUrl));
      verifyUrl.searchParams.set('token', otpToken);
      const verifyLink = verifyUrl.toString();

      // --- Send Email ---
      await sendEmail({
        to: user.email,
        subject: serverT('auth.otp.email_subject', {}, locale), // Pass locale
        // Construct basic HTML email content using translations
        html: `
          <p>${serverT('auth.otp.email_body', { name: user.name || user.email, minutes: OTP_EXPIRY_MINUTES }, locale)}</p>
          <p><a href="${verifyLink}">${serverT('auth.otp.email_link', {}, locale)}</a></p>
          <p>${serverT('auth.otp.email_ignore', {}, locale)}</p>
        `
        // locale: locale // Optional: Pass locale if sendEmail supports it
      });

    } else {
      // Log if user not found for debugging, but don't expose this to client
      console.log(`OTP request for non-existent user: ${email}`);
    }

    // Return success even if user doesn't exist or email fails silently
    return { message: 'OK' };

  } catch (error: any) {
    console.error('Error processing OTP request:', error);
    // Log the error but return a generic success response to the client
    // Avoid exposing internal errors like database connection issues.
    return { message: 'OK' }; // Still return OK to prevent enumeration
  }
}); 