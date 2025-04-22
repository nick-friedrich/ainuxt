<script setup lang="ts">
// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n, useLocalePath } from "#imports";

// Define the expected response type
interface ResetPasswordResponse {
  message: string;
}

const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();

// Extract token from query
const token = ref((route.query.token as string) || "");

const form = ref({ newPassword: "", confirmPassword: "" });
const formErrors = ref<{ newPassword?: string; confirmPassword?: string }>({});
const status = ref<"idle" | "success" | "error">("idle");
const errorMessageKey = ref<string>("");

async function onSubmit() {
  formErrors.value = {};
  errorMessageKey.value = "";
  status.value = "idle";

  // Client validation
  let valid = true;
  if (form.value.newPassword.length < 8) {
    formErrors.value.newPassword = t("auth.validation.password_minLength", {
      min: 8,
    });
    valid = false;
  }
  if (form.value.confirmPassword !== form.value.newPassword) {
    formErrors.value.confirmPassword = t("auth.password.reset_mismatch");
    valid = false;
  }
  if (!token.value) {
    errorMessageKey.value = "auth.password.reset_missing_token";
    valid = false;
  }
  if (!valid) return;

  try {
    const { message } = await $fetch<ResetPasswordResponse>(
      "/api/auth/password/reset",
      {
        method: "POST",
        body: {
          token: token.value,
          newPassword: form.value.newPassword,
          confirmPassword: form.value.confirmPassword,
          locale: locale.value,
        },
      }
    );
    status.value = "success";
    // Redirect to login after success
    setTimeout(() => router.push(localePath("/login")), 2000);
  } catch (err: any) {
    status.value = "error";
    console.error("Password reset error:", err);
    if (err.data?.message) {
      errorMessageKey.value = err.data.message;
    } else if (err.statusCode === 400 && err.data?.data?.issues) {
      const firstIssue = err.data.data.issues[0];
      errorMessageKey.value =
        firstIssue?.message || "auth.password.reset_error";
    } else {
      errorMessageKey.value = "auth.password.reset_error";
    }
  }
}
</script>

<template>
  <div class="py-8">
    <div class="card bg-base-200 mx-auto w-full max-w-md shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">{{ t("page_reset_password.title") }}</h2>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <FormTextField
            id="new-password"
            v-model="form.newPassword"
            type="password"
            :label="t('page_reset_password.new_password')"
            :placeholder="t('page_reset_password.new_password_placeholder')"
            :error="formErrors.newPassword"
            required
          />
          <FormTextField
            id="confirm-password"
            v-model="form.confirmPassword"
            type="password"
            :label="t('page_reset_password.confirm_password')"
            :placeholder="t('page_reset_password.confirm_password_placeholder')"
            :error="formErrors.confirmPassword"
            required
          />
          <div class="card-actions justify-end">
            <FormButton type="submit" color="primary" block>
              {{ t("page_reset_password.submit") }}
            </FormButton>
          </div>
          <div
            v-if="
              status === 'error' ||
              formErrors.newPassword ||
              formErrors.confirmPassword
            "
            class="alert alert-error alert-soft mt-4"
          >
            <span>
              {{
                formErrors.newPassword ||
                formErrors.confirmPassword ||
                t(errorMessageKey)
              }}
            </span>
          </div>
          <div
            v-if="status === 'success'"
            class="alert alert-success alert-soft mt-4"
          >
            <span>{{ t("auth.password.reset_success") }}</span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
