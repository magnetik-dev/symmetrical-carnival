import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
      }
    }
  });

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session from the browser's storage,
   * `supabase.auth.getUser()` always sends a request to the Auth server to fetch the user object,
   * which makes it safer.
   */
  event.locals.getUser = async () => {
    const { data: { user } } = await event.locals.supabase.auth.getUser();
    return user;
  };

  const user = await event.locals.getUser();

  // Auth Guards
  const isProtectedPath = event.url.pathname.startsWith('/quiz') 
    || event.url.pathname.startsWith('/generator');
  
  if (isProtectedPath && !user) {
    throw redirect(303, '/');
  }

  // Redirect logged-in users away from root (login) if they are already authenticated
  if (event.url.pathname === '/' && user) {
      throw redirect(303, '/quiz');
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-parse';
    }
  });
};
