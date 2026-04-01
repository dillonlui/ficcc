# S05: Forms, SEO & Security Infrastructure — UAT

**Milestone:** M001
**Written:** 2026-04-01T01:54:03.292Z

# S05: Forms, SEO & Security Infrastructure — UAT

**Milestone:** M001
**Written:** 2026-03-31

## UAT Type

- UAT mode: mixed (artifact-driven for SEO/security files, live-runtime for form submission)
- Why this mode is sufficient: SEO files and security headers are static config verified at build time. Form submission requires live Vercel deployment with env vars to fully test.

## Preconditions

- `npm run build` completes successfully
- For form testing: deploy to Vercel preview with TURNSTILE_SECRET_KEY, RESEND_API_KEY, PUBLIC_TURNSTILE_SITE_KEY, and CONTACT_TO_EMAIL set

## Smoke Test

Run `npm run build` — should exit 0, produce `dist/sitemap-index.xml`, and show no errors.

## Test Cases

### 1. Contact form renders with Turnstile widget

1. Open the page containing ContactForm in a browser (preview deploy or local dev)
2. Scroll to the contact form section
3. **Expected:** Form shows Name, Email, Message fields and a Cloudflare Turnstile challenge widget. Submit button is present.

### 2. Contact form validates required fields client-side

1. Leave all fields empty
2. Click Submit
3. **Expected:** Browser native validation prevents submission, highlights required fields

### 3. Contact form submits successfully (requires live deploy)

1. Fill in Name: "Test User", Email: "test@example.com", Message: "Test message"
2. Complete the Turnstile challenge
3. Click Submit
4. **Expected:** Spinner appears during submission. On success, a green confirmation message appears. Email arrives at the configured CONTACT_TO_EMAIL address.

### 4. Contact form shows server errors gracefully

1. Submit form with valid data but with an invalid RESEND_API_KEY configured
2. **Expected:** A red error banner appears with a user-friendly message (not a stack trace)

### 5. robots.txt is correct

1. Run `cat public/robots.txt`
2. **Expected:** Contains `User-agent: *`, `Allow: /`, and `Sitemap: https://ficcc.org/sitemap-index.xml`

### 6. Sitemap generates at build time

1. Run `npm run build`
2. Check `dist/sitemap-index.xml`
3. **Expected:** Valid XML file exists with sitemap entries for all public pages

### 7. Security headers in vercel.json

1. Open `vercel.json` and inspect the headers array
2. **Expected:** Contains Strict-Transport-Security with `max-age=63072000; includeSubDomains; preload`. Also contains existing CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy headers.

### 8. Lighthouse CI passes

1. Run `npm run build && npm run lhci`
2. **Expected:** All 6 assertion runs pass. Performance ≥ 0.75 for /, ≥ 0.50 for /styleguide/. Accessibility, SEO, and best-practices thresholds met.

## Edge Cases

### Missing environment variables

1. Remove TURNSTILE_SECRET_KEY from environment
2. Submit the contact form
3. **Expected:** API returns a descriptive JSON error about missing configuration, not a 500 crash

### Invalid email format

1. Enter "not-an-email" in the Email field
2. **Expected:** Browser validation (type=email) rejects submission before it reaches the server

### Empty Turnstile token

1. Submit form without completing the Turnstile challenge (if possible via JS manipulation)
2. **Expected:** Server returns 400 error indicating Turnstile verification failed

## Failure Signals

- `npm run build` fails or does not produce `dist/sitemap-index.xml`
- Contact form shows no Turnstile widget (script blocked or site key wrong)
- Form submission returns 500 or shows raw error text instead of styled error banner
- `robots.txt` missing or has relative Sitemap URL
- Lighthouse CI run fails thresholds
- `vercel.json` missing Strict-Transport-Security header

## Not Proven By This UAT

- Actual email delivery to real recipients (requires production Resend API key)
- HSTS preload list submission
- Form behavior under high traffic / DDoS conditions
- Turnstile widget rendering across all browsers and devices

## Notes for Tester

- Form testing on localhost will show missing env var errors — this is expected. Use a Vercel preview deploy with secrets configured for end-to-end testing.
- The Turnstile widget may show as a simple checkbox or invisible challenge depending on Cloudflare's risk assessment.
- HSTS preload requires the domain to be submitted to hstspreload.org separately — the header alone enables the policy but doesn't add to browser preload lists.
