# Layout Layer

This document provides guidance on using the `layers/layout` layer for consistent UI layouts, theme management, and UI components in your Nuxt applications.

## Overview

The layout layer provides:

- Common layout components (default layout with header and footer)
- Theme management with light/dark mode support using cookies
- Language switching integration with the i18n layer
- UI utilities and shared components

The layout layer extends both the `styling` and `i18n` layers, providing a complete UI foundation.

## Important Development Note

Since the layout layer extends the i18n layer, you may need to generate the i18n layer's type definitions for proper TypeScript support, especially when using i18n features within layout components.

Run this command from the root of the monorepo:

```bash
# Generate types for the i18n layer first
pnpm layer:dev --filter @layers/i18n

# If needed, you can also run dev mode for the layout layer
pnpm layer:dev --filter @layers/layout
```

This ensures that all necessary type definitions are generated and available in your IDE.

## Usage

### 1. Extend the Layer

In your application's `nuxt.config.ts`, extend the layout layer:

```typescript
// apps/your-app/nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    // other layers
    "../../layers/layout", // Path relative to your nuxt.config.ts
  ],
  // Since layout already extends styling and i18n, you don't need to include those separately
});
```

### 2. Using the Default Layout

The layout is automatically applied to all pages. You don't need to explicitly wrap your pages with it.

```vue
<!-- apps/your-app/pages/index.vue -->
<template>
  <!-- Your content goes here directly -->
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold">Welcome to my app</h1>
    <p>This content is inside the default layout</p>
  </div>
</template>
```

If you want to use a different layout for a specific page, you can override it:

```vue
<script setup>
definePageMeta({
  layout: "custom", // uses layouts/custom.vue if you create it
});
</script>
```

### 3. Theme Management

The layout layer provides a theme management system that uses cookies to persist user preferences. The theme automatically applies to DaisyUI components.

#### Using Theme in Components

```vue
<script setup>
// Import the theme composable
import { useThemeCookie } from "@layers/layout/composables/useThemeCookie";

// Get theme-related properties and functions
const { theme, isDark, toggleTheme } = useThemeCookie();
</script>

<template>
  <div>
    <p>Current theme: {{ theme }}</p>
    <button @click="toggleTheme">Toggle Theme</button>

    <!-- Conditional styles based on theme -->
    <div :class="isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
      This div changes with theme
    </div>
  </div>
</template>
```

#### Using the Theme Switcher Component

```vue
<template>
  <div class="flex justify-end p-4">
    <!-- The ThemeSwitcher component -->
    <ThemeSwitcher />
  </div>
</template>
```

### 4. Language Switching

The layout layer also includes a language switcher component that integrates with the i18n layer.

```vue
<template>
  <div class="flex justify-end p-4">
    <!-- The LanguageSwitcher component -->
    <LanguageSwitcher />
  </div>
</template>
```

## Header & Footer Navigation (2025-04)

- The main header (`AppHeader.vue`) should NOT include a link to `/page` for all users.
- The user dropdown menu now includes a link to `/page` only for admins (role name "ADMIN").
- The footer may include a link to `/page` for general navigation, but this can be toggled as needed.
- All navigation/menu links use i18n keys for labels (see i18n.md).

#### Example (User Dropdown Admin Link)
```vue
<li v-if="isAdmin">
  <NuxtLinkLocale to="/page" @click="closeDropdown">
    {{ $t("layout.navigation.page", "Page") }}
  </NuxtLinkLocale>
</li>
```

## Theme Examples

The layout layer uses DaisyUI themes via the `data-theme` attribute. The default implementation toggles between 'light' and 'dark' themes.

### Light Theme (Default)

The light theme is the default:

- Background: White/light colors
- Text: Dark colors
- Subtle shadows and borders

### Dark Theme

The dark theme flips the color scheme:

- Background: Dark grays/blacks
- Text: Light colors
- More subtle shadows

### Customizing Themes

To customize the available themes, you can:

1. Extend the themes in your app's `tailwind.config.js`:

```javascript
// apps/your-app/tailwind.config.js
module.exports = {
  // ... other config
  daisyui: {
    themes: [
      // Include the themes you want to use
      "light",
      "dark",
      "cupcake",
      "forest",
      // Add a custom theme
      {
        mytheme: {
          primary: "#FF5733",
          secondary: "#3386FF",
          accent: "#C533FF",
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
          "base-content": "#1F2937",
        },
      },
    ],
  },
};
```

2. Modify the `useThemeCookie.ts` composable to support your custom themes:

```typescript
// Create a copy in your app to override the layer version
// apps/your-app/composables/useThemeCookie.ts
export const useThemeCookie = () => {
  // Same as original, but with more theme options
  const toggleTheme = () => {
    // Cycle through themes: light -> dark -> mytheme -> light
    let newTheme = "light";
    if (theme.value === "light") newTheme = "dark";
    else if (theme.value === "dark") newTheme = "mytheme";

    theme.value = newTheme;
    themeCookie.value = newTheme;
  };

  // Rest of the implementation...
};
```

## Components Reference

### Layout-Related Components

- `layouts/default.vue`: The main layout with header and footer
- `components/layout/AppHeader.vue`: Application header (auth-free version)
- `components/layout/AppFooter.vue`: Application footer (if implemented)

### UI Components

- `ThemeSwitcher.vue`: Button to toggle between light and dark mode
- `LanguageSwitcher.vue`: Dropdown to switch between available languages

## Composables

### useThemeCookie

The `useThemeCookie` composable provides theme management functionality:

```typescript
const {
  theme, // Reactive string: 'light' or 'dark'
  isDark, // Computed boolean: true if dark theme
  toggleTheme, // Function: Toggles between light and dark
} = useThemeCookie();
```

## Best Practices

1. **UI Component Organization**:

   - Keep UI components organized in directories by feature/type
   - Prefix component names with their category (e.g., `LayoutAppHeader`, `FormInput`)

2. **Theme-Aware Styling**:

   - Use DaisyUI classes where possible to automatically respect theme changes
   - For custom styles, use the `isDark` computed value from `useThemeCookie`

3. **Layout Consistency**:

   - Maintain consistent spacing, sizing, and UI patterns across the application
   - Use Tailwind's spacing and sizing utilities

4. **Responsive Design**:

   - Ensure all layouts and components work well on mobile and desktop
   - Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)

5. **Form Elements**:
   - For form elements, use the styling layer's form components if available
   - **When using form components from the layout layer, always import as `FormTextField`, `FormTextArea`, `FormButton`, etc.**
   - Ensure all forms provide proper feedback and validation

## Extending the Layout Layer

The layout layer can be extended with additional components and features:

1. Create new layout variants in your application:

   ```
   apps/your-app/layouts/admin.vue
   ```

2. Create specialized components for specific UIs:
   ```
   apps/your-app/components/dashboard/
   ```
