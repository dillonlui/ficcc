// ---------------------------------------------------------------------------
// Shared helpers for form API endpoints — Turnstile verification + Resend email
// ---------------------------------------------------------------------------

import { Resend } from 'resend';

// Keep form payloads comfortably below the size needed for ordinary church
// correspondence. This is enforced while streaming as well as through the
// Content-Length fast path so chunked requests cannot bypass it.
export const FORM_BODY_MAX_BYTES = 16 * 1024;
export const FORM_RATE_LIMIT = 5;
export const FORM_RATE_WINDOW_MS = 10 * 60 * 1000;
const FORM_RATE_MAX_KEYS = 10_000;

type JsonBodyResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: 400 | 413; error: string };

type RateLimitEntry = { count: number; resetAt: number };
const formRateLimits = new Map<string, RateLimitEntry>();

export async function readLimitedJsonBody(
  request: Request,
  maxBytes = FORM_BODY_MAX_BYTES,
): Promise<JsonBodyResult> {
  const contentLength = request.headers.get('content-length');
  if (contentLength !== null) {
    const declaredBytes = Number(contentLength);
    if (!Number.isSafeInteger(declaredBytes) || declaredBytes < 0) {
      return { ok: false, status: 400, error: 'Invalid Content-Length header' };
    }
    if (declaredBytes > maxBytes) {
      return { ok: false, status: 413, error: 'Request body is too large' };
    }
  }

  if (!request.body) {
    return { ok: false, status: 400, error: 'Invalid JSON body' };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytesRead = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > maxBytes) {
        await reader.cancel();
        return { ok: false, status: 413, error: 'Request body is too large' };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400, error: 'Invalid JSON body' };
  }

  const bytes = new Uint8Array(bytesRead);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return { ok: false, status: 400, error: 'JSON body must be an object' };
    }
    return { ok: true, body: body as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400, error: 'Invalid JSON body' };
  }
}

export function formField(body: Record<string, unknown>, name: string): string {
  const value = body[name];
  return typeof value === 'string' ? value.trim() : '';
}

export function isValidIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

export function getFormClientKey(request: Request, endpoint: string, clientAddress?: string): string {
  const ip = request.headers.get('x-real-ip')?.trim()
    || clientAddress?.trim()
    || 'unknown';
  return `${endpoint}:${ip}`;
}

export function checkFormRateLimit(
  key: string,
  now = Date.now(),
  limit = FORM_RATE_LIMIT,
  windowMs = FORM_RATE_WINDOW_MS,
): { allowed: boolean; retryAfterSeconds: number } {
  const existing = formRateLimits.get(key);
  if (!existing || now >= existing.resetAt) {
    if (!existing && formRateLimits.size >= FORM_RATE_MAX_KEYS) {
      for (const [storedKey, entry] of formRateLimits) {
        if (now >= entry.resetAt) formRateLimits.delete(storedKey);
      }
      if (formRateLimits.size >= FORM_RATE_MAX_KEYS) {
        return { allowed: false, retryAfterSeconds: Math.ceil(windowMs / 1000) };
      }
    }
    formRateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetFormRateLimitsForTests(): void {
  formRateLimits.clear();
}

// ---------------------------------------------------------------------------
// Turnstile verification
// ---------------------------------------------------------------------------

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_TIMEOUT_MS = 5_000;

/**
 * Verify a Cloudflare Turnstile token against the siteverify API.
 * Returns true if the token is valid. Logs failures for diagnostics.
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('[form-helpers] TURNSTILE_SECRET_KEY is not set');
    return false;
  }

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    });

    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };

    if (!data.success) {
      console.warn('[form-helpers] Turnstile verification failed', data['error-codes']);
    }

    return data.success;
  } catch (err) {
    console.error('[form-helpers] Turnstile verification error', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Resend email
// ---------------------------------------------------------------------------

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Read a form-specific recipient from the deployment environment. We fail
 * closed instead of routing church correspondence to Resend's sample address.
 *
 * Access env vars with static property reads — Vite only inlines
 * `import.meta.env.FORM_RECIPIENT_*` when the key is written literally.
 * Dynamic `import.meta.env[name]` stays undefined at runtime even when
 * the variable is set in Vercel.
 */
export function getFormRecipient(variableName: string): string | null {
  const recipients: Record<string, string | undefined> = {
    FORM_RECIPIENT_CONTACT: import.meta.env.FORM_RECIPIENT_CONTACT,
    FORM_RECIPIENT_RIDE: import.meta.env.FORM_RECIPIENT_RIDE,
  };

  const recipient = recipients[variableName]?.trim();
  if (!recipient || !isValidEmail(recipient)) {
    console.error(`[form-helpers] ${variableName} must be a valid email address`);
    return null;
  }

  return recipient;
}

/**
 * Send an email via the Resend SDK.
 * Returns true on success. Logs the Resend error payload on failure.
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[form-helpers] RESEND_API_KEY is not set');
    return false;
  }

  const from = import.meta.env.FROM_EMAIL?.trim();
  if (!from) {
    console.error('[form-helpers] FROM_EMAIL is not set');
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    });

    if (error) {
      console.error('[form-helpers] Resend send error', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[form-helpers] Resend exception', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// JSON response helpers
// ---------------------------------------------------------------------------

interface FieldError {
  field: string;
  message: string;
}

/**
 * Return a JSON error response matching the shape the client-side forms expect:
 * `{ error: string, fields?: [{field, message}] }`
 */
export function jsonError(
  status: number,
  error: string,
  fields?: FieldError[],
): Response {
  const body: Record<string, unknown> = { error };
  if (fields?.length) body.fields = fields;

  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Return a JSON success response: `{ success: true, message: string }`
 */
export function jsonSuccess(message: string): Response {
  return new Response(JSON.stringify({ success: true, message }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

// ---------------------------------------------------------------------------
// HTML escaping — shared by all API endpoints for email body construction
// ---------------------------------------------------------------------------

/**
 * Escape HTML special characters to prevent injection in email bodies.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
