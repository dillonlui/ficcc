---
id: S06
parent: M002
milestone: M002
provides:
  - 4 server-side API endpoints for form submissions
  - Events page with CMS-backed event data
  - Give page with donation methods
  - Contact page with 4 tabbed forms
  - Form-helpers shared module for Turnstile + Resend
requires:
  - slice: S01
    provides: BaseLayout, Hero, CSS custom properties, Header/Footer components
affects:
  - S07
key_files:
  - src/lib/form-helpers.ts
  - src/pages/api/contact.ts
  - src/pages/api/prayer-request.ts
  - src/pages/api/ride-request.ts
  - src/pages/api/connect.ts
  - src/pages/events.astro
  - src/pages/give.astro
  - src/pages/contact.astro
  - src/components/EventCard.astro
  - src/components/PrayerRequestForm.astro
  - src/components/ConnectForm.astro
key_decisions:
  - Shared form-helpers.ts module for Turnstile + Resend + JSON response utilities (D010 pattern)
  - Turnstile script loading extracted from form components into consuming pages for implicit/explicit mode separation (D016)
  - Recurring events always shown in upcoming section regardless of date
  - CONTACT_EMAIL env var with onboarding@resend.dev fallback for form submission recipient
patterns_established:
  - Form component pattern: each form component owns its fields, validation, and submit handler but not the Turnstile script tag — consuming pages control Turnstile loading mode
  - Multi-form page pattern: accessible tablist with turnstile.render/remove on tab switch for single-widget-at-a-time constraint
observability_surfaces:
  - API endpoints return structured JSON errors with field-level validation details
  - Missing env vars (TURNSTILE_SECRET_KEY, RESEND_API_KEY) return 500 with descriptive error rather than crashing
drill_down_paths:
  - .gsd/milestones/M002/slices/S06/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S06/tasks/T02-SUMMARY.md
  - .gsd/milestones/M002/slices/S06/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T14:20:42.428Z
blocker_discovered: false
---

# S06: Events, Give & Contact

**Events listing with upcoming/past split, static Give page with 3 donation methods, Contact page with 4 tabbed forms backed by server-side API endpoints with Turnstile verification and Resend email delivery**

## What Happened

Three tasks delivered the full Events, Give & Contact surface.

T01 built the server-side plumbing: a shared `src/lib/form-helpers.ts` module extracts Turnstile verification (POST to Cloudflare siteverify), Resend email sending, JSON response formatting, and email validation into reusable functions. Four API endpoints (`/api/contact`, `/api/prayer-request`, `/api/ride-request`, `/api/connect`) each parse JSON, validate fields with field-level error responses, verify Turnstile, send formatted HTML email via Resend, and return structured JSON. All use `export const prerender = false` for SSR-only execution. A `CONTACT_EMAIL` env var controls the recipient address with a fallback to `onboarding@resend.dev`.

T02 added the image field to the event Sanity schema and GROQ query, built the EventCard component with date formatting and recurring badge, created `/events` with CMS fetch (try-catch + fallback events) splitting events into upcoming and past sections, and created `/give` as a fully static page with PayPal link, check mailing address, and in-person giving instructions plus a scripture verse.

T03 created PrayerRequestForm and ConnectForm components following the established form pattern, then composed the Contact page with accessible tablist/tab/tabpanel UI. The key challenge was multi-form Turnstile management — only one widget can render at a time. Solution: extract the Turnstile script tag from form components into consuming pages. The contact page uses explicit render mode, calling `turnstile.render()` on tab switch and `turnstile.remove()` on the previous widget. This required refactoring ContactForm and RideRequestForm to remove their embedded Turnstile scripts, with corresponding updates to `/visit` and `/styleguide` pages that use those forms. Church info sidebar shows address, phone, email, and service times.

## Verification

All task-level verifications passed: file existence checks for all 12 created/modified files, `prerender = false` grep across all 4 API files, and `npm run build` succeeds with /contact/index.html, /events/index.html, and /give/index.html all pre-rendered cleanly alongside all existing pages.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Turnstile script loading was refactored out of form components into consuming pages (D016). This was unplanned but necessary — the contact page's 4-form tab UI required explicit Turnstile render mode, which conflicts with implicit mode scripts embedded in individual form components. Existing pages using those forms (visit, styleguide) were updated to load the Turnstile script themselves.

## Known Limitations

PayPal donate link uses placeholder URL (hosted_button_id=PLACEHOLDER) — church needs to supply their actual PayPal donate link.

## Follow-ups

Replace PayPal placeholder URL with church's actual PayPal donate link before launch.

## Files Created/Modified

- `src/lib/form-helpers.ts` — Shared utilities for Turnstile verification, Resend email sending, JSON response helpers, email validation
- `src/pages/api/contact.ts` — POST endpoint for general contact form — validates name/email/message, Turnstile, Resend
- `src/pages/api/prayer-request.ts` — POST endpoint for prayer requests — name/request required, email optional
- `src/pages/api/ride-request.ts` — POST endpoint for ride requests — name/email/pickupLocation required
- `src/pages/api/connect.ts` — POST endpoint for newcomer connect form — name/email required
- `src/pages/events.astro` — Events listing page with CMS fetch, fallback events, upcoming/past split
- `src/pages/give.astro` — Static Give page with PayPal, check, and in-person donation methods
- `src/pages/contact.astro` — Contact page with 4 tabbed forms, accessible tablist, centralized Turnstile management, church info sidebar
- `src/components/EventCard.astro` — Event display card with date formatting, recurring badge, optional image
- `src/components/PrayerRequestForm.astro` — Prayer request form component — name/email/request fields
- `src/components/ConnectForm.astro` — Newcomer connect form — name/email/phone/interests/message
- `src/components/ContactForm.astro` — Refactored to remove embedded Turnstile script tag — consuming page now controls loading
- `src/components/RideRequestForm.astro` — Refactored to remove embedded Turnstile script tag
- `src/pages/visit.astro` — Updated to load Turnstile script directly (after form component refactor)
- `src/pages/styleguide.astro` — Updated to load Turnstile script directly
- `sanity/schemas/documents/event.ts` — Added image field with hotspot to event schema
- `src/lib/sanity.ts` — Updated Event interface and GROQ query to include image field
