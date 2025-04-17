# New Layer Creation Prompt

When requested to create a new Nuxt layer (e.g., using `@layer create <layer-name>` or similar trigger):

1.  **Get Layer Name:** Confirm the desired `<layer-name>` with the user.

2.  **Create Directory:** Create the directory `layers/<layer-name>`.

3.  **Create `package.json`:** Create a minimal `layers/<layer-name>/package.json`. Use `__examples/minimal_nuxt_layer_example/package.json` as a template but **do not include dependencies manually**. Update the `name` field to `@layers/<layer-name>` (following project convention).

    ```json
    {\n  \"name\": \"@layers/<layer-name>\",\n  \"version\": \"0.0.1\",\n  \"private\": true,\n  \"type\": \"module\",\n  \"main\": \"./nuxt.config.ts\"\n}
    ```

4.  **Instruct User to Add Dependencies:** Tell the user to run the following from the workspace root:

    - Add base dev dependencies: `pnpm add -F @layers/<layer-name> nuxt vue vue-router -D`
    - Add any other layer-specific dependencies: `pnpm add -F @layers/<layer-name> <list-of-other-dependencies>`. Specify `-D` for dev dependencies.
    - **Note for Tailwind v4 Styling Layer:** Dependencies (`tailwindcss`, `daisyui`, etc.) should be added to the _application_ package, not the layer.

5.  **Create `nuxt.config.ts`:** Create `layers/<layer-name>/nuxt.config.ts`. Use `__examples/minimal_nuxt_layer_example/nuxt.config.ts` as a template, or create a minimal one:

    ```typescript
    import { defineNuxtConfig } from "nuxt/config";

    export default defineNuxtConfig({});
    ```

    - **For Tailwind v4 Styling Layer:** This file likely remains empty or minimal. CSS registration and Vite plugin configuration should happen in the _application's_ `nuxt.config.ts`.

6.  **Create Layer-Specific Config Files:** Create necessary config files (e.g., `tailwind.config.js`, `.env.example`) within the layer if needed:

    - **For Tailwind v4 Styling Layer:** Create `tailwind.config.js` to hold the base configuration (theme, daisyui settings). The `content` and `plugins` arrays should generally be empty or minimal, as these are handled by the application's config. Do **not** create `assets/css/tailwind.css` here; it belongs in the application.

7.  **Create Basic Structure (Optional):** Create common subdirectories like `components/`, `server/utils/`, `public/` within `layers/<layer-name>/` if appropriate for the layer's purpose.

8.  **Verify Workspace Config:** Check `pnpm-workspace.yaml` and ensure `layers/*` is included in the `packages` list. If not, add it.

9.  **Instruct User:**

    - Tell the user the layer structure has been created.
    - Remind the user to run `pnpm install` from the workspace root (especially if they just added dependencies via `pnpm add`).
    - Instruct the user to add the relative path to the new layer (e.g., `'../../layers/<layer-name>'`) to the `extends` array in the `nuxt.config.ts` of any application(s) that should use this layer.
    - **For Tailwind v4 Styling Layer:** Instruct the user to:
      1.  Install dependencies in the app: `pnpm add -F <app-name> tailwindcss@next @tailwindcss/vite daisyui -D`
      2.  Create `assets/css/tailwind.css` in the app with `@import "tailwindcss"; @import "daisyui";`.
      3.  Register the CSS file in the app's `nuxt.config.ts` (`css: ['~/assets/css/tailwind.css']`).
      4.  Configure the `@tailwindcss/vite` plugin in the app's `nuxt.config.ts` (`vite: { plugins: [tailwindcss()] }`).
      5.  Create/Update the app's `tailwind.config.js` to include `content` paths. It will automatically extend the layer's config.

10. **Update `_ai/readme.md`:** Add the newly created layer to the list under the `### \`layers/\`` section.

11. **Update `_ai/todolist.md`:** Add a task to implement the intended functionality of the new layer if specified by the user.
