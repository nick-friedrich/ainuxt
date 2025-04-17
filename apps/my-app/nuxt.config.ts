// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Add the database layer
  extends: [
    '../../layers/database' // Path relative to this nuxt.config.ts
  ],

  // Expose DATABASE_URL to the server runtime
  runtimeConfig: {
    // Keys defined here are available server-side only
    databaseUrl: process.env.DATABASE_URL, // Read from the app's .env
    // public:
    //   Keys defined here are available client-side
  }
})
