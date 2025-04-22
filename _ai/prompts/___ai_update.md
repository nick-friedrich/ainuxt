# AI Folder Update Prompt

When requested to update the `_ai` folder (e.g., using `@_ai update` or similar trigger):

1.  **Review Recent Changes:** Examine the latest user messages, code changes, file attachments, and conversation history to understand what progress has been made or what new information needs to be documented (e.g., commits "Enhance profile update functionality with locale support" and "Update Nuxt configuration and layout for improved localization").
2.  **Update Documentation Files in `_ai` Root (excluding `prompts/`):**
    - Files: `readme.md`, `todolist.md`, `i18n.md`, `auth.md`, `contact.md`, `mail.md`, `future_ideas.md`, `layout.md`, `daisyui.md`, `tailwind.md`.
    - Reflect any relevant changes: new features, updates, conventions, scripts, troubleshooting tips.
    - Ensure clarity, accuracy, and consistency across all `_ai` documentation.
3.  **Do Not Modify Prompt Files:**
    - Files under `_ai/prompts/` (e.g., `___ai_update.md`, `___new_layer.md`) are predefined prompts and must remain unchanged.
4.  **Check Other Documentation:**
    - Review the root `README.md` for necessary updates based on project changes (structure, tech stack, usage instructions).
    - Review any other `.md` files within the workspace for necessary updates.
5.  **Confirm with User:** Briefly summarize the updates made to the `_ai` documentation and any other files.

**Goal:** Keep the `_ai` documentation accurate and up-to-date references while preserving the prompt files.
