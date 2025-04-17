# New Layer Creation Prompt

When requested to create a new Nuxt layer (e.g., using ``@layer create <layer-name>`` or similar trigger):

1.  **Get Layer Name:** Confirm the desired `<layer-name>` with the user.


2.  **Create Directory:** Create the directory `layers/<layer-name>`.


3.  **Create `package.json`:** Create `layers/<layer-name>/package.json`. Use `__examples/minimal_nuxt_layer_example/package.json` as a template. Update the `name` field to `@ainuxt/layer-<layer-name>` (or similar convention). Add any necessary initial dependencies, using `workspace:*` for internal packages.


4.  **Create `nuxt.config.ts`:** Create `layers/<layer-name>/nuxt.config.ts`. Use `__examples/minimal_nuxt_layer_example/nuxt.config.ts` as a template, or create a minimal one:
    ```typescript
    import { defineNuxtConfig } from 'nuxt/config'

    export default defineNuxtConfig({})
    ```


5.  **Create Basic Structure (Optional):** Create common subdirectories like `components/`, `server/utils/`, `public/` within `layers/<layer-name>/` if appropriate for the layer's purpose.


6.  **Verify Workspace Config:** Check `pnpm-workspace.yaml` and ensure `layers/*` is included in the `packages` list. If not, add it.


7.  **Instruct User:**
    *   Tell the user the layer structure has been created.
    *   Remind the user to run `pnpm install` from the workspace root.
    *   Instruct the user to add the relative path to the new layer (e.g., `'../../layers/<layer-name>'`) to the `extends` array in the `nuxt.config.ts` of any application(s) that should use this layer.


8.  **Update `_ai/readme.md`:** Add the newly created layer to the list under the `### ``layers/`` section.


9.  **Update `_ai/todolist.md`:** Add a task to implement the intended functionality of the new layer if specified by the user.
