<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n, useLocalePath } from "#imports";

// Define possible statuses
const PENDING = "pending";
const ERROR = "error"; // Only for initial token missing or fetch error

const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const { t } = useI18n();

// Reactive states
const status = ref(PENDING);
// Key for errors displayed *on this page* (e.g., missing token)
const errorKey = ref("auth.otp.error_server");

// Function to trigger verification API
async function verifyLoginToken(token: string) {
  try {
    // Trigger the GET request. The backend will handle the redirect.
    // We don't expect a specific JSON response here due to redirects.
    await $fetch(`/api/auth/otp/verify`, {
      method: "GET",
      params: { token },
      // Prevent $fetch from throwing on 3xx redirect responses
      redirect: "manual",
    });
    // Client-side redirect after successful OTP verification
    await router.replace(localePath("/"));
    // Force full page reload to hydrate authenticated state
    window.location.reload();
  } catch (fetchError: any) {
    // Catch actual network errors. The backend redirect should ideally not cause an error now.
    // If it still does, this catch block will handle it.
    console.error("Error fetching OTP verification endpoint:", fetchError);
    status.value = ERROR;
    errorKey.value = "auth.otp.error_server";
  }
}

// Verify token on component mount
onMounted(() => {
  const token = route.query.token as string | undefined;

  if (!token) {
    status.value = ERROR;
    errorKey.value = "auth.otp.error_invalid"; // Missing token is an invalid link
  } else {
    verifyLoginToken(token);
  }
});
</script>

<template>
  <div class="py-8">
    <div class="card bg-base-200 mx-auto w-full max-w-md shadow-xl">
      <div class="card-body items-center text-center">
        <!-- Title changes based on status -->
        <h2 class="card-title mb-4">
          {{
            status === "pending"
              ? $t("auth.otp.verifying_title")
              : $t("auth.otp.verification_failed_title")
          }}
        </h2>

        <!-- Pending state -->
        <div
          v-if="status === 'pending'"
          class="flex flex-col items-center py-4"
        >
          <div
            class="loading loading-spinner loading-lg text-primary mb-4"
          ></div>
          <p>{{ $t("auth.otp.verifying_message") }}</p>
          <p class="text-sm text-base-content/70 mt-2">
            {{ $t("auth.otp.verifying_redirect_info") }}
          </p>
        </div>

        <!-- Error state (only shown if token missing or fetch itself fails) -->
        <div v-if="status === 'error'" class="alert alert-error alert-soft">
          <div class="flex flex-col items-center">
            <Icon name="heroicons:exclamation-triangle" class="h-8 w-8 mb-2" />
            <span class="font-semibold">{{ $t(errorKey) }}</span>
            <span class="mt-4">
              <NuxtLinkLocale to="/login" class="btn btn-sm btn-primary">
                {{ $t("auth.otp.return_to_login") }}
              </NuxtLinkLocale>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
