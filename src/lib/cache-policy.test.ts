import { describe, expect, it } from 'vitest';
import {
  applyPrivatePreviewCache,
  applyPublicPageCache,
  browserRevalidationPolicy,
  privatePreviewPolicy,
  vercelPublicPagePolicy,
} from './cache-policy';

describe('public page cache policy', () => {
  it('keeps browsers revalidating while enabling a short Vercel edge cache', () => {
    const headers = new Headers();

    applyPublicPageCache(headers);

    expect(headers.get('Cache-Control')).toBe(browserRevalidationPolicy);
    expect(headers.get('Vercel-CDN-Cache-Control')).toBe(vercelPublicPagePolicy);
  });

  it('removes every shared-cache override for authenticated preview responses', () => {
    const headers = new Headers({
      'Cache-Control': browserRevalidationPolicy,
      'Vercel-CDN-Cache-Control': vercelPublicPagePolicy,
      'CDN-Cache-Control': 'public, max-age=600',
    });

    applyPrivatePreviewCache(headers);

    expect(headers.get('Cache-Control')).toBe(privatePreviewPolicy);
    expect(headers.has('Vercel-CDN-Cache-Control')).toBe(false);
    expect(headers.has('CDN-Cache-Control')).toBe(false);
  });
});
