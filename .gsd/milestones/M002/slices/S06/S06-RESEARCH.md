# S06 — Research: Events, Give & Contact

**Date:** 2026-03-31

## Summary

S06 delivers three page routes (`/events`, `/give`, `/contact`) plus API endpoints for form submission. This is straightforward application of established patterns — all the building blocks exist: the event Sanity schema and `getEvents()` GROQ helper are already in place (used on homepage for featured content), ContactForm and RideRequestForm components exist with full client-side validation and Turnstile integration, and Resend is installed for email delivery. The CSP in vercel.json already allows `frame-src https://www.paypal.com` for the Give page.

The "all 4 contact forms" referenced in the roadmap are: (1) General Contact (ContactForm.astro exists), (2) Prayer Request (new, similar to ContactForm), (3) Ride Request (RideRequestForm.astro exists, currently on /visit), and (4) a newcomer/connect form. The Contact page will be the central hub hosting all four, with the existing components reused and two new form variants built following the identical pattern.

The main new work is: creating the three page files, building two new form components (PrayerRequestForm, ConnectForm), creating the API routes (`/api/contact`, `/api/prayer-request`, `/api/ride-request`, `/api/connect`) with Vercel Edge Runtime + Turnstile verification + Resend email delivery, and adding an `image` field to the event schema for richer event cards.

## Recommendation

Build in three phases: (1) API endpoints first — they're the shared dependency for all forms, (2) Events + Give pages which are simpler and have no form dependencies, (3) Contact page with all four forms wired to the API. No new Sanity singletons are needed — events are document-type content, give is a static page, and contact is a static page with forms.

## Implementation Landscape

### Key Files

- `src/lib/sanity.ts` — Already has `Event` interface and `getEvents()` helper. The query fetches all events sorted by date ascending. May want to filter to future events only via GROQ `&& date >= now()`.
- `sanity/schemas/documents/event.ts` — Existing event schema. Has title, date, endDate, time, location, description (portable text), recurring, language. Missing `image` field and `slug` field — add image for card display and slug for potential future detail pages.
- `src/components/ContactForm.astro` — Existing general contact form. Posts to `/api/contact`. Has name, email, message fields with Turnstile.
- `src/components/RideRequestForm.astro` — Existing ride request form. Posts to `/api/ride-request`. Has name, email, phone, pickup location, date, notes with Turnstile.
- `src/pages/index.astro` — Homepage already references `/events` link in featured content section. Events page will resolve this dead link.
- `src/components/Footer.astro` — Footer already has `{ label: 'Contact', href: '/contact' }` nav link. Contact page will resolve this dead link.
- `vercel.json` — CSP already includes `frame-src https://www.paypal.com` and `script-src https://challenges.cloudflare.com` for Turnstile.

### New Files

- `src/pages/events.astro` — Events listing page with upcoming events grid
- `src/pages/give.astro` — Give page with PayPal button/link and giving info
- `src/pages/contact.astro` — Contact hub with 4 tabbed/sectioned forms
- `src/components/PrayerRequestForm.astro` — New form following ContactForm pattern
- `src/components/ConnectForm.astro` — New newcomer/connect form following ContactForm pattern
- `src/components/EventCard.astro` — New event card component for events listing
- `src/pages/api/contact.ts` — API endpoint: validate, verify Turnstile, send via Resend
- `src/pages/api/prayer-request.ts` — API endpoint for prayer requests
- `src/pages/api/ride-request.ts` — API endpoint for ride requests
- `src/pages/api/connect.ts` — API endpoint for connect/newcomer form

### Build Order

1. **API endpoints first** — Create all 4 API routes with Turnstile verification + Resend email. These use `export const prerender = false` for SSR (per K005a — static + adapter enables per-page SSR). This is the riskiest part since it touches server runtime. Build one endpoint, verify it works, then replicate the pattern for the other three.
2. **Events page + EventCard** — Use existing `getEvents()` helper, build EventCard component and events listing. Low risk, follows Card.astro pattern from S01.
3. **Give page** — Simple static page with PayPal link/button, giving info, and church bank details. Lowest complexity.
4. **Contact page + new forms** — Build PrayerRequestForm and ConnectForm following ContactForm pattern. Compose contact page with all 4 forms organized in sections. Wire to API endpoints from step 1.

### Verification Approach

- `npm run build` succeeds with all new pages generating
- All 4 API endpoints are SSR (not prerendered) — verify `export const prerender = false` present in each
- No `client:*` directives on page-level components (forms use inline scripts per D010)
- EventCard, PrayerRequestForm, ConnectForm components exist and are used
- Footer `/contact` link resolves, homepage `/events` link resolves
- Form client-side validation works (required fields, email format)
- API endpoints return proper JSON responses for success and validation errors

## Constraints

- All components must be pure Astro with scoped CSS using only CSS custom properties (D010)
- CMS fetch must be wrapped in try-catch with hardcoded fallbacks (K008)
- API routes need `export const prerender = false` to opt into SSR (K005a)
- Turnstile script loaded async — already in ContactForm/RideRequestForm pattern
- Resend API key needed as `RESEND_API_KEY` env var (server-only, no PUBLIC_ prefix)
- `TURNSTILE_SECRET_KEY` needed server-side for Turnstile verification (distinct from `PUBLIC_TURNSTILE_SITE_KEY`)
- PayPal giving: use PayPal.me link or PayPal donate button — not a full checkout integration. CSP frame-src already allows it.

## Common Pitfalls

- **Multiple Turnstile widgets on one page** — If the contact page renders all 4 forms simultaneously, only one Turnstile widget renders per page by default. Solution: use tab/section UI so only one form is visible at a time, or load Turnstile in explicit render mode with per-container IDs.
- **API route SSR opt-in** — Forgetting `export const prerender = false` causes API routes to be statically rendered at build time, returning stale HTML instead of JSON. Every API file needs this export.
- **Resend sender domain** — Resend requires a verified sender domain or uses `onboarding@resend.dev` for testing. The API endpoint should use a configurable `FROM_EMAIL` env var with a sensible default.
- **Event date filtering** — `getEvents()` currently returns ALL events including past ones. The events page should filter to upcoming events (or show past events in a separate section). GROQ filter `&& date >= now()` works at query level, or filter client-side.

## Open Risks

- No `RESEND_API_KEY` or `TURNSTILE_SECRET_KEY` env vars are configured yet. API endpoints will need these at runtime. Build-time verification can confirm the routes exist but can't test actual email delivery without secrets.
- The "4 forms" count is inferred from roadmap context — general contact, prayer request, ride request, and newcomer/connect. If the intent was different (e.g. baptism request, event RSVP), the planner should adjust. The form pattern is identical regardless.
