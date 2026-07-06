import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const user = await locals.getUser();
    if (user) {
        throw redirect(303, '/dashboard');
    }
    return {};
};

export const actions: Actions = {
    login: async ({ request, locals }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

        if (error) {
            return fail(401, { error: error.message });
        }

        throw redirect(303, '/quiz');
    },

    signup: async ({ request, locals }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        const { error } = await locals.supabase.auth.signUp({ email, password });

        if (error) {
            return fail(400, { error: error.message });
        }

        return { success: 'Account created successfully!' };
    }
};
