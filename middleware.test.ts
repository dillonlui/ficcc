import { describe, expect, it, vi } from 'vitest';
import middleware from './middleware';

vi.mock('@vercel/edge', () => ({
  next: () => new Response(null, { status: 200 }),
}));

describe('language gateway middleware', () => {
  it('redirects root visitors with English preference to /en/', () => {
    const response = middleware(
      new Request('https://ficcc.org/', {
        headers: { cookie: 'lang-pref=en' },
      }),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://ficcc.org/en/');
  });

  it('redirects root visitors with Chinese preference to /zh/', () => {
    const response = middleware(
      new Request('https://ficcc.org/', {
        headers: { cookie: 'lang-pref=zh' },
      }),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://ficcc.org/zh/');
  });

  it('shows the splash when no language preference is set', () => {
    const response = middleware(new Request('https://ficcc.org/'));

    expect(response.status).toBe(200);
  });

  it('shows the splash when chooselang is requested', () => {
    const response = middleware(
      new Request('https://ficcc.org/?chooselang', {
        headers: { cookie: 'lang-pref=en' },
      }),
    );

    expect(response.status).toBe(200);
  });

  it('does not intercept language-specific routes', () => {
    const response = middleware(
      new Request('https://ficcc.org/en/about', {
        headers: { cookie: 'lang-pref=zh' },
      }),
    );

    expect(response.status).toBe(200);
  });
});
