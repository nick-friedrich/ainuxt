<!-- AI Generation Reference: See /ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
// Explicit import if auto-import isn't working
import { useCookieConsent } from "../composables/useCookieConsent";
import { computed, onMounted } from "vue";

const { consent, showCookieSettings, showBanner } = useCookieConsent();
const { t } = useI18n();

// Helper to display current status text
const currentStatusText = computed(() => {
  if (consent.value === "accepted") {
    return t("cookieConsent.statusAccepted") || "Accepted";
  }
  if (consent.value === "declined") {
    return t("cookieConsent.statusDeclined") || "Declined";
  }
  return t("cookieConsent.statusNotSet") || "Not set";
});

// Helper to get appropriate badge class
const statusBadgeClass = computed(() => {
  if (consent.value === "accepted") return "badge-success badge-outline";
  if (consent.value === "declined") return "badge-error badge-outline";
  return "badge-warning badge-outline";
});

// Handle cookie settings click
function handleShowSettings() {
  console.log(
    "[tracking] CookieControl: Showing settings, current banner state:",
    showBanner.value
  );
  showCookieSettings();
  console.log(
    "[tracking] CookieControl: After showing settings, banner state:",
    showBanner.value
  );
}

onMounted(() => {
  console.log("[tracking] CookieControl mounted, consent:", consent.value);
});
</script>

<template>
  <div class="cookie-control flex items-center gap-2 p-2 text-xs">
    <span>{{ t("cookieConsent.title") || "Cookies" }}:</span>
    <span :class="['badge', 'badge-sm', statusBadgeClass]">
      {{ currentStatusText }}
    </span>
    <button @click="handleShowSettings" class="btn btn-ghost btn-xs link">
      {{ t("cookieConsent.manage") }}
    </button>
  </div>
</template>

<style scoped>
.link {
  text-decoration: underline;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.link:hover {
  opacity: 1;
}
</style>
