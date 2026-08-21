// /api/contact — General contact form endpoint
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
  getFormClientKey,
  checkFormRateLimit,
} from '../../lib/form-helpers';

const ENDPOINT = '/api/contact';

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
  const message = formField(parsed.body, 'message');
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
  if (message.length < 10) {
    fields.push({ field: 'message', message: 'Message is required (min 10 characters)' });
  } else if (message.length > 5_000) {
    fields.push({ field: 'message', message: 'Message must be 5000 characters or fewer' });
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
  const to = getFormRecipient('FORM_RECIPIENT_CONTACT');
  if (!to) {
    return jsonError(503, 'This form is temporarily unavailable. Please try again later.');
  }
  const ok = await sendEmail({
    to,
    subject: `New Contact Form Message from ${name}`,
    replyTo: email,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `,
  });

  if (!ok) {
    return jsonError(500, 'Unable to send your message right now. Please try again later.');
  }

  return jsonSuccess("Your message has been sent! We'll be in touch soon.");
};
