---
id: S03
parent: M002
milestone: M002
provides:
  - Visit page at /visit with all sections
  - visitPage Sanity singleton schema (EN+ZH)
  - RideRequestForm component
  - getVisitPage() GROQ helper
requires:
  - slice: S01
    provides: Hero component, BaseLayout, Accordion component, global CSS custom properties, CMS fetch pattern with try-catch fallbacks
affects:
  - S06
key_files:
  - sanity/schemas/singletons/visitPage.ts
  - sanity/schemas/index.ts
  - src/lib/sanity.ts
  - src/pages/visit.astro
  - src/components/RideRequestForm.astro
key_decisions:
  - Built schedule as custom card grid rather than reusing ServiceTimes component — schedule items need a description field that ServiceTimes doesn't support
  - Embedded Google Maps iframe in transportation section for directions
  - RideRequestForm follows ContactForm pattern exactly: BEM CSS, Turnstile widget, inline script validation, fetch submission
patterns_established:
  - visitPage singleton schema pattern with portable text + array-of-objects fields — reusable for future page singletons
  - Conditional form rendering based on CMS boolean field (rideRequestEnabled)
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M002/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M002/slices/S03/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T13:45:18.223Z
blocker_discovered: false
---

# S03: Sundays / Plan a Visit

**Plan a Visit page at /visit with CMS-editable hero, Sunday schedule cards, what-to-expect, transportation with embedded map, 6-question FAQ accordion, and ride request form with Turnstile captcha — all with hardcoded fallbacks**

## What Happened

Three tasks delivered the full Plan a Visit experience. T01 created the visitPage Sanity singleton schema with all required fields (heroImage, heroTitle, heroSubtitle, whatToExpect portable text, schedule array, transportation portable text, faqItems array, rideRequestEnabled boolean, language), registered it in the schema index with EN+ZH singleton document IDs, and added the VisitPage/ScheduleItem/FaqItem TypeScript interfaces plus getVisitPage() GROQ helper to the data layer.

T02 built the /visit page itself with five content sections: Hero (reused component), Schedule (custom card grid with time + label + description — deliberately not reusing ServiceTimes since schedule items need a description field), What to Expect (portable text or fallback HTML), Getting Here (two-column layout with transportation text and embedded Google Maps iframe), and FAQ (6 visitor questions rendered via the existing Accordion component). CMS fetch uses try-catch with complete hardcoded fallbacks per K008.

T03 added the RideRequestForm component following the ContactForm pattern — 6 fields (name, email, phone, pickup location, date, notes), client-side validation for required fields, Cloudflare Turnstile widget, and fetch-based submission to /api/ride-request. Integrated into the visit page as a conditional "Need a Ride?" section controlled by the rideRequestEnabled CMS field. No client: directives — all interactivity via inline script.

## Verification

All slice-level verification checks pass: visitPage schema file exists, registered in schema index (schemaTypes, singletonTypes, singletonDocIds), VisitPage interface and getVisitPage() helper present in sanity.ts, visit.astro exists with Accordion and getVisitPage imports, RideRequestForm component exists with Turnstile integration, no client: directives on either file, npm run build exits 0 with /visit in generated output (8 pages total).

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

T02 switched two FAQ answer strings from single quotes to backtick template literals to handle curly apostrophes. No other deviations.

## Known Limitations

/api/ride-request endpoint does not exist yet — form submission will 404 with a user-friendly error message. This is consistent with the ContactForm pattern and will be wired up in a future slice (S06).

## Follow-ups

Wire up /api/ride-request endpoint (same pattern as /api/contact) when building S06 Events, Give & Contact.

## Files Created/Modified

- `sanity/schemas/singletons/visitPage.ts` — New visitPage singleton schema with hero, schedule, whatToExpect, transportation, FAQ, and rideRequest fields
- `sanity/schemas/index.ts` — Registered visitPage in exports, imports, schemaTypes, singletonTypes, and singletonDocIds (EN+ZH)
- `src/lib/sanity.ts` — Added VisitPage, ScheduleItem, FaqItem interfaces and getVisitPage() GROQ helper
- `src/pages/visit.astro` — New Plan a Visit page with Hero, Schedule, What to Expect, Getting Here, FAQ, and Ride Request sections
- `src/components/RideRequestForm.astro` — New ride request form with 6 fields, client-side validation, Turnstile captcha, fetch submission
