<script setup lang="ts">
// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { ref, computed } from "vue";
import { z } from "zod";
import { contactFormSchema } from "~/server/utils/contact.schema";

// Define the type based on Zod schema
type Schema = z.output<typeof contactFormSchema>;

const { t } = useI18n();

// Form state - Use Partial to allow initial empty/undefined state before validation
const state = ref<Partial<Schema>>({
  name: undefined,
  email: undefined,
  message: undefined,
});

// Ref to store validation errors for each field
const errors = ref<{ [key in keyof Schema]?: string }>({});

// Submission handling
const formStatus = ref("idle"); // idle, submitting, success, error
const submissionError = ref<string | null>(null);

// Manual validation and submission
async function onSubmit() {
  // Clear previous errors
  errors.value = {};
  submissionError.value = null;
  formStatus.value = "submitting";

  // Validate state using Zod schema
  const result = contactFormSchema.safeParse(state.value);

  if (!result.success) {
    // Map Zod errors to our errors ref
    result.error.issues.forEach((issue) => {
      const path = issue.path[0] as keyof Schema; // Assuming simple, non-nested paths
      const messageKey = issue.message; // Message is now the i18n key

      // Prepare arguments for interpolation (e.g., { min: 10 } for minLength)
      let messageArgs = {};
      if ("minimum" in issue) {
        messageArgs = { min: (issue as any).minimum };
      }

      if (path && messageKey) {
        errors.value[path] = t(messageKey, messageArgs); // Translate using t() with args
      }
    });
    formStatus.value = "error";
    return;
  }

  // --- If validation passes, proceed with submission ---
  try {
    const apiResult = await $fetch("/api/contact", {
      method: "POST",
      body: result.data, // Send validated data
    });
    formStatus.value = "success";
    // Reset form state on success
    state.value = { name: undefined, email: undefined, message: undefined };
    errors.value = {}; // Clear errors as well
  } catch (error: any) {
    console.error("Form submission error:", error);
    submissionError.value =
      error.data?.message || t("page_contact.contact.form.error");
    formStatus.value = "error";
  }
}

const isLoading = computed(() => formStatus.value === "submitting");
</script>

<template>
  <div>
    <h1 class="mb-4 text-2xl font-bold">
      {{ $t("page_contact.contact.title") }}
    </h1>

    <div class="card bg-base-200 mt-6 shadow-xl">
      <div class="card-body">
        <h3 class="card-title">
          {{ $t("page_contact.contact.form.title") }}
        </h3>

        <form class="space-y-4" @submit.prevent="onSubmit">
          <!-- Use BaseInput for Name -->
          <FormTextField
            id="contact-name"
            v-model="state.name"
            :label="$t('page_contact.contact.form.name.label')"
            :placeholder="$t('page_contact.contact.form.name.placeholder')"
            :error="errors.name"
            required
          />

          <!-- Use BaseInput for Email -->
          <FormTextField
            id="contact-email"
            v-model="state.email"
            type="email"
            :label="$t('page_contact.contact.form.email.label')"
            placeholder="you@example.com"
            :error="errors.email"
            required
          />

          <!-- Use BaseTextarea for Message -->
          <FormTextArea
            id="contact-message"
            v-model="state.message"
            :label="$t('page_contact.contact.form.message.label')"
            :placeholder="$t('page_contact.contact.form.message.placeholder')"
            :error="errors.message"
            :rows="4"
            required
          />

          <!-- Submit Button -->
          <div class="card-actions justify-end pt-4">
            <!-- Use BaseButton -->
            <FormButton
              type="submit"
              color="primary"
              :loading="isLoading"
              :loadingText="$t('page_contact.contact.form.submitting')"
              :disabled="isLoading"
            >
              {{ $t("page_contact.contact.form.submit") }}
            </FormButton>
          </div>

          <!-- Alerts -->
          <div
            v-if="formStatus === 'success'"
            role="alert"
            class="alert alert-success alert-soft mt-4"
          >
            <!-- Success Icon and text -->
            <span>{{ $t("page_contact.contact.form.success") }}</span>
          </div>

          <div
            v-if="formStatus === 'error' && submissionError"
            role="alert"
            class="alert alert-error alert-soft mt-4"
          >
            <!-- Error Icon and text -->
            <span>{{ submissionError }}</span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
