// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../base'],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix', // Always prefix even default locale
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