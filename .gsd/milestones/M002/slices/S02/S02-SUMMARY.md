---
id: S02
parent: M002
milestone: M002
provides:
  - aboutPage singleton schema and GROQ helpers for Who We Are, Beliefs, and Staff content
  - portableTextToHtml() utility for server-side Portable Text rendering
  - StaffCard component reusable for any person grid
  - Enhanced Accordion component that renders HTML content
requires:
  - slice: S01
    provides: BaseLayout, Accordion component, Card component, design tokens, CMS fetch pattern
affects:
  - S07
key_files:
  - sanity/schemas/singletons/aboutPage.ts
  - sanity/schemas/index.ts
  - src/lib/sanity.ts
  - src/components/Accordion.astro
  - src/components/StaffCard.astro
  - src/pages/about/index.astro
  - src/pages/about/beliefs.astro
  - src/pages/about/staff.astro
key_decisions:
  - Accordion uses set:html on a div — non-breaking for plain-text consumers while enabling rich HTML
  - portableTextToHtml handles block/normal with strong/em/link marks and escapes HTML server-side
  - StaffCard placeholder uses SVG person silhouette on CSS gradient rather than blank space
  - Desk structure uses singletonDocIds dynamically so no manual structure.ts edits needed for new singletons
patterns_established:
  - CMS singleton + GROQ helper + try-catch fallback pattern now proven for multi-field singletons (aboutPage joins homePage)
  - portableTextToHtml() enables server-side Portable Text rendering without any client-side library
  - Accordion component now accepts both plain text and HTML content strings
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M002/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S02/tasks/T02-SUMMARY.md
  - .gsd/milestones/M002/slices/S02/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T13:32:21.449Z
blocker_discovered: false
---

# S02: About / Beliefs / Staff

**Delivered three identity pages — About (Who We Are), Beliefs accordion, and Staff grid — all CMS-editable via aboutPage singleton with hardcoded fallbacks, plus a server-side portableTextToHtml utility and enhanced Accordion component.**

## What Happened

Three tasks built the About section end-to-end. T01 created the aboutPage Sanity singleton schema with whoWeAre, beliefs, and staffOrder fields, registered it in the schema index (EN/ZH singleton IDs), added getAboutPage()/getStaff() GROQ helpers and a portableTextToHtml() server-side Portable Text renderer to sanity.ts. The desk structure required no manual edits since it already maps singletonDocIds dynamically.

T02 modified the Accordion component to render content via set:html instead of text interpolation — a non-breaking change that enables rich HTML while keeping plain-text consumers working. Created the /about page with a responsive two-column layout (narrative text + optional CMS image) and the /about/beliefs page with intro text and an 8-belief accordion using standard evangelical doctrinal statements as fallbacks. Both pages fetch from getAboutPage() with try-catch.

T03 built StaffCard.astro with a 1:1 aspect-ratio photo container, name, role, and an SVG person silhouette placeholder for missing photos. The /about/staff page uses a responsive CSS Grid (1→2→3 columns) with four realistic fallback staff entries. All three pages are pure Astro with zero client:* directives.

## Verification

All file existence checks pass. No client:* directives in any about page or StaffCard component. set:html confirmed in Accordion.astro. All GROQ helpers (getAboutPage, getStaff, portableTextToHtml) confirmed in sanity.ts. npm run build succeeds — all three pages generate: /about/index.html, /about/beliefs/index.html, /about/staff/index.html.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Desk structure required no manual edits to structure.ts — it already iterates singletonDocIds dynamically, which was discovered during T01 execution.

## Known Limitations

Staff ordering from CMS uses staffOrder references, but without CMS content populated the fallback uses a hardcoded array. Bio text on StaffCard is not displayed — only name and role appear on the card (bio could be added in a detail view later).

## Follow-ups

None.

## Files Created/Modified

- `sanity/schemas/singletons/aboutPage.ts` — New aboutPage singleton schema with whoWeAre, beliefs, staffOrder fields
- `sanity/schemas/index.ts` — Registered aboutPage in schemaTypes, singletonTypes, singletonDocIds
- `src/lib/sanity.ts` — Added AboutPage/Person interfaces, getAboutPage()/getStaff() helpers, portableTextToHtml() utility
- `src/components/Accordion.astro` — Changed content rendering from text interpolation to set:html, added :global() CSS for rich HTML
- `src/components/StaffCard.astro` — New component with 1:1 photo container, name, role, SVG placeholder
- `src/pages/about/index.astro` — New Who We Are page with two-column layout, CMS fetch + fallback
- `src/pages/about/beliefs.astro` — New Beliefs page with 8-belief accordion, CMS fetch + fallback
- `src/pages/about/staff.astro` — New Staff page with responsive 1/2/3-column grid, CMS fetch + fallback
