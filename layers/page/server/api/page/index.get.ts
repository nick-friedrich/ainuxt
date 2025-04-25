// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import db from '@layers/database/db';
import { defineEventHandler } from 'h3';
import { getUserFromSession } from '../../../../auth/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event);
  const isAdmin = user?.roles?.some((r: any) => r.name === 'ADMIN');

  const whereClause = isAdmin ? {} : { published: true };

  const pages = await db.page.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
  return pages;
}); 