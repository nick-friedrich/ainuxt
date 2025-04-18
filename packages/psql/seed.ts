// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.

import db from "./index";
import dotenv from "dotenv";
import argon2 from "argon2";

dotenv.config();

async function main() {
  // Use Argon2 and the AUTH_SECRET from the env to hash the password
  const hashedPassword = await argon2.hash("password", {
    secret: Buffer.from(process.env.AUTH_SECRET || ""),
  });

  // Seed Roles
  const userRole = await db.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
    },
  });
  console.log(`Created/Found USER role with id: ${userRole.id}`);

  const adminRole = await db.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
    },
  });
  console.log(`Created/Found ADMIN role with id: ${adminRole.id}`);

  // Create admin user with ADMIN role
  const adminUser = await db.user.create({
    data: {
      id: "cluser123admin456", // Fixed ID for consistency
      email: "admin@example.com",
      name: "Admin",
      hashedPassword,
      roles: {
        create: {
          roleId: adminRole.id,
          // assignedAt is auto-generated with @default(now())
        }
      }
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  // Create regular user with USER role
  const regularUser = await db.user.create({
    data: {
      id: "cluser789regular012", // Fixed ID for consistency
      email: "user@example.com",
      name: "Regular User",
      hashedPassword,
      roles: {
        create: {
          roleId: userRole.id,
        }
      }
    },
  });
  console.log(`Created regular user: ${regularUser.email}`);

  console.log("Database seeding completed successfully!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
