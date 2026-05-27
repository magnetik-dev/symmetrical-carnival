// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Profile {
			id: string;
			role: string;
			// Add other fields from your public.profiles table here
		}

		interface Locals {
			supabase: import('@supabase/supabase-js').SupabaseClient;
			getUser: () => Promise<import('@supabase/supabase-js').User | null>;
			getProfile: () => Promise<Profile | null>;
		}
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
