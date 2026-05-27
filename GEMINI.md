# Symmetrical Carnival - Project Documentation

This project is a SvelteKit-based web application designed for viewing and generating quiz entries stored in JSON format.

## Tech Stack
- **Framework:** SvelteKit (Svelte 5 with Runes)
- **Styling:** Bulma CSS
- **Language:** TypeScript
- **Deployment:** Vercel (configured with `@sveltejs/adapter-vercel` and `adapter-auto`)

## Project Structure
- `src/routes/`: Contains the application's pages.
    - `+page.svelte`: Main viewer for quiz entries. Supports searching and book selection via query parameters.
    - `generator/+page.svelte`: Utility page for creating new quiz JSON data.
- `static/books/`: Directory containing JSON files for various quiz sets.
- `src/app.d.ts`: Global type definitions, including the `App.Entry` interface used for quiz data.

## Core Conventions

### Svelte 5 Runes
The project utilizes Svelte 5 Runes for reactivity:
- `$state`: Used for mutable state (e.g., search queries, list of entries).
- `$derived`: Used for computed values (e.g., filtered results, JSON output).
- `$effect`: Used for side effects (e.g., syncing load data with local state).
- `$props`: Used for receiving component properties.

### Data Management
- Quiz data is stored as JSON files in `/static/books/`.
- The `Entry` interface (defined in `src/app.d.ts`) is the standard format:
  ```typescript
  interface Entry {
    query: string;
    response: string;
  }
  ```
- **User Profiles:** Authenticated users have associated profiles stored in the `public.profiles` table (linked by `id` to `auth.users`).
  - The `Profile` interface defines the structure, including the user's `role`.
  - Profiles are fetched on the server via `event.locals.getProfile()` and exposed globally through `src/routes/+layout.server.ts`.
- Data fetching for quizzes is handled in `+page.ts` using the SvelteKit `load` function, which fetches JSON files based on the `book` query parameter.

### UI & Styling
- **Bulma:** The project uses Bulma for layout and styling. It is imported globally in `src/routes/+layout.svelte`.
- **Search:** The main page features a real-time search filter implemented via a `$derived` rune.
- **Generator:** A dedicated tool for manually creating quiz entries and copying them to the clipboard as JSON.

## Development Commands
- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run check`: Run Svelte and TypeScript checks.

## Guidelines for LLM Assistants
- **Adhere to Svelte 5 Syntax:** Always use Svelte 5 Runes (`$state`, `$derived`, etc.) and the new event handler syntax (e.g., `onclick` instead of `on:click`).
- **Maintain Bulma Consistency:** Use Bulma classes for any new UI components or modifications.
- **Type Safety:** Use the `App.Entry` type for quiz-related data. Ensure all new components and functions are properly typed.
- **Surgical Edits:** When modifying pages, ensure the existing logic for query parameters and data fetching remains intact.
