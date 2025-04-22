<script setup lang="ts">
// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { ref } from "vue";
import { useI18n, useLocalePath } from "#imports";

// Define the expected response type
interface ForgotPasswordResponse {
  message: string;
}

const { t, locale } = useI18n();
const localePath = useLocalePath();

const form = ref({ email: "" });
const formErrors = ref<{ email?: string }>({});
const status = ref<"idle" | "success" | "error">("idle");
const errorMessageKey = ref<string>("");
const successMessageKey = ref<string>("");

async function onSubmit() {
  formErrors.value = {};
  errorMessageKey.value = "";
  successMessageKey.value = "";
  status.value = "idle";

  // Client validation
  let valid = true;
  if (!form.value.email) {
    formErrors.value.email = t("auth.validation.email_required");
    valid = false;
  }
  // Basic email format validation (can be enhanced)
  else if (!/.+@.+\..+/.test(form.value.email)) {
    formErrors.value.email = t("auth.validation.email_invalid");
    valid = false;
  }
  if (!valid) return;

  try {
    const { message } = await $fetch<ForgotPasswordResponse>(
      "/api/auth/password/forgot",
      {
        method: "POST",
        body: {
          email: form.value.email,
          locale: locale.value,
        },
      }
    );
    status.value = "success";
    successMessageKey.value = message || "auth.password.forgot_success"; // Use message from API or default
    form.value.email = ""; // Clear email field on success
  } catch (err: any) {
    status.value = "error";
    if (err.data?.message) {
      errorMessageKey.value = err.data.message;
    } else {
      errorMessageKey.value = "auth.password.forgot_error";
    }
  }
}
</script>

<template>
  <div class="py-8">
    <div class="card bg-base-200 mx-auto w-full max-w-md shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">{{ t("page_forgot_password.title") }}</h2>
        <p class="mb-4 text-sm">
          {{ t("page_forgot_password.instructions") }}
        </p>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <FormTextField
            id="email"
            v-model="form.email"
            type="email"
            :label="t('page_forgot_password.email')"
            :placeholder="t('page_forgot_password.email_placeholder')"
            :error="formErrors.email"
            required
          />
          <div class="card-actions justify-end">
            <FormButton type="submit" color="primary" block>
              {{ t("page_forgot_password.submit") }}
            </FormButton>
          </div>
          <div
            v-if="status === 'error' || formErrors.email"
            class="alert alert-error alert-soft mt-4"
          >
            <span>{{ formErrors.email || t(errorMessageKey) }}</span>
          </div>
          <div
            v-if="status === 'success'"
            class="alert alert-success alert-soft mt-4"
          >
            <span>{{ t(successMessageKey) }}</span>
          </div>
        </form>
        <div class="mt-4 text-center">
          <NuxtLink :to="localePath('/login')" class="link-hover link text-sm">
            {{ t("page_forgot_password.back_to_login") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
