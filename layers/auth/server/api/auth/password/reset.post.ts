// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { defineEventHandler, readValidatedBody, createError, setCookie } from 'h3';
import { z } from 'zod';
import db from '@layers/database/db';
import { hashPassword } from '../../../utils/auth';
import { useRuntimeConfig } from '#imports';

// Zod schema for password reset
const resetSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8, { message: 'auth.validation.password.minLength' }),
  confirmPassword: z.string(),
  locale: z.string().optional().default('en')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'auth.password.reset_mismatch',
  path: ['confirmPassword']
});

export default defineEventHandler(async (event) => {
  console.log("[/api/auth/password/reset] Received request");
  const config = useRuntimeConfig();
  const serverT = event.context.t;
  if (!serverT) {
    throw createError({ statusCode: 500, message: 'Internal Server Error: Translation service unavailable' });
  }

  // Validate request body
  const { success, data, error } = await readValidatedBody(event, resetSchema.safeParse);
  if (!success) {
    throw createError({ statusCode: 400, message: 'auth.profile.validation_error', data: error.flatten() });
  }
  const { token, newPassword, locale } = data;

  // Find user by reset token
  const user = await db.user.findFirst({
    where: { passwordResetToken: token, passwordResetTokenExpiresAt: { gt: new Date() } }
  });
  if (!user) {
    throw createError({ statusCode: 400, message: 'auth.password.reset_invalid_token' });
  }

  // Hash new password and update user
  try {
    const hashed = await hashPassword(newPassword);
    await db.user.update({
      where: { id: user.id },
      data: {
        hashedPassword: hashed,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null
      }
    });
  } catch (dbError: any) {
    console.error("Error during password reset hashing or DB update:", dbError);
    // Ensure the generic error key is sent back in the expected format
    throw createError({
      statusCode: 500,
      message: 'auth.password.reset_error' // Use the translation key directly
    });
  }

  // If successful, return the success message key
  return { message: 'auth.password.reset_success' };
}); 