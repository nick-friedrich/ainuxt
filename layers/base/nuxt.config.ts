// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.

import { defineNuxtConfig } from 'nuxt/config'

// Base layer is the parent of all layers. It provides the base configuration for all layers.
// It is also the parent of the app layer.

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  extends: [
    '../database',
  ],

  // TypeScript strict mode (ensure tsconfig also has it)
  typescript: {
    strict: true,
  },

  runtimeConfig: {
    public: {
      applicationName: 'Nuxt Layers',
      applicationVersion: '1.0.0',
      applicationUrl: 'http://localhost:3000',
    }
  }
}) 