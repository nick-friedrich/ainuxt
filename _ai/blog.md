# Blog Layer Documentation

## Overview

The `blog` layer provides functionality for managing blog posts within the application. It includes:

- Pages for viewing, listing, creating, and editing blog posts.
- API endpoints for CRUD operations on blog posts.
- Role-based access control (only `ADMIN` users can create/edit posts).

## Dependencies

- `@layers/auth` (for user fetching and role checks)
- `@layers/database` (for database access)
- `@layers/layout` (for UI components and layout)
- `@layers/i18n` (for translations)
- `zod` (for API validation)

## Structure

```
layers/blog/
├── i18n/
│   └── locales/      # EN and DE translations for blog UI
├── pages/
│   ├── blog/
│   │   ├── index.vue         # Lists all blog posts
│   │   ├── new.vue           # Form to create a new blog post (Admin only)
│   │   └── [slug]/
│   │       ├── index.vue     # Displays a single blog post
│   │       └── edit.vue      # Form to edit an existing blog post (Admin only)
└── server/
    └── api/
        └── blog/
            ├── index.get.ts      # Get all blog posts
            ├── add.post.ts       # Create a new blog post (Admin only)
            ├── [slug].get.ts     # Get a single blog post by slug
            └── [slug].put.ts     # Update a blog post by slug (Admin only)
```

## Pages

- **`/blog`**: Lists all posts. Shows an "Add New" button for admins.
- **`/blog/new`**: Form for creating a new post. Accessible only to admins.
- **`/blog/[slug]`**: Displays a single post. Shows an "Edit" button for admins.
- **`/blog/[slug]/edit`**: Form for editing an existing post. Accessible only to admins.

## API Endpoints

- **`GET /api/blog`**: Returns all blog posts.
- **`POST /api/blog/add`**: Creates a new blog post. Requires `ADMIN` role.
- **`GET /api/blog/[slug]`**: Returns a single blog post by slug.
- **`PUT /api/blog/[slug]`**: Updates a blog post by slug. Requires `ADMIN` role.

## Conventions

- Uses shared `Form*` components from the `layout` layer.
- Uses `NuxtLinkLocale` for navigation.
- Uses `useAuth` composable for client-side auth checks.
- Uses `getUserFromSession` utility for server-side auth checks.
- API endpoints validate input using Zod.
- All user-facing text is translated using `@nuxtjs/i18n`.

- When fetching data server-side that depends on authentication (e.g. listing unpublished posts for admins), forward incoming cookies by using `useRequestHeaders` in a `process.server` block and pass the resulting headers into your `$fetch` call. For example:

  ```ts
  import { useRequestHeaders } from "#imports";

  const requestHeaders = process.server ? useRequestHeaders(["cookie"]) : {};
  const { data: posts } = await useAsyncData<BlogPost[]>("blog-posts", () =>
    $fetch("/api/blog", { headers: requestHeaders })
  );
  ```

## Page Implementation Patterns

- Server-side user sync: In `<script setup>`, call `onServerPrefetch(fetchUser)` to prefetch the session during SSR, then use a `clientReady` `ref(false)` + `onMounted` to hydrate or re-fetch the user on the client only if needed.
- Role-based UI: Define `const isAdmin = computed(() => user.value?.roles?.some(r => r.name === 'ADMIN'))` and guard admin-only controls (e.g. new/post buttons, edit links).
- Unpublished badge: Wrap badges in `v-if="clientReady && isAdmin && !post.published"` to prevent hydration mismatches.
- SEO meta: Use `useSeoMeta({ title: $t('page_blog.index.title'), description: $t('page_blog.index.seo_description') })` and ensure the `page_blog.index.seo_description` key exists in your locale files.
- Date formatting helper: Use a simple `formatDate(dateString: string)` (e.g. `DD.MM.YYYY`) to render dates consistently.
- Content preview: Use `<MarkdownRenderer :content="post.content" size="sm" />` inside a `line-clamp-2` container for snippet previews.
- Locale-aware routing: Use `NuxtLinkLocale` for all internal links, e.g. `<NuxtLinkLocale :to="`/blog/${post.slug}`">`.
