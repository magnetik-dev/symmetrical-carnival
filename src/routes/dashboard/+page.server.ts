import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // The student data and stats are now cached and loaded on the client side
    // to prevent server-side database calls on every page refresh or navigation.
    return {};
};
