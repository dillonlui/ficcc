// /api/ride-request — Ride request form endpoint
export const prerender = false;

import type { APIRoute } from 'astro';
import {
  verifyTurnstile,
  sendEmail,
  jsonError,
  jsonSuccess,
  isValidEmail,
} from '../../lib/form-helpers';

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const pickupLocation = String(body.pickupLocation ?? '').trim();
  const preferredDate = String(body.preferredDate ?? '').trim();
  const notes = String(body.notes ?? '').trim();
  const turnstileToken = String(body.turnstileToken ?? '').trim();

  // --- Validation ---
  const fields: { field: string; message: string }[] = [];

  if (name.length < 2) {
    fields.push({ field: 'name', message: 'Name is required (min 2 characters)' });
  }
  if (!isValidEmail(email)) {
    fields.push({ field: 'email', message: 'A valid email address is required' });
  }
  if (pickupLocation.length < 5) {
    fields.push({ field: 'pickupLocation', message: 'Pickup location is required (min 5 characters)' });
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
    subject: `New Ride Request from ${name}`,
    replyTo: email,
    html: `
      <h2>New Ride Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
      <p><strong>Pickup Location:</strong> ${escapeHtml(pickupLocation)}</p>
      ${preferredDate ? `<p><strong>Preferred Date:</strong> ${escapeHtml(preferredDate)}</p>` : ''}
      ${notes ? `<p><strong>Notes:</strong> ${escapeHtml(notes).replace(/\n/g, '<br>')}</p>` : ''}
    `,
  });

  if (!ok) {
    return jsonError(500, 'Unable to submit your ride request right now. Please try again later.');
  }

  return jsonSuccess("Your ride request has been submitted! We'll be in touch soon.");
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
