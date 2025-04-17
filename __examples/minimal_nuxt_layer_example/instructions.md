# Creating a New Nuxt Layer (Manual Steps)

This document outlines the steps to manually create a new Nuxt layer within this monorepo, using the files in this example directory (`__examples/minimal_nuxt_layer_example/`) as a template.

1.  **Create Layer Directory:**
    Create a new folder for your layer inside the main `layers/` directory:

    ```bash
    mkdir layers/<new-layer-name>
    ```

2.  **Create `package.json`:**
    Copy the `package.json` from this example directory to `layers/<new-layer-name>/package.json`.

    - **Modify `name`:** Change the `name` field to something descriptive, following the convention `@layers/<new-layer-name>`.
    - **Review Dependencies:** The example includes the core dependencies required for a Nuxt layer (`nuxt`, `vue`, `vue-router`). Add any additional layer-specific dependencies if needed. For internal packages (like `@db/psql`), use the `workspace:*` protocol (e.g., `"@db/psql": "workspace:*"`).
    - **Keep:** `private: true`, `type: "module"`, `main: "./nuxt.config.ts"`, and the `aiReference` field.

3.  **Create `nuxt.config.ts`:**
    Copy the `nuxt.config.ts` from this example directory to `layers/<new-layer-name>/nuxt.config.ts`. This provides a minimal starting point. You can add layer-specific configurations here later.

4.  **Verify Workspace Configuration:**
    Ensure the `pnpm-workspace.yaml` file at the root of the monorepo includes `layers/*` in its `packages` list:

    ```yaml
    packages:
      - "apps/*"
      - "packages/*"
      - "layers/*" # Make sure this line exists
    ```

5.  **Install Dependencies:**
    Run `pnpm install` from the root directory of the monorepo. This will link the new layer and install its dependencies.

    ```bash
    pnpm install
    ```

6.  **Extend Layer in App(s):**
    To use the new layer in an application (e.g., `apps/my-app`), edit that application's `nuxt.config.ts` file (`apps/my-app/nuxt.config.ts`). Add the relative path to your new layer to the `extends` array:

    ```typescript
    export default defineNuxtConfig({
      // ... other configs
      extends: [
        "../../layers/database", // Example: existing layer
        "../../layers/<new-layer-name>", // Add your new layer here
      ],
      // ... other configs
    });
    ```

7.  **Add Layer Content:**
    Start adding components, composables, server routes, utilities, etc., within the `layers/<new-layer-name>/` directory as needed.

8.  **Add Header Comment:**
    Remember to add the standard AI reference comment to the top of all newly created source files (`.ts`, `.vue`, `.css`, `.md`, etc.), adjusting the syntax (`//`, `<!--`, `#`) based on the file type:
    ```
    // AI Generation Reference: See ~/_ai/README.md for guidelines and patterns.
    ```
