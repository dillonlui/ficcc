---
id: S04
parent: M002
milestone: M002
provides:
  - SermonCard.astro component
  - YouTubeEmbed.astro component
  - getSermonBySlug() GROQ helper
  - Sermon slug field in schema
  - /sermons listing page
  - /sermons/[slug] detail pages
requires:
  - slice: S01
    provides: BaseLayout, Hero, shared CSS custom properties
affects:
  - S07
key_files:
  - sanity/schemas/documents/sermon.ts
  - src/lib/sanity.ts
  - src/components/SermonCard.astro
  - src/components/YouTubeEmbed.astro
  - src/pages/sermons/index.astro
  - src/pages/sermons/[slug].astro
key_decisions:
  - Used color-mix() for series badge background tint
  - Wrapped sermon cards in grid-item divs with data-series for filter toggling rather than applying hidden directly to SermonCard
  - Used getSermons() in getStaticPaths passing full sermon as props to avoid double-fetch
patterns_established:
  - Series pill filter pattern: inline script toggling hidden on wrapper divs via data-* attributes — reusable for any client-side filter without framework JS
  - Slug-based detail page pattern: getStaticPaths fetches all items, passes full object as props
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M002/slices/S04/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S04/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T13:54:00.474Z
blocker_discovered: false
---

# S04: Sermons Library

**Sermon listing with series pill filter at /sermons and detail pages at /sermons/[slug] with metadata grid and conditional YouTube embed**

## What Happened

Extended the Sanity sermon schema with a required slug field (source: title), updated the Sermon TypeScript interface, modified getSermons() to include slug in its GROQ projection, and added a getSermonBySlug() helper for single-sermon fetches by slug + language.

Built two reusable components: SermonCard.astro (series badge using color-mix() tint, formatted date, speaker, scripture, data-series attribute for filter targeting) and YouTubeEmbed.astro (responsive 16:9 iframe wrapper, youtube-nocookie.com, lazy loading). Both are pure Astro with scoped CSS and no client:* directives.

Created the /sermons listing page with Hero, centered pill-style series filter bar (All + per-series buttons), and a responsive 3/2/1 column card grid. Filtering uses an inline script that toggles hidden attributes on grid-item wrapper divs based on data-series match — zero framework JS. Empty CMS state renders a fallback message.

Created the /sermons/[slug] detail page using getStaticPaths() with full sermon data passed as props (avoiding double-fetch). Shows a metadata grid (speaker, date, scripture, series), conditionally renders YouTubeEmbed when videoId exists, and includes a back link to /sermons. Both pages use BaseLayout and the established try-catch CMS fetch pattern.

## Verification

All slice-level checks passed:
- T01 verification: slug in schema with source:'title', getSermonBySlug in sanity.ts, both component files exist, youtube-nocookie.com in embed, no client: directives, data-series attribute present, loading=lazy on iframe.
- T02 verification: npm run build succeeds (9 pages, 7.4s), both page files exist, no client: directives in either page.
- Slice-level: re-ran all checks independently — all pass. Build clean.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

Series filter is client-side only — with many series the pill bar could overflow horizontally on mobile. No pagination for large sermon libraries.

## Follow-ups

None.

## Files Created/Modified

- `sanity/schemas/documents/sermon.ts` — Added required slug field with source: title
- `src/lib/sanity.ts` — Added slug to Sermon interface, updated getSermons() projection, added getSermonBySlug() helper
- `src/components/SermonCard.astro` — New component — sermon card with series badge, date, speaker, scripture, data-series attribute
- `src/components/YouTubeEmbed.astro` — New component — responsive 16:9 YouTube iframe with privacy-enhanced mode and lazy loading
- `src/pages/sermons/index.astro` — New page — sermon listing with Hero, series pill filter, responsive card grid
- `src/pages/sermons/[slug].astro` — New page — sermon detail with metadata grid, conditional YouTube embed, back link
