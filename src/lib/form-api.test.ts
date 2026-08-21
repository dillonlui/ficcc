import { beforeEach, describe, expect, it } from 'vitest';
import { resetFormRateLimitsForTests } from './form-helpers';
import { POST as contactPost } from '../pages/api/contact';
import { POST as ridePost } from '../pages/api/ride-request';

function context(path: string, body: Record<string, unknown> | string, ip: string) {
  return {
    request: new Request(`https://ficcc.org${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-real-ip': ip },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
    clientAddress: ip,
  } as never;
}

describe('form API boundaries', () => {
  beforeEach(() => resetFormRateLimitsForTests());

  it('allows maximum contact field lengths through to Turnstile verification', async () => {
    const response = await contactPost(context('/api/contact', {
      name: 'N'.repeat(100),
      email: 'visitor@example.com',
      message: 'M'.repeat(5_000),
      turnstileToken: 'invalid-token',
    }, '192.0.2.1'));

    expect(response.status).toBe(403);
  });

  it('rejects contact fields one character over their limits', async () => {
    const response = await contactPost(context('/api/contact', {
      name: 'N'.repeat(101),
      email: 'visitor@example.com',
      message: 'A valid message',
      turnstileToken: 'token',
    }, '192.0.2.2'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.fields).toContainEqual({ field: 'name', message: 'Name must be 100 characters or fewer' });
  });

  it('rejects missing and invalid Turnstile tokens', async () => {
    const missing = await contactPost(context('/api/contact', {
      name: 'Visitor', email: 'visitor@example.com', message: 'A valid message',
    }, '192.0.2.3'));
    const invalid = await contactPost(context('/api/contact', {
      name: 'Visitor', email: 'visitor@example.com', message: 'A valid message', turnstileToken: 'invalid',
    }, '192.0.2.4'));

    expect(missing.status).toBe(400);
    expect(invalid.status).toBe(403);
  });

  it('validates ride phone length, field caps, and real dates', async () => {
    const response = await ridePost(context('/api/ride-request', {
      name: 'Visitor',
      email: 'visitor@example.com',
      phone: '123',
      pickupLocation: 'P'.repeat(301),
      preferredDate: '2026-02-29',
      notes: 'N'.repeat(2_001),
      turnstileToken: 'token',
    }, '192.0.2.5'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.fields.map((field: { field: string }) => field.field)).toEqual([
      'phone', 'pickupLocation', 'preferredDate', 'notes',
    ]);
  });

  it('returns 429 with Retry-After after repeated endpoint requests', async () => {
    const makeRequest = () => contactPost(context('/api/contact', '{bad json}', '192.0.2.6'));
    for (let index = 0; index < 5; index += 1) {
      expect((await makeRequest()).status).toBe(400);
    }
    const throttled = await makeRequest();

    expect(throttled.status).toBe(429);
    expect(Number(throttled.headers.get('Retry-After'))).toBeGreaterThan(0);
  });
});
