// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { defineEventHandler, getCookie, createError } from 'h3';
import { validateSessionToken, SESSION_COOKIE_NAME } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE_NAME);

  if (!token) {
    // No token, user is not logged in
    return null;
  }

  try {
    const { user, session } = await validateSessionToken(token);

    if (!user || !session) {
      // Invalid or expired session
      // Optionally delete the invalid cookie here if desired
      // deleteCookie(event, SESSION_COOKIE_NAME, { ... });
      return null;
    }

    // Return necessary user information (exclude sensitive data)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles, // Roles are already included from validateSessionToken
    };

  } catch (error: any) {
    // Handle unexpected errors during validation
    console.error("Error fetching user state:", error);
    // Don't throw 500, just indicate user is not authenticated
    return null;
  }
}); 