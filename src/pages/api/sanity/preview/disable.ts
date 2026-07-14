import type { APIRoute } from 'astro';
import {
  sanityPreviewPerspectiveCookie,
  sanityPreviewSecretCookie,
} from '../../../../lib/sanity';

export const prerender = false;

export const GET: APIRoute = ({ cookies, redirect }) => {
  cookies.delete(sanityPreviewSecretCookie, { path: '/' });
  cookies.delete(sanityPreviewPerspectiveCookie, { path: '/' });
  const response = redirect('/', 307);
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  return response;
};
