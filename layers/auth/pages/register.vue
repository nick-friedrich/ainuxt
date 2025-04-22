<script setup lang="ts">
definePageMeta({
  middleware: ["guest"],
});

import { ref } from "vue";
import { z } from "zod";
import { useAuth } from "~/composables/useAuth";
import { useI18n } from "#imports";
import { useRouter } from "vue-router";

const { t, locale } = useI18n();
const router = useRouter();
const { register, loading, error } = useAuth();

const form = ref({ email: "", password: "" });
const formErrors = ref<{ email?: string; password?: string }>({});
const successMessageKey = ref<string | null>(null);

const schema = z.object({
  email: z.string().email({ message: "auth.validation.email_invalid" }),
  password: z
    .string()
    .min(8, { message: "auth.validation.password_minLength" }),
});

async function onSubmit() {
  formErrors.value = {};
  successMessageKey.value = null;
  const result = schema.safeParse(form.value);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const path = issue.path[0] as keyof typeof form.value;
      const messageKey = issue.message;
      let messageArgs = {};
      if ("minimum" in issue) {
        messageArgs = { min: (issue as any).minimum };
      }
      formErrors.value[path] = t(messageKey, messageArgs);
    }
    return;
  }

  const response = await register(
    form.value.email,
    form.value.password,
    locale.value
  );

  if (
    typeof response === "object" &&
    response !== null &&
    "message" in response &&
    typeof response.message === "string"
  ) {
    successMessageKey.value = response.message;

    // Redirect to dashboard if auto-login is enabled, otherwise go to login page
    const redirectPath = response.autoLogin === true ? "/" : "/login";
    setTimeout(() => router.push(redirectPath), 2000);
  }
}
</script>

<template>
  <div class="py-8">
    <div class="card bg-base-200 mx-auto w-full max-w-md shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">
          {{ $t("page_register.title") }}
        </h2>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Use BaseInput for Email -->
          <FormTextField
            id="register-email"
            v-model="form.email"
            type="email"
            :label="$t('page_register.email')"
            placeholder="you@example.com"
            :error="formErrors.email"
            required
          />

          <!-- Use BaseInput for Password -->
          <FormTextField
            id="register-password"
            v-model="form.password"
            type="password"
            :label="$t('page_register.password')"
            :placeholder="$t('page_register.password_placeholder')"
            :error="formErrors.password"
            required
          />

          <div class="card-actions justify-end pt-4">
            <!-- Use BaseButton -->
            <FormButton
              type="submit"
              color="primary"
              block
              :loading="loading"
              :disabled="loading"
            >
              {{ $t("page_register.submit") }}
            </FormButton>
          </div>
          <!-- Alerts -->
          <div v-if="error" class="alert alert-error alert-soft mt-4">
            <span>{{
              typeof error === "string" && error.includes(".")
                ? $t(error)
                : error
            }}</span>
          </div>
          <div
            v-if="successMessageKey"
            class="alert alert-success alert-soft mt-4"
          >
            <span>
              {{ $t(successMessageKey) }}
            </span>
          </div>
        </form>
        <div class="mt-4 text-center">
          <NuxtLinkLocale to="/login" class="link link-primary">
            {{ $t("page_register.have_account") }}
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </div>
</template>
