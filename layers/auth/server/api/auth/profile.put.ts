// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { z } from 'zod';
import { defineEventHandler, readBody, createError } from 'h3';
import { useRuntimeConfig } from '#imports';
import { getUserFromSession } from '../../utils/auth';
import db from '@layers/database/db';
import crypto from 'node:crypto';
import { sendEmail } from '@layers/mail/mail';

// Validation schema for profile data (with confirmation)
const profileSchema = z
  .object({
    name: z.string().min(1, { message: 'auth.profile.validation.name_required' }),
    email: z.string().email({ message: 'auth.profile.validation.email_invalid' }),
    confirmEmail: z.string().email({ message: 'auth.profile.validation.email_invalid' })
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: 'auth.profile.validation.emails_must_match',
    path: ['confirmEmail'],
  });

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // Server-side translation function
  const serverT = event.context.t;
  if (!serverT) {
    throw createError({ statusCode: 500, message: 'Internal Server Error: Translation service unavailable' });
  }
  // Parse request body
  const body = await readBody(event);
  // Extract locale for email content
  const locale = (body as any).locale || config.public.i18n?.defaultLocale || 'en';
  try {
    // Get the authenticated user from session
    const user = await getUserFromSession(event);
    if (!user) {
      throw createError({ statusCode: 401, message: 'auth.profile.unauthorized' });
    }

    // Parse and validate request body
    const validatedData = profileSchema.parse(body);
    const { name, email } = validatedData;
    const emailChanged = email !== user.email;

    if (emailChanged) {
      // Generate verification token and expiry
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Update user with new email and verification token
      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          name,
          email,
          emailVerifiedAt: null,
          emailVerifyToken: token,
          emailVerifyTokenExpiresAt: expiresAt,
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerifiedAt: true,
        }
      });

      // Send verification email
      // Build verification URL with locale prefix
      const defaultLocale = config.public.i18n?.defaultLocale || 'en';
      const localePrefix = locale !== defaultLocale ? `/${locale}` : '';
      const verifyUrl = `${config.public.applicationUrl}${localePrefix}/verify-email?token=${token}`;

      await sendEmail({
        to: updatedUser.email,
        subject: serverT('auth.email.verify_subject', {}, locale),
        html: `
          <p>${serverT('auth.email.verify_body', {}, locale)}</p>
          <p><a href="${verifyUrl}">${serverT('auth.email.verify_link', {}, locale)}</a></p>
        `
      });

      // Return updated user and success key for verification email
      return { user: updatedUser, message: 'auth.profile.verification_email_sent' };
    }

    // No email change: regular update
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { name, email },
      select: { id: true, name: true, email: true, emailVerifiedAt: true }
    });
    return { user: updatedUser, message: 'auth.profile.update_success' };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw createError({ statusCode: 400, message: 'auth.profile.validation_error', data: error.errors });
    }
    if (error.statusCode) {
      throw error;
    }
    console.error('Profile update error:', error);
    throw createError({ statusCode: 500, message: 'auth.profile.server_error' });
  }
}); 