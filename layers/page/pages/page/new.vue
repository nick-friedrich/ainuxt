<script setup lang="ts">
// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { ref, onMounted, computed, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useAuth } from "../../../auth/composables/useAuth";
import { onServerPrefetch } from "vue";

const { t: $t } = useI18n();

const { user, fetchUser } = useAuth();
onServerPrefetch(fetchUser);

const isAdmin = computed(() =>
  user.value?.roles?.some((r) => r.name === "ADMIN")
);

const form = ref({
  title: "",
  slug: "",
  published: false,
  content: "",
  keywords: "",
});

const success = ref(false);
const error = ref("");
const fieldErrors = ref<Record<string, string[]>>({});

watchEffect(() => {
  if (isAdmin.value === false) {
    error.value =
      $t("errors.unauthorized") || "You are not authorized to add pages.";
  }
});

async function submitForm() {
  success.value = false;
  error.value = "";
  fieldErrors.value = {};
  try {
    await $fetch("/api/page/add", {
      method: "POST",
      body: {
        ...form.value,
        keywords: form.value.keywords.split(",").map((k) => k.trim()),
      },
    });
    success.value = true;
    form.value = {
      title: "",
      slug: "",
      published: false,
      content: "",
      keywords: "",
    };
  } catch (e: any) {
    if (e?.statusCode === 401) {
      error.value =
        $t("errors.unauthorized") ||
        "You are not authorized to add pages.";
    } else if (e?.statusCode === 400 && e?.data?.data) {
      // Zod validation error
      fieldErrors.value = e.data.data.fieldErrors || {};
      error.value =
        $t("errors.validation_failed") ||
        "Validation failed. Please check your input.";
    } else {
      error.value =
        e?.data?.message || e.message || $t("page_page.new.form.error");
    }
  }
}
</script>
<template>
  <div class="max-w-2xl mx-auto py-8">
    <div class="mb-4">
      <NuxtLinkLocale :to="'/page'">
        <FormButton color="secondary" icon-left="heroicons:arrow-left">
          {{ $t("common.back") }}
        </FormButton>
      </NuxtLinkLocale>
    </div>
    <h1 class="text-2xl font-bold mb-6">{{ $t("page_page.new.title") }}</h1>
    <div v-if="!isAdmin && error" class="alert alert-error alert-soft mt-4">
      {{ error }}
    </div>
    <form v-else @submit.prevent="submitForm" class="space-y-4">
      <FormTextField
        id="title"
        :label="$t('page_page.new.form.title.label')"
        :placeholder="$t('page_page.new.form.title.placeholder')"
        v-model="form.title"
        required
      />
      <FormTextField
        id="slug"
        :label="$t('page_page.new.form.slug.label')"
        :placeholder="$t('page_page.new.form.slug.placeholder')"
        v-model="form.slug"
        required
      />
      <div>
        <label class="block font-medium mb-1" for="published">{{
          $t("page_page.new.form.published.label")
        }}</label>
        <input
          id="published"
          v-model="form.published"
          type="checkbox"
          class="checkbox checkbox-primary"
        />
      </div>
      <FormTextArea
        id="content"
        :label="$t('page_page.new.form.content.label')"
        :placeholder="$t('page_page.new.form.content.placeholder')"
        v-model="form.content"
        :rows="6"
        required
      />
      <FormTextField
        id="keywords"
        :label="$t('page_page.new.form.keywords.label')"
        :placeholder="$t('page_page.new.form.keywords.placeholder')"
        v-model="form.keywords"
      />
      <FormButton type="submit" color="primary">{{
        $t("page_page.new.form.submit")
      }}</FormButton>
    </form>
    <div v-if="success" class="alert alert-success alert-soft mt-4">
      {{ $t("page_page.new.form.success") }}
    </div>
    <div v-if="error" class="alert alert-error alert-soft mt-4">
      {{ $t("page_page.new.form.error") }}
    </div>
  </div>
</template>
