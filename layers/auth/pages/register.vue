<script setup lang="ts">
definePageMeta({
  middleware: ["guest"],
});

import { ref } from "vue";
import { z } from "zod";
import { useAuth } from "~/composables/useAuth";
import { useI18n } from "#imports";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();
const { register, loading, error } = useAuth();

const form = ref({ email: "", password: "" });
const formErrors = ref<{ email?: string; password?: string }>({});
const success = ref(false);

const schema = z.object({
  email: z.string().email({ message: "validation.contact.email.invalid" }),
  password: z.string().min(8, { message: "validation.password.minLength" }),
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
  const ok = await register(form.value.email, form.value.password);
  if (ok) {
    success.value = true;
    setTimeout(() => router.push("/"), 1000);
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
            <span>{{ error }}</span>
          </div>
          <div v-if="success" class="alert alert-success alert-soft mt-4">
            <span>
              {{ $t("page_register.success") }}
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
