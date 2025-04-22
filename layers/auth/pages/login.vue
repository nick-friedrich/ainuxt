<script setup lang="ts">
definePageMeta({
  middleware: ["guest"],
});

import { ref } from "vue";
import { z } from "zod";
import { useAuth } from "~/composables/useAuth";
import { useI18n, useLocalePath } from "#imports";
import { useRouter } from "vue-router";

const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const { login, loading, error } = useAuth(); // Removed isLoggedIn as it's not used here

const form = ref({ email: "", password: "" });
const formErrors = ref<{ email?: string; password?: string }>({});
const success = ref(false);

const schema = z.object({
  email: z.string().email({ message: "validation.contact.email.invalid" }),
  password: z.string().min(1, { message: "validation.password.required" }),
});

async function onSubmit() {
  formErrors.value = {};
  success.value = false;
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
  const ok = await login(form.value.email, form.value.password);
  if (ok) {
    success.value = true;
    setTimeout(() => {
      router.push(localePath("/"));
    }, 1000);
  }
}
</script>

<template>
  <div class="py-8">
    <div class="card bg-base-200 mx-auto w-full max-w-md shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">{{ $t("page_login.title") }}</h2>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Use BaseInput for Email -->
          <FormTextField
            id="login-email"
            v-model="form.email"
            type="email"
            :label="$t('page_login.email')"
            placeholder="you@example.com"
            :error="formErrors.email"
            required
          />

          <!-- Use BaseInput for Password -->
          <FormTextField
            id="login-password"
            v-model="form.password"
            type="password"
            :label="$t('page_login.password')"
            :placeholder="$t('page_login.password_placeholder')"
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
              {{ $t("page_login.submit") }}
            </FormButton>
          </div>
          <!-- Alerts -->
          <div v-if="error" class="alert alert-error alert-soft mt-4">
            <span>{{ error }}</span>
          </div>
          <div v-if="success" class="alert alert-success alert-soft mt-4">
            <span>{{ $t("page_login.success") }}</span>
          </div>
        </form>
        <div class="mt-4 text-center">
          <NuxtLinkLocale to="/register" class="link link-primary">
            {{ $t("page_login.no_account") }}
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </div>
</template>
