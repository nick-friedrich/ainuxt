# New Layer Creation Prompt

When requested to create a new Nuxt layer (e.g., using `@layer create <layer-name>` or similar trigger):

1.  **Get Layer Name:** Confirm the desired `<layer-name>` with the user.

2.  **Create Directory:** Create the directory `layers/<layer-name>`.

3.  **Create `package.json`:** Create `layers/<layer-name>/package.json` with:

    ```json
    {
      "name": "@layers/<layer-name>",
      "version": "0.0.1",
      "private": true,
      "type": "module",
      "aiReference": "See ~/_ai/README.md for guidelines and patterns",
      "main": "./nuxt.config.ts",
      "scripts": {
        "layer:dev": "nuxt dev"
      },
      "dependencies": {
        "@nuxtjs/i18n": "^9.5.3",
        "nuxt": "^3.16.2",
        "vue": "^3.5.13",
        "vue-router": "^4.5.0"
      }
    }
    ```

3a. **Create `tsconfig.json`:** Create `layers/<layer-name>/tsconfig.json`:

    ```json
    {
      "extends": "../../tsconfig.json",
      "include": ["./**/*"],
      "exclude": ["node_modules", ".output", ".nuxt"]
    }
    ```

3b. **Create i18n translation files:** Create `layers/<layer-name>/i18n/locales/en.json` and `layers/<layer-name>/i18n/locales/de.json` containing your layer’s localization messages. For example:

    ```json
    {
      "cookieConsent": {
        "message": "This site uses cookies for analytics and improved experience. Do you accept?",
        "accept": "Accept",
        "decline": "Decline"
      }
    }
    ```

4.  **Add Additional Dependencies (if needed):** If the layer requires additional dependencies beyond the standard ones, tell the user to run:

    - Add layer-specific dependencies: `pnpm add -F @layers/<layer-name> <list-of-other-dependencies>`. Specify `-D` for dev dependencies.
    - **Note for Tailwind v4 Styling Layer:** Dependencies (`tailwindcss`, `daisyui`, etc.) should be added to the _application_ package, not the layer.

5.  **Create `nuxt.config.ts`:** Create `layers/<layer-name>/nuxt.config.ts` (from `__examples/minimal_nuxt_layer_example`):

    ```typescript
    // AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
    import { defineNuxtConfig } from 'nuxt/config';
    export default defineNuxtConfig({
      extends: ['../base', '../i18n', '../layout'],
      components: [
        { path: fileURLToPath(new URL('./components', import.meta.url)), pathPrefix: false }
      ],
      // If providing translations, add:
      i18n: {
        locales: [
          { code: 'en', file: 'en.json' },
          { code: 'de', file: 'de.json' }
        ]
      }
    });
    ```

    - **For Tailwind v4 Styling Layer:** This file likely remains empty or minimal. CSS registration and Vite plugin configuration should happen in the _application's_ `nuxt.config.ts`.

6.  **Create Layer-Specific Config Files:** Create necessary config files (e.g., `tailwind.config.js`, `.env.example`) within the layer if needed:

    - **For Tailwind v4 Styling Layer:** Create `tailwind.config.js` to hold the base configuration (theme, daisyui settings). The `content` and `plugins` arrays should generally be empty or minimal, as these are handled by the application's config. Do **not** create `assets/css/tailwind.css` here; it belongs in the application.

    **Important:** Add the standard header comment (using appropriate syntax) to the top of any created config files.

7.  **Create Basic Structure (Optional):** Create common subdirectories like `components/`, `server/utils/`, `public/` within `layers/<layer-name>/` if appropriate for the layer's purpose.

    **Important:** Add the standard header comment (using appropriate syntax) to the top of any files created within these structures.

8.  **Verify Workspace Config:** Check `pnpm-workspace.yaml` and ensure `layers/*` is included in the `packages` list. If not, add it.

9.  **Instruct User:**

    - Tell the user the layer structure is created.
    - Remind to run `pnpm install` at the monorepo root.
    - Then run `pnpm -F @layers/<layer-name> layer:dev` to generate the `.nuxt` folder and types.
    - **Ignore linter/TS errors until dependencies are installed and `layer:dev` completes.**
    - Instruct the user to add the relative path to the new layer (e.g., `'../../layers/<layer-name>'`) to the `extends` array in the `nuxt.config.ts` of any application(s) that should use this layer.
    - **For Tailwind v4 Styling Layer:** Instruct the user to:
      1.  Install dependencies in the app: `pnpm add -F <app-name> tailwindcss@next @tailwindcss/vite daisyui -D`
      2.  Create `assets/css/tailwind.css` in the app with `@import "tailwindcss"; @import "daisyui";`.
      3.  Register the CSS file in the app's `nuxt.config.ts` (`css: ['~/assets/css/tailwind.css']`).
      4.  Configure the `@tailwindcss/vite` plugin in the app's `nuxt.config.ts` (`vite: { plugins: [tailwindcss()] }`).
      5.  Create/Update the app's `tailwind.config.js` to include `content` paths. It will automatically extend the layer's config.

10. **Update `_ai/readme.md`:** Add the new layer under `### \`layers/\``.

11. **Update `_ai/todolist.md`:** Add a task for implementing the new layer functionality.
