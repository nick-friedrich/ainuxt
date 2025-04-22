import { defineEventHandler, getQuery, sendRedirect, createError, setCookie } from 'h3';
import db from '@layers/database/db';
// Import custom auth utils using relative path
import {
  generateSessionToken,
  createSession,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE
} from '../../../utils/auth';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  console.log('--- OTP Verify Endpoint Handler START ---');
  const query = getQuery(event);
  const token = query.token as string | undefined;
  const config = useRuntimeConfig(event);
  const loginUrl = new URL('/login', config.public.applicationUrl); // Redirect base

  if (!token) {
    console.log('OTP Verify: No token found in query.');
    loginUrl.searchParams.set('error', 'otp_invalid');
    return sendRedirect(event, loginUrl.toString(), 302);
  }

  try {
    // Find user by the OTP token
    const user = await db.user.findFirst({
      // Select necessary fields only
      select: { id: true, otpToken: true, otpTokenExpiresAt: true, emailVerifiedAt: true },
      where: { otpToken: token },
    });
    console.log(`OTP Verify: User found by token? ${user ? user.id : 'No'}`);

    // Check if user exists and token is not expired
    if (!user || !user.otpTokenExpiresAt || user.otpTokenExpiresAt < new Date()) {
      console.log('OTP Verify: Token invalid or expired.');
      if (user) {
        // Clear expired/invalid token
        await db.user.update({
          where: { id: user.id },
          data: { otpToken: null, otpTokenExpiresAt: null },
        });
      }
      loginUrl.searchParams.set('error', 'otp_expired');
      return sendRedirect(event, loginUrl.toString(), 302);
    }

    // Token is valid, log the user in

    // 1. Clear the OTP token fields
    console.log('OTP Verify: Clearing OTP token for user:', user.id);
    await db.user.update({
      where: { id: user.id },
      data: {
        otpToken: null,
        otpTokenExpiresAt: null,
        // Optionally update emailVerifiedAt
        // emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
      },
    });

    // 2. Generate a new session token (unhashed)
    console.log('OTP Verify: Generating new session token...');
    const newSessionToken = generateSessionToken();

    // 3. Create the session in the DB (stores hashed token)
    console.log('OTP Verify: Creating session in DB...');
    await createSession(newSessionToken, user.id);

    // 4. Set the session cookie with the *unhashed* token
    console.log('OTP Verify: Setting session cookie...');
    setCookie(event, SESSION_COOKIE_NAME, newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_COOKIE_MAX_AGE, // Use maxAge from auth utils
    });

    // 5. Redirect to the home page
    const homeUrl = new URL('/', config.public.applicationUrl);
    console.log('OTP Verify: Success! Redirecting to:', homeUrl.toString());
    return sendRedirect(event, homeUrl.toString(), 302);

  } catch (error: any) {
    // Log the actual error causing the catch block
    console.error('Error verifying OTP token:', error);
    loginUrl.searchParams.set('error', 'server_error');
    return sendRedirect(event, loginUrl.toString(), 302);
  }
}); 