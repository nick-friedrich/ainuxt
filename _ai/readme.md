# AI Reference

This folder contains reference materials for AI Chatbots assisting with this project.

## About the Project

This is a monorepo for Nuxt applications. We utilize Nuxt layers to structure the project effectively.

### Project Goal

We want to create a easy to maintain and extendable project. Therefore it needs to be structured, modular and easy to understand.

## Project Structure

The repository is organized as follows:

### `apps/`

This directory contains the individual Nuxt applications.

- **`my-app/`**: The primary application. _(Others may be added in the future)_

### `layers/`

This directory holds the reusable Nuxt layers shared across applications.

- **`base/`**: The fundamental layer that serves as the parent for all other layers. It provides base configuration (including compatibilityDate) for all layers and applications in the monorepo.
- **`auth/`**: Handles user authentication, protected routes, and session management. Extends the base layer for consistent configuration. Features include:
  - Login and registration pages with forms and validation
  - Protected routes via middleware (`auth.ts` and `guest.ts`)
  - Authentication state management with `useAuth` composable
  - Auth-aware AppHeader component with user menu
  - Server API endpoints for authentication (login, register, logout, user info)
  - Dashboard page for authenticated users
- **`styling/`**: Provides a base `tailwind.config.js` (Tailwind v4). **Note:** Due to current limitations, apps must install `tailwindcss`/`daisyui` themselves and import the main CSS (`@import 'tailwindcss'; @import 'daisyui';`) in their own `assets/css/`. The layer primarily serves to share the base config.
- **`i18n/`**: Manages internationalization and localization using `@nuxtjs/i18n` module. Provides core configuration, locale setup, and types. **Note:** We're transitioning to a decentralized approach where each layer manages its own translations rather than centralizing them in the i18n layer. The i18n layer will primarily provide the infrastructure for internationalization.
- **`database/`**: Provides utilities (`server/utils/db.ts`) to access the shared Prisma client defined in `packages/psql`.
- **`layout/`**: Provides shared layout components and theme management. Includes a default layout, theme switching functionality using cookies, and a language switcher component. The layer extends both `styling` and `i18n` layers to provide a complete UI foundation. **Note:** The current implementation does not include authentication-related UI; these will be added by the upcoming `auth` layer.

### `packages/`

This directory includes non-Nuxt-layer packages that are reused across the monorepo.

- **`psql/`**: Provides utilities or configurations for interacting with PostgreSQL.
  - **Authentication Models**: The package includes Prisma models for authentication (User, Session, Role, UserRole) with support for:
    - Session-based authentication with secure token handling
    - Role-based access control with User-Role relationships
    - Password hashing using argon2
    - Email verification infrastructure
    - OTP/2FA support structure
  - **Database Client**: Singleton pattern for Prisma client instantiation
  - **Seeding**: Scripts for creating initial admin and regular users with appropriate roles
  - **Environment**: Uses AUTH_SECRET environment variable for secure password hashing
- **`psql2/`**: (Potential future package) Intended for another application potentially requiring PostgreSQL interaction.

### `__examples/`

This directory contains example code snippets or mini-projects demonstrating common patterns or setups within this monorepo (e.g., creating a minimal Nuxt layer).

# General Instructions

- We use Typescript for the project.
- This is a monorepo project using pnpm as package manager.
- We use turbo as the build system.
- We use nuxt layers to structure the project.
- We use nuxt packages to reuse code across the project.
- We use docker to run the project.
- We use postgres to store the project data.
- We use prisma to interact with the database.
- We use tailwindcss for styling.
- We use nuxt-i18n for internationalization.
- We use nuxt-icon for icons.
- We use daisyui for the ui library.

- **Type Generation for Layers:** When working with layers that use specialized modules (like i18n), run `pnpm layer:dev --filter @layers/layer-name` to generate type definitions in the `.nuxt` folder. This ensures proper TypeScript support.

- **Internationalization Strategy:** Each layer should manage its own translations rather than centralizing them in the i18n layer. This promotes modularity and keeps translations close to where they're used.

- **File Header Comment:** All new source code files (`.ts`, `.js`, `.vue`, `.css`, `.md`, etc.) should start with a reference comment:

  ```
  // AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
  ```

  (Adjust comment syntax: `<!-- ... -->` for HTML/Markdown, `# ...` for shell/config files, etc.)

  **Exception for JSON files:** Since JSON doesn't support comments, add an `"aiReference"` field instead (except for turbo.json):

  ```json
  {
    "aiReference": "See ~/_ai/README.md for guidelines and patterns"
    // other JSON fields...
  }
  ```

- Always try to run the commands in the root of the project.
- Always try to use pnpm as package manager.
- Don't edit package.json files to add new dependencies, run pnpm add <package> instead.

- You might find ai.md files in some folders. These are specific instructions for this folder/package which needs to be followed.

- You might find a todolist.md file in some folders. These are specific instructions for this folder/package which needs to be followed. Otherwise create a new one. Also you can find one in the \_ai folder.

- Please keep the todo list's up to date.

- please keep the \_ai folder up to date with the latest information.

- feel free to create new .md files in the \_ai folder if needed.
