// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { z } from 'zod';
import { getUserFromSession } from '../../utils/auth';
import db from '@layers/database/db';

// Validation schema for profile data
const profileSchema = z.object({
  name: z.string().min(1, { message: 'auth.profile.validation.name_required' }),
  email: z.string().email({ message: 'auth.profile.validation.email_invalid' })
});

export default defineEventHandler(async (event) => {
  try {
    // Get the authenticated user from session
    const user = await getUserFromSession(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'auth.profile.unauthorized'
      });
    }

    // Parse and validate request body
    const body = await readBody(event);
    const validatedData = profileSchema.parse(body);

    // Check if email is being changed
    const emailChanged = validatedData.email !== user.email;

    // If email is changing, check if it's already in use
    if (emailChanged) {
      const existingUser = await db.user.findUnique({
        where: { email: validatedData.email }
      });

      if (existingUser) {
        throw createError({
          statusCode: 400,
          message: 'auth.profile.email_already_exists'
        });
      }
    }

    // Update user profile
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name: validatedData.name,
        email: emailChanged ? validatedData.email : undefined,
        // If email is changed, set it as unverified
        emailVerifiedAt: emailChanged ? null : user.emailVerifiedAt
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerifiedAt: true
      }
    });

    // Return updated user data (without sensitive fields)
    return {
      user: updatedUser,
      message: emailChanged ? 'auth.profile.email_verification_required' : 'auth.profile.update_success'
    };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: 'auth.profile.validation_error',
        data: error.errors
      });
    }

    if (error.statusCode) {
      throw error;
    }

    console.error('Profile update error:', error);
    throw createError({
      statusCode: 500,
      message: 'auth.profile.server_error'
    });
  }
}); 