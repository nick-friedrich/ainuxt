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
    - **Example for Tailwind v4 Styling Layer:** `pnpm add -F @layers/styling tailwindcss@next @tailwindcss/vite daisyui -D`

5.  **Create `nuxt.config.ts`:** Create `layers/<layer-name>/nuxt.config.ts`. Use `__examples/minimal_nuxt_layer_example/nuxt.config.ts` as a template, or create a minimal one:

    ```typescript
    import { defineNuxtConfig } from "nuxt/config";

    export default defineNuxtConfig({});
    ```

    - **For Tailwind v4:** Register a global CSS file (e.g., `css: ['~/assets/css/tailwind.css']`). Add the vite plugin:

    ```typescript
    import { defineNuxtConfig } from "nuxt/config";
    import tailwindcss from "tailwindcss"; // Or potentially from '@tailwindcss/vite' depending on export

    export default defineNuxtConfig({
      css: ["~/assets/css/tailwind.css"],
      vite: {
        plugins: [
          tailwindcss(), // Check correct import/invocation
        ],
      },
    });
    ```

6.  **Create Layer-Specific Config Files:** Create necessary config files (e.g., `tailwind.config.js`, `.env.example`) within the layer if needed:

    - **For Tailwind v4:** Create `tailwind.config.js` (plugins array should be empty). Create the global CSS file (e.g., `assets/css/tailwind.css`) and add `@import "tailwindcss";` and any plugin imports like `@import "daisyui";`.

7.  **Create Basic Structure (Optional):** Create common subdirectories like `components/`, `server/utils/`, `public/` within `layers/<layer-name>/` if appropriate for the layer's purpose.

8.  **Verify Workspace Config:** Check `pnpm-workspace.yaml` and ensure `layers/*` is included in the `packages` list. If not, add it.

9.  **Instruct User:**

    - Tell the user the layer structure has been created.
    - Remind the user to run `pnpm install` from the workspace root (especially if they just added dependencies via `pnpm add`).
    - Instruct the user to add the relative path to the new layer (e.g., `'../../layers/<layer-name>'`) to the `extends` array in the `nuxt.config.ts` of any application(s) that should use this layer.
    - **For Tailwind v4:** Remind the user to configure the `content` paths in the _application's_ `tailwind.config.js` (or create one) to include the app's files.

10. **Update `_ai/readme.md`:** Add the newly created layer to the list under the `### \`layers/\`` section.

11. **Update `_ai/todolist.md`:** Add a task to implement the intended functionality of the new layer if specified by the user.
