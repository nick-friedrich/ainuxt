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

## Middleware

### auth.ts

Protects routes that require authentication.

- Redirects to login page if user is not authenticated
- Use in page meta: `definePageMeta({ middleware: ['auth'] })`

### guest.ts

Redirects authenticated users away from guest-only pages.

- Redirects to dashboard if user is already authenticated
- Use in page meta: `definePageMeta({ middleware: ['guest'] })`

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

## Translation Structure

Auth translations follow this pattern:

- `auth.profile.*` - Profile-related content
- `auth.profile.validation.*` - Field validation messages
- `page_login.*` - Login page content
- `page_register.*` - Registration page content

## Known Issues and Solutions

1. **Issue**: Using 'prisma' directly causes typescript errors
   **Solution**: Import and use `db` object from '@layers/database/db'

2. **Issue**: Field name mismatches between code and database schema
   **Solution**: Always verify exact field names in the database schema

3. **Issue**: Hardcoded validation messages make internationalization difficult
   **Solution**: Always use i18n translation keys in validation schemas
