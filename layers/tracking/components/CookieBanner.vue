<!-- AI Generation Reference: See /ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
// Explicit import if auto-import isn't working
import { useCookieConsent } from "../composables/useCookieConsent";
import { onMounted, watch } from "vue";

const { t } = useI18n();
const { consent, showBanner, acceptCookies, declineCookies } =
  useCookieConsent();

// Debug logging
onMounted(() => {
  console.log("[tracking] CookieBanner mounted, showBanner:", showBanner.value);
});

// Watch for showBanner changes
watch(showBanner, (isVisible) => {
  console.log("[tracking] Banner visibility changed to:", isVisible);
});
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform opacity-0 translate-y-4"
    enter-to-class="transform opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform opacity-100 translate-y-0"
    leave-to-class="transform opacity-0 translate-y-4"
  >
    <div
      v-if="showBanner"
      class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-md rounded-lg bg-base-100 border border-base-300 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie Consent Banner"
    >
      <!-- Adjusted text size and spacing -->
      <span class="text-sm text-base-content flex-grow">
        {{ t("cookieConsent.message") }}
      </span>
      <div class="flex gap-2 flex-shrink-0 self-end sm:self-center">
        <button
          class="btn btn-primary btn-xs sm:btn-sm"
          @click="acceptCookies"
          :aria-label="t('cookieConsent.accept')"
        >
          {{ t("cookieConsent.accept") }}
        </button>
        <button
          class="btn btn-ghost btn-xs sm:btn-sm"
          @click="declineCookies"
          :aria-label="t('cookieConsent.decline')"
        >
          {{ t("cookieConsent.decline") }}
        </button>
      </div>
    </div>
  </Transition>
</template>
