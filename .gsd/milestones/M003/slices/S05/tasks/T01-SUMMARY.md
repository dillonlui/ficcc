---
id: T01
parent: S05
milestone: M003
provides: []
requires: []
affects: []
key_files: ["vercel.json"]
key_decisions: ["Added catch-all redirect as final rule so unmatched cm.ficcc.org paths land on ZH homepage", "Included both URL-encoded and raw CJK forms for /home/教會事工/ to cover browser-dependent encoding"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "JSON parsing passes. Redirect count is 10 (≥8 threshold). npm run build completes successfully with no regression."
completed_at: 2026-04-01T17:22:40.290Z
blocker_discovered: false
---

# T01: Added 10 permanent redirects from cm.ficcc.org paths to /zh/ equivalents in vercel.json

> Added 10 permanent redirects from cm.ficcc.org paths to /zh/ equivalents in vercel.json

## What Happened
---
id: T01
parent: S05
milestone: M003
key_files:
  - vercel.json
key_decisions:
  - Added catch-all redirect as final rule so unmatched cm.ficcc.org paths land on ZH homepage
  - Included both URL-encoded and raw CJK forms for /home/教會事工/ to cover browser-dependent encoding
duration: ""
verification_result: passed
completed_at: 2026-04-01T17:22:40.291Z
blocker_discovered: false
---

# T01: Added 10 permanent redirects from cm.ficcc.org paths to /zh/ equivalents in vercel.json

**Added 10 permanent redirects from cm.ficcc.org paths to /zh/ equivalents in vercel.json**

## What Happened

Added a redirects array to vercel.json with 10 cross-domain redirect entries using Vercel's has condition with type:host matching for cm.ficcc.org. Covers all 8 known pages from the redirect map, plus both URL-encoded and raw CJK forms for /home/教會事工/, plus a catch-all for unmapped paths. All redirects are permanent (301) and point to the corresponding /zh/ paths on ficcc.org.

## Verification

JSON parsing passes. Redirect count is 10 (≥8 threshold). npm run build completes successfully with no regression.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))"` | 0 | ✅ pass | 500ms |
| 2 | `node -e "...if(!v.redirects||v.redirects.length<8) throw..."` | 0 | ✅ pass | 500ms |
| 3 | `npm run build` | 0 | ✅ pass | 8700ms |


## Deviations

Added 2 extra redirects beyond the 8 specified: both encoded and unencoded CJK path forms, and a catch-all /:path* rule.

## Known Issues

None.

## Files Created/Modified

- `vercel.json`


## Deviations
Added 2 extra redirects beyond the 8 specified: both encoded and unencoded CJK path forms, and a catch-all /:path* rule.

## Known Issues
None.
