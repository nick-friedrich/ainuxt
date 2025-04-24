// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  extends: [
    "../base",
    "../database",
    "../i18n",
    "../layout",
    "../content",
  ]
}); 