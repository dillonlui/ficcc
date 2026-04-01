---
estimated_steps: 26
estimated_files: 5
skills_used: []
---

# T01: Create all 4 API endpoints with Turnstile verification and Resend email delivery

Build the 4 server-side API routes that all contact forms POST to. Each endpoint: parses JSON body, validates required fields, verifies Turnstile token against Cloudflare API, sends email via Resend, returns structured JSON response. This is the riskiest piece of the slice since it touches SSR runtime, external APIs, and server-only secrets.

Create a shared helper (`src/lib/form-helpers.ts`) to avoid duplicating Turnstile verification and Resend send logic across 4 endpoints. Each endpoint validates its own fields but shares the verification/send plumbing.

### Steps

1. Create `src/lib/form-helpers.ts` with:
   - `verifyTurnstile(token: string): Promise<boolean>` — POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with `TURNSTILE_SECRET_KEY`
   - `sendEmail(options: { to: string, subject: string, html: string, replyTo?: string }): Promise<boolean>` — use Resend SDK with `RESEND_API_KEY`, sender from `FROM_EMAIL` env var defaulting to `onboarding@resend.dev`
   - `jsonError(status, error, fields?): Response` and `jsonSuccess(message): Response` helpers

2. Create `src/pages/api/contact.ts`:
   - `export const prerender = false`
   - POST handler: validate name (min 2), email (regex), message (min 10), turnstileToken
   - Verify Turnstile, send email with form contents, return JSON response

3. Create `src/pages/api/prayer-request.ts`:
   - Same structure. Fields: name (required), email (optional), request (required, min 10), turnstileToken
   - Email subject: 'New Prayer Request from [name]'

4. Create `src/pages/api/ride-request.ts`:
   - Same structure. Fields: name (required), email (required), phone (optional), pickupLocation (required, min 5), preferredDate (optional), notes (optional), turnstileToken
   - Email subject: 'New Ride Request from [name]'

5. Create `src/pages/api/connect.ts`:
   - Same structure. Fields: name (required), email (required), phone (optional), interests (optional string), message (optional), turnstileToken
   - Email subject: 'New Connection Request from [name]'

### Constraints
- All API files need `export const prerender = false` (K005a)
- Use `import.meta.env.TURNSTILE_SECRET_KEY` and `import.meta.env.RESEND_API_KEY` (no PUBLIC_ prefix)
- Return proper Content-Type: application/json
- Handle missing env vars gracefully — return 500 with descriptive error, don't crash
- Match the error response shape ContactForm.astro expects: `{ error: string, fields?: [{field, message}] }` for errors, `{ success: true, message: string }` for success

## Inputs

- ``src/components/ContactForm.astro` — reference for expected request/response shape`
- ``src/components/RideRequestForm.astro` — reference for ride request field names`
- ``package.json` — resend dependency already installed`

## Expected Output

- ``src/lib/form-helpers.ts` — shared Turnstile verification + Resend email helpers`
- ``src/pages/api/contact.ts` — general contact form API endpoint`
- ``src/pages/api/prayer-request.ts` — prayer request form API endpoint`
- ``src/pages/api/ride-request.ts` — ride request form API endpoint`
- ``src/pages/api/connect.ts` — newcomer connect form API endpoint`

## Verification

grep -q 'prerender = false' src/pages/api/contact.ts src/pages/api/prayer-request.ts src/pages/api/ride-request.ts src/pages/api/connect.ts && test -f src/lib/form-helpers.ts && npm run build
