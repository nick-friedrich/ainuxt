// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { defineEventHandler, readBody, createError } from 'h3';
import { z } from 'zod';
import db from '@layers/database/db';
import crypto from 'node:crypto';
import { sendEmail } from '@layers/mail/mail';
import { useRuntimeConfig } from '#imports';

// Zod schema for forgot-password request
const forgotSchema = z.object({
  email: z.string().email({ message: 'auth.profile.validation.email_invalid' }),
  locale: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const serverT = event.context.t;
  if (!serverT) {
    throw createError({ statusCode: 500, message: 'Internal Server Error: Translation service unavailable' });
  }

  const body = await readBody(event);
  const parse = forgotSchema.safeParse(body);
  if (!parse.success) {
    throw createError({ statusCode: 400, message: 'auth.profile.validation_error', data: parse.error.flatten() });
  }
  const { email, locale } = parse.data;

  // Always respond success to avoid user enumeration
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return { message: 'auth.password.reset_email_sent' };
  }

  // Generate reset token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  // Save token and expiry
  await db.user.update({
    where: { id: user.id },
    data: { passwordResetToken: token, passwordResetTokenExpiresAt: expiresAt }
  });

  // Build reset URL with locale prefix
  const defaultLocale = config.public.i18n?.defaultLocale || 'en';
  const localePrefix = locale && locale !== defaultLocale ? `/${locale}` : '';
  const resetUrl = `${config.public.applicationUrl}${localePrefix}/reset-password?token=${token}`;

  // Send the reset email
  await sendEmail({
    to: user.email,
    subject: serverT('auth.password.reset_subject', {}, locale),
    html: `
      <p>${serverT('auth.password.reset_body', { url: resetUrl }, locale)}</p>
      <p><a href="${resetUrl}">${serverT('auth.password.reset_link', {}, locale)}</a></p>
    `
  });

  return { message: 'auth.password.reset_email_sent' };
}); 