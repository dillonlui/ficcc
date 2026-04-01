---
estimated_steps: 8
estimated_files: 4
skills_used: []
---

# T01: Build contact form API endpoint with Turnstile verification and Resend email delivery

Create the Vercel serverless function at api/contact.ts that handles form submissions. Install the resend package. The function must: (1) parse and validate form fields (name, email, message — all required, email format check), (2) verify the Turnstile token via Cloudflare's siteverify API, (3) send email via Resend SDK to a configured recipient, (4) return structured JSON responses with appropriate status codes. Then update ContactForm.astro to include the Cloudflare Turnstile widget (using PUBLIC_TURNSTILE_SITE_KEY from env), add client-side JavaScript for form submission via fetch to /api/contact, and implement loading/success/error UI states. The form JS should do client-side validation before submission, show a spinner during submit, display success confirmation, and show field-level or general error messages on failure.

Key constraints:
- Use Vercel Edge Runtime for fast cold starts (export const config = { runtime: 'edge' })
- Turnstile verification is server-side only — secret key never reaches client
- CSP in vercel.json already allows challenges.cloudflare.com for script-src and frame-src, and connect-src 'self' covers /api/contact
- Rate limiting is not in scope — Turnstile provides sufficient spam protection
- The Turnstile widget script must be loaded from https://challenges.cloudflare.com/turnstile/v0/api.js
- For dev/test without real keys, the API should return clear error messages about missing env vars rather than crashing

## Inputs

- ``src/components/ContactForm.astro` — existing styled form component with name/email/message fields, no submission handler`
- ``.env.example` — already defines RESEND_API_KEY, PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY`
- ``vercel.json` — CSP already allows challenges.cloudflare.com and connect-src 'self'`
- ``package.json` — current dependencies, needs resend added`

## Expected Output

- ``api/contact.ts` — Vercel Edge serverless function with input validation, Turnstile verification, Resend email delivery`
- ``src/components/ContactForm.astro` — updated with Turnstile widget, client-side fetch submission, loading/success/error states`
- ``package.json` — resend dependency added`

## Verification

npm run build && test -f api/contact.ts && grep -q 'turnstile' src/components/ContactForm.astro && grep -q 'resend' package.json
