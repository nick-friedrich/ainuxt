<!-- AI Generation Reference: See /ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
const { locales, setLocale } = useI18n();
</script>

<template>
  <div class="flex items-center gap-1 text-sm">
    <span v-for="(locale, index) in locales" :key="locale.code">
      <a
        href="#"
        class="hover:text-primary-500 dark:hover:text-primary-400"
        :class="{
          'text-primary-600 dark:text-primary-400 font-bold':
            $i18n.locale === locale.code,
        }"
        @click.prevent="setLocale(locale.code)"
      >
        {{ locale.code.toUpperCase() }}
      </a>
      <!-- Conditionally render separator if not the last item -->
      <span
        v-if="index < locales.length - 1"
        class="ml-1 text-gray-300 dark:text-gray-700"
        >|</span
      >
    </span>
  </div>
</template>

<style scoped>
/* Component specific styles if needed */
</style>
