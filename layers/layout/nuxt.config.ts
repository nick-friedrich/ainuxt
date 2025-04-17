// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  extends: [
    '@layers/i18n',
    '@layers/styling',
  ],
  modules: [
    '@nuxt/icon',
  ]
}) 