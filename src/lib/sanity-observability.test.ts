import { afterEach, describe, expect, it, vi } from 'vitest';
import { reportSanityQueryFailure } from './sanity';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Sanity fallback observability', () => {
  it('emits one structured, non-sensitive event per request', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const request = new Request('https://ficcc.org/zh/about?secret=do-not-log', {
      headers: { cookie: '__sanity_preview_secret=do-not-log' },
    });

    reportSanityQueryFailure(request, new TypeError('response included sensitive details'));
    reportSanityQueryFailure(request, new Error('second failure'));

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const output = errorSpy.mock.calls.flat().join(' ');
    expect(output).toContain('sanity_query_failed');
    expect(output).toContain('"route":"/zh/about"');
    expect(output).toContain('"previewCookiePresent":true');
    expect(output).toContain('"errorName":"TypeError"');
    expect(output).not.toContain('do-not-log');
    expect(output).not.toContain('sensitive details');
  });
});
