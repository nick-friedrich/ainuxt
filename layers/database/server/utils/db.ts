// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
// Re-export the Prisma client instance made available by the Nitro plugin
// This provides a clean way to access it within server routes/utils

// Note: Accessing nitroApp requires H3Event context, typical in server routes.
// For utilities used outside of route handlers, consider alternative injection patterns
// or passing the prisma instance explicitly.

// ATTENTION: Only working in .vue files, not in .ts files
// But we keep this file if we call the db directly in vue

// Import the Prisma client instance from the shared psql package
import db from '@db/psql';

// Export the client directly. 
// Layers or apps using this layer can import this utility.
export default db;

// Export the PrismaClient type for convenience
// Note: This type comes from the generated client within packages/psql
import type { PrismaClient } from '@db/psql/generated/prisma/client';
export type { PrismaClient };

import { Session, User, Role, UserRole } from '@db/psql/generated/prisma';
export type { Session, User, Role, UserRole };