// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
  ],
  extends: [
    '../base',
    '../layout',
    '../i18n',
    // Why do we need to add it as npm package?
    // `@layers/mail`, we need it to access the exported functions from the mail layer
    // Also we added it to package.json as a dependency, so it should be available

    // For some reason we cannot import it via npm, so we need to import it via the path
    // But still we need to add it to package.json as a dependency, so it should be available
    '../mail'
  ],

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