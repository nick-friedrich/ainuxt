<script setup lang="ts">
// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuth } from "../../../../auth/composables/useAuth";

const { t: $t } = useI18n();
const route = useRoute();
const router = useRouter();
const post = ref<any>(null);
const loading = ref(true);
const error = ref("");
const { user, fetchUser } = useAuth();
const isAdmin = computed(() =>
  user.value?.roles?.some((r) => r.name === "ADMIN")
);

onMounted(async () => {
  loading.value = true;
  error.value = "";
  try {
    post.value = await $fetch(`/api/blog/${route.params.slug}`);
  } catch (e: any) {
    if (e?.statusCode === 404) {
      error.value = $t("page_blog.detail.not_found");
    } else {
      error.value =
        e?.data?.message || e.message || $t("page_blog.detail.error");
    }
  } finally {
    loading.value = false;
  }
});

onServerPrefetch(fetchUser);
</script>
<template>
  <div class="max-w-3xl mx-auto py-8">
    <div class="mb-4 flex gap-2">
      <NuxtLinkLocale :to="'/blog'">
        <FormButton color="secondary" icon-left="heroicons:arrow-left">
          {{ $t("common.back") }}
        </FormButton>
      </NuxtLinkLocale>
      <NuxtLinkLocale v-if="isAdmin" :to="`/blog/${route.params.slug}/edit`">
        <FormButton color="primary" icon-left="heroicons:pencil-square">
          {{ $t("page_blog.detail.edit") }}
        </FormButton>
      </NuxtLinkLocale>
    </div>
    <div v-if="loading" class="text-center py-8">
      {{ $t("common.loading") }}
    </div>
    <div v-else-if="error" class="alert alert-error alert-soft mb-4">
      {{ error }}
    </div>
    <div v-else-if="post">
      <div class="flex items-center gap-2 mb-2">
        <h1 class="text-3xl font-bold">{{ post.title }}</h1>
        <span
          v-if="isAdmin && !post.published"
          class="badge badge-warning badge-sm"
        >
          {{ $t("page_blog.common.unpublished") }}
        </span>
      </div>
      <div class="text-sm text-gray-500 mb-4">
        <span>{{ post.category }}</span> ·
        <span>{{ new Date(post.createdAt).toLocaleDateString() }}</span>
      </div>
      <MarkdownRenderer :content="post.content" />
    </div>
  </div>
</template>
