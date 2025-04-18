// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { defineEventHandler, getCookie } from 'h3';
import { validateSessionToken, SESSION_COOKIE_NAME } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE_NAME);

  if (!token) {
    event.context.user = null;
    return;
  }

  const { user, session } = await validateSessionToken(token);
  if (user && session) {
    event.context.user = user;
  } else {
    event.context.user = null;
  }
}); 