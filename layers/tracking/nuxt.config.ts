// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
// Ignore errors when created we need to run pnpm layer:dev from root to generate the types
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../base', '../i18n', '../layout'],
  // Layer configuration can go here if needed in the future

  // Example i18n configuration for layers, this way we can add translations to the layer
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.json',
      },
      {
        code: 'de',
        file: 'de.json',
      }
    ],
  }
}) 