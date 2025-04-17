# AI Reference

This folder contains reference materials for AI Chatbots assisting with this project.

## About the Project

This is a monorepo for Nuxt applications. We utilize Nuxt layers to structure the project effectively.

### Project Goal

We want to create a easy to maintain and extendable project. Therefore it needs to be structured, modular and easy to understand.

## Project Structure

The repository is organized as follows:

### `apps/`

This directory contains the individual Nuxt applications.

- **`my-app/`**: The primary application. _(Others may be added in the future)_

### `layers/`

This directory holds the reusable Nuxt layers shared across applications.

- **`auth/`**: Handles authentication logic.
- **`styling/`**: Contains shared styling configurations and components.
- **`i18n/`**: Manages internationalization and localization.
- **`database/`**: Provides utilities (`server/utils/db.ts`) to access the shared Prisma client defined in `packages/psql`.

### `packages/`

This directory includes non-Nuxt-layer packages that are reused across the monorepo.

- **`psql/`**: Provides utilities or configurations for interacting with PostgreSQL.
- **`psql2/`**: (Potential future package) Intended for another application potentially requiring PostgreSQL interaction.

### `__examples/`

This directory contains example code snippets or mini-projects demonstrating common patterns or setups within this monorepo (e.g., creating a minimal Nuxt layer).

# General Instructions

- We use Typescript for the project.
- This is a monorepo project using pnpm as package manager.
- We use turbo as the build system.
- We use nuxt layers to structure the project.
- We use nuxt packages to reuse code across the project.
- We use docker to run the project.
- We use postgres to store the project data.
- We use prisma to interact with the database.
- We use tailwindcss for styling.
- We use nuxt-i18n for internationalization.
- We use nuxt-icon for icons.
- We use daisyui for the ui library.

- Always try to run the commands in the root of the project.
- Always try to use pnpm as package manager.
- Don't edit package.json files to add new dependencies, run pnpm add <package> instead.

- You might find ai.md files in some folders. These are specific instructions for this folder/package which needs to be followed.

- You might find a todolist.md file in some folders. These are specific instructions for this folder/package which needs to be followed. Otherwise create a new one. Also you can find one in the \_ai folder.

- Please keep the todo list's up to date.

- please keep the \_ai folder up to date with the latest information.

- feel free to create new .md files in the \_ai folder if needed.
