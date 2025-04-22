<!-- AI Generation Reference: See ~/_ai/README.md for guidelines and patterns. -->
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { z } from "zod";

const { t, locale } = useI18n();
const { user, loading: isLoading, isLoggedIn: isAuthenticated } = useAuth();
const router = useRouter();

// Redirect if not authenticated
onMounted(() => {
  if (!isLoading.value && !isAuthenticated.value) {
    router.push("/login");
  }
});

// Form states
const formStatus = ref("idle"); // idle, submitting, success, error
const serverError = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const verificationEmailSent = ref(false);

// Profile data with initial values from user
const profileData = reactive({
  name: "",
  email: "",
  confirmEmail: "",
});

// Password change form (separate from profile data)
const passwordData = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Load user data when available
watch(
  () => user.value,
  (newUser) => {
    if (newUser) {
      profileData.name = newUser.name || "";
      profileData.email = newUser.email || "";
      profileData.confirmEmail = newUser.email || "";
    }
  },
  { immediate: true }
);

// Validation errors
const errors = reactive({
  name: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  confirmEmail: "",
});

// Clear all validation errors
const clearErrors = () => {
  errors.name = "";
  errors.email = "";
  errors.currentPassword = "";
  errors.newPassword = "";
  errors.confirmPassword = "";
  errors.confirmEmail = "";
  serverError.value = null;
  successMessage.value = null;
};

// Validate and update profile
const updateProfile = async () => {
  clearErrors();
  formStatus.value = "submitting";

  // Create validation schema
  const profileSchema = z
    .object({
      name: z
        .string()
        .min(1, { message: "auth.profile.validation.name_required" }),
      email: z
        .string()
        .email({ message: "auth.profile.validation.email_invalid" }),
      confirmEmail: z
        .string()
        .email({ message: "auth.profile.validation.email_invalid" }),
    })
    .refine((data) => data.email === data.confirmEmail, {
      message: "auth.profile.validation.emails_must_match",
      path: ["confirmEmail"],
    });

  try {
    // Validate the form data
    const validData = profileSchema.parse(profileData);

    // Submit to API and get updated user and message key
    type ProfileResponse = {
      user: {
        id: string;
        name: string;
        email: string;
        emailVerifiedAt: string | null;
      };
      message: string;
    };
    const response = await $fetch<ProfileResponse>("/api/auth/profile", {
      method: "PUT",
      body: validData,
    });

    // Handle success: display translated message
    formStatus.value = "success";
    successMessage.value = t(response.message);

    // Immediately update local auth user state
    if (user.value) {
      user.value.name = response.user.name;
      user.value.email = response.user.email;
      user.value.emailVerifiedAt = response.user.emailVerifiedAt
        ? new Date(response.user.emailVerifiedAt)
        : undefined;
    }
    // Reset confirmEmail field to match new email
    profileData.confirmEmail = response.user.email;
  } catch (error: any) {
    formStatus.value = "error";

    // Handle Zod validation errors
    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path && err.path.length > 0) {
          const field = err.path[0];
          errors[field as keyof typeof errors] = t(err.message as string);
        }
      });
    }
    // Handle server errors
    else if (error.data?.message) {
      serverError.value = t(error.data.message);
    } else {
      serverError.value = t("auth.profile.update_error");
    }
  }
};

// Validate and update password
const updatePassword = async () => {
  clearErrors();
  formStatus.value = "submitting";

  // Create validation schema for password change
  const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, {
        message: "auth.profile.validation.current_password_required",
      }),
      newPassword: z
        .string()
        .min(8, { message: "auth.profile.validation.password_min_length" }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "auth.profile.validation.passwords_must_match",
      path: ["confirmPassword"],
    });

  try {
    // Validate the password data
    const validData = passwordSchema.parse(passwordData);

    // Submit to API
    const response = await $fetch("/api/auth/password", {
      method: "PUT",
      body: {
        currentPassword: validData.currentPassword,
        newPassword: validData.newPassword,
      },
    });

    // Handle success
    formStatus.value = "success";
    successMessage.value = t("auth.profile.password_update_success");

    // Reset password fields
    passwordData.currentPassword = "";
    passwordData.newPassword = "";
    passwordData.confirmPassword = "";
  } catch (error: any) {
    formStatus.value = "error";

    // Handle Zod validation errors
    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path && err.path.length > 0) {
          const field = err.path[0];
          errors[field as keyof typeof errors] = t(err.message as string);
        }
      });
    }
    // Handle server errors
    else if (error.data?.message) {
      serverError.value = t(error.data.message);
    } else {
      serverError.value = t("auth.profile.password_update_error");
    }
  }
};

