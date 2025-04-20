// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import crypto from 'node:crypto';
import argon2 from 'argon2';
// Revert to standard Prisma Client import
import type { Session, User, Role } from '@layers/database/db';

// Why is #imports not working? Because it's not a vue file
// Easier to use the db package directly here, but let's keep the layer for vue files
import db from '@db/psql';

// Constants
const SESSION_EXPIRY_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const SESSION_REFRESH_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 15; // 15 days
const SESSION_TOKEN_BYTES = 32;
const SESSION_ID_ENCODING = 'base64url'; // URL-safe base64
export const SESSION_COOKIE_NAME = 'auth_session_token'; // Single source of truth for session cookie name
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

/**
 * Generates a secure, random session token.
 * @returns {string} A base64url encoded session token.
 */
export function generateSessionToken(): string {
  const buffer = crypto.randomBytes(SESSION_TOKEN_BYTES);
  return buffer.toString(SESSION_ID_ENCODING);
}

/**
 * Hashes a password using Argon2.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} The Argon2 hash.
 */
export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    secret: Buffer.from(process.env.AUTH_SECRET || ''),
  });
}

/**
 * Verifies a password against an Argon2 hash.
 * @param {string} hash - The Argon2 hash.
 * @param {string} password - The plain text password.
 * @returns {Promise<boolean>} True if the password matches the hash, false otherwise.
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return await argon2.verify(hash, password, {
    secret: Buffer.from(process.env.AUTH_SECRET || ''),
  });
}

/**
 * Creates a SHA-256 hash of the session token to use as the session ID.
 * @param {string} token - The session token.
 * @returns {string} The SHA-256 hash.
 */
function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Creates a new session in the database.
 * @param {string} token - The session token.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Session>} The created session object.
 */
export async function createSession(token: string, userId: string): Promise<Session> {
  const sessionId = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);

  const session = await db.session.create({
    data: {
      id: sessionId,
      userId: userId,
      expiresAt: expiresAt,
    },
  });
  return session;
}

// Define the result type for session validation
export type SessionValidationResult =
  | { session: Session; user: User & { roles: Role[] } } // Includes roles
  | { session: null; user: null };

/**
 * Validates a session token, checks expiry, and refreshes if needed.
 * @param {string} token - The session token provided by the client.
 * @returns {Promise<SessionValidationResult>} An object containing the session and user (with roles) or nulls if invalid.
 */
export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = hashSessionToken(token);

  const result = await db.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: {
        include: {
          roles: { // Include the UserRole join table
            include: {
              role: true, // Include the actual Role data
            },
          },
        },
      },
    },
  });

  if (!result) {
    return { session: null, user: null };
  }

  // Separate session and user data
  const { user: userData, ...session } = result;

  // Check for expiration
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }

  // Refresh session expiry if it's within the refresh threshold
  if (Date.now() >= session.expiresAt.getTime() - SESSION_REFRESH_THRESHOLD_MS) {
    const newExpiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);
    try {
      await db.session.update({
        where: {
          id: session.id,
        },
        data: {
          expiresAt: newExpiresAt,
        },
      });
      session.expiresAt = newExpiresAt; // Update the session object in memory too
    } catch (error) {
      // Handle potential race condition if session was deleted between findUnique and update
      console.error("Error refreshing session expiry:", error);
      // Depending on strategy, you might invalidate here or just let it expire
      return { session: null, user: null };
    }
  }

  // Map the UserRole data to a simple array of Role objects
  // Explicitly type userRole based on the Prisma include structure
  const roles = userData.roles.map((userRole: { role: Role }) => userRole.role);
  const userWithRoles = { ...userData, roles };

  return { session, user: userWithRoles };
}

/**
 * Invalidates a single session by its ID.
 * @param {string} sessionId - The ID of the session to invalidate.
 * @returns {Promise<void>}
 */
export async function invalidateSession(sessionId: string): Promise<void> {
  try {
    await db.session.delete({ where: { id: sessionId } });
  } catch (error) {
    // Ignore errors if session doesn't exist (e.g., already deleted)
    // Log other unexpected errors if necessary
    // console.error("Error invalidating session:", error);
  }
}

/**
 * Invalidates all sessions for a specific user.
 * @param {string} userId - The ID of the user whose sessions should be invalidated.
 * @returns {Promise<void>}
 */
export async function invalidateAllUserSessions(userId: string): Promise<void> {
  await db.session.deleteMany({
    where: {
      userId: userId,
    },
  });
} 