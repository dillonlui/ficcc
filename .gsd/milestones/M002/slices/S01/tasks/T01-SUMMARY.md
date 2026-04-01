---
id: T01
parent: S01
milestone: M002
provides: []
requires: []
affects: []
key_files: ["sanity/schemas/singletons/homePage.ts", "sanity/schemas/index.ts", "src/lib/sanity.ts"]
key_decisions: ["urlForImage accepts optional width/format params for responsive image sizing", "MosaicImage extends SanityImage with alt field matching schema inline image+alt pattern"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "All five checks passed: schema file exists, homePage registered in index, getHomePage present, urlForImage present, npm run build succeeds (4 pages, 7.31s)."
completed_at: 2026-04-01T13:13:26.674Z
blocker_discovered: false
---

# T01: Added homePage Sanity singleton schema with hero/service-times/mosaic/pillars/next-steps fields, registered in schema index, and added getHomePage() + urlForImage() helpers

> Added homePage Sanity singleton schema with hero/service-times/mosaic/pillars/next-steps fields, registered in schema index, and added getHomePage() + urlForImage() helpers

## What Happened
---
id: T01
parent: S01
milestone: M002
key_files:
  - sanity/schemas/singletons/homePage.ts
  - sanity/schemas/index.ts
  - src/lib/sanity.ts
key_decisions:
  - urlForImage accepts optional width/format params for responsive image sizing
  - MosaicImage extends SanityImage with alt field matching schema inline image+alt pattern
duration: ""
verification_result: passed
completed_at: 2026-04-01T13:13:26.677Z
blocker_discovered: false
---

# T01: Added homePage Sanity singleton schema with hero/service-times/mosaic/pillars/next-steps fields, registered in schema index, and added getHomePage() + urlForImage() helpers

**Added homePage Sanity singleton schema with hero/service-times/mosaic/pillars/next-steps fields, registered in schema index, and added getHomePage() + urlForImage() helpers**

## What Happened

Created the homePage singleton schema following the siteSettings pattern, registered it in the schema index (exports, imports, schemaTypes, singletonTypes, singletonDocIds for EN/ZH), and added TypeScript interfaces plus getHomePage() and urlForImage() helpers to the data layer.

## Verification

All five checks passed: schema file exists, homePage registered in index, getHomePage present, urlForImage present, npm run build succeeds (4 pages, 7.31s).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f sanity/schemas/singletons/homePage.ts` | 0 | ✅ pass | 100ms |
| 2 | `grep -q 'homePage' sanity/schemas/index.ts` | 0 | ✅ pass | 100ms |
| 3 | `grep -q 'getHomePage' src/lib/sanity.ts` | 0 | ✅ pass | 100ms |
| 4 | `grep -q 'urlForImage' src/lib/sanity.ts` | 0 | ✅ pass | 100ms |
| 5 | `npm run build` | 0 | ✅ pass | 8400ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sanity/schemas/singletons/homePage.ts`
- `sanity/schemas/index.ts`
- `src/lib/sanity.ts`


## Deviations
None.

## Known Issues
None.
