// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// reuse shared entry type for queries
		interface Entry {
			query: string;
			response: string;
		}

		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
