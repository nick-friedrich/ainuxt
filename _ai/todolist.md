- [x] Create a reusable `layers/database` layer for database abstraction.
  - ~~[ ] Initialize Prisma client within the layer using `runtimeConfig` for dynamic connection strings.~~ (Leveraged existing `packages/psql` singleton)
  - [x] Provide database utility functions via `server/utils/db.ts` (imports from `packages/psql`).
- [x] Configure `apps/my-app` to use the `layers/database` layer and provide its `DATABASE_URL` via `runtimeConfig`.

- [x] In the ai folder create a prompts folder and create a file called `___ai_update.md`, the prompt should be used to update the todolist.md file and the ai folder in general.

- [x] Document the process for creating a new Nuxt layer.

  - [x] Added `__examples/minimal_nuxt_layer_example/instructions.md` with manual steps.
  - [x] Added `_ai/prompts/___new_layer.md` for AI-assisted layer creation.
  - [x] Updated `_ai/readme.md` to include the `__examples` directory.
  - [x] Updated `_ai/prompts/___ai_update.md` trigger.

- [x] Configure `apps/my-app` styling (Tailwind v4 Workaround):
  - [x] Extend `layers/styling` in `apps/my-app/nuxt.config.ts`.
  - [x] Add Tailwind/DaisyUI dev dependencies to `apps/my-app` (`pnpm add -F my-app ...`).
  - [x] Create `apps/my-app/assets/css/tailwind.css` with `@import` directives.
  - [x] Register CSS file in `apps/my-app/nuxt.config.ts`.
  - [x] Configure `@tailwindcss/vite` plugin in `apps/my-app/nuxt.config.ts`.
  - [x] Create/update `apps/my-app/tailwind.config.js` with `content` paths.
