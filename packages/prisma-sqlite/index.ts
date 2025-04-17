import { PrismaClient } from './generated/prisma/client'

// Ensure a single PrismaClient instance in development to prevent hot-reload issues
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const db: PrismaClient = process.env.NODE_ENV === 'production'
  ? new PrismaClient()
  : global.prisma ?? (global.prisma = new PrismaClient())

export default db
