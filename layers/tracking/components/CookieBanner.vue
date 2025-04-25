<!-- AI Generation Reference: See /ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const consent = ref<string | null>(null);
const showBanner = ref(false);

onMounted(() => {
  consent.value = localStorage.getItem('cookie_consent');
  showBanner.value = !consent.value;
});

function acceptCookies() {
  localStorage.setItem('cookie_consent', 'accepted');
  consent.value = 'accepted';
  showBanner.value = false;
  // Test log
  console.log('[tracking] Cookie consent accepted');
}

function declineCookies() {
  localStorage.setItem('cookie_consent', 'declined');
  consent.value = 'declined';
  showBanner.value = false;
  // Test log
  console.log('[tracking] Cookie consent declined');
}
</script>

<template>
  <div v-if="showBanner" class="fixed bottom-0 left-0 right-0 z-50 bg-base-200 border-t border-base-300 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
    <span class="text-base-content">
      This site uses cookies for analytics and improved experience. Do you accept?
    </span>
    <div class="flex gap-2">
      <button class="btn btn-primary btn-sm" @click="acceptCookies">Accept</button>
      <button class="btn btn-ghost btn-sm" @click="declineCookies">Decline</button>
    </div>
  </div>
</template>

<style scoped>
/* Banner styles can be customized as needed */
</style>
