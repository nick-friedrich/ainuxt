// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({

  extends: [
    '../base',
    '@layers/i18n',
    '@layers/styling',
  ],
  modules: [
    '@nuxt/icon',
  ]
}) 