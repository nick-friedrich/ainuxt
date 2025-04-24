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
