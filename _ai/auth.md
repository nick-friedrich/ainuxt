# Auth Layer Documentation

## Overview

The auth layer provides a complete authentication system for Nuxt applications, including:

- User registration and login
- Session management
- Profile management
- Password updates
- Role-based access control

## Directory Structure

```
layers/auth/
├── components/       # Vue components for auth UI
├── composables/      # Shared functionality (useAuth, etc.)
├── i18n/             # Translations specific to auth
│   └── locales/      # EN and DE translations
├── middleware/       # Auth and guest middleware
├── pages/            # Auth-related pages
│   ├── login.vue
│   ├── register.vue
│   ├── profile.vue
│   └── dashboard.vue
└── server/           # Server-side code
    ├── api/          # API endpoints
    │   └── auth/     # Auth-specific endpoints
    └── utils/        # Auth utilities
```

## API Endpoints

### POST /api/auth/register

Creates a new user account.

- Body: `{ name, email, password }`
- Returns: User object (without sensitive data)

### POST /api/auth/login

Authenticates a user and creates a session.

- Body: `{ email, password }`
- Returns: User object (without sensitive data)

### POST /api/auth/logout

Ends the current user session.

- No body required
- Returns: Success message

### GET /api/auth/user

Returns the currently authenticated user.

- No body required
- Returns: User object with roles (without sensitive data)

### PUT /api/auth/profile

Updates the user's profile information.

- Body: `{ name, email }`
- Returns: Updated user object
- Notes:
  - Changing email requires verification
  - Checks for email uniqueness

### PUT /api/auth/password

Updates the user's password.

- Body: `{ currentPassword, newPassword }`
- Returns: Success message
- Notes:
  - Verifies current password before allowing change
  - Requires minimum password length (8 characters)
  - Sends a confirmation email (using `useMail`) to the user.

### POST /api/auth/password/forgot

Initiates the password reset process by sending an email with a reset link.

- Body: `{ email, locale? }` (locale defaults to 'en')
- Returns: Success message
- Notes:
  - Checks if the email exists in the database.
  - Generates a unique, time-limited reset token.
  - Sends an email (using `useMail`) with a link like `/reset-password?token=...`.
  - Email content is translated based on the provided locale.

### POST /api/auth/password/reset

Resets the user's password using a valid token.

- Body: `{ token, newPassword, confirmPassword, locale? }` (locale defaults to 'en')
- Returns: Success message
- Notes:
  - Verifies the token is valid and not expired.
  - Validates `newPassword` and `confirmPassword` match and meet length requirements.
  - Updates the user's password hash in the database.
  - Invalidates the used token.
  - Sends a confirmation email (using `useMail`) to the user.

### POST /api/auth/otp/request

Initiates the OTP (magic link) login process.

- Body: `{ email, locale? }` (Optional locale to determine email language)
- Returns: `{ message: 'OK' }` (Always returns OK for security reasons)
- Notes:
  - Checks if the email exists in the database.
  - Generates a unique, time-limited OTP token (stored in `otpToken`, `otpTokenExpiresAt` fields).
  - Sends an email (using `sendEmail` from `@layers/mail/mail`) with a link like `/verify-login?token=...`.
  - Link validity is typically short (e.g., 15 minutes).

### GET /api/auth/otp/verify

Verifies an OTP token from a magic link and logs the user in.

- Query Parameters: `?token=<otp_token>`
- Returns: Redirects the user.
- Notes:
  - Finds user by the `otpToken`.
  - Checks if the token is valid and not expired.
  - If valid:
    - Clears the `otpToken` and `otpTokenExpiresAt` fields in the database.
    - Creates a new user session using custom auth utils (`createSession`, `generateSessionToken`).
    - Sets the session cookie (`auth_session_token`).
    - Redirects the user to the application root (`/`).
  - If invalid/expired:
    - Redirects the user to the login page (`/login`) with an `error` query parameter (`otp_invalid` or `otp_expired`).

## Middleware

### auth.ts

Protects routes that require authentication.

