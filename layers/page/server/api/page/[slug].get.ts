// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import db from '@layers/database/db';
import { defineEventHandler, createError } from 'h3';
import { getUserFromSession } from '../../../../auth/server/utils/auth';

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug parameter' });
  }
  const page = await db.page.findUnique({
    where: { slug },
  });
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  }

  // Check if user is admin or if the page is published
  const user = await getUserFromSession(event);
  const isAdmin = user?.roles?.some((r: any) => r.name === 'ADMIN');

  if (!isAdmin && !page.published) {
    // Non-admin trying to access unpublished page - treat as not found
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  }

  return page;
}); 