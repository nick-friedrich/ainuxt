// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { defineEventHandler, readBody, createError } from 'h3';
import db from '@layers/database/db';

/**
 * Email verification endpoint
 * Accepts a verification token and marks the user's email as verified
 */
export default defineEventHandler(async (event) => {
  const { token } = await readBody(event);

  if (!token || typeof token !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'auth.email.verify_invalid_token',
    });
  }

  try {
    // Find user with matching token that hasn't expired
    const user = await db.user.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerifyTokenExpiresAt: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      throw createError({
        statusCode: 400,
        message: 'auth.email.verify_expired_or_invalid',
      });
    }

    // Update user record, mark email as verified, clear verification token
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        emailVerifyToken: null,
        emailVerifyTokenExpiresAt: null,
      },
    });

    return {
      success: true,
      message: 'auth.email.verify_success',
      email: user.email
    };
  } catch (error: any) {
    console.error('Email verification error:', error);

    if (error.statusCode) {
      throw error; // Re-throw H3 errors
    }

    throw createError({
      statusCode: 500,
      message: 'auth.email.verify_error',
    });
  }
}); 