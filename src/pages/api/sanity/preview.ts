import type { APIRoute } from 'astro';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import {
  client,
  sanityPreviewPerspectiveCookie,
  sanityPreviewSecretCookie,
} from '../../../lib/sanity';

export const prerender = false;

const secretParam = 'sanity-preview-secret';
const perspectiveParam = 'sanity-preview-perspective';

function getSafeRedirect(request: Request, redirectTo: string | undefined): URL {
  const origin = new URL(request.url).origin;
  const destination = new URL(redirectTo || '/', origin);

  if (destination.origin !== origin) {
    return new URL('/', origin);
  }

  return destination;
}

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const token = import.meta.env.SANITY_API_READ_TOKEN;
  if (!token) {
    return new Response('Sanity preview is not configured.', { status: 503 });
  }

  const validation = await validatePreviewUrl(client.withConfig({ token }), request.url);
  if (!validation.isValid) {
    return new Response('Invalid Sanity preview request.', { status: 401 });
  }

  const url = new URL(request.url);
  const secret = url.searchParams.get(secretParam);
  if (!secret) {
    return new Response('Missing Sanity preview secret.', { status: 400 });
  }

  const isProduction = import.meta.env.PROD;
  const cookieOptions = {
    httpOnly: true,
    path: '/',
    sameSite: 'lax' as const,
    secure: isProduction,
    maxAge: 60 * 60 * 4,
  };

  cookies.set(sanityPreviewSecretCookie, secret, cookieOptions);
  cookies.set(
    sanityPreviewPerspectiveCookie,
    validation.studioPreviewPerspective || url.searchParams.get(perspectiveParam) || 'drafts',
    cookieOptions,
  );

  const destination = getSafeRedirect(request, validation.redirectTo);
  const response = redirect(`${destination.pathname}${destination.search}${destination.hash}`, 307);
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  return response;
};
