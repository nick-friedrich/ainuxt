// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { getUserFromSession } from '../../utils/auth';
import db from '@layers/database/db';
import crypto from 'node:crypto';
import { sendEmail } from '@layers/mail/mail';


import * as en from '../../../i18n/locales/en.json'
import * as de from '../../../i18n/locales/de.json'

const translations = {
  en: en,
  de: de,
} as const;

type TranslationParams = Record<string, string | number>;

// Helper to access nested properties by dot notation
function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj) || path;
}

function t(key: string, params: TranslationParams = {}, locale = 'en') {
  let translation = getNestedValue(translations[locale as keyof typeof translations], key) ||
    getNestedValue(translations.en, key) ||
    key;

  Object.keys(params).forEach(param => {
    translation = translation.replace(new RegExp(`{${param}}`, 'g'), String(params[param]));
  });
  return translation;
}

export default defineEventHandler(async (event) => {
  // Get local from request, we send it with the request in the body
  const body = await readBody(event);
  const locale = body.locale || 'en';
  console.log('Sending verification email');
  const config = useRuntimeConfig();

  try {
    // Get the authenticated user
    const user = await getUserFromSession(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'auth.profile.unauthorized'
      });
    }

    // Check if email is already verified
    if (user.emailVerifiedAt) {
      console.log('Email already verified');
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

    // Send verification email
    // Note: In a real implementation, you would integrate with the mail layer here
    // await sendVerificationEmail(user.email, token);
    console.log('Sending verification email to:', user.email);
    await sendEmail({
      to: user.email,
      subject: t('auth.email.verify_subject', {}, locale),
      html: `
      <p>${t('auth.email.verify_body', {}, locale)}</p>
      <p>
      <a href="${config.public.applicationUrl}/verify-email?token=${token}">
      ${t('auth.email.verify_link', {}, locale)}
      </a>
      </p>
      `
    });

    // For now, we'll just log the token
    console.log(`Verification token for ${user.email}: ${token}`);

    return {
      message: 'auth.profile.verification_email_sent'
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    console.error('Email verification error:', error);
    throw createError({
      statusCode: 500,
      message: 'auth.profile.verification_email_error'
    });
  }
}); 