// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { getUserFromSession } from '../../utils/auth';
import db from '@layers/database/db';
import crypto from 'node:crypto';
import { sendEmail } from '@layers/mail/mail';

// TODO:// Missing server side translations
export default defineEventHandler(async (event) => {
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
      subject: 'Verify your email',
      html: `
      <p>Click <a href="${config.public.applicationUrl}/verify-email?token=${token}">here</a> to verify your email.</p>
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