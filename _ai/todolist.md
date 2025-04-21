- [x] Create a reusable `layers/database` layer for database abstraction.
  - ~~[ ] Initialize Prisma client within the layer using `runtimeConfig` for dynamic connection strings.~~ (Leveraged existing `packages/psql` singleton)
  - [x] Provide database utility functions via `server/utils/db.ts` (imports from `packages/psql`).
  - [x] Configure the database layer to be imported by other layers via proper exports configuration.
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

- [x] Refactor i18n implementation to use decentralized approach:

  - [x] Convert TypeScript translation files to JSON format
  - [x] Move translations from i18n layer to each individual layer
  - [x] Update i18n configuration in each layer's nuxt.config.ts
  - [x] Add example translations to the minimal_nuxt_layer_example
  - [x] Update documentation to reflect the new i18n structure
  - [x] Test integration with existing components

- [x] Implement the `@layers/contact` layer:

  - [x] Set up initial layer structure with basic configuration
  - [x] Configure layer to extend the base and layout layers
  - [x] Create contact page with form UI
  - [x] Add Zod schema for form validation
  - [x] Implement i18n support with translated validation messages
  - [x] Create server endpoint for form submission
  - [x] Integrate with mail layer for sending contact emails
  - [x] Add proper error handling and success states
  - [x] Update apps/my-app to use the contact layer

- [ ] Implement the `@layers/mail` layer:

  - [x] Set up initial layer structure with basic configuration
  - [x] Configure layer to extend the base layer
  - ~~[x] Set up i18n translations for the mail functionality~~ (Removed in favor of direct integration)
  - [x] Add an email sending service using a mail provider (Resend API)
  - [x] Create adapter-based architecture for different email providers
  - [x] Implement console adapter for development environment
  - [x] Add configuration through runtime config (API keys, from email/name)
  - [x] Add exports configuration for importing mail functionality
  - [x] Create proper TypeScript interfaces for email operations
  - [ ] Create email templates for various use cases (welcome, password reset, notifications, etc.)
  - [ ] Create a mail queue system for reliable email delivery
  - [ ] Add logging and error handling for email operations
  - [ ] Integrate with the auth layer for user-related emails
  - [ ] Create documentation for the mail layer

- [ ] Implement the `@layers/auth` layer:

  - [x] Set up initial layer structure with basic configuration
  - [x] Configure layer to extend the base layer
  - [x] Create login/register pages with forms and validation
  - [x] Create protected dashboard page
  - [x] Implement useAuth composable for authentication state management
  - [x] Implement auth and guest middleware for route protection
  - [x] Create auth server API endpoints (login, register, logout, user)
  - [x] Create auth-aware AppHeader component with user menu
  - [x] Refactor to use database layer abstraction instead of direct DB package
  - [x] Implement user registration endpoint
  - [x] Implement user login endpoint
  - [x] Implement user logout endpoint
  - [x] Implement get current user endpoint
  - [x] Implement update user profile endpoint
  - [x] Implement change password endpoint
  - [ ] Implement password reset functionality
  - [ ] Implement email verification process
  - [ ] Add social authentication providers (Google, GitHub, etc.)

## Lessons Learned

- [x] Use consistent database access patterns (`db` from '@layers/database/db' instead of direct 'prisma' usage)
- [x] Use i18n translation keys in both client-side forms and server-side validations
- [x] Verify that database schema field names match exactly in code (e.g., 'emailVerifiedAt' not 'emailVerified')
- [x] Keep error handling consistent across API endpoints (401 for unauthorized, 400 for validation errors)
- [x] Add comprehensive translations for all user-facing content in all supported languages (EN, DE)

- [ ] Future Enhancements:

  - [ ] Expand i18n translations for additional components and pages
  - [ ] Create additional layout variants (AuthLayout, AdminLayout, etc.)
  - [ ] Add more UI components to the layout layer
  - [ ] Integrate auth layer with layout for user-specific themes/settings

- [x] Implement Contact Form:

  - [x] Create contact form component
  - [x] Create server API endpoint for form submission
  - [x] Add form validation
  - [x] Implement email sending functionality
  - [x] Add success/error states and feedback

- [ ] Create Documentation:

  - [x] Create `_ai/i18n.md` with i18n layer usage guide and best practices
  - [x] Create `_ai/layout.md` with layout layer usage guide and theme examples
  - [x] Update application READMEs with layer integration instructions
  - [x] Create `_ai/auth.md` with authentication layer usage guide and security best practices
  - [ ] Create `_ai/mail.md` with mail layer usage guide and examples
  - [ ] Create `_ai/contact.md` with contact layer usage guide and examples

- [ ] Get the translations into the layers not centralised in the i18n layer
