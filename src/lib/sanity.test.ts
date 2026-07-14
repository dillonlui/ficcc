import { describe, expect, it } from 'vitest';
import { getSanityPreviewContext, hasSanityPreviewCookie } from './sanity';

describe('Sanity preview gate', () => {
  it('does not treat ordinary visitors as preview users', async () => {
    const request = new Request('https://ficcc.org/en/');

    expect(hasSanityPreviewCookie(request)).toBe(false);
    await expect(getSanityPreviewContext(request)).resolves.toEqual({
      enabled: false,
      perspective: 'published',
    });
  });

  it('only recognizes the server-set preview cookie name', () => {
    const queryStringRequest = new Request(
      'https://ficcc.org/en/?sanity-preview-secret=not-a-session',
    );
    const authenticatedRequest = new Request('https://ficcc.org/en/', {
      headers: { cookie: '__sanity_preview_secret=server-validated-secret' },
    });

    expect(hasSanityPreviewCookie(queryStringRequest)).toBe(false);
    expect(hasSanityPreviewCookie(authenticatedRequest)).toBe(true);
  });
});
