<!-- AI Generation Reference: See ~/_ai/README.md for guidelines and patterns. -->

# My App

A Nuxt application built using the Ainuxt monorepo structure with shared layers for styling, i18n, layout, and database functionality.

## Features

- **Multi-language Support**: English and German via the i18n layer
- **Theme Switching**: Light and dark mode via the layout layer
- **Database Integration**: PostgreSQL with Prisma

## Setup

Make sure to install dependencies from the root of the monorepo:

```bash
# From the monorepo root
pnpm install
```

### Environment Variables

Create a `.env` file in this directory with:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ainuxt?schema=public"
```

Adjust the values based on your PostgreSQL configuration.

## Using the Layers

This application uses several shared layers from the monorepo:

### Database Layer

The database layer provides access to the Prisma client. Use it in your API routes:

```typescript
// server/api/users.get.ts
import { db } from "#imports";

export default defineEventHandler(async () => {
  const users = await db.user.findMany();
  return users;
});
```

### Styling Layer (Tailwind v4 + DaisyUI)

The styling layer provides Tailwind and DaisyUI configuration. Use Tailwind classes directly in your templates:

```vue
<div class="bg-primary text-white p-4 rounded-lg">
  Styled with Tailwind & DaisyUI
</div>
```

### i18n Layer

The i18n layer provides translations. See [\_ai/i18n.md](../../_ai/i18n.md) for detailed usage.

Basic usage:

```vue
<script setup>
const { t } = useI18n();
</script>

<template>
  <h1>{{ t("common.welcome") }}</h1>
</template>
```

> **Note:** For proper TypeScript type support, you may need to run `pnpm layer:dev --filter @layers/i18n` from the monorepo root to generate type definitions.

### Layout Layer

The layout layer provides UI components including theme switching and layouts. See [\_ai/layout.md](../../_ai/layout.md) for detailed usage.

Example:

```vue
<template>
  <div>
    <!-- These components are available from the layout layer -->
    <ThemeSwitcher />
    <LanguageSwitcher />

    <!-- Your content -->
  </div>
</template>
```

## Development Server

Start the development server from the monorepo root:

```bash
# Start just this app
pnpm dev --filter=my-app

# Or use turbo to also build dependencies
pnpm dev --filter=my-app...
```

## Building for Production

Build from the monorepo root:

```bash
pnpm build --filter=my-app
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
