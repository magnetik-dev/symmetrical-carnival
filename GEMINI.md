# Symmetrical Carnival - Project Documentation

This project is a SvelteKit-based web application designed for viewing and generating quiz entries stored in JSON format, as well as managing and displaying student registry and cohort information.

## Tech Stack
- **Framework:** SvelteKit (Svelte 5 with Runes)
- **Styling:** Bulma CSS
- **Language:** TypeScript
- **Database / Auth:** Supabase (using `@supabase/ssr` and `@supabase/supabase-js`)
- **Deployment:** Vercel (configured with `@sveltejs/adapter-vercel` and `adapter-auto`)

## Project Structure
- `src/routes/`: Contains the application's pages.
    - `+page.svelte`: Main viewer for quiz entries. Supports searching and book selection via query parameters.
    - `dashboard/+page.svelte`: Student registry dashboard displaying real-time statistics and a searchable table of student records.
    - `dashboard/+page.server.ts`: Server load function that retrieves dynamic count statistics and student records with joined batch and lead info.
    - `generator/+page.svelte`: Utility page for creating new quiz JSON data.
- `static/books/`: Directory containing JSON files for various quiz sets.
- `src/app.d.ts`: Global type definitions, including the `App.Entry` and `App.Profile` interfaces.
- `DATABASE_SCHEMA.md`: Documentation of the Supabase database schema, tables, types, and relationships.
- `schema.sql`: SQL definition file reflecting the Supabase database structure (tracked for context).

## Core Conventions

### Svelte 5 Runes
The project utilizes Svelte 5 Runes for reactivity:
- `$state`: Used for mutable state (e.g., search queries, list of entries).
- `$derived`: Used for computed values (e.g., filtered results, JSON output).
- `$effect`: Used for side effects (e.g., syncing load data with local state).
- `$props`: Used for receiving component properties.

### Data Management
- **Quiz Data:** Stored as JSON files in `/static/books/`. Uses the `Entry` interface (defined in `src/app.d.ts`):
  ```typescript
  interface Entry {
    query: string;
    response: string;
  }
  ```
- **User Profiles:** Authenticated users have associated profiles stored in the `public.profiles` table (linked by `id` to `auth.users`).
  - The `Profile` interface defines the structure, including the user's `role`.
  - Profiles are fetched on the server via `event.locals.getProfile()` and exposed globally through `src/routes/+layout.server.ts`.
- **Student & Academic Records:** Managed via Supabase tables (`students`, `batch`, `leads`, `programs`, `providers`, `payments`).
  - Fetched using relational joins in SvelteKit server load functions (`+page.server.ts`).
  - Normalized or flat-mapped on the server before being sent to the client to ensure clean, type-safe props on the frontend.
  - See `DATABASE_SCHEMA.md` for a comprehensive ER diagram and table schemas.

### UI & Styling
- **Bulma:** The project uses Bulma for layout and styling. It is imported globally in `src/routes/+layout.svelte`.
- **Search:** Pages like `/quiz` and `/dashboard` feature real-time search filters implemented via `$derived` runes.
- **Generator:** A dedicated tool for manually creating quiz entries and copying them to the clipboard as JSON.

## Development Commands
- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run check`: Run Svelte and TypeScript checks.

## Guidelines for LLM Assistants
- **Adhere to Svelte 5 Syntax:** Always use Svelte 5 Runes (`$state`, `$derived`, etc.) and the new event handler syntax (e.g., `onclick` instead of `on:click`).
- **Maintain Bulma Consistency:** Use Bulma classes for any new UI components or modifications.
- **Type Safety:** Use appropriate types from `src/app.d.ts` for quiz-related and profile-related data. Ensure all new components and functions are properly typed.
- **Surgical Edits:** When modifying pages, ensure the existing logic for query parameters, authentication guards, and data fetching remains intact.
- **Server-Side Data Formatting:** When querying relational tables (e.g., Supabase joins), perform mapping and normalization on the server side (`+page.server.ts`) to present clean, flat properties to Svelte components.
- **Database Context:** Always consult `DATABASE_SCHEMA.md` when writing or modifying queries targeting the Supabase database.

## Antigravity CLI
Run the following command after installing Antigravity
```
agy
```

```
Resume: agy --conversation=d43c97b9-5d4e-4a79-abef-52780f3cf5b7 (or -c)
```
