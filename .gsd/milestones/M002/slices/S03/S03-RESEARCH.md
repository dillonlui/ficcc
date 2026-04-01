# S03 — Research: Sundays / Plan a Visit

**Date:** 2026-03-31

## Summary

S03 delivers a "Plan a Visit" page that answers every first-time visitor question: what to expect on Sundays, service schedule, transportation/parking/directions, an FAQ accordion, and a ride request form. This is straightforward application of established patterns — the singleton schema + GROQ helper + try-catch fallback flow is proven across S01 (homePage) and S02 (aboutPage). The existing Accordion component handles FAQ content. The ContactForm pattern provides a template for the ride request form.

No new technology, no risky integration. The page is a single Astro page at `/visit` (or `/sundays`) composed from existing components plus one new Sanity singleton for CMS-editable content.

## Recommendation

Build a `visitPage` Sanity singleton following the homePage/aboutPage pattern, create a single `/visit` page route, and adapt the existing ContactForm into a lightweight RideRequestForm. Use the Accordion for FAQs. All content should have hardcoded fallbacks matching the church's real details (429 Mitchell Street, 9:45 AM Sunday gathering, etc.).

One page file, one schema, one form component, one GROQ helper — minimal surface area.

## Implementation Landscape

### Key Files

- `sanity/schemas/singletons/visitPage.ts` — **New.** Singleton schema with fields: heroImage, heroTitle, heroSubtitle, whatToExpect (portable text), schedule (array of {label, time, description}), transportation (portable text), faqItems (array of {question, answer}), rideRequestEnabled (boolean).
- `sanity/schemas/index.ts` — Register visitPage in schemaTypes, singletonTypes, singletonDocIds (visitPage-en, visitPage-zh).
- `src/lib/sanity.ts` — Add `VisitPage` interface and `getVisitPage()` GROQ helper following getHomePage/getAboutPage pattern.
- `src/pages/visit.astro` — **New.** Main Plan a Visit page composed with Hero, schedule section, what-to-expect section, transportation/directions section, FAQ accordion, and ride request form.
- `src/components/RideRequestForm.astro` — **New.** Lightweight form adapted from ContactForm pattern. Fields: name, email, phone (optional), pickup location, date preference. Uses the same inline `<script is:inline>` validation + fetch pattern as ContactForm. Posts to `/api/ride-request` or could reuse `/api/contact` with a `type` field.
- `src/components/Accordion.astro` — **Existing.** Already supports HTML content via `set:html`. Use as-is for FAQ items.
- `src/components/Hero.astro` — **Existing.** Reuse for page hero.
- `src/components/ServiceTimes.astro` — **Existing.** Could reuse for the schedule section, or build a slightly richer variant with descriptions per time slot.

### Build Order

1. **Schema + data layer first** (T01): Create visitPage singleton schema, register it, add interface + GROQ helper. This is the foundation — quick to build, quick to verify (`npm run build` still passes).
2. **Page layout + static sections** (T02): Build `/visit` page with Hero, schedule, what-to-expect, transportation, and FAQ accordion — all with hardcoded fallbacks wired to CMS data. This is the bulk of the user-facing work.
3. **Ride request form** (T03): Build RideRequestForm component and integrate into the visit page. This is isolated — it can be built last without affecting the rest of the page.

### Verification Approach

- `npm run build` succeeds with all pages (including `/visit`) generating
- No `client:*` directives on any new component except potentially the form's Turnstile widget
- visitPage schema file exists, is registered in schema index
- getVisitPage helper present in sanity.ts
- Visual verification: page renders with all sections at mobile (375px) and desktop (1280px)
- Form validation works (client-side only — no API endpoint in this slice unless ContactForm's endpoint can be reused with a type discriminator)

## Constraints

- All components must be pure Astro with scoped CSS using only CSS custom properties from global.css (D010).
- CMS fetch must be wrapped in try-catch with hardcoded fallbacks (K008).
- No new CSS files — use scoped `<style>` blocks per component.
- The ride request form needs a server endpoint. Options: (a) reuse `/api/contact` with an additional `type` field, (b) create `/api/ride-request`. Decision deferred to planner — either works. If no API endpoint exists yet, the form can submit to a mailto: link or be a static form that's wired up in S06 when the full contact infrastructure is built.

## Common Pitfalls

- **Over-engineering the schedule section** — ServiceTimes component already exists from S01. Evaluate whether to reuse it or build a richer variant. Don't duplicate if the existing one works.
- **Ride form API scope creep** — The roadmap says "ride request form" but S06 is where all 4 contact forms land. The form UI should be built here, but the API endpoint might belong to S06 if it shares the contact API infrastructure. Keep the form functional with client-side validation; wire the backend in S06 if needed.
