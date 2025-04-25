# Tracking Layer Documentation

## Overview

The `tracking` layer provides privacy-friendly tracking, analytics, and cookie consent management for the application. It is designed to be modular, easily extended, and compliant with privacy regulations (e.g., GDPR).

## Directory Structure

```
layers/tracking/
├── components/           # Vue components for cookie banners and tracking scripts
│   ├── CookieBanner.vue
│   ├── CookieControl.vue
│   └── TrackingScripts.vue
├── composables/          # Composables for consent state and tracking logic
│   └── useCookieConsent.ts
├── i18n/
│   └── locales/          # EN and DE translation files for tracking UI
│       ├── en.json
│       └── de.json
├── nuxt.config.ts        # Layer config (registers components, composables, etc.)
├── package.json
├── tsconfig.json
└── README.md             # Layer-specific readme
```

## Key Components

### CookieBanner.vue
- Displays a banner to inform users about cookie usage and request consent.
- Supports accepting/rejecting optional cookies.
- Text is fully translatable via i18n.

### CookieControl.vue
- UI for users to change their cookie consent preferences at any time.
- Can be placed in the footer or settings page.

### TrackingScripts.vue
- Conditionally injects analytics/tracking scripts (e.g., Plausible, Google Analytics) based on user consent.
- Ensures scripts are only loaded after consent is given.

## Composables

### useCookieConsent.ts
- Provides reactive state and methods for reading/updating cookie consent.
- Persists consent state in a cookie.
- Example usage:
  ```ts
  const { consent, acceptAll, rejectAll, setConsent } = useCookieConsent();
  ```

## i18n
- All user-facing text in banners and controls is translatable.
- Translation files: `i18n/locales/en.json`, `i18n/locales/de.json`.

## Nuxt Integration
- Register the tracking layer in your Nuxt app's `nuxt.config.ts` via `extends`.
- Use `<TrackingScripts />` in your main layout to handle analytics loading.
- Place `<CookieBanner />` at the root of your app (e.g., in `App.vue` or main layout).
- Add `<CookieControl />` to allow users to change consent later (e.g., in the footer).

## Best Practices
- Never load analytics or tracking scripts until the user has explicitly consented.
- Store only minimal, non-personal data unless consent is given.
- Make it easy for users to change their consent at any time.
- Keep all consent-related UI fully translatable.

## Example Usage
```vue
<template>
  <TrackingScripts />
  <CookieBanner />
  <CookieControl />
</template>
```

## Known Issues & Future Improvements
- Add support for additional analytics providers as needed.
- Consider supporting server-side event proxying for improved privacy.
- Improve accessibility of consent banners and controls.

---
_Last updated: 2025-04-25_
