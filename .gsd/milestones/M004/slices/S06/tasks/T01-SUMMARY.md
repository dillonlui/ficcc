---
id: T01
parent: S06
milestone: M004
provides: []
requires: []
affects: []
key_files: ["vercel.json"]
key_decisions: ["Placed em.ficcc.org redirects before cm.ficcc.org block so specific-path rules match first"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "Valid JSON confirmed, grep shows exactly 8 em.ficcc.org references, CSP includes both GA4 domains. Build passes, 27 unit tests pass, 112 Playwright e2e tests pass."
completed_at: 2026-04-02T17:27:19.057Z
blocker_discovered: false
---

# T01: Added 8 em.ficcc.org redirect rules and GA4 domains to CSP in vercel.json for production launch

> Added 8 em.ficcc.org redirect rules and GA4 domains to CSP in vercel.json for production launch

## What Happened
---
id: T01
parent: S06
milestone: M004
key_files:
  - vercel.json
key_decisions:
  - Placed em.ficcc.org redirects before cm.ficcc.org block so specific-path rules match first
duration: ""
verification_result: passed
completed_at: 2026-04-02T17:27:19.058Z
blocker_discovered: false
---

# T01: Added 8 em.ficcc.org redirect rules and GA4 domains to CSP in vercel.json for production launch

**Added 8 em.ficcc.org redirect rules and GA4 domains to CSP in vercel.json for production launch**

## What Happened

Updated vercel.json with 8 em.ficcc.org permanent redirect rules (/, /home/about/, /home/faith/, /home/sermons/, /home/worship/, /home/fellowships/, /home/contact/, and catch-all) pointing to English routes. Updated CSP header to allow GA4: added googletagmanager.com to script-src and google-analytics.com + googletagmanager.com wildcards to connect-src.

## Verification

Valid JSON confirmed, grep shows exactly 8 em.ficcc.org references, CSP includes both GA4 domains. Build passes, 27 unit tests pass, 112 Playwright e2e tests pass.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))"` | 0 | ✅ pass | 200ms |
| 2 | `grep -c 'em.ficcc.org' vercel.json` | 0 | ✅ pass (returns 8) | 10ms |
| 3 | `grep 'googletagmanager' vercel.json` | 0 | ✅ pass | 10ms |
| 4 | `grep 'google-analytics' vercel.json` | 0 | ✅ pass | 10ms |
| 5 | `npm run build` | 0 | ✅ pass | 10800ms |
| 6 | `npm test` | 1 | ⚠️ pass (27/27 unit tests pass; e2e suite errors pre-existing) | 10800ms |
| 7 | `npx playwright test` | 0 | ✅ pass (112 passed) | 6900ms |


## Deviations

None.

## Known Issues

npm test (vitest) picks up Playwright e2e files and errors — pre-existing config issue, not introduced by this task.

## Files Created/Modified

- `vercel.json`


## Deviations
None.

## Known Issues
npm test (vitest) picks up Playwright e2e files and errors — pre-existing config issue, not introduced by this task.
