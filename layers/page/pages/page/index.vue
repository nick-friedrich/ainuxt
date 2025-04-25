<script setup lang="ts">
// AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAuth } from "../../../auth/composables/useAuth";
import { useAsyncData, useSeoMeta, useRequestHeaders } from "#imports";

const { t: $t } = useI18n();
const { user, fetchUser, loading: authLoading } = useAuth();
onServerPrefetch(fetchUser);

const isAdmin = computed(() =>
  user.value?.roles?.some((r: { name: string }) => r.name === "ADMIN")
);

// PAGE type (copied and adapted from BlogPost)
type Page = {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  content: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
};

// Fetch pages server-side
const requestHeaders = import.meta.server ? useRequestHeaders(["cookie"]) : {};
const {
  data: pages,
  status,
  error,
} = await useAsyncData<Page[]>(
  "pages",
  () => ($fetch as any)("/api/page", { headers: requestHeaders }),
  { default: () => [] }
);

const dataLoading = computed(() => status.value === "pending");

// Combined loading state: wait for both pages and auth
const pageLoading = computed(() => dataLoading.value || authLoading.value);

// Set SEO meta
useSeoMeta({
  title: $t("page_page.index.title"),
  description: $t("page_page.index.seo_description"), // Add this key to i18n
});

const clientReady = ref(false);
onMounted(() => {
  clientReady.value = true;
  // Fetch user client-side ONLY if not already populated by SSR
  if (!user.value) {
    fetchUser();
  }
});

// Helper function for consistent date formatting (DD.MM.YYYY)
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
</script>
<template>
  <div class="max-w-3xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6">{{ $t("page_page.index.title") }}</h1>
    <div v-if="isAdmin" class="mb-6 text-right">
      <NuxtLinkLocale :to="'/page/new'">
        <FormButton color="primary" icon-left="heroicons:plus">
          {{ $t("page_page.index.new_page") }}
        </FormButton>
      </NuxtLinkLocale>
    </div>
    <div v-if="pageLoading" class="text-center py-8">
      {{ $t("common.loading") }}
    </div>
    <div v-else-if="error" class="alert alert-error alert-soft mb-4">
      {{ $t("page_page.index.error") }}
    </div>
    <div v-else>
      <div
        v-if="!pages || pages.length === 0"
        class="text-center text-gray-500"
      >
        {{ $t("page_page.index.empty") }}
      </div>
      <ul v-else class="space-y-4">
        <li
          v-for="page in pages"
          :key="page.id"
          class="card bg-base-100 shadow"
        >
          <div class="card-body">
            <NuxtLinkLocale
              :to="`/page/${page.slug}`"
              class="card-title text-xl font-semibold hover:underline"
            >
              {{ page.title }}
              <span
                v-if="clientReady && isAdmin && !page.published"
                class="badge badge-warning badge-sm ml-2"
              >
                {{ $t("page_page.common.unpublished") }}
              </span>
            </NuxtLinkLocale>
            <div class="text-sm text-gray-500 mb-2">
              <span>{{ formatDate(page.createdAt) }}</span>
            </div>
            <div class="line-clamp-2 text-gray-700">
              <MarkdownRenderer :content="page.content" size="sm" />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
