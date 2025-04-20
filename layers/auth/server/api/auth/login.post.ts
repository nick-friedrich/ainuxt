// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { defineEventHandler, readValidatedBody, createError, setCookie } from 'h3';
import { z } from 'zod';
import db from '@layers/database/db';
import {
  verifyPassword,
  generateSessionToken,
  createSession,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
} from '../../utils/auth';

// Zod schema for login data
const loginBodySchema = z.object({
  email: z.string().email({ message: 'validation.contact.email.invalid' }), // Reuse key
  password: z.string().min(1, { message: 'validation.password.required' }), // Add key
});

export default defineEventHandler(async (event) => {
  // 1. Validate Body
  const bodyResult = await readValidatedBody(event, loginBodySchema.safeParse);

  if (!bodyResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Failed',
      data: bodyResult.error.flatten(),
    });
  }

  const { email, password } = bodyResult.data;

  try {
    // 2. Find user by email
    const user = await db.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } }, // Include roles
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid email or password.', // Generic message
      });
    }

    // Handle case where user exists but might not have a password (e.g., social login later)
    if (!user.hashedPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Password login not enabled for this account.', // Or 'Invalid credentials'
      });
    }

    // 3. Verify Password
    const isValidPassword = await verifyPassword(user.hashedPassword, password);
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid email or password.', // Generic message
      });
    }

    // 4. Generate and Create Session
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);

    // 5. Set Session Cookie
    setCookie(event, SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_COOKIE_MAX_AGE,
    });

    // 6. Return User Info (excluding sensitive data)
    // Explicitly type userRole based on the Prisma include structure
    const roles = user.roles.map((userRole: { role: { id: number; name: string } }) => userRole.role);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: roles, // Return roles
    };

  } catch (error: any) {
    console.error("Login Error:", error);
    if (error.statusCode) { // Re-throw H3Errors
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Could not log in user.',
    });
  }
}); 