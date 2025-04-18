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
  - [x] Updated `__examples/minimal_nuxt_layer_example/instructions.md` to include information about TypeScript type generation.

- [x] Create a reusable `@layers/base` layer as the foundation for all other layers.

  - [x] Set up base configuration with compatibilityDate.
  - [x] Ensure all other layers extend from this base layer for consistent configuration.

- [x] Configure `apps/my-app` styling (Tailwind v4 Workaround):

  - [x] Extend `@layers/styling` in `apps/my-app/nuxt.config.ts`.
  - [x] Add Tailwind/DaisyUI dev dependencies to `apps/my-app` (`pnpm add -F my-app ...`).
  - [x] Create `apps/my-app/assets/css/tailwind.css` with `@import` directives.
  - [x] Register CSS file in `apps/my-app/nuxt.config.ts`.
  - [x] Configure `@tailwindcss/vite` plugin in `apps/my-app/nuxt.config.ts`.
  - [x] Create/update `apps/my-app/tailwind.config.js` with `content` paths.

- [x] Implement the `@layers/layout` layer:

  - [x] Create shared layout components (DefaultLayout, etc.)
  - [x] Configure composables for layout management (useThemeCookie)
  - [x] Implement theme switching functionality
  - [x] Create language switcher component
  - [x] Create auth-free AppHeader component (for base layout usage)
  - [ ] Document usage in applications

- [x] Implement the `@layers/i18n` layer:

  - [x] Add nuxt-i18n module dependency
  - [x] Configure basic translation structure with locale files
  - [x] Set up English and German translations
  - [x] Add `layer:dev` script command for generating type definitions
  - [ ] Document usage in applications

- [x] Update `packages/psql` authentication models:

  - [x] Add User, Session, Role, and UserRole models to Prisma schema
  - [x] Create initial migration for auth models
  - [x] Update seed script to create admin and regular users with roles
  - [x] Add argon2 for password hashing
  - [x] Add AUTH_SECRET environment variable for secure password hashing

- [ ] Implement the `@layers/auth` layer:

  - [x] Set up initial layer structure with basic configuration
  - [x] Configure layer to extend the base layer
  - [x] Create login/register pages with forms and validation
  - [x] Create protected dashboard page
  - [x] Implement useAuth composable for authentication state management
  - [x] Implement auth and guest middleware for route protection
  - [x] Create auth server API endpoints (login, register, logout, user)
  - [x] Create auth-aware AppHeader component with user menu
  - [ ] Integrate with database layer for user authentication (Started)
  - [ ] Add user profile management
  - [ ] Add role-based access control
  - [ ] Add email verification
  - [ ] Add password reset functionality

- [ ] Future Enhancements:

  - [ ] Expand i18n translations for additional components and pages
  - [ ] Create additional layout variants (AuthLayout, AdminLayout, etc.)
  - [ ] Add more UI components to the layout layer
  - [ ] Integrate auth layer with layout for user-specific themes/settings

- [ ] Implement Contact Form:

  - [ ] Transfer contact form component from existing repository
  - [ ] Create server API endpoint for form submission
  - [ ] Add form validation
  - [ ] Implement email sending functionality
  - [ ] Add success/error states and feedback

- [ ] Create Documentation:

  - [x] Create `_ai/i18n.md` with i18n layer usage guide and best practices
  - [x] Create `_ai/layout.md` with layout layer usage guide and theme examples
  - [x] Update application READMEs with layer integration instructions
  - [ ] Create `_ai/auth.md` with authentication layer usage guide and security best practices

- [ ] Get the translations into the layers not centralised in the i18n layer
