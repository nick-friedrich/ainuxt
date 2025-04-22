<!-- AI Generation Reference: See /ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
// AI Generation Reference: See /ai/README.md for guidelines and patterns.
// Layout script - now much simpler
// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { useThemeCookie } from "../composables/useThemeCookie";
const { theme } = useThemeCookie();
const { locale } = useI18n();

useHead({
  htmlAttrs: {
    lang: locale.value,
    "data-theme": () => theme.value, // Dynamically bind to the theme state
  },
});
</script>

<template>
  <div class="bg-base-100 flex min-h-screen flex-col">
    <LayoutAppHeader />
    <!-- Main Content Section -->
    <main class="container mx-auto flex-1 px-4 py-8">
      <slot />
    </main>

    <LayoutAppFooter />
  </div>
</template>

<style scoped>
/* Layout styles - keep minimal for now */
</style>
