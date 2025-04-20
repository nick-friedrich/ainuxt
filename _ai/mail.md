# Mail Layer

This document provides guidance on using the `layers/mail` layer for sending emails in your Nuxt applications.

## Overview

The mail layer provides a simple, flexible email sending infrastructure with:

- Adapter-based architecture supporting different email providers
- Environment-based switching between production and development modes
- Type-safe interfaces for email operations
- Centralized configuration through runtime config

## Configuration

### 1. Environment Variables

The mail layer uses the following environment variables:

```dotenv
# Required for production (Resend API)
RESEND_API_KEY=your_resend_api_key_here

# Default sender info (optional, defaults provided)
MAIL_FROM_EMAIL=noreply@example.com
MAIL_FROM_NAME=Example
```

### 2. Extending the Layer

In your application's `nuxt.config.ts`, extend the mail layer:

```typescript
// apps/your-app/nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    // other layers
    "../../layers/mail",
  ],

  // Optional: Override default config
  runtimeConfig: {
    // Server-side secrets
    resendApiKey: process.env.RESEND_API_KEY,

    // Public keys (exposed client-side)
    public: {
      mailFromEmail: process.env.MAIL_FROM_EMAIL || "custom@example.com",
      mailFromName: process.env.MAIL_FROM_NAME || "Custom Name",
    },
  },
});
```

### 3. Add the Layer Dependency

In your application's `package.json`, add the mail layer as a dependency:

```json
"dependencies": {
  "@layers/mail": "workspace:*"
}
```

## Usage

### Basic Email Sending

```typescript
// server/api/contact.post.ts
import { sendEmail } from "@layers/mail/mail";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const result = await sendEmail({
      to: "recipient@example.com",
      subject: "Contact Form Submission",
      html: `<h1>New Contact Message</h1>
             <p><strong>From:</strong> ${body.name}</p>
             <p><strong>Email:</strong> ${body.email}</p>
             <p><strong>Message:</strong></p>
             <p>${body.message}</p>`,
      text: `New Contact Message\n\nFrom: ${body.name}\nEmail: ${body.email}\nMessage: ${body.message}`,
    });

    if (result.success) {
      return { success: true, messageId: result.messageId };
    } else {
      throw createError({
        statusCode: 500,
        message: "Failed to send email",
      });
    }
  } catch (error) {
    console.error("Email error:", error);
    throw createError({
      statusCode: 500,
      message: "An error occurred while sending the email",
    });
  }
});
```

### Environment Switching

The mail layer automatically uses:

- **Production (NODE_ENV=production)**: Uses Resend API if RESEND_API_KEY is provided
- **Development/Other**: Uses Console adapter (logs email content to console)

This allows you to develop and test without sending actual emails.

## Email Adapters

### 1. Resend Adapter (Production)

Used when `RESEND_API_KEY` is provided and `NODE_ENV` is `production`.

- Sends real emails through the [Resend](https://resend.com) API
- Requires an API key from Resend
- Provides delivery statistics and tracking

### 2. Console Adapter (Development)

Used when `RESEND_API_KEY` is not provided or `NODE_ENV` is not `production`.

- Logs email content to the console
- Useful for development and testing
- No actual emails are sent

## Adding New Adapters

You can add support for additional email providers by:

1. Creating a new adapter class that implements the `EmailAdapter` interface:

```typescript
// server/utils/email/NewAdapter.ts
import type { EmailAdapter, SendEmailOptions } from "./types";

export class NewAdapter implements EmailAdapter {
  async send(
    options: SendEmailOptions
  ): Promise<{ success: boolean; messageId?: string; error?: unknown }> {
    // Implementation for your email provider
    // ...
  }
}
```

2. Modify the `getEmailAdapter()` function in `index.ts` to use your new adapter:

```typescript
function getEmailAdapter(): EmailAdapter {
  if (!emailAdapter) {
    const config = useRuntimeConfig();

    if (process.env.USE_NEW_PROVIDER === "true") {
      emailAdapter = new NewAdapter(/* config */);
    } else if (config.resendApiKey && process.env.NODE_ENV === "production") {
      emailAdapter = new ResendAdapter(/* config */);
    } else {
      emailAdapter = new ConsoleAdapter();
    }
  }
  return emailAdapter;
}
```

## Future Enhancements

Planned features for the mail layer include:

- Email templates for common scenarios (welcome, password reset, etc.)
- Email queue for reliable delivery and retries
- Advanced logging and error handling
- Integration with authentication for user-specific emails
