---
id: S01
parent: M002
milestone: M002
provides:
  - homePage Sanity singleton schema with hero/service-times/mosaic/pillars/next-steps fields
  - getHomePage() GROQ helper for fetching homepage content by language
  - urlForImage() helper for resolving Sanity image refs to CDN URLs
  - ServiceTimes, Pillars, NextSteps reusable Astro components
  - Composed homepage at index.astro with all six sections
requires:
  []
affects:
  - S02
  - S03
  - S04
  - S05
  - S06
key_files:
  - sanity/schemas/singletons/homePage.ts
  - sanity/schemas/index.ts
  - src/lib/sanity.ts
  - src/components/ServiceTimes.astro
  - src/components/Pillars.astro
  - src/components/NextSteps.astro
  - src/pages/index.astro
  - public/images/hero-placeholder.svg
key_decisions:
  - urlForImage accepts optional width/format params for responsive image sizing
  - Wrapped CMS fetch calls in try-catch with Promise.all for graceful fallback when Sanity is unreachable
  - Used SVG placeholders instead of JPEG since ImageMagick unavailable
patterns_established:
  - Homepage section components are pure Astro with scoped CSS using only CSS custom properties — no client:* directives
  - CMS-editable content with hardcoded fallbacks: fetch from Sanity first, fall back to static content when CMS returns null or is unreachable
  - homePage singleton pattern: per-language documents with IDs like homePage-en, matching siteSettings pattern
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M002/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S01/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T13:20:24.288Z
blocker_discovered: false
---

# S01: Homepage

**Full homepage with hero, service times, photo mosaic, pillars, featured content, and next-steps cards — all CMS-editable via Sanity homePage singleton with hardcoded fallbacks for empty CMS state**

## What Happened

Two tasks delivered the complete homepage. T01 created the homePage Sanity singleton schema following the established siteSettings pattern, registered it in the schema index (exports, singletonTypes, singletonDocIds for EN/ZH), and added TypeScript interfaces plus getHomePage() and urlForImage() helpers to the data layer. T02 built three new section-level Astro components (ServiceTimes, Pillars, NextSteps) — all pure Astro with scoped CSS using only CSS custom properties from global.css, no client:* directives. The full homepage was composed in index.astro with Hero → ServiceTimes → ImageMosaic → Pillars → Featured Content (latest sermon + next event) → NextSteps section order. CMS data is fetched via Promise.all wrapped in try-catch so the build succeeds with hardcoded fallback content when Sanity is unreachable. SVG placeholders were created for development since ImageMagick was unavailable.

## Verification

All slice verification checks passed: (1) homePage schema file exists, (2) homePage registered in schema index, (3) getHomePage helper present in sanity.ts, (4) urlForImage helper present in sanity.ts, (5) npm run build succeeds — 4 pages built in 7.04s, (6) all three components (ServiceTimes, Pillars, NextSteps) present in index.astro, (7) no client: directives in any new component. Visual verification confirmed all sections render with proper responsive behavior at 375px mobile and 1280px desktop breakpoints.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

SVG placeholders used instead of JPEG since ImageMagick was unavailable. Try-catch added around CMS fetching to handle placeholder Sanity project ID during build.

## Known Limitations

Placeholder images are SVGs — production will need real photography from the church. Featured content section shows hardcoded fallback since no sermons or events exist in Sanity yet.

## Follow-ups

None.

## Files Created/Modified

- `sanity/schemas/singletons/homePage.ts` — New homePage singleton schema with hero, service times, mosaic, pillars, and next-steps fields
- `sanity/schemas/index.ts` — Registered homePage in schema types, singleton types, and singleton doc IDs
- `src/lib/sanity.ts` — Added HomePage interface, getHomePage() GROQ helper, urlForImage() helper
- `src/components/ServiceTimes.astro` — New component rendering service schedule in responsive horizontal/vertical layout
- `src/components/Pillars.astro` — New component rendering church values in responsive 3-column grid
- `src/components/NextSteps.astro` — New component rendering CTA cards using Card.astro
- `src/pages/index.astro` — Composed full homepage with all six sections, CMS data wiring, and hardcoded fallbacks
- `public/images/hero-placeholder.svg` — SVG placeholder for hero image during development
