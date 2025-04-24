// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import db from '@layers/database/db';
import { defineEventHandler, readBody, createError } from 'h3';
import { getUserFromSession } from '../../../../auth/server/utils/auth';
import { z } from 'zod';

const BlogPostSchema = z.object({
  title: z.string().min(1),
  category: z.string().optional(),
  slug: z.string().min(1),
  published: z.boolean().optional(),
  content: z.string().min(1),
  keywords: z.array(z.string()).optional(),
});

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event);
  if (!user || !user.roles?.some((r: any) => r.name === 'ADMIN')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  const slug = event.context.params?.slug;
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug parameter' });
  }
  const body = await readBody(event);
  const parse = BlogPostSchema.safeParse({
    ...body,
    keywords: body.keywords,
  });
  if (!parse.success) {
    throw createError({ statusCode: 400, statusMessage: 'Validation failed', data: parse.error.flatten() });
  }
  const post = await db.blogPost.update({
    where: { slug },
    data: {
      title: parse.data.title,
      category: parse.data.category || 'general',
      slug: parse.data.slug,
      published: parse.data.published ?? false,
      content: parse.data.content,
      keywords: parse.data.keywords,
    },
  });
  return post;
}); 