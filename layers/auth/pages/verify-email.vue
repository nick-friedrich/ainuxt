<script setup lang="ts">
// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n, useLocalePath } from "#imports";
import { useAuth } from "~/composables/useAuth";

// Status states
const VERIFYING = "verifying";
const SUCCESS = "success";
const ERROR = "error";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const localePath = useLocalePath();
const { isLoggedIn, fetchUser } = useAuth();

// Reactive states
const status = ref(VERIFYING);
const message = ref("");
const email = ref("");
const errorType = ref("");

// Function to verify token
async function verifyToken(token: string) {
  try {
    // Define the expected response type
    type VerifyResponse = {
      success: boolean;
      message: string;
      email: string;
    };

    const response = await $fetch<VerifyResponse>("/api/auth/email/verify", {
      method: "POST",
      body: { token },
    });

    if (response.success) {
      status.value = SUCCESS;
      message.value = response.message;
      email.value = response.email;

      // Refresh user state if already logged in
      if (isLoggedIn.value) {
        await fetchUser();
      }

      // Redirect to login page after 3 seconds on success
      setTimeout(() => {
        router.push(localePath("/login"));
      }, 3000);
    } else {
      throw new Error("Verification failed");
    }
  } catch (error: any) {
    console.error("Token verification error:", error);
    status.value = ERROR;

    // Extract message key from API error if available
    if (error.data?.message && typeof error.data.message === "string") {
      errorType.value = error.data.message;
    } else {
      errorType.value = "auth.email.verify_error";
    }
  }
}

// Verify token on page load
onMounted(() => {
  const token = route.query.token as string;

  if (!token) {
    status.value = ERROR;
    errorType.value = "auth.email.verify_missing_token";
    return;
  }

  verifyToken(token);
});
</script>

<template>
  <div class="py-8">
    <div class="card bg-base-200 mx-auto w-full max-w-md shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">
          {{ $t("auth.email.verify_email") }}
        </h2>

        <!-- Verifying state -->
        <div
          v-if="status === 'verifying'"
          class="flex flex-col items-center py-4"
        >
          <div class="loading loading-spinner loading-lg text-primary"></div>
          <p class="mt-4">{{ $t("auth.email.verify_in_progress") }}</p>
        </div>

        <!-- Success state -->
        <div v-if="status === 'success'" class="alert alert-success alert-soft">
          <div class="flex flex-col">
            <span class="font-semibold">{{ $t(message) }}</span>
            <span>{{ $t("auth.email.verify_redirect") }}</span>
          </div>
        </div>

        <!-- Error state -->
        <div v-if="status === 'error'" class="alert alert-error alert-soft">
          <div class="flex flex-col">
            <span class="font-semibold">{{ $t(errorType) }}</span>
            <span class="mt-2">
              <NuxtLinkLocale to="/login" class="link link-primary">
                {{ $t("auth.email.verify_go_to_login") }}
              </NuxtLinkLocale>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
