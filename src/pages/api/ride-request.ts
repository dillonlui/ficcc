// /api/ride-request — Ride request form endpoint
export const prerender = false;

import type { APIRoute } from 'astro';
import {
  verifyTurnstile,
  sendEmail,
  getFormRecipient,
  jsonError,
  jsonSuccess,
  isValidEmail,
  escapeHtml,
  readLimitedJsonBody,
  formField,
  isValidIsoDate,
  getFormClientKey,
  checkFormRateLimit,
} from '../../lib/form-helpers';

const ENDPOINT = '/api/ride-request';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const rateLimit = checkFormRateLimit(getFormClientKey(request, ENDPOINT, clientAddress));
  if (!rateLimit.allowed) {
    const response = jsonError(429, 'Too many requests. Please wait before trying again.');
    response.headers.set('Retry-After', String(rateLimit.retryAfterSeconds));
    return response;
  }

  const parsed = await readLimitedJsonBody(request);
  if (!parsed.ok) return jsonError(parsed.status, parsed.error);

  const name = formField(parsed.body, 'name');
  const email = formField(parsed.body, 'email');
  const phone = formField(parsed.body, 'phone');
  const pickupLocation = formField(parsed.body, 'pickupLocation');
  const preferredDate = formField(parsed.body, 'preferredDate');
  const notes = formField(parsed.body, 'notes');
  const turnstileToken = formField(parsed.body, 'turnstileToken');

  // --- Validation ---
  const fields: { field: string; message: string }[] = [];

  if (name.length < 2) {
    fields.push({ field: 'name', message: 'Name is required (min 2 characters)' });
  } else if (name.length > 100) {
    fields.push({ field: 'name', message: 'Name must be 100 characters or fewer' });
  }
  if (!isValidEmail(email) || email.length > 254) {
    fields.push({ field: 'email', message: 'A valid email address is required' });
  }
  if (phone && (phone.length < 7 || phone.length > 40)) {
    fields.push({ field: 'phone', message: 'Phone must be between 7 and 40 characters' });
  }
  if (pickupLocation.length < 5) {
    fields.push({ field: 'pickupLocation', message: 'Pickup location is required (min 5 characters)' });
  } else if (pickupLocation.length > 300) {
    fields.push({ field: 'pickupLocation', message: 'Pickup location must be 300 characters or fewer' });
  }
  if (preferredDate && !isValidIsoDate(preferredDate)) {
    fields.push({ field: 'preferredDate', message: 'Preferred date must be a valid date' });
  }
  if (notes.length > 2_000) {
    fields.push({ field: 'notes', message: 'Notes must be 2000 characters or fewer' });
  }
  if (!turnstileToken) {
    fields.push({ field: 'turnstileToken', message: 'Captcha verification is required' });
  } else if (turnstileToken.length > 2_048) {
    fields.push({ field: 'turnstileToken', message: 'Captcha verification token is invalid' });
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
  const to = getFormRecipient('FORM_RECIPIENT_RIDE');
  if (!to) {
    return jsonError(503, 'This form is temporarily unavailable. Please try again later.');
  }
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
