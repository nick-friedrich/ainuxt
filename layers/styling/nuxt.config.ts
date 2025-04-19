// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

// This layer provides base styling configuration using Tailwind CSS v4 and DaisyUI.
// It relies on the consuming application having the necessary dependencies installed
// via pnpm (tailwindcss, daisyui, postcss).

export default defineNuxtConfig({

  extends: ['../base'],

  modules: [
    '@nuxt/icon',
  ],

  css: ['./assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  }
}) 