---
id: T02
parent: S04
milestone: M002
provides: []
requires: []
affects: []
key_files: ["src/pages/sermons/index.astro", "src/pages/sermons/[slug].astro"]
key_decisions: ["Wrapped sermon cards in grid-item divs with data-series for filter toggling rather than applying hidden directly to SermonCard", "Used getSermons() in getStaticPaths passing full sermon as props to avoid double-fetch"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build succeeds (9 pages built). Both files exist at expected paths. No client: directives in either file. Empty CMS state handled gracefully — listing shows fallback message, [slug] generates zero pages without error."
completed_at: 2026-04-01T13:52:29.069Z
blocker_discovered: false
---

# T02: Built /sermons listing with series pill filter and /sermons/[slug] detail page with metadata grid and conditional YouTube embed

> Built /sermons listing with series pill filter and /sermons/[slug] detail page with metadata grid and conditional YouTube embed

## What Happened
---
id: T02
parent: S04
milestone: M002
key_files:
  - src/pages/sermons/index.astro
  - src/pages/sermons/[slug].astro
key_decisions:
  - Wrapped sermon cards in grid-item divs with data-series for filter toggling rather than applying hidden directly to SermonCard
  - Used getSermons() in getStaticPaths passing full sermon as props to avoid double-fetch
duration: ""
verification_result: passed
completed_at: 2026-04-01T13:52:29.070Z
blocker_discovered: false
---

# T02: Built /sermons listing with series pill filter and /sermons/[slug] detail page with metadata grid and conditional YouTube embed

**Built /sermons listing with series pill filter and /sermons/[slug] detail page with metadata grid and conditional YouTube embed**

## What Happened

Created both sermon pages. The listing at /sermons renders a Hero, centered pill-style filter bar (All + per-series buttons), and a responsive 3/2/1 column card grid with inline script toggling hidden attributes for filtering. Empty CMS renders a fallback message. The detail page at /sermons/[slug] uses getStaticPaths() with full sermon props, shows a metadata grid (speaker, date, scripture, series), conditionally renders YouTubeEmbed, and includes a back link. Both use BaseLayout and try-catch CMS fetch pattern.

## Verification

npm run build succeeds (9 pages built). Both files exist at expected paths. No client: directives in either file. Empty CMS state handled gracefully — listing shows fallback message, [slug] generates zero pages without error.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build 2>&1 | tail -5 && test -f src/pages/sermons/index.astro && test -f src/pages/sermons/[slug].astro && ! grep -q client: src/pages/sermons/index.astro && ! grep -q client: src/pages/sermons/[slug].astro` | 0 | ✅ pass | 7300ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/pages/sermons/index.astro`
- `src/pages/sermons/[slug].astro`


## Deviations
None.

## Known Issues
None.
