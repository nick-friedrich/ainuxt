# PSQL Package

// AI Generation Reference: See ~/\_ai/README.md for guidelines and patterns.

This package provides PostgreSQL integration for the monorepo, including authentication models and database utilities.

## Authentication Models

The package includes the following Prisma models for authentication:

### User

```prisma
model User {
  id                       String    @id @default(cuid())
  email                    String    @unique
  hashedPassword           String?
  name                     String?
  emailVerifiedAt          DateTime?
  emailVerifyToken         String?   @unique
  emailVerifyTokenExpiresAt DateTime?
  otpToken                 String?
  otpTokenExpiresAt        DateTime?
  createdAt                DateTime  @default(now())
  updatedAt                DateTime  @updatedAt
  deletedAt                DateTime?
  sessions                 Session[]
  roles                    UserRole[]
}
```

### Session

```prisma
model Session {
  id        String   @id
  expiresAt DateTime
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
}
```

### Role and UserRole

```prisma
model Role {
  id    Int       @id @default(autoincrement())
  name  String    @unique
  users UserRole[]
}

model UserRole {
  userId     String
  roleId     Int
  assignedAt DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role       Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  @@id([userId, roleId])
  @@index([roleId])
}
```

## Usage

### Database Client

The package provides a singleton Prisma client that can be used throughout the application:

```typescript
import { db } from "packages/psql";

// Use the client
const users = await db.user.findMany();
```

### Authentication

This package supports:

1. **Session-based authentication** with secure token handling
2. **Role-based access control** with User-Role relationships
3. **Password hashing** using argon2
4. **Email verification** infrastructure
5. **OTP/2FA support** structure

### Environment Variables

Required environment variables:

- `DATABASE_URL`: Connection string for PostgreSQL database
- `AUTH_SECRET`: Secret key for password hashing and token generation

## Seeding

The package includes a seed script for initializing the database with:

- Default admin user
- Regular user accounts
- Role definitions

Run the seed script with:

```bash
pnpm exec prisma db seed
```
