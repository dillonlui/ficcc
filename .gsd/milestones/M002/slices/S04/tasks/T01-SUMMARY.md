---
id: T01
parent: S04
milestone: M002
provides: []
requires: []
affects: []
key_files: ["sanity/schemas/documents/sermon.ts", "src/lib/sanity.ts", "src/components/SermonCard.astro", "src/components/YouTubeEmbed.astro"]
key_decisions: ["Used color-mix() for series badge background tint", "SermonCard formats dates via toLocaleDateString for locale-aware display"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "Ran composite verification: slug in schema, getSermonBySlug in sanity.ts, both component files exist, youtube-nocookie.com in embed, no client: directives in either component. All checks passed (exit 0). Additionally confirmed slug has source: 'title' option, data-series attribute present on SermonCard root, loading=lazy on iframe."
completed_at: 2026-04-01T13:50:27.946Z
blocker_discovered: false
---

# T01: Added slug field to sermon schema, updated Sermon interface/queries, and built SermonCard and YouTubeEmbed components

> Added slug field to sermon schema, updated Sermon interface/queries, and built SermonCard and YouTubeEmbed components

## What Happened
---
id: T01
parent: S04
milestone: M002
key_files:
  - sanity/schemas/documents/sermon.ts
  - src/lib/sanity.ts
  - src/components/SermonCard.astro
  - src/components/YouTubeEmbed.astro
key_decisions:
  - Used color-mix() for series badge background tint
  - SermonCard formats dates via toLocaleDateString for locale-aware display
duration: ""
verification_result: passed
completed_at: 2026-04-01T13:50:27.947Z
blocker_discovered: false
---

# T01: Added slug field to sermon schema, updated Sermon interface/queries, and built SermonCard and YouTubeEmbed components

**Added slug field to sermon schema, updated Sermon interface/queries, and built SermonCard and YouTubeEmbed components**

## What Happened

Extended the Sanity sermon schema with a required slug field (source: title), updated the Sermon TypeScript interface to include slug, modified getSermons() with an explicit projection including slug, and added getSermonBySlug() helper. Built SermonCard.astro (series badge, date, speaker, scripture, data-series attribute for filtering) and YouTubeEmbed.astro (responsive 16:9 iframe, youtube-nocookie.com, lazy loading). Both components follow project conventions — BEM scoped CSS with custom properties, no client: directives.

## Verification

Ran composite verification: slug in schema, getSermonBySlug in sanity.ts, both component files exist, youtube-nocookie.com in embed, no client: directives in either component. All checks passed (exit 0). Additionally confirmed slug has source: 'title' option, data-series attribute present on SermonCard root, loading=lazy on iframe.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `grep -q 'slug' sanity/schemas/documents/sermon.ts && grep -q 'getSermonBySlug' src/lib/sanity.ts && test -f src/components/SermonCard.astro && test -f src/components/YouTubeEmbed.astro && grep -q 'youtube-nocookie.com' src/components/YouTubeEmbed.astro && ! grep -q 'client:' src/components/SermonCard.astro && ! grep -q 'client:' src/components/YouTubeEmbed.astro` | 0 | ✅ pass | 200ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sanity/schemas/documents/sermon.ts`
- `src/lib/sanity.ts`
- `src/components/SermonCard.astro`
- `src/components/YouTubeEmbed.astro`


## Deviations
None.

## Known Issues
None.
