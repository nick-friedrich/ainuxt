// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { z } from 'zod';
import { getUserFromSession } from '~/server/utils/auth';
import { verifyPassword, hashPassword } from '~/server/utils/auth';
import db from '@layers/database/db';

// Validation schema for password data
const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'auth.profile.validation.current_password_required' }),
  newPassword: z.string().min(8, { message: 'auth.profile.validation.password_min_length' })
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
    const validatedData = passwordSchema.parse(body);

    // Fetch user with password hash
    const userWithPassword = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        hashedPassword: true
      }
    });

    if (!userWithPassword?.hashedPassword) {
      throw createError({
        statusCode: 400,
        message: 'auth.profile.password_not_set'
      });
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(
      userWithPassword.hashedPassword,
      validatedData.currentPassword
    );

    if (!isPasswordValid) {
      throw createError({
        statusCode: 400,
        message: 'auth.profile.invalid_current_password'
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(validatedData.newPassword);

    // Update user password
    await db.user.update({
      where: { id: user.id },
      data: {
        hashedPassword
      }
    });

    // Return success message
    return {
      message: 'auth.profile.password_update_success'
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

    console.error('Password update error:', error);
    throw createError({
      statusCode: 500,
      message: 'auth.profile.server_error'
    });
  }
}); 