- Redirects to login page if user is not authenticated
- Use in page meta: `definePageMeta({ middleware: ['auth'] })`

### guest.ts

Redirects authenticated users away from guest-only pages.

- Redirects to dashboard if user is already authenticated
- Use in page meta: `definePageMeta({ middleware: ['guest'] })`

### Pages

#### `/login`

- **File:** `layers/auth/pages/login.vue`
- **Middleware:** `guest`
- **Purpose:** Allows existing users to log in.

#### `/register`

- **File:** `layers/auth/pages/register.vue`
- **Middleware:** `guest`
- **Purpose:** Allows new users to create an account.

#### `/profile`

- **File:** `layers/auth/pages/profile.vue`
- **Middleware:** `auth`
- **Purpose:** Allows authenticated users to view and update their profile information (name, email) and change their password.
- **Note:** Uses `onServerPrefetch(fetchUser)` in `profile.vue` to fetch user data during SSR and prevent hydration mismatches.

#### `/forgot-password`

- **File:** `layers/auth/pages/forgot-password.vue`
- **Middleware:** `guest`
- **Purpose:** Allows users to request a password reset email.
- **Process:**
  - User enters their email address.
  - Form submits to `POST /api/auth/password/forgot`.
  - On success, a message indicates that an email has been sent (if the email exists).
  - Includes a link back to the login page.

#### `/reset-password`

- **File:** `layers/auth/pages/reset-password.vue`
- **Middleware:** `guest`
- **Purpose:** Allows users to set a new password using a token received via email.
- **Process:**
  - Page expects a `token` query parameter (`/reset-password?token=...`).
  - User enters and confirms their new password.
  - Form submits to `POST /api/auth/password/reset` with the token and new password.
  - On success, a message confirms the password change, and the user is redirected to the login page after a short delay.
  - Displays errors if the token is invalid/expired or passwords don't match/meet requirements.

#### `/login-email`

- **File:** `layers/auth/pages/login-email.vue`
- **Middleware:** `guest`
- **Purpose:** Allows users to request an OTP (magic link) login email.
- **Process:**
  - User enters their email address.
  - Form submits to `POST /api/auth/otp/request`.
  - On success, a message indicates that an email has been sent (if the email exists).
  - Includes a link back to the standard login page.

#### `/dashboard`

- **File:** `layers/auth/pages/dashboard.vue`
- **Middleware:** `auth`
- **Purpose:** A protected placeholder page accessible only to authenticated users. Displays user information and roles.
- **Note:** Uses `onServerPrefetch(fetchUser)` in `dashboard.vue` to pre-fetch user data server-side and keep SSR in sync with client, avoiding hydration warnings.

## Composables

### useAuth()

Provides reactive auth state and helper methods.

- Properties:
  - `user: Ref<User | null>` - Current user or null
  - `isLoggedIn: ComputedRef<boolean>` - Whether user is authenticated
  - `loading: Ref<boolean>` - Auth state loading status
- Methods:
  - `login(email, password)` - Log in user
  - `register(name, email, password)` - Register new user
  - `logout()` - Log out current user
  - `fetchUser()` - Refresh user data from server

## Common Implementation Patterns

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

### Form Validation

Both client and server validation use Zod schemas:

```ts
// Client-side validation
const profileSchema = z.object({
  name: z.string().min(1, { message: "auth.profile.validation.name_required" }),
  email: z.string().email({ message: "auth.profile.validation.email_invalid" }),
});

// Server-side validation (same approach)
const profileSchema = z.object({
  name: z.string().min(1, { message: "auth.profile.validation.name_required" }),
  email: z.string().email({ message: "auth.profile.validation.email_invalid" }),
});
```

### Error Handling

API endpoints use consistent error handling:

```ts
try {
  // Main logic
} catch (error: any) {
  if (error.name === "ZodError") {
    throw createError({
      statusCode: 400,
      message: "auth.profile.validation_error",
      data: error.errors,
    });
  }

  if (error.statusCode) {
    throw error;
  }

  console.error("Error:", error);
  throw createError({
    statusCode: 500,
    message: "auth.profile.server_error",
  });
}
```

