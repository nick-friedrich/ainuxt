# AI Folder Update Prompt

When requested to update the `_ai` folder (e.g., using `@_ai update` or similar trigger):

1.  **Review Recent Changes:** Examine the latest user messages, code changes, file attachments, and conversation history to understand what progress has been made or what new information needs to be documented (e.g., commits "Enhance profile update functionality with locale support" and "Update Nuxt configuration and layout for improved localization").
2.  **Update `_ai/readme.md`:**
    - Reflect any changes to the project structure (new apps, layers, packages).
    - Update descriptions of existing components if their purpose has changed.
    - Add any new general instructions, conventions, or technology stack decisions mentioned.
    - Ensure clarity and accuracy.
3.  **Update `_ai/todolist.md`:**
    - Mark completed tasks with `[x]`. Add brief notes if the implementation differed from the original plan (e.g., "Leveraged existing package X").
    - Add new tasks identified during the conversation or from user requests. Ensure tasks are clear and actionable.
    - Remove or consolidate obsolete tasks.
4.  **Check Other Documentation:**
    - Review the root `README.md` for necessary updates based on project changes (structure, tech stack, usage instructions).
    - Review any other `.md` files within `_ai` (or subfolders like `prompts`) for necessary updates based on the recent changes.
5.  **Confirm with User:** Briefly summarize the updates made to the documentation (`_ai` folder and root `README.md`).

**Goal:** Keep the `_ai` folder and root `README.md` accurate and up-to-date references.
