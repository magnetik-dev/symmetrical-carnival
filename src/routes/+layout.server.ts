import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    return {
        user: await locals.getUser(),
        profile: await locals.getProfile()
    };
};
