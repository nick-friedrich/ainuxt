// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../base'],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'en',
    experimental: {
      typedOptionsAndMessages: 'default'
    },
    strategy: 'prefix_except_default',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'de',
        iso: 'de-DE',
        name: 'Deutsch',
        file: 'de.json'
      },
    ],
    bundle: {
      optimizeTranslationDirective: false,
    },

  },
}) 