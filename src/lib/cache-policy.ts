export const browserRevalidationPolicy = 'public, max-age=0, must-revalidate';
export const vercelPublicPagePolicy =
  'public, max-age=30, stale-while-revalidate=60, stale-if-error=86400';
export const privatePreviewPolicy = 'private, no-store, max-age=0';

/** Apply the shared cache policy for public, visitor-independent SSR pages. */
export function applyPublicPageCache(headers: Headers): void {
  headers.set('Cache-Control', browserRevalidationPolicy);
  headers.set('Vercel-CDN-Cache-Control', vercelPublicPagePolicy);
}

/** Ensure an authenticated preview can never enter a browser or shared cache. */
export function applyPrivatePreviewCache(headers: Headers): void {
  headers.set('Cache-Control', privatePreviewPolicy);
  headers.delete('Vercel-CDN-Cache-Control');
  headers.delete('CDN-Cache-Control');
}
