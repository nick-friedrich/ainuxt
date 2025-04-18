// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Add the database layer
  extends: [
    '../../layers/base',
    '@layers/styling', // using pnpm workspace to link the layer

    // The layout layer is extended by the auth layer, so we don't need to extend it here.
    // '../../layers/layout',

    '../../layers/database', // Path relative to this nuxt.config.ts
    '../../layers/i18n',
    '../../layers/auth',
  ],

  // Expose DATABASE_URL to the server runtime
  runtimeConfig: {
    // Keys defined here are available server-side only
    databaseUrl: process.env.DATABASE_URL, // Read from the app's .env
    // public:
    //   Keys defined here are available client-side
  },

  // TypeScript strict mode (ensure tsconfig also has it)
  typescript: {
    strict: true,
  },

  // Alias for easier imports
  alias: {
    '@': '.',
  },
})
