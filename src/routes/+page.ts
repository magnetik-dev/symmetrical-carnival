import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
  // pick book from query param ?book=book1, default to book1
  const book = url.searchParams.get('book') ?? 'ca-itf4-1';

    try{
        const res = await fetch(`/books/${book}.json`);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
/*
        const contentType = res.headers.get('content-type');
        console.log('Content-Type:', contentType);

        if (!contentType?.includes('application/json')) {
            throw new Error('Not JSON');
        }
*/
        const data = await res.json(); // array of { query, response }

        return {
            entries: data,
            book
        };
      } catch (error) {
    console.error('JSON load failed:', error);
    return { entries: [], book };  // fallback
  }
};
 