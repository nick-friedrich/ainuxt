// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../base'],

  runtimeConfig: {
    // Server-side secrets
    resendApiKey: process.env.RESEND_API_KEY ?? undefined, // Used by ResendAdapter

    // Public keys exposed client-side (use with caution)
    public: {
      mailFromEmail: process.env.MAIL_FROM_EMAIL || 'noreply@example.com', // Add default From email here
      mailFromName: process.env.MAIL_FROM_NAME || 'Example', // Add default From name here
    },
  },
}) 