# Tailwind CSS v4 Setup (Current Workaround)

Due to the current state of Tailwind v4 integration with Nuxt layers, the following app-level setup is required:

**1. `layers/styling`:**

- This layer primarily provides a shared base `tailwind.config.js` (e.g., for base theme settings, daisyui themes).
- It does **not** handle CSS imports or dependency installation for the apps.

**2. Application Setup (e.g., `apps/my-app`):**

- **Dependencies:** Install necessary dev dependencies directly in the app:
  ```bash
  # From workspace root
  pnpm add -F <app-name> tailwindcss@next @tailwindcss/vite daisyui -D
  ```
- **Extend Layer:** Add `layers/styling` to the `extends` array in the app's `nuxt.config.ts`.
- **Create CSS Entrypoint:** Create `assets/css/tailwind.css` within the app.

  ```css
  @import "tailwindcss";
  @import "daisyui";

  /* App-specific base styles can go here */
  ```

- **Configure `nuxt.config.ts`:**
  - Register the CSS file: `css: ['~/assets/css/tailwind.css']`
  - Configure the Vite plugin:
    ```typescript
    import tailwindcss from "tailwindcss"; // Or '@tailwindcss/vite'? Check import
    // ...
    vite: {
      plugins: [tailwindcss()];
    }
    ```
- **Configure `tailwind.config.js`:**
  - Create/update `tailwind.config.js` in the app.
  - **Crucially:** Define the `content` array here to scan the app's files (components, pages, etc.).
  - This config automatically merges with and extends the config from `layers/styling`.

**Reasoning:** This approach ensures Tailwind scans the correct application files for class generation and that dependencies are correctly resolved during the app's build process. The layer still offers value by centralizing the base theme/plugin configuration.

```ts
css: [
    '~/assets/css/tailwind.css', // Path relative to this nuxt.config.ts
  ],
```
