---
id: S05
parent: M001
milestone: M001
provides:
  - Contact form API endpoint at /api/contact
  - Turnstile CAPTCHA integration pattern
  - robots.txt and sitemap-index.xml for SEO
  - HSTS and complete security header set in vercel.json
requires:
  []
affects:
  - S06
key_files:
  - api/contact.ts
  - src/components/ContactForm.astro
  - public/robots.txt
  - vercel.json
  - package.json
key_decisions:
  - D012: Contact form uses Vercel Edge Runtime with Turnstile CAPTCHA and Resend email delivery
  - D013: HSTS set to 2-year max-age with includeSubDomains and preload per OWASP
patterns_established:
  - Vercel Edge Runtime with web-standard Request/Response for serverless API endpoints
  - Structured JSON error responses with field-level errors array for form validation
  - Console-based observability with [contact] prefix for serverless log filtering
observability_surfaces:
  - Console logs with [contact] prefix in api/contact.ts for Vercel serverless log filtering
  - Descriptive error messages when env vars are missing (graceful degradation)
drill_down_paths:
  - .gsd/milestones/M001/slices/S05/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S05/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T01:54:03.291Z
blocker_discovered: false
---

# S05: Forms, SEO & Security Infrastructure

**Contact form with Turnstile CAPTCHA and Resend email delivery, robots.txt, sitemap, and HSTS security header — infrastructure layer complete for page-building milestones.**

## What Happened

Two tasks shipped the remaining infrastructure layer.

**T01 — Contact form API and UI.** Created `api/contact.ts` as a Vercel Edge Runtime function handling POST requests with input validation (name, email, message — all required, email format check), server-side Turnstile token verification against Cloudflare's siteverify API, and email delivery via Resend SDK. Returns structured JSON with field-level errors array for rich client feedback. Updated `ContactForm.astro` with the Cloudflare Turnstile widget (loaded from challenges.cloudflare.com), client-side fetch submission to `/api/contact`, and three UI states: loading spinner, success confirmation, and field-level/general error display. The form does client-side validation before submission. Console-based observability with `[contact]` prefix for serverless log filtering.

**T02 — SEO files and security hardening.** Created `public/robots.txt` allowing all crawlers with absolute Sitemap URL pointing to `https://ficcc.org/sitemap-index.xml`. Verified `@astrojs/sitemap` generates `dist/sitemap-index.xml` at build time. Added `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` to vercel.json global headers (2-year HSTS per OWASP best practice). Existing CSP already covers the new `/api/contact` endpoint via `connect-src 'self'`. All 6 Lighthouse CI runs pass assertion thresholds across both tested URLs.

## Verification

All slice-level verification checks pass:
- `npm run build` exits 0, producing 3 static pages and sitemap-index.xml
- `api/contact.ts` exists with Edge Runtime config
- `ContactForm.astro` includes Turnstile widget integration
- `package.json` includes resend dependency
- `public/robots.txt` exists with absolute Sitemap directive
- `dist/sitemap-index.xml` generated with valid XML
- `vercel.json` includes Strict-Transport-Security header
- Lighthouse CI passes all thresholds (performance, accessibility, SEO, best-practices) for / and /styleguide/

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

T01 initially used VercelRequest/VercelResponse (Node.js runtime) but was corrected to web-standard Request/Response for Edge Runtime as specified in the plan.

## Known Limitations

- Contact form requires TURNSTILE_SECRET_KEY, RESEND_API_KEY, and PUBLIC_TURNSTILE_SITE_KEY environment variables configured in Vercel for production — without them the API returns descriptive error messages rather than crashing.
- No rate limiting beyond Turnstile's built-in bot protection.
- Form recipient email is configured via CONTACT_TO_EMAIL env var (not yet set in production).

## Follow-ups

- Set TURNSTILE_SECRET_KEY, RESEND_API_KEY, PUBLIC_TURNSTILE_SITE_KEY, and CONTACT_TO_EMAIL in Vercel environment variables before production launch.
- Consider HSTS preload list submission once domain is confirmed stable on HTTPS.

## Files Created/Modified

- `api/contact.ts` — New Vercel Edge Runtime function — validates form input, verifies Turnstile token, sends email via Resend
- `src/components/ContactForm.astro` — Added Turnstile widget, fetch-based submission, loading/success/error UI states
- `public/robots.txt` — New file — allows all crawlers, absolute Sitemap URL
- `vercel.json` — Added Strict-Transport-Security header to global headers
- `package.json` — Added resend dependency
