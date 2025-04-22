<script setup lang="ts">
definePageMeta({
  middleware: ["guest"], // Only accessible to guests
});

import { ref } from "vue";
import { z } from "zod";
import { useI18n, useLocalePath } from "#imports"; // Removed Icon import, assuming auto-import

const { t, locale } = useI18n();
const localePath = useLocalePath();

const form = ref({ email: "" });
// Using formErrors object for consistency, even with one field
const formErrors = ref<{ email?: string }>({});
const status = ref<"idle" | "pending" | "success" | "error">("idle"); // Added 'pending' state
const errorMessageKey = ref<string>(""); // For API errors
const successMessageKey = ref<string>(""); // For success message

// Removed loading ref, status covers this

const schema = z.object({
  email: z.string().email({ message: "validation.contact.email.invalid" }), // Reusing existing validation message
});

async function onSubmit() {
  formErrors.value = {};
  errorMessageKey.value = "";
  successMessageKey.value = "";
  status.value = "pending"; // Set status to pending

  const result = schema.safeParse(form.value);
  if (!result.success) {
    const issue = result.error.issues[0];
    formErrors.value.email = issue.message; // Store the KEY, not the translated string
    status.value = "error"; // Set status to error for validation fail
    return;
  }

  try {
    // Using $fetch directly, similar to forgot-password.vue
    await $fetch<any>("/api/auth/otp/request", {
      // Assuming API returns object on success, maybe { message: string } or just {}
      method: "POST",
      body: { email: form.value.email, locale: locale.value }, // Send current locale
      headers: { "Content-Type": "application/json" },
      // baseURL is automatically handled by Nuxt's $fetch
    });

    status.value = "success";
    successMessageKey.value = "page_login_email.success"; // Set success message key
    // Optionally clear form: form.value.email = "";
  } catch (e: any) {
    console.error("OTP Request Error:", e);
    status.value = "error";
    // Extract error message from $fetch error structure
    if (e.data?.message) {
      errorMessageKey.value = e.data.message; // Use message from API if available
    } else {
      errorMessageKey.value = "page_login_email.error_generic"; // Fallback generic error
    }
  }
}
</script>

<template>
  <div class="py-8">
    <div class="card bg-base-200 mx-auto w-full max-w-md shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">{{ $t("page_login_email.title") }}</h2>
        <p class="mb-4 text-sm text-base-content/80">
          {{ $t("page_login_email.description") }}
        </p>
        <form
          v-if="status !== 'success'"
          @submit.prevent="onSubmit"
          class="space-y-4"
        >
          <FormTextField
            id="login-email-otp"
            v-model="form.email"
            type="email"
            :label="$t('page_login_email.email')"
            placeholder="you@example.com"
            :error="formErrors.email ? t(formErrors.email) : undefined"
            required
            autofocus
          />

          <div class="card-actions justify-end pt-4">
            <FormButton
              type="submit"
              color="primary"
              block
              :loading="status === 'pending'"
              :disabled="status === 'pending'"
            >
              {{ $t("page_login_email.submit") }}
            </FormButton>
          </div>
          <!-- Combined Error Alert -->
          <div
            v-if="status === 'error' && !formErrors.email"
            class="alert alert-error alert-soft mt-4"
          >
            <span>{{
              t(errorMessageKey || "page_login_email.error_generic")
            }}</span>
          </div>
        </form>

        <!-- Success State -->
        <div
          v-if="status === 'success'"
          class="alert alert-success alert-soft mt-4"
        >
          <Icon name="heroicons:check-circle" class="h-6 w-6" />
          <span>{{ t(successMessageKey) }}</span>
        </div>

        <!-- Back to Login Link -->
        <div class="mt-6 text-center">
          <NuxtLinkLocale :to="'/login'" class="link link-hover">
            {{ $t("page_login_email.back_to_login") }}
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </div>
</template>
