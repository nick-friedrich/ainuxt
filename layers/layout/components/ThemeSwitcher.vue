<!-- AI Generation Reference: See /ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { useThemeCookie } from "../composables/useThemeCookie";

const { isDark, toggleTheme } = useThemeCookie();
</script>

<template>
  <!-- Button to toggle the theme using the composable -->
  <button
    class="btn btn-ghost btn-circle"
    aria-label="Toggle Theme"
    @click="toggleTheme"
  >
    <!-- Conditionally render sun or moon icon based on isDark state -->
    <Icon v-if="isDark" name="heroicons:moon-20-solid" class="h-5 w-5" />
    <Icon v-else name="heroicons:sun-20-solid" class="h-5 w-5" />
  </button>
</template>

<style scoped>
/* Styles removed as swap/theme-controller classes are gone */
</style>
