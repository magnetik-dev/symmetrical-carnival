import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
  // pick book from query param ?book=book1
  const book = url.searchParams.get('book') ?? 'ca-itf4-all';

    try{
        const res = await fetch(`/books/${book}.json`);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json(); 
        // array of { query, response }

        return {
            entries: data,
            book
        };
      } catch (error) {
    console.error('JSON load failed:', error);
    return { entries: [], book };  // fallback
  }
};
 