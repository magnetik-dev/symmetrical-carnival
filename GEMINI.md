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
    - `+page.svelte`: Login page at `/`; its server actions handle login and signup.
    - `+page.server.ts`: Redirects authenticated users and handles login/signup form submissions.
    - `quiz/+page.svelte`: Quiz viewer with search and book selection via query parameters.
    - `quiz/+page.ts`: Loads the selected quiz JSON file from `/static/books/`.
    - `dashboard/+page.svelte`: Student registry dashboard displaying real-time statistics and a searchable table of student records.
    - `dashboard/+page.server.ts`: Server load function that returns minimal payloads, delegating data fetching to the client-side cache.
    - `generator/+page.svelte`: Utility page for creating new quiz JSON data.
    - `tally/+page.svelte`: Weekly hours tally that persists entries in browser local storage.
    - `logout/+page.server.ts`: Signs the current user out and redirects to `/`.
- `src/hooks.server.ts`: Initializes the Supabase server client, provides user/profile helpers, and guards authenticated routes.
- `src/lib/`: Shared application libraries and utilities.
    - `state.svelte.ts`: A Svelte 5 reactive cache store (`registryCache`) that handles fetching, flat-mapping, and persisting student registry data.
- `static/books/`: Directory containing JSON files for various quiz sets.
- `src/app.d.ts`: Global type definitions, including the `App.Entry` and `App.Profile` interfaces.
- `DATABASE_SCHEMA.md`: Documentation of the Supabase database schema, tables, types, and relationships.
- `schema.sql`: SQL definition file reflecting the Supabase database structure (tracked for context).

## Authentication and Route Access
- The root route (`/`) is the login page. Authenticated users are redirected to `/dashboard` when their profile role is `admin`, and to `/quiz` otherwise.
- `/quiz`, `/generator`, and `/dashboard` redirect unauthenticated visitors to `/`.
- The navbar shows the Dashboard, Quiz, Generator, and Tally links when a user is signed in.
- `/tally` is a standalone static feature and is intentionally accessible without signing in.
- The server exposes a signup action on the root page, but the signup control is currently commented out in the login UI.

## Core Conventions

### Svelte 5 Runes
The project utilizes Svelte 5 Runes for reactivity:
- `$state`: Used for mutable state (e.g., search queries, list of entries, cache states).
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
  - Managed and fetched on the client side using the reactive cache store (`src/lib/state.svelte.ts`).
  - **In-Memory Caching:** The cache store (`registryCache`) retains loaded data in Svelte 5 state runes to allow instantaneous client-side navigation without re-fetching.
  - **Session Persistence:** State is cached in the browser's `sessionStorage` so that hard page refreshes do not trigger database hits.
  - **Dropdown & Reference Data**: The cache store automatically fetches and caches the list of available batches (`batchesList`) and lead sources (`leadsList`) on app load. These are used to populate dropdown selections in data entry forms.
  - **Manual Refresh:** The UI provides a manual "Refresh" trigger to force-fetch fresh data from the database whenever needed.
  - **Flat-mapping:** Relational joins (getting `batch_name` and `lead_name`) are normalized inside the store to present clean properties to the UI.
  - See `DATABASE_SCHEMA.md` for a comprehensive ER diagram and table schemas.

### Admin Tools & Transactions
- **Student Enrollment:** Users with the `'admin'` role have access to an **Add Student** form in the dashboard.
- **Transaction Flow**:
  1. Inserts the student record into the `public.students` table.
  2. Calls the Supabase RPC function `encrypt_student_password(s_number, raw_password)` to securely hash and insert the credentials into the `public.students_credentials` table.
  3. Triggers a force-refresh of `registryCache` to update the dashboard metrics and student list instantly.

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
- **Leverage the Cache Store:** For academic and student records, always interact with `registryCache` in `src/lib/state.svelte.ts` instead of writing ad-hoc Supabase queries in views or server files.
- **Database Context:** Always consult `DATABASE_SCHEMA.md` when writing or modifying queries targeting the Supabase database.

## Antigravity CLI
Run the following command after installing Antigravity
```
agy
```
