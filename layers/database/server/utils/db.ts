// Re-export the Prisma client instance made available by the Nitro plugin
// This provides a clean way to access it within server routes/utils

// Note: Accessing nitroApp requires H3Event context, typical in server routes.
// For utilities used outside of route handlers, consider alternative injection patterns
// or passing the prisma instance explicitly.

import { H3Event } from 'h3';

// Import the Prisma client instance from the shared psql package
import db from '@db/psql';

// Export the client directly. 
// Layers or apps using this layer can import this utility.
export default db;

// Export the PrismaClient type for convenience
// Note: This type comes from the generated client within packages/psql
import type { PrismaClient } from '@db/psql/generated/prisma/client';
export type { PrismaClient };

// Alternatively, if you often need just the client type:
// export type { PrismaClient }; 