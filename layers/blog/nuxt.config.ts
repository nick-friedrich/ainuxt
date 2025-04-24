// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({

  extends: [
    "../base",

    "../i18n",
    "@layers/layout",
    "../database",
    "../content",
  ],

  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'de', file: 'de.json' }
    ],
    defaultLocale: 'en',
  }
});