import db from "@db/psql";

export default defineEventHandler(async () => {
  const users = await db.user.findMany();
  return users;
});
