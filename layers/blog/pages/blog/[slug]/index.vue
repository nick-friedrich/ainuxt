<script setup lang="ts">
// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuth } from "../../../../auth/composables/useAuth";
import { useAsyncData, useSeoMeta, createError, showError } from "#imports";

type BlogPost = {
  id: number;
  title: string;
  category: string;
  slug: string;
  published: boolean;
  content: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
};

const { t: $t } = useI18n();
const route = useRoute();
const { user, fetchUser } = useAuth();
const isAdmin = computed(() =>
  user.value?.roles?.some((r: { name: string }) => r.name === "ADMIN")
);

// Fetch post server-side
const {
  data: post,
  status,
  error,
} = await useAsyncData<BlogPost | null>(
  `blog-post-${route.params.slug}`,
  async () => {
    try {
      return await ($fetch as any)(`/api/blog/${route.params.slug}`);
    } catch (e: any) {
      if (e?.statusCode === 404) {
        showError({
          statusCode: 404,
          statusMessage: $t("page_blog.detail.not_found"),
        });
      } else {
        showError({
          statusCode: 500,
          statusMessage: $t("page_blog.detail.error"),
        });
      }
      return null; // Return null on error
    }
  },
  { default: () => null } // Default value while loading
);

// Set SEO meta if post loaded
if (post.value) {
  useSeoMeta({
    title: post.value.title,
    description: post.value.content.substring(0, 150), // Truncate description
    ogTitle: post.value.title,
    ogDescription: post.value.content.substring(0, 150),
    // Add more meta tags as needed (e.g., keywords, image)
  });
}

const isLoading = computed(() => status.value === "pending");
// Fetch user client-side ONLY if not already populated by SSR
onMounted(() => {
  if (!user.value) {
    fetchUser();
  }
});
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
    <div v-if="isLoading" class="text-center py-8">
      {{ $t("common.loading") }}
    </div>
    <div v-else-if="error" class="alert alert-error alert-soft mb-4">
      {{ $t("page_blog.detail.error") }}
      <!-- Generic error, handled by showError -->
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
    <!-- No need for explicit 404 message here, showError handles it -->
  </div>
</template>
