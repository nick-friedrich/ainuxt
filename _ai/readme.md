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
- **`contact/`**: Provides contact form functionality and email submission handling. Extends the base and layout layers. Features include:
  - Contact page with responsive form UI
  - Form validation using Zod schema
  - Internationalization support with translated error messages
  - Email submission via the mail layer
  - Server-side validation and error handling
- **`mail/`**: Provides email functionality for the application. Extends the base layer and includes infrastructure for sending and managing emails. Features include:
  - Adapter-based architecture with different email providers (Resend for production, console for development)
  - Centralized email sending through a simple API (`sendEmail` function)
  - Type-safe email interfaces
  - Environment-based configuration through runtime config
  - Auto-switching between production and development modes
- **`styling/`**: Provides a base `tailwind.config.js` (Tailwind v4). **Note:** Due to current limitations, apps must install `tailwindcss`/`daisyui` themselves and import the main CSS (`@import 'tailwindcss'; @import 'daisyui';`) in their own `assets/css/`. The layer primarily serves to share the base config.
- **`i18n/`**: Manages internationalization and localization using `@nuxtjs/i18n` module. Provides core configuration, locale setup, and types. **Note:** Each layer manages its own translations using JSON files rather than centralizing them in the i18n layer. The i18n layer primarily provides the infrastructure for internationalization.
- **`database/`**: Provides utilities (`server/utils/db.ts`) to access the shared Prisma client defined in `packages/psql`. The layer acts as an abstraction over the direct database package, allowing other layers to import from `@layers/database/db` rather than directly from `@db/psql`.
- **`layout/`**: Provides shared layout components and theme management. Includes a default layout, theme switching functionality using cookies, and a language switcher component. The layer extends both `styling` and `i18n` layers to provide a complete UI foundation. **Note:** The current implementation does not include authentication-related UI; these will be added by the upcoming `auth` layer.
- **`content/`**: A layer for managing content within the application.
- **`blog/`**: A layer for managing blog content within the application.

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

- **Internationalization Strategy:** Each layer should manage its own translations using JSON files rather than centralizing them in the i18n layer. This promotes modularity and keeps translations close to where they're used.

- **Server-Side Translations**: A custom Nitro plugin in the `i18n` layer (`layers/i18n/server/plugins/0.translations.server.ts`) handles server-side translations (e.g., for emails). It scans all layers/apps for locale JSON files, merges them, and injects a `t` function into the H3 event context (`event.context.t`). This is a workaround for limitations with using `@nuxtjs/i18n` directly in server routes.

- **Layer Exports:** When creating functionality in a layer that should be imported by other layers or apps, define it in the `exports` field of the layer's package.json. For example:

  ```json
  "exports": {
    "./db": "./server/utils/db.ts",
    "./mail": "./server/utils/email/index.ts"
  }
  ```

  Then import it as `import { something } from "@layers/layer-name/export-name"`.

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
- - When running scripts defined in a specific workspace package, use `pnpm -F <packageName> <script>` (e.g., `pnpm -F @db/psql prisma migrate dev`).
- Don't edit package.json files to add new dependencies, run pnpm add <package> instead.

- You might find ai.md files in some folders. These are specific instructions for this folder/package which needs to be followed.

- You might find a todolist.md file in some folders. These are specific instructions for this folder/package which needs to be followed. Otherwise create a new one. Also you can find one in the \_ai folder.

- Please keep the todo list's up to date.

- please keep the \_ai folder up to date with the latest information.

- feel free to create new .md files in the \_ai folder if needed.

## Auth Layer

The auth layer provides authentication and user management functionality:

- **User Registration and Login**: Standard email/password authentication
- **Session Management**: Secure cookie-based sessions
- **Profile Management**: Users can update their profile information (name, email) and change passwords
- **Email Verification**: Support for email verification with resendable verification links
- **Role-based Authorization**: Support for user roles and permissions

### API Routes

- `/api/auth/login.post.ts`: User login endpoint
- `/api/auth/register.post.ts`: User registration endpoint
- `/api/auth/logout.post.ts`: User logout endpoint
- `/api/auth/user.get.ts`: Get current user data endpoint
- `/api/auth/profile.put.ts`: Update user profile (name, email) endpoint
- `/api/auth/password.put.ts`: Update user password endpoint
- `/api/auth/send-verification-mail.post.ts`: Resend verification email endpoint

### Components

- `profile.vue`: User profile page with forms for updating personal information and changing password
  - Includes email verification status banner with resend option

### Notes

- Email changes require verification (emailVerifiedAt is set to null when email changes)
- The database schema uses `emailVerifiedAt` field for email verification status, not `emailVerified`
- Use the imported `db` object from '@layers/database/db' for database operations, not 'prisma'
- Server-side translations use a custom implementation since Nuxt's i18n doesn't work well on the server side

### Important Implementation Details

- **Form Validation**:
  - Always use i18n translation keys in validation schemas (e.g., `z.string().min(1, { message: 'auth.profile.validation.name_required' })`)
  - Client and server validation should be consistent using Zod schemas
  - Error messages should be displayed from API responses
- **Password Management**:
  - Current password must be verified before allowing password changes
  - New passwords require minimum 8 characters
  - Passwords are hashed using argon2 with AUTH_SECRET environment variable
- **Translations Structure**:
  - Auth translations follow the pattern `auth.profile.*` for profile-related content
  - Email notifications use the pattern `auth.email.*` for email-related content
  - Each form field should have corresponding validation messages
  - Error states should have clear, translated messages
- **Database Operations**:

  - Always check for existing records before creation (e.g., email uniqueness)
  - Select only necessary fields when returning user data (no password hashes)
  - Use proper error handling with appropriate HTTP status codes

- **Email Verification**:
  - Server-side email templates use a custom translation implementation
  - Verification tokens are stored in the database with expiration dates
  - The profile page shows a warning banner for unverified emails
  - Users can request resending verification emails

### Imports in Layer Files

When working with Nuxt layers, always use relative paths for imports within the same layer:

```ts
// CORRECT: Use relative paths within the same layer
import { getUserFromSession } from "../../utils/auth";
import { verifyPassword } from "../../utils/auth";

// INCORRECT: Don't use ~ alias for imports within the layer
// import { getUserFromSession } from '~/server/utils/auth';
```

This is because the `~` alias resolves to the project root in the final application, but not correctly within the layer's own file structure.

## 📝 Updates

- Enhanced profile update flow to include email confirmation and instant UI updates.
- Switched i18n routing strategy to always prefix locale and added locale-aware redirects in middleware and layout.
