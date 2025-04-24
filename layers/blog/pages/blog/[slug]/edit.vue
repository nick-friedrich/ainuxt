<script setup lang="ts">
// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { ref, onMounted, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuth } from "../../../../auth/composables/useAuth";
import { onServerPrefetch } from "vue";

const { t: $t } = useI18n();
const route = useRoute();
const { user, fetchUser } = useAuth();
onServerPrefetch(fetchUser);
const isAdmin = computed(() =>
  user.value?.roles?.some((r) => r.name === "ADMIN")
);

const form = ref({
  title: "",
  category: "",
  slug: "",
  published: false,
  content: "",
  keywords: "",
});
const loading = ref(true);
const success = ref(false);
const error = ref("");
const fieldErrors = ref<Record<string, string[]>>({});

onMounted(async () => {
  loading.value = true;
  error.value = "";
  try {
    const post: any = await $fetch(`/api/blog/${route.params.slug}`);
    form.value = {
      title: post.title,
      category: post.category,
      slug: post.slug,
      published: post.published,
      content: post.content,
      keywords: post.keywords?.join(", ") || "",
    };
  } catch (e: any) {
    error.value = e?.data?.message || e.message || $t("page_blog.detail.error");
  } finally {
    loading.value = false;
  }
});

watchEffect(() => {
  if (isAdmin.value === false) {
    error.value =
      $t("errors.unauthorized") || "You are not authorized to edit blog posts.";
  }
});

async function submitForm() {
  success.value = false;
  error.value = "";
  fieldErrors.value = {};
  try {
    await $fetch(`/api/blog/${route.params.slug}`, {
      method: "PUT" as any,
      body: {
        ...form.value,
        keywords: form.value.keywords.split(",").map((k) => k.trim()),
      },
    });
    success.value = true;
  } catch (e: any) {
    if (e?.statusCode === 401) {
      error.value =
        $t("errors.unauthorized") ||
        "You are not authorized to edit blog posts.";
    } else if (e?.statusCode === 400 && e?.data?.data) {
      fieldErrors.value = e.data.data.fieldErrors || {};
      error.value =
        $t("errors.validation_failed") ||
        "Validation failed. Please check your input.";
    } else {
      error.value =
        e?.data?.message || e.message || $t("page_blog.new.form.error");
    }
  }
}
</script>
<template>
  <div class="max-w-2xl mx-auto py-8">
    <div class="mb-4">
      <NuxtLinkLocale :to="`/blog/${route.params.slug}`">
        <FormButton color="secondary" icon-left="heroicons:arrow-left">
          {{ $t("common.back") }}
        </FormButton>
      </NuxtLinkLocale>
    </div>
    <h1 class="text-2xl font-bold mb-6">{{ $t("page_blog.edit.title") }}</h1>
    <div v-if="loading" class="text-center py-8">
      {{ $t("common.loading") }}
    </div>
    <div
      v-else-if="!isAdmin && error"
      class="alert alert-error alert-soft mt-4"
    >
      {{ error }}
    </div>
    <form v-else @submit.prevent="submitForm" class="space-y-4">
      <FormTextField
        id="title"
        :label="$t('page_blog.new.form.title.label')"
        :placeholder="$t('page_blog.new.form.title.placeholder')"
        v-model="form.title"
        required
      />
      <FormTextField
        id="category"
        :label="$t('page_blog.new.form.category.label')"
        :placeholder="$t('page_blog.new.form.category.placeholder')"
        v-model="form.category"
      />
      <FormTextField
        id="slug"
        :label="$t('page_blog.new.form.slug.label')"
        :placeholder="$t('page_blog.new.form.slug.placeholder')"
        v-model="form.slug"
        required
      />
      <div>
        <label class="block font-medium mb-1" for="published">{{
          $t("page_blog.new.form.published.label")
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
        :label="$t('page_blog.new.form.content.label')"
        :placeholder="$t('page_blog.new.form.content.placeholder')"
        v-model="form.content"
        :rows="6"
        required
      />
      <FormTextField
        id="keywords"
        :label="$t('page_blog.new.form.keywords.label')"
        :placeholder="$t('page_blog.new.form.keywords.placeholder')"
        v-model="form.keywords"
      />
      <FormButton type="submit" color="primary">{{
        $t("page_blog.edit.save")
      }}</FormButton>
    </form>
    <div v-if="success" class="alert alert-success alert-soft mt-4">
      {{ $t("page_blog.edit.success") }}
    </div>
    <div v-if="error" class="alert alert-error alert-soft mt-4">
      {{ error }}
    </div>
  </div>
</template>
