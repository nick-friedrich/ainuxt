// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
// Using defineNuxtConfig from "nuxt/config" which is the correct import path for Nuxt configurations
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  extends: ['../base'],
  experimental: {
    componentIslands: {
      selectiveClient: 'deep'
    }
  },
}); 