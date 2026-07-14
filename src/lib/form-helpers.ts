// ---------------------------------------------------------------------------
// Shared helpers for form API endpoints — Turnstile verification + Resend email
// ---------------------------------------------------------------------------

import { Resend } from 'resend';

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
 */
export function getFormRecipient(variableName: string): string | null {
  const recipient = import.meta.env[variableName]?.trim();
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
