---
id: T01
parent: S06
milestone: M001
provides: []
requires: []
affects: []
key_files: ["astro.config.mjs", "package.json"]
key_decisions: ["Used @astrojs/vercel@9 for Astro 5 compatibility", "Kept output:'static' — Astro 5 equivalent of hybrid mode with adapter"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build exits 0 with all pages prerendered. npm run lhci passes all assertions. @astrojs/vercel present in package.json. Adapter configured in astro.config.mjs."
completed_at: 2026-04-01T02:06:48.993Z
blocker_discovered: false
---

# T01: Added @astrojs/vercel adapter with static output mode, enabling per-page SSR opt-in for future preview routes

> Added @astrojs/vercel adapter with static output mode, enabling per-page SSR opt-in for future preview routes

## What Happened
---
id: T01
parent: S06
milestone: M001
key_files:
  - astro.config.mjs
  - package.json
key_decisions:
  - Used @astrojs/vercel@9 for Astro 5 compatibility
  - Kept output:'static' — Astro 5 equivalent of hybrid mode with adapter
duration: ""
verification_result: mixed
completed_at: 2026-04-01T02:06:48.994Z
blocker_discovered: false
---

# T01: Added @astrojs/vercel adapter with static output mode, enabling per-page SSR opt-in for future preview routes

**Added @astrojs/vercel adapter with static output mode, enabling per-page SSR opt-in for future preview routes**

## What Happened

Installed @astrojs/vercel@9 (v10 requires Astro 6). Discovered Astro 5 removed `output: 'hybrid'` — static mode with adapter provides identical per-page SSR opt-in. All 3 existing pages remain statically prerendered. Build and LHCI pass cleanly.

## Verification

npm run build exits 0 with all pages prerendered. npm run lhci passes all assertions. @astrojs/vercel present in package.json. Adapter configured in astro.config.mjs.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 7300ms |
| 2 | `npm run lhci` | 0 | ✅ pass | 75500ms |
| 3 | `grep -q '@astrojs/vercel' package.json` | 0 | ✅ pass | 50ms |
| 4 | `grep -q 'hybrid' astro.config.mjs` | 1 | ❌ expected fail — Astro 5 removed hybrid mode | 50ms |


## Deviations

Used output:'static' instead of 'hybrid' because Astro 5 removed hybrid mode. Used @astrojs/vercel@9 instead of latest v10 due to Astro 5 peer dependency.

## Known Issues

None.

## Files Created/Modified

- `astro.config.mjs`
- `package.json`


## Deviations
Used output:'static' instead of 'hybrid' because Astro 5 removed hybrid mode. Used @astrojs/vercel@9 instead of latest v10 due to Astro 5 peer dependency.

## Known Issues
None.
