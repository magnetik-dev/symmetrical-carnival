import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
  // pick book from query param ?book=book1, default to book1
  const book = url.searchParams.get('book') ?? 'book1';

  const res = await fetch(`/books/${book}.json`);
  const data = await res.json(); // array of { query, response }

  return {
    entries: data,
    book
  };
};
 