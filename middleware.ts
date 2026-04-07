/**
 * Vercel Edge Middleware — redirects returning visitors from splash (/)
 * to their preferred language based on the lang-pref cookie.
 *
 * Only intercepts exact requests to "/". All other routes pass through.
 * ?chooselang query param bypasses the redirect (dev convenience).
 */

import { next } from '@vercel/edge';

export default function middleware(request: Request) {
  const url = new URL(request.url);

  // Only intercept the root path
  if (url.pathname !== '/') {
    return next();
  }

  // ?chooselang bypasses redirect — always show splash
  if (url.searchParams.has('chooselang')) {
    return next();
  }

  // Read lang-pref cookie
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(/(?:^|;\s*)lang-pref=(en|zh)(?:;|$)/);

  if (match) {
    const lang = match[1];
    const destination = lang === 'zh' ? '/zh/' : '/en/';
    return Response.redirect(new URL(destination, request.url), 302);
  }

  // No cookie — show splash
  return next();
}

export const config = {
  matcher: '/',
};
