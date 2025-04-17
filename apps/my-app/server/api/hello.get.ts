// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { db } from "#imports";

export default defineEventHandler(async () => {
  const users = await db.user.findMany();
  return users;
});
