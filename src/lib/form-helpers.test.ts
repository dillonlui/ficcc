import { beforeEach, describe, expect, it } from 'vitest';
import {
  checkFormRateLimit,
  formField,
  getFormClientKey,
  isValidIsoDate,
  readLimitedJsonBody,
  resetFormRateLimitsForTests,
} from './form-helpers';

describe('bounded JSON form bodies', () => {
  it('accepts a body exactly at the configured byte limit', async () => {
    const body = JSON.stringify({ message: '你好' });
    const bytes = new TextEncoder().encode(body).byteLength;
    const result = await readLimitedJsonBody(new Request('https://ficcc.org/api/contact', {
      method: 'POST',
      headers: { 'Content-Length': String(bytes) },
      body,
    }), bytes);

    expect(result).toEqual({ ok: true, body: { message: '你好' } });
  });

  it('rejects a declared body one byte over the limit before parsing', async () => {
    const result = await readLimitedJsonBody(new Request('https://ficcc.org/api/contact', {
      method: 'POST',
      headers: { 'Content-Length': '11' },
      body: '{bad json}',
    }), 10);

    expect(result).toEqual({ ok: false, status: 413, error: 'Request body is too large' });
  });

  it('rejects an oversized streamed body without Content-Length', async () => {
    const result = await readLimitedJsonBody(new Request('https://ficcc.org/api/contact', {
      method: 'POST',
      body: JSON.stringify({ message: 'too long' }),
    }), 8);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(413);
  });

  it('rejects malformed JSON and non-object JSON', async () => {
    const malformed = await readLimitedJsonBody(new Request('https://ficcc.org/api/contact', {
      method: 'POST',
      body: '{bad json}',
    }));
    const array = await readLimitedJsonBody(new Request('https://ficcc.org/api/contact', {
      method: 'POST',
      body: '[]',
    }));

    expect(malformed).toMatchObject({ ok: false, status: 400 });
    expect(array).toEqual({ ok: false, status: 400, error: 'JSON body must be an object' });
  });
});

describe('form validation helpers', () => {
  it('accepts real ISO calendar dates and rejects impossible dates', () => {
    expect(isValidIsoDate('2026-08-20')).toBe(true);
    expect(isValidIsoDate('2026-02-29')).toBe(false);
    expect(isValidIsoDate('08/20/2026')).toBe(false);
  });

  it('only accepts string fields and trims them', () => {
    expect(formField({ name: '  Visitor  ' }, 'name')).toBe('Visitor');
    expect(formField({ name: 42 }, 'name')).toBe('');
  });
});

describe('form request throttling', () => {
  beforeEach(() => resetFormRateLimitsForTests());

  it('keys limits by endpoint and Vercel-provided client IP', () => {
    const request = new Request('https://ficcc.org/api/contact', {
      headers: { 'x-real-ip': '192.0.2.10' },
    });
    expect(getFormClientKey(request, '/api/contact', '127.0.0.1')).toBe('/api/contact:192.0.2.10');
    expect(getFormClientKey(request, '/api/ride-request', '127.0.0.1')).toBe('/api/ride-request:192.0.2.10');
  });

  it('returns a retry window after repeated requests', () => {
    const key = '/api/contact:192.0.2.10';
    expect(checkFormRateLimit(key, 1_000, 2, 60_000).allowed).toBe(true);
    expect(checkFormRateLimit(key, 1_001, 2, 60_000).allowed).toBe(true);
    expect(checkFormRateLimit(key, 1_002, 2, 60_000)).toEqual({
      allowed: false,
      retryAfterSeconds: 60,
    });
    expect(checkFormRateLimit(key, 61_000, 2, 60_000).allowed).toBe(true);
  });
});