// Add resendVerificationEmail function in script section
const resendVerificationEmail = async () => {
  try {
    await $fetch("/api/auth/send-verification-mail", {
      method: "POST",
      body: {
        locale: locale.value,
      },
    });
    successMessage.value = t("auth.profile.verification_email_sent");
    verificationEmailSent.value = true;
  } catch (error: any) {
    serverError.value = error.data?.message
      ? t(error.data.message)
      : t("auth.profile.verification_email_error");
  }
};
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="loading loading-spinner loading-lg"></div>
    </div>

    <!-- Main content -->
    <div v-else-if="isAuthenticated" class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">{{ $t("auth.profile.title") }}</h1>

      <!-- Success message -->
      <div v-if="successMessage" class="alert alert-success alert-soft mb-6">
        <div>{{ successMessage }}</div>
      </div>

      <!-- Server error message -->
      <div v-if="serverError" class="alert alert-error alert-soft mb-6">
        <div>{{ serverError }}</div>
      </div>

      <!-- Email verification banner -->
      <div
        v-if="user && user.email && !user.emailVerifiedAt"
        class="alert alert-warning alert-soft mb-6"
      >
        <div class="flex flex-row justify-between w-full items-center">
          <span>{{ $t("auth.profile.email_not_verified") }}</span>
          <button
            @click="resendVerificationEmail"
            class="btn btn-sm btn-warning btn-outline ml-2"
            :disabled="verificationEmailSent"
          >
            {{ $t("auth.profile.resend_verification") }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Profile information -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">
              {{ $t("auth.profile.personal_info") }}
            </h2>

            <form @submit.prevent="updateProfile">
              <!-- Name field -->
              <FormTextField
                id="name"
                v-model="profileData.name"
                :label="$t('auth.profile.name')"
                :placeholder="$t('auth.profile.name_placeholder')"
                :error="errors.name"
                class="mb-4"
              />

              <!-- Email field -->
              <FormTextField
                id="email"
                v-model="profileData.email"
                type="email"
                :label="$t('auth.profile.email')"
                :placeholder="$t('auth.profile.email_placeholder')"
                :error="errors.email"
                class="mb-4"
              />

              <!-- Confirm Email field -->
              <FormTextField
                id="confirmEmail"
                v-model="profileData.confirmEmail"
                type="email"
                :label="$t('auth.profile.confirm_email')"
                :placeholder="$t('auth.profile.confirm_email_placeholder')"
                :error="errors.confirmEmail"
                class="mb-4"
              />
              <p class="text-sm text-gray-500 mb-4">
                {{ $t("auth.profile.email_confirmation_info") }}
              </p>

              <!-- Submit button -->
              <FormButton
                type="submit"
                color="primary"
                :loading="formStatus === 'submitting'"
                :loadingText="$t('auth.profile.updating')"
                :disabled="formStatus === 'submitting'"
              >
                {{ $t("auth.profile.update_profile") }}
              </FormButton>
            </form>
          </div>
        </div>

        <!-- Change password -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">
              {{ $t("auth.profile.change_password") }}
            </h2>

            <form @submit.prevent="updatePassword">
              <!-- Current password field -->
              <FormTextField
                id="currentPassword"
                v-model="passwordData.currentPassword"
                type="password"
                :label="$t('auth.profile.current_password')"
                :placeholder="$t('auth.profile.password_placeholder')"
                :error="errors.currentPassword"
                class="mb-4"
              />

              <!-- New password field -->
              <FormTextField
                id="newPassword"
                v-model="passwordData.newPassword"
                type="password"
                :label="$t('auth.profile.new_password')"
                :placeholder="$t('auth.profile.new_password_placeholder')"
                :error="errors.newPassword"
                class="mb-4"
              />

              <!-- Confirm password field -->
              <FormTextField
                id="confirmPassword"
                v-model="passwordData.confirmPassword"
                type="password"
                :label="$t('auth.profile.confirm_password')"
                :placeholder="$t('auth.profile.confirm_password_placeholder')"
                :error="errors.confirmPassword"
                class="mb-6"
              />

              <!-- Submit button -->
              <FormButton
                type="submit"
                color="primary"
                :loading="formStatus === 'submitting'"
                :loadingText="$t('auth.profile.updating')"
                :disabled="formStatus === 'submitting'"
              >
                {{ $t("auth.profile.update_password") }}
              </FormButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
