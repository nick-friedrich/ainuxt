// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.

import db from "./index";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  await db.user.create({
    data: {
      email: "user1@example.com",
      name: "User 1",
    },
  });
}

main().catch((e) => {
  console.error(e);
});
