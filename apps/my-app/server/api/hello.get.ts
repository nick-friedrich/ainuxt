import { db } from "#imports";

export default defineEventHandler(async () => {
  const users = await db.user.findMany();
  return users;
});
