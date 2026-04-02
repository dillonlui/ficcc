---
id: T02
parent: S06
milestone: M004
provides: []
requires: []
affects: []
key_files: ["docs/launch-runbook.md", "vitest.config.ts"]
key_decisions: ["Created vitest.config.ts using Astro getViteConfig to exclude e2e/ and .gsd/ from Vitest test discovery"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "All task and slice-level verification checks pass: file exists with 6 sections, no placeholders, vercel.json valid with 8 em.ficcc.org rules and GA4 CSP domains, npm test 27/27 pass, npm run build exits 0."
completed_at: 2026-04-02T17:30:05.285Z
blocker_discovered: false
---

# T02: Created docs/launch-runbook.md with full DNS cutover procedure and fixed Vitest config to exclude Playwright e2e specs

> Created docs/launch-runbook.md with full DNS cutover procedure and fixed Vitest config to exclude Playwright e2e specs

## What Happened
---
id: T02
parent: S06
milestone: M004
key_files:
  - docs/launch-runbook.md
  - vitest.config.ts
key_decisions:
  - Created vitest.config.ts using Astro getViteConfig to exclude e2e/ and .gsd/ from Vitest test discovery
duration: ""
verification_result: passed
completed_at: 2026-04-02T17:30:05.286Z
blocker_discovered: false
---

# T02: Created docs/launch-runbook.md with full DNS cutover procedure and fixed Vitest config to exclude Playwright e2e specs

**Created docs/launch-runbook.md with full DNS cutover procedure and fixed Vitest config to exclude Playwright e2e specs**

## What Happened

Fixed the npm test failure by creating vitest.config.ts to exclude e2e/ from Vitest discovery (Playwright specs use test.describe which Vitest rejects). Then wrote the complete launch runbook covering prerequisites, Vercel domain setup, DNS records for all three domains, post-cutover verification checklist with redirect tables matching vercel.json, rollback procedure, and timeline.

## Verification

All task and slice-level verification checks pass: file exists with 6 sections, no placeholders, vercel.json valid with 8 em.ficcc.org rules and GA4 CSP domains, npm test 27/27 pass, npm run build exits 0.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f docs/launch-runbook.md && grep -c '^## ' docs/launch-runbook.md >= 5 && no TBD/TODO` | 0 | ✅ pass | 100ms |
| 2 | `npm test` | 0 | ✅ pass | 3100ms |
| 3 | `npm run build` | 0 | ✅ pass | 10500ms |
| 4 | `node -e JSON.parse vercel.json` | 0 | ✅ pass | 100ms |
| 5 | `grep -c em.ficcc.org vercel.json (8)` | 0 | ✅ pass | 100ms |
| 6 | `grep googletagmanager/google-analytics vercel.json` | 0 | ✅ pass | 100ms |


## Deviations

Created vitest.config.ts (not in task plan) to fix pre-existing npm test failure from Vitest loading Playwright e2e specs.

## Known Issues

npm run test:e2e not verified — requires running dev server and Playwright browsers.

## Files Created/Modified

- `docs/launch-runbook.md`
- `vitest.config.ts`


## Deviations
Created vitest.config.ts (not in task plan) to fix pre-existing npm test failure from Vitest loading Playwright e2e specs.

## Known Issues
npm run test:e2e not verified — requires running dev server and Playwright browsers.
