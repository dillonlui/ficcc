// /api/prayer-request — Prayer request form endpoint
export const prerender = false;

import type { APIRoute } from 'astro';
import {
  verifyTurnstile,
  sendEmail,
  jsonError,
  jsonSuccess,
} from '../../lib/form-helpers';

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim(); // optional
  const prayerRequest = String(body.request ?? '').trim();
  const turnstileToken = String(body.turnstileToken ?? '').trim();

  // --- Validation ---
  const fields: { field: string; message: string }[] = [];

  if (name.length < 2) {
    fields.push({ field: 'name', message: 'Name is required (min 2 characters)' });
  }
  if (prayerRequest.length < 10) {
    fields.push({ field: 'request', message: 'Prayer request is required (min 10 characters)' });
  }
  if (!turnstileToken) {
    fields.push({ field: 'turnstileToken', message: 'Captcha verification is required' });
  }

  if (fields.length > 0) {
    return jsonError(400, 'Please fix the errors below', fields);
  }

  // --- Turnstile verification ---
  const turnstileOk = await verifyTurnstile(turnstileToken);
  if (!turnstileOk) {
    return jsonError(403, 'Captcha verification failed. Please try again.');
  }

  // --- Send email ---
  const to = import.meta.env.CONTACT_EMAIL || 'onboarding@resend.dev';
  const ok = await sendEmail({
    to,
    subject: `New Prayer Request from ${name}`,
    ...(email ? { replyTo: email } : {}),
    html: `
      <h2>New Prayer Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      ${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ''}
      <p><strong>Prayer Request:</strong></p>
      <p>${escapeHtml(prayerRequest).replace(/\n/g, '<br>')}</p>
    `,
  });

  if (!ok) {
    return jsonError(500, 'Unable to submit your prayer request right now. Please try again later.');
  }

  return jsonSuccess('Your prayer request has been submitted. Thank you for sharing.');
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
