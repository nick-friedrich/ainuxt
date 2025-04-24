<script setup lang="ts">
// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAuth } from "../../../auth/composables/useAuth";
import { onServerPrefetch } from "vue";

const { t: $t } = useI18n();
const posts = ref<any[]>([]);
const loading = ref(true);
const error = ref("");
const { user, fetchUser } = useAuth();
const isAdmin = computed(() =>
  user.value?.roles?.some((r: { name: string }) => r.name === "ADMIN")
);

onMounted(async () => {
  loading.value = true;
  error.value = "";
  try {
    posts.value = await $fetch("/api/blog");
  } catch (e: any) {
    error.value = e?.data?.message || e.message || $t("page_blog.index.error");
  } finally {
    loading.value = false;
  }
});

onServerPrefetch(fetchUser);
</script>
<template>
  <div class="max-w-3xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6">{{ $t("page_blog.index.title") }}</h1>
    <div v-if="isAdmin" class="mb-6 text-right">
      <NuxtLinkLocale :to="'/blog/new'">
        <FormButton color="primary" icon-left="heroicons:plus">
          {{ $t("page_blog.index.new_post") }}
        </FormButton>
      </NuxtLinkLocale>
    </div>
    <div v-if="loading" class="text-center py-8">
      {{ $t("common.loading") }}
    </div>
    <div v-else-if="error" class="alert alert-error alert-soft mb-4">
      {{ error }}
    </div>
    <div v-else>
      <div v-if="posts.length === 0" class="text-center text-gray-500">
        {{ $t("page_blog.index.empty") }}
      </div>
      <ul v-else class="space-y-4">
        <li
          v-for="post in posts"
          :key="post.id"
          class="card bg-base-100 shadow"
        >
          <div class="card-body">
            <NuxtLinkLocale
              :to="`/blog/${post.slug}`"
              class="card-title text-xl font-semibold hover:underline"
            >
              {{ post.title }}
              <span
                v-if="isAdmin && !post.published"
                class="badge badge-warning badge-sm ml-2"
              >
                {{ $t("page_blog.common.unpublished") }}
              </span>
            </NuxtLinkLocale>
            <div class="text-sm text-gray-500 mb-2">
              <span>{{ post.category }}</span> ·
              <span>{{ new Date(post.createdAt).toLocaleDateString() }}</span>
            </div>
            <div class="line-clamp-2 text-gray-700">
              <MarkdownRenderer :content="post.content" size="sm" />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
