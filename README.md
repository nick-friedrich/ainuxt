# Project Ainuxt - Nuxt Monorepo

This repository contains the codebase for Project Ainuxt, a collection of Nuxt applications built within a Turborepo-powered monorepo structure.

Optimized for AI development, also called Vibe-Coding.

## Project Goal

The primary goal is to create a highly maintainable and easily extendable Nuxt project ecosystem. We achieve this through:

- **Modularity:** Using Nuxt Layers and shared packages to promote code reuse and separation of concerns.
- **Structure:** A clear and consistent directory layout.
- **Understandability:** Well-defined components and clear conventions.

## What's Inside?

This monorepo includes:

- **`apps/`**: Contains the individual Nuxt applications built using the shared layers and packages.
  - `my-app`: The primary Nuxt application. (Others may follow)
- **`layers/`**: Reusable Nuxt Layers providing specific functionalities or features shared across apps.
  - `auth`: Authentication logic. _(Upcoming)_
  - `styling`: Shared styling (TailwindCSS, DaisyUI) configuration and components.
  - `i18n`: Internationalization setup using `@nuxtjs/i18n` with structured locale files for English and German.
  - `database`: Utilities for accessing the shared database connection (via `packages/psql`).
  - `layout`: UI layout components with theme switching (light/dark) and language switcher integration.
- **`packages/`**: Shared non-Nuxt packages (utilities, configurations).
  - `psql`: Prisma client setup and database utilities for PostgreSQL.
  - `eslint-config-custom`: Shared ESLint configurations.
  - `tsconfig`: Shared TypeScript configurations.
- **`__examples/`**: Example setups (e.g., minimal Nuxt layer) for reference.
- **`_ai/`**: Internal documentation and prompts for AI assistant usage (see `_ai/readme.md`).

## Tech Stack

- **Framework:** Nuxt 3
- **Language:** TypeScript
- **Monorepo:** Turborepo
- **Package Manager:** pnpm
- **Database:** PostgreSQL with Prisma
- **Styling:** TailwindCSS (v4) with DaisyUI plugin
  - **Note:** Current setup requires apps to install Tailwind/DaisyUI deps and handle CSS imports; the `layers/styling` layer provides base config.
- **Icons:** nuxt-icon
- **i18n:** nuxt-i18n
- **Linting/Formatting:** ESLint, Prettier
- **Deployment (Potentially):** Docker

## Planned Features

- **Authentication System:** User authentication, registration, and profile management via the upcoming `auth` layer.
- **Contact Form:** Integrated contact form with validation and email forwarding capabilities.
- **Advanced Layouts:** Additional layout variants for various application contexts.

## Getting Started & Usage

1.  **Install Dependencies:**

    ```bash
    # Run from the root of the monorepo
    pnpm install
    ```

2.  **Environment Variables:**

    - Each application in `apps/` requires its own `.env` file.
    - Ensure `DATABASE_URL` is defined in the `.env` file of the app you intend to run (e.g., `apps/my-app/.env`).
    - The `packages/psql` package also has its own `.env` for potential direct use (e.g., seeding).
    - For docker compose we also need a .env in the root of the monorepo (see .env.example)

3.  **Database Setup:**

        - Ensure PostgreSQL is running (potentially via Docker - setup TBD).
        - Run Prisma migrations from the root:
          ```bash
          pnpm --filter @db/psql db:migrate # Or specific prisma commands via the psql package
          ```
        - Generate Prisma client (usually happens automatically post-install or on migration, but can be run manually):
          ```bash
          pnpm --filter @db/psql generate
          ```
        - Seed the database (if applicable):
          `bash

    pnpm --filter @db/psql db:seed
    `      _(Note: Adjust Prisma commands based on`packages/psql/package.json` scripts)\_

4.  **Development:**
    To run a specific app (e.g., `my-app`) in development mode:

    ```bash
    # Option 1: Using Turborepo filtering
    pnpm dev --filter=my-app...

    # Option 2: Specifying the app directly (if turbo scripts allow)
    pnpm dev my-app
    ```

    Turborepo handles building dependencies.

    **Layer Development:**
    Some layers, especially those with modules like i18n, need to generate type definitions for proper TypeScript support:

    ```bash
    # Generate types for a specific layer
    pnpm layer:dev --filter @layers/i18n

    # Run layer:dev across all layers that support it
    pnpm layer:dev
    ```

    This creates the `.nuxt` folder with necessary type definitions.

5.  **Build:**
    To build all apps and packages:
    ```bash
    pnpm build
    ```
    To build a specific app:
    ```bash
    pnpm build --filter=my-app...
    ```

### Important Conventions

- **PNPM Workspaces:** Use `pnpm` for all package management. Run commands from the workspace root.
- **Adding Dependencies:** Use `pnpm add <package> -F <app-or-package-name>` (e.g., `pnpm add lodash -F my-app`) or `pnpm add <package> -w` for root dev dependencies. Do _not_ manually edit `package.json` files.
- **Nuxt Layers:** New reusable functionalities should ideally be implemented as layers in the `layers/` directory. Refer to `__examples/minimal_nuxt_layer_example/instructions.md`.
- **AI Assistant:** Use `@_ai ...` commands for assistance. Refer to `_ai/readme.md` and `_ai/prompts/` for details.
- **File Header Comment:** All new source files (`.ts`, `.js`, `.vue`, `.css`, `.md`, etc., excluding auto-generated/config files where inappropriate) should start with a reference comment to the AI guidelines (adjust syntax based on file type):

  ```
  // AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
  ```

  For JSON files (which don't support comments), add an `"aiReference"` field:

  ```json
  {
    "aiReference": "See ~/_ai/README.md for guidelines and patterns",
    ...
  }
  ```

## Useful Links

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Turborepo Documentation](https://turbo.build/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com/)
