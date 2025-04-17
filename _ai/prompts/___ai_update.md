# AI Folder Update Prompt

When requested to update the `_ai` folder (e.g., using `@_ai update` or similar trigger):

1.  **Review Recent Changes:** Examine the latest user messages, code changes, file attachments, and conversation history to understand what progress has been made or what new information needs to be documented.
2.  **Update `_ai/readme.md`:**
    - Reflect any changes to the project structure (new apps, layers, packages).
    - Update descriptions of existing components if their purpose has changed.
    - Add any new general instructions, conventions, or technology stack decisions mentioned.
    - Ensure clarity and accuracy.
3.  **Update `_ai/todolist.md`:**
    - Mark completed tasks with `[x]`. Add brief notes if the implementation differed from the original plan (e.g., "Leveraged existing package X").
    - Add new tasks identified during the conversation or from user requests. Ensure tasks are clear and actionable.
    - Remove or consolidate obsolete tasks.
4.  **Check Other `.md` Files:** Review any other `.md` files within `_ai` (or subfolders like `prompts`) for necessary updates based on the recent changes.
5.  **Confirm with User:** Briefly summarize the updates made to the `_ai` folder.

**Goal:** Keep the `_ai` folder an accurate and up-to-date reference for the AI assistant working on this project.
