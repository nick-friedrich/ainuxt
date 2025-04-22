// Add type declaration for H3 context (optional but recommended)
// Create a file like `server/types/h3.d.ts`
import { H3EventContext } from 'h3';

declare module 'h3' {
  interface H3EventContext {
    t: (key: string, params?: Record<string, string | number>, locale?: string) => string;
  }
}