// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { defineEventHandler, getCookie, deleteCookie, createError } from 'h3';
import { invalidateSession, SESSION_COOKIE_NAME } from '../../utils/auth';
import crypto from 'node:crypto'; // Needed for hashing the token

/**
 * Creates a SHA-256 hash of the session token to use as the session ID.
 * Replicated here for direct use, or could be imported if hashSessionToken was exported from auth.ts
 * @param {string} token - The session token.
 * @returns {string} The SHA-256 hash.
 */
function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE_NAME);

  if (token) {
    try {
      const sessionId = hashSessionToken(token);
      await invalidateSession(sessionId); // Invalidate the session in DB
    } catch (error) {
      // Log error but proceed to clear cookie regardless
      console.error("Error invalidating session during logout:", error);
    }
  }

  // Always clear the cookie
  deleteCookie(event, SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return { message: 'Logged out successfully' };
}); 