<!-- AI Generation Reference: See /ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
// AI Generation Reference: See /ai/README.md for guidelines and patterns.
// Component script
</script>

<template>
  <footer
    class="footer bg-base-200 text-base-content border-base-300 mt-auto border-t p-4"
  >
    <div class="flex justify-between items-center w-full">
      <p>
        {{ $t("layout.footer.copyright", { year: new Date().getFullYear() }) }}
      </p>
      <div class="flex items-center gap-4">
        <ThemeSwitcher />
        <CookieControl />
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Footer specific styles if needed */
</style>
