# Contact Layer

This document provides guidance on using the `layers/contact` layer for adding contact form functionality to your Nuxt applications.

## Overview

The contact layer provides a complete solution for implementing contact forms with:

- Pre-built contact form UI with responsive design
- Form validation using Zod schema
- Internationalization support with translated messages
- Email submission via the mail layer
- Server-side validation and error handling

## Configuration

### 1. Extending the Layer

In your application's `nuxt.config.ts`, extend the contact layer:

```typescript
// apps/your-app/nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    // other layers
    "../../layers/contact",
  ],
});
```

### 2. Adding Dependencies

In your application's `package.json`, add the contact layer as a dependency:

```json
"dependencies": {
  "@layers/contact": "workspace:*"
}
```

The contact layer itself depends on:

- `@layers/mail`: For sending emails
- `zod`: For schema validation

## Usage

### 1. Accessing the Contact Page

The contact layer automatically adds a `/contact` route to your application with a fully functional contact form. The route uses the layout layer's components and styling.

### 2. Customizing the Destination Email

By default, contact form submissions are sent to `your-support-email@example.com`. To change this, you need to modify the `server/api/contact.post.ts` file in the contact layer:

```typescript
// Change this line in the sendEmail call
to: 'your-actual-email@example.com', // Replace with your actual email
```

### 3. Customizing the Form

The form uses components from the layout layer (`FormTextField`, `FormTextArea`, `FormButton`). If you need to customize the form's appearance or behavior, you can:

1. Create your own contact page in your app that imports components from the contact layer
2. Override the contact page by creating `pages/contact.vue` in your app

## Form Validation

The contact form uses Zod for validation with the following rules:

- **Name**: Required field
- **Email**: Must be a valid email address
- **Message**: Minimum 10 characters

All validation messages are available in both English and German through the i18n layer.

## Components Structure

```
layers/contact/
├── i18n/                  # Localization files
│   └── locales/
│       ├── en.json        # English translations
│       └── de.json        # German translations
├── pages/
│   └── contact.vue        # Contact page with form
├── server/
│   ├── api/
│   │   └── contact.post.ts  # API endpoint for form submission
│   └── utils/
│       └── contact.schema.ts  # Zod validation schema
```

## Translations

The contact layer includes translations for:

- Form labels and placeholders
- Validation error messages
- Success and error states
- Submit button text

Example from the English locale file:

```json
{
  "page_contact": {
    "contact": {
      "title": "Contact Page",
      "form": {
        "title": "Send us a message",
        "name": {
          "label": "Name",
          "placeholder": "Your Name"
        },
        // ...
        "submit": "Send Message",
        "success": "Message sent successfully! We'll get back to you soon.",
        "error": "Failed to send message. Please try again later."
      }
    }
  }
}
```

## API Endpoint

The contact form submits to `/api/contact` which:

1. Validates the incoming data using the Zod schema
2. Creates an HTML and plain text version of the email
3. Sends the email using the mail layer's `sendEmail` function
4. Returns success or error response

## Integration with Mail Layer

The contact layer integrates with the mail layer for sending emails. It uses the mail layer's adapter-based architecture, which means:

- In development: Emails are logged to the console
- In production: Emails are sent using the configured provider (e.g., Resend API)

## Customizing Email Templates

To customize the email template, modify the HTML content in `server/api/contact.post.ts`:

```typescript
const htmlContent = `
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Message:</strong></p>
  <p>${message.replace(/\n/g, "<br>")}</p>
  <!-- Add your custom content here -->
`;
```

## Future Enhancements

Planned features for the contact layer include:

- Additional form field types (phone, subject, etc.)
- File attachment support
- Admin notification options
- Custom templates selection
- Form analytics tracking
