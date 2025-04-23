/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "acceptedMarketing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "authProvider" TEXT DEFAULT 'password',
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
