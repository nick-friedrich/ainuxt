// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { defineEventHandler, readValidatedBody, createError } from 'h3';
import { z } from 'zod';
import db from '@layers/database/db';
import { hashPassword } from '../../utils/auth';

// Zod schema for registration data
const registerBodySchema = z.object({
  email: z.string().email({ message: 'validation.contact.email.invalid' }), // Reusing existing key for now
  password: z.string().min(8, { message: 'validation.password.minLength' }), // Add key like this to validation.ts
});

// TODO: Send verification email, therefore we need to refactor our i18n solution from send-verification-mail.post.ts
export default defineEventHandler(async (event) => {
  // 1. Validate Body
  const bodyResult = await readValidatedBody(event, registerBodySchema.safeParse);

  if (!bodyResult.success) {
    // Use ZodError.flatten() to get structured errors
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Failed',
      data: bodyResult.error.flatten(),
    });
  }

  const { email, password } = bodyResult.data;

  try {
    // 2. Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createError({
        statusCode: 409, // Conflict
        statusMessage: 'Conflict',
        message: 'An account with this email already exists.', // Consider i18n
      });
    }

    // 3. Hash Password
    const hashedPassword = await hashPassword(password);

    // 4. Find default 'USER' role (assuming it exists - seed this!)
    const userRole = await db.role.findUnique({
      where: { name: 'USER' },
    });

    if (!userRole) {
      console.error("CRITICAL: Default 'USER' role not found in database.");
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Server configuration error.'
      });
    }

    // 5. Create User and assign role
    const newUser = await db.user.create({
      data: {
        email,
        hashedPassword,
        roles: {
          create: [
            {
              roleId: userRole.id,
            },
          ],
        },
      },
    });

    // 6. Return Success (don't return password hash)
    return {
      statusCode: 201, // Created
      message: 'User registered successfully',
      userId: newUser.id // Optionally return the new user ID
    };

  } catch (error: any) {
    // Handle potential Prisma errors or thrown createError
    console.error("Registration Error:", error);
    if (error.statusCode) { // Re-throw H3Errors
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Could not register user.',
    });
  }
}); 