### User Data Access

Always select only necessary fields when returning user data:

```ts
const user = await db.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    email: true,
    emailVerifiedAt: true,
    // NO password or security fields
  },
});
```

### Server-Side Translations Workaround

The built-in Nuxt i18n functions don't work well in server-side API routes. For email templates, we implemented a custom translation solution:

```ts
// Import translations directly
import * as en from "../../../i18n/locales/en.json";
import * as de from "../../../i18n/locales/de.json";

const translations = {
  en: en,
  de: de,
} as const;

// Helper to access nested properties by dot notation
function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  return (
    keys.reduce(
      (o, key) => (o && o[key] !== undefined ? o[key] : undefined),
      obj
    ) || path
  );
}

// Custom t function for server-side
function t(
  key: string,
  params: Record<string, string | number> = {},
  locale = "en"
) {
  let translation =
    getNestedValue(translations[locale as keyof typeof translations], key) ||
    getNestedValue(translations.en, key) ||
    key;

  Object.keys(params).forEach((param) => {
    translation = translation.replace(
      new RegExp(`{${param}}`, "g"),
      String(params[param])
    );
  });
  return translation;
}
```

Usage in API routes:

```ts
// Get locale from request body if needed
const body = await readBody(event);
const locale = body.locale || "en";

// Send email with translated content
await sendEmail({
  to: user.email,
  subject: t("auth.email.verify_subject", {}, locale),
  html: `
  <p>${t("auth.email.verify_body", {}, locale)}</p>
  <p>
  <a href="${config.public.applicationUrl}/verify-email?token=${token}">
  ${t("auth.email.verify_link", {}, locale)}
  </a>
  </p>
  `,
});
```

### Email Verification UI

The profile page displays a warning banner when the user's email is not verified:

```vue
<!-- Email verification banner -->
<div
  v-if="user && user.email && !user.emailVerifiedAt"
  class="alert alert-warning alert-soft mb-6"
>
  <div class="flex flex-row justify-between w-full items-center">
    <span>{{ $t("auth.profile.email_not_verified") }}</span>
    <button
      @click="resendVerificationEmail"
      class="btn btn-sm btn-warning btn-outline ml-2"
      :disabled="verificationEmailSent"
    >
      {{ $t("auth.profile.resend_verification") }}
    </button>
  </div>
</div>
```

With the supporting function:

```ts
const verificationEmailSent = ref(false);

const resendVerificationEmail = async () => {
  try {
    await $fetch("/api/auth/send-verification-mail", {
      method: "POST",
    });
    successMessage.value = t("auth.profile.verification_email_sent");
    verificationEmailSent.value = true;
  } catch (error: any) {
    serverError.value = error.data?.message
      ? t(error.data.message)
      : t("auth.profile.verification_email_error");
  }
};
```

### SSR Hydration

- To avoid hydration mismatches on pages that depend on async data (like user state), use Vue's `onServerPrefetch(fetchUser)` within `<script setup>` alongside the `useAuth()` composable. This fetches required data during server-side rendering before client hydration.

## Translation Structure

Auth translations follow this pattern:

- `auth.profile.*` - Profile-related content
- `auth.profile.validation.*` - Field validation messages
- `page_login.*` - Login page content
- `page_register.*` - Registration page content
- `page_login_email.*` - OTP Email request page content
- `auth.otp.*` - OTP email content and error messages

## Known Issues and Solutions

1. **Issue**: Using 'prisma' directly causes typescript errors
   **Solution**: Import and use `db` object from '@layers/database/db'

2. **Issue**: Field name mismatches between code and database schema
   **Solution**: Always verify exact field names in the database schema

3. **Issue**: Hardcoded validation messages make internationalization difficult
   **Solution**: Always use i18n translation keys in validation schemas

4. **Issue**: Import paths using `~` alias don't work correctly in layer files
   **Solution**: Use relative paths for imports within the same layer
