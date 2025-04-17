import db from "@packages/prisma-sqlite";

export default defineEventHandler(async () => {
  const users = await db.user.findMany();
  return users;
});
