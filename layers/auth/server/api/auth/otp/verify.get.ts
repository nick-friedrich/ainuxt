import { defineEventHandler, getQuery, sendRedirect, createError, setCookie } from 'h3';
import db from '@layers/database/db';
import { generateSessionToken, createSession, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from '../../../utils/auth';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token as string | undefined;
  const config = useRuntimeConfig(event);
  const loginUrl = new URL('/login', config.public.applicationUrl);

  if (!token) {
    loginUrl.searchParams.set('error', 'otp_invalid');
    return sendRedirect(event, loginUrl.toString(), 302);
  }

  try {
    const user = await db.user.findFirst({
      select: { id: true, otpToken: true, otpTokenExpiresAt: true, emailVerifiedAt: true },
      where: { otpToken: token },
    });

    if (!user || !user.otpTokenExpiresAt || user.otpTokenExpiresAt < new Date()) {
      if (user) {
        await db.user.update({
          where: { id: user.id },
          data: { otpToken: null, otpTokenExpiresAt: null },
        });
      }
      loginUrl.searchParams.set('error', 'otp_expired');
      return sendRedirect(event, loginUrl.toString(), 302);
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        otpToken: null,
        otpTokenExpiresAt: null,
      },
    });

    const newSessionToken = generateSessionToken();

    await createSession(newSessionToken, user.id);

    setCookie(event, SESSION_COOKIE_NAME, newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_COOKIE_MAX_AGE,
    });

    const homeUrl = new URL('/', config.public.applicationUrl);
    return sendRedirect(event, homeUrl.toString(), 302);

  } catch (error: any) {
    console.error('Error verifying OTP token:', error);
    loginUrl.searchParams.set('error', 'server_error');
    return sendRedirect(event, loginUrl.toString(), 302);
  }
}); 