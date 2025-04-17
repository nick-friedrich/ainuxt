import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

// This layer provides base styling configuration using Tailwind CSS v4 and DaisyUI.
// It relies on the consuming application having the necessary dependencies installed
// via pnpm (tailwindcss, daisyui, postcss).

export default defineNuxtConfig({

  compatibilityDate: '2024-11-01',
  css: ['./assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  }
}) 