---
id: T01
parent: S01
milestone: M004
provides: []
requires: []
affects: []
key_files: ["src/components/Hero.astro", "src/layouts/BaseLayout.astro", "src/lib/sanity.ts"]
key_decisions: ["Hero uses alt="" since image is decorative (text overlay provides content)", "Solid color fallback via background-color on .hero container when no backgroundImage provided"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build exited 0. grep confirmed fetchpriority in Hero.astro, preconnect in BaseLayout.astro, and webp default in sanity.ts."
completed_at: 2026-04-01T17:38:00.211Z
blocker_discovered: false
---

# T01: Converted Hero from CSS background-image to <img> with fetchpriority="high", added cdn.sanity.io preconnect, and defaulted Sanity image URLs to WebP

> Converted Hero from CSS background-image to <img> with fetchpriority="high", added cdn.sanity.io preconnect, and defaulted Sanity image URLs to WebP

## What Happened
---
id: T01
parent: S01
milestone: M004
key_files:
  - src/components/Hero.astro
  - src/layouts/BaseLayout.astro
  - src/lib/sanity.ts
key_decisions:
  - Hero uses alt="" since image is decorative (text overlay provides content)
  - Solid color fallback via background-color on .hero container when no backgroundImage provided
duration: ""
verification_result: passed
completed_at: 2026-04-01T17:38:00.212Z
blocker_discovered: false
---

# T01: Converted Hero from CSS background-image to <img> with fetchpriority="high", added cdn.sanity.io preconnect, and defaulted Sanity image URLs to WebP

**Converted Hero from CSS background-image to <img> with fetchpriority="high", added cdn.sanity.io preconnect, and defaulted Sanity image URLs to WebP**

## What Happened

Restructured Hero.astro from CSS background-image to a proper <img> element with fetchpriority="high", loading="eager", and decoding="async" for LCP optimization. Added a solid-color fallback when no image is provided. Added preconnect hint for cdn.sanity.io in BaseLayout head. Modified urlForImage() to always append fm=webp unless caller overrides.

## Verification

npm run build exited 0. grep confirmed fetchpriority in Hero.astro, preconnect in BaseLayout.astro, and webp default in sanity.ts.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 8800ms |
| 2 | `grep -q 'fetchpriority' src/components/Hero.astro` | 0 | ✅ pass | 50ms |
| 3 | `grep -q 'preconnect' src/layouts/BaseLayout.astro` | 0 | ✅ pass | 50ms |
| 4 | `grep -q "format.*webp|fm.*webp|'webp'" src/lib/sanity.ts` | 0 | ✅ pass | 50ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/components/Hero.astro`
- `src/layouts/BaseLayout.astro`
- `src/lib/sanity.ts`


## Deviations
None.

## Known Issues
None.
