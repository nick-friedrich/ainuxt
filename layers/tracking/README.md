# Tracking Layer

// AI Generation Reference: See /ai/README.md for guidelines and patterns.

This Nuxt layer provides tracking and cookie consent functionality for your applications.

## Features
- Cookie consent banner (`CookieBanner.vue`) with Accept/Decline actions
- Test logs to verify consent state in the console
- Designed for future extensibility (add analytics, tracking, etc.)

## Usage
1. Add the `tracking` layer to your Nuxt app's `extends` array in `nuxt.config.ts`:
   ```ts
   extends: [
     // ...
     '../../layers/tracking',
   ]
   ```
2. Use the `<CookieBanner />` component in your main layout (e.g., `DefaultLayout.vue` or `App.vue`):
   ```vue
   <template>
     <AppHeader />
     <NuxtPage />
     <CookieBanner />
     <AppFooter />
   </template>
   ```
3. Check the browser console for test logs when accepting or declining cookies.

## Extending
- Add tracking/analytics scripts based on user consent in the future.
- Update this layer to manage additional privacy features as needed.
