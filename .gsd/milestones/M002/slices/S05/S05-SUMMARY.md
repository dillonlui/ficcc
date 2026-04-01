---
id: S05
parent: M002
milestone: M002
provides:
  - MinistryCard component reusable for any ministry listing
  - getMinistryBySlug() GROQ helper with leader dereference
  - /ministries hub and /ministries/[slug] routes
requires:
  - slice: S01
    provides: Shared components (Hero, Card), BaseLayout, design tokens, sanity.ts data layer
affects:
  - S06
  - S07
key_files:
  - sanity/schemas/documents/ministry.ts
  - src/lib/sanity.ts
  - src/components/MinistryCard.astro
  - src/pages/ministries/index.astro
  - src/pages/ministries/[slug].astro
key_decisions:
  - MinistryDetail uses Omit<Ministry, 'leader'> to replace raw ref with resolved object type
  - Detail page fetches in page body (not getStaticPaths props) to get resolved leader via getMinistryBySlug
  - Redirect to /ministries when slug not found rather than 404
patterns_established:
  - Ministry hub+detail follows same pattern as sermons: hub with card grid, detail with getStaticPaths and GROQ slug helper
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M002/slices/S05/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S05/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T14:02:08.815Z
blocker_discovered: false
---

# S05: Community & Ministries

**Community hub at /ministries with responsive card grid and /ministries/[slug] detail pages with leader info, meeting time, and portable text description**

## What Happened

Extended the Sanity ministry schema with slug (required, sourced from name) and image (hotspot-enabled) fields. Created MinistryDetail interface using Omit to replace the raw leader reference with a resolved object containing name, role, and photo. Added getMinistryBySlug() GROQ helper with leader dereference projection.

Built three new files: MinistryCard.astro wraps the shared Card component with meeting time display, ministries/index.astro is a hub page with Hero and responsive 3→2→1 card grid following the established sermons pattern, and ministries/[slug].astro is a detail page using getStaticPaths with leader photo/name/role, meeting time, and portable text description rendered server-side via set:html. All styles use CSS custom properties only, no client directives — fully static.

## Verification

npm run build succeeds (10 pages, 7.4s) and generates /ministries/index.html. No client: directives in any new files. getMinistryBySlug helper and slug field confirmed present. tsc --noEmit shows only pre-existing sanity config errors, no new type errors.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Detail page fetches MinistryDetail in page body via getMinistryBySlug() rather than passing through getStaticPaths props, to get the fully resolved leader reference. Minor structural change, same end result.

## Known Limitations

No ministry content seeded in Sanity yet — pages render with fallback/empty states until content is added. Ministry detail pages redirect to /ministries hub when slug not found rather than showing 404.

## Follow-ups

None.

## Files Created/Modified

- `sanity/schemas/documents/ministry.ts` — Added slug and image fields to ministry schema
- `src/lib/sanity.ts` — Added MinistryDetail interface and getMinistryBySlug() GROQ helper
- `src/components/MinistryCard.astro` — New component wrapping Card.astro with meeting time display
- `src/pages/ministries/index.astro` — New hub page with Hero and responsive ministry card grid
- `src/pages/ministries/[slug].astro` — New detail page with leader info, meeting time, portable text description
