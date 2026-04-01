import { Resend } from 'resend';

export const config = { runtime: 'edge' };

/* ------------------------------------------------------------------ */
/*  Config                                                            */
/* ------------------------------------------------------------------ */

const RECIPIENT_EMAIL = 'info@ficcc.org';
const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                */
/* ------------------------------------------------------------------ */

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
}

interface FieldError {
  field: string;
  message: string;
}

function validatePayload(body: unknown): {
  ok: true;
  data: ContactPayload;
} | {
  ok: false;
  errors: FieldError[];
} {
  if (!body || typeof body !== 'object') {
    return { ok: false, errors: [{ field: 'body', message: 'Invalid request body' }] };
  }

  const { name, email, message, turnstileToken } = body as Record<string, unknown>;
  const errors: FieldError[] = [];

  if (typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name is required (min 2 characters)' });
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }
  if (typeof message !== 'string' || message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message is required (min 10 characters)' });
  }
  if (typeof turnstileToken !== 'string' || turnstileToken.trim().length === 0) {
    errors.push({ field: 'turnstileToken', message: 'Turnstile verification is required' });
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name: (name as string).trim(),
      email: (email as string).trim(),
      message: (message as string).trim(),
      turnstileToken: (turnstileToken as string).trim(),
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Turnstile verification                                            */
/* ------------------------------------------------------------------ */

async function verifyTurnstile(
  token: string,
  secretKey: string,
  ip: string | undefined,
): Promise<{ success: boolean; errorCodes?: string[] }> {
  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);
  if (ip) formData.append('remoteip', ip);

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  if (!res.ok) {
    return { success: false, errorCodes: [`http-${res.status}`] };
  }

  const json = (await res.json()) as {
    success: boolean;
    'error-codes'?: string[];
  };

  return { success: json.success, errorCodes: json['error-codes'] };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/* ------------------------------------------------------------------ */
/*  Handler (Vercel Edge Runtime)                                     */
/* ------------------------------------------------------------------ */

export default async function handler(request: Request) {
  /* ---- Method check ---- */
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  /* ---- Env check ---- */
  const resendApiKey = process.env.RESEND_API_KEY;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  if (!resendApiKey) {
    console.error('[contact] RESEND_API_KEY is not set');
    return json({
      error: 'Server configuration error: RESEND_API_KEY is not set. Contact the site administrator.',
    }, 500);
  }
  if (!turnstileSecret) {
    console.error('[contact] TURNSTILE_SECRET_KEY is not set');
    return json({
      error: 'Server configuration error: TURNSTILE_SECRET_KEY is not set. Contact the site administrator.',
    }, 500);
  }

  /* ---- Parse & validate ---- */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const validation = validatePayload(body);
  if (!validation.ok) {
    return json({ error: 'Validation failed', fields: validation.errors }, 400);
  }
  const { name, email, message, turnstileToken } = validation.data;

  /* ---- Turnstile verification ---- */
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();

  let turnstileResult: Awaited<ReturnType<typeof verifyTurnstile>>;
  try {
    turnstileResult = await verifyTurnstile(turnstileToken, turnstileSecret, clientIp);
  } catch (err) {
    console.error('[contact] Turnstile verification failed:', err);
    return json({ error: 'Unable to verify captcha. Please try again.' }, 502);
  }

  if (!turnstileResult.success) {
    console.warn('[contact] Turnstile rejected:', turnstileResult.errorCodes);
    return json({
      error: 'Captcha verification failed. Please try again.',
      turnstileErrors: turnstileResult.errorCodes,
    }, 400);
  }

  /* ---- Send email via Resend ---- */
  const resend = new Resend(resendApiKey);

  try {
    const { error } = await resend.emails.send({
      from: 'FICCC Contact Form <onboarding@resend.dev>',
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return json({ error: 'Failed to send email. Please try again later.' }, 502);
    }
  } catch (err) {
    console.error('[contact] Resend exception:', err);
    return json({ error: 'Failed to send email. Please try again later.' }, 502);
  }

  /* ---- Success ---- */
  return json({ success: true, message: "Your message has been sent. We'll be in touch!" });
}
