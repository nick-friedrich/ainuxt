// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import db from '@layers/database/db';
import { defineEventHandler, createError } from 'h3';
import { getUserFromSession } from '../../../../auth/server/utils/auth';

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug parameter' });
  }
  const post = await db.blogPost.findUnique({
    where: { slug },
  });
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Blog post not found' });
  }

  // Check if user is admin or if the post is published
  const user = await getUserFromSession(event);
  const isAdmin = user?.roles?.some((r: any) => r.name === 'ADMIN');

  if (!isAdmin && !post.published) {
    // Non-admin trying to access unpublished post - treat as not found
    throw createError({ statusCode: 404, statusMessage: 'Blog post not found' });
  }

  return post;
}); 