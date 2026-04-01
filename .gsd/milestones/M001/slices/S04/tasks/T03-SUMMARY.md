---
id: T03
parent: S04
milestone: M001
provides: []
requires: []
affects: []
key_files: ["src/lib/sanity.ts"]
key_decisions: ["No CSP changes needed — Studio scripts self-hosted from Astro build", "Lighthouse config unchanged — /admin not in tested URLs"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build exits 0 (7.1s), ! test -d studio confirms removal, grep confirms GROQ helpers present (7 exports), npx lhci autorun passes all assertions (68.3s), slice-level checks (sanity in astro.config, sanity.config.ts exists, sanity/structure.ts exists) all pass."
completed_at: 2026-04-01T01:36:21.888Z
blocker_discovered: false
---

# T03: Added 6 typed GROQ query helpers to src/lib/sanity.ts, removed old studio/ directory, confirmed build and Lighthouse CI pass with no regressions

> Added 6 typed GROQ query helpers to src/lib/sanity.ts, removed old studio/ directory, confirmed build and Lighthouse CI pass with no regressions

## What Happened
---
id: T03
parent: S04
milestone: M001
key_files:
  - src/lib/sanity.ts
key_decisions:
  - No CSP changes needed — Studio scripts self-hosted from Astro build
  - Lighthouse config unchanged — /admin not in tested URLs
duration: ""
verification_result: passed
completed_at: 2026-04-01T01:36:21.889Z
blocker_discovered: false
---

# T03: Added 6 typed GROQ query helpers to src/lib/sanity.ts, removed old studio/ directory, confirmed build and Lighthouse CI pass with no regressions

**Added 6 typed GROQ query helpers to src/lib/sanity.ts, removed old studio/ directory, confirmed build and Lighthouse CI pass with no regressions**

## What Happened

Expanded src/lib/sanity.ts with TypeScript interfaces for all 6 content types and exported query functions (getPageBySlug, getSermons, getEvents, getMinistries, getSiteSettings, getNavigation). Each accepts a language parameter defaulting to 'en'. Reviewed CSP — no changes needed since Studio scripts are self-hosted. Removed old standalone studio/ directory. Ran full LHCI — all assertions passed with no regressions.

## Verification

npm run build exits 0 (7.1s), ! test -d studio confirms removal, grep confirms GROQ helpers present (7 exports), npx lhci autorun passes all assertions (68.3s), slice-level checks (sanity in astro.config, sanity.config.ts exists, sanity/structure.ts exists) all pass.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 7100ms |
| 2 | `! test -d studio` | 0 | ✅ pass | 100ms |
| 3 | `grep -q 'getPageBySlug|getSermons' src/lib/sanity.ts` | 0 | ✅ pass | 100ms |
| 4 | `npx lhci autorun` | 0 | ✅ pass | 68300ms |
| 5 | `grep -q 'sanity' astro.config.mjs` | 0 | ✅ pass | 100ms |
| 6 | `test -f sanity.config.ts` | 0 | ✅ pass | 100ms |
| 7 | `test -f sanity/structure.ts` | 0 | ✅ pass | 100ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/lib/sanity.ts`


## Deviations
None.

## Known Issues
None.
