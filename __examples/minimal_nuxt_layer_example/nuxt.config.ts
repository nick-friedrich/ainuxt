// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
// Ignore errors when created we need to run pnpm layer:dev from root to generate the types
// @ts-expect-error - nuxt module typings
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../base'],
  // Layer configuration can go here if needed in the future
}) 