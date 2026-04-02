---
id: S06
parent: M004
milestone: M004
provides:
  - em.ficcc.org redirect rules in vercel.json
  - GA4 CSP domains for production analytics
  - DNS cutover runbook at docs/launch-runbook.md
  - Clean npm test with vitest.config.ts excluding e2e specs
requires:
  - slice: S01
    provides: Performance baseline and accessibility fixes
  - slice: S02
    provides: SEO infrastructure and GA4 analytics setup
  - slice: S03
    provides: Playwright E2E test suite
  - slice: S04
    provides: Pagefind search integration
  - slice: S05
    provides: Staff documentation
affects:
  []
key_files:
  - vercel.json
  - docs/launch-runbook.md
  - vitest.config.ts
key_decisions:
  - D020: em.ficcc.org redirects placed before cm.ficcc.org block with catch-all last
  - Created vitest.config.ts to exclude e2e/ and .gsd/ from Vitest discovery
patterns_established:
  - Subdomain redirect pattern: host-header matching with specific paths before catch-all, reusable for any future subdomain redirects
observability_surfaces:
  - Post-cutover verification checklist in docs/launch-runbook.md covers redirect validation, SSL, analytics, and sitemap
drill_down_paths:
  - .gsd/milestones/M004/slices/S06/tasks/T01-SUMMARY.md
  - .gsd/milestones/M004/slices/S06/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-02T17:32:10.090Z
blocker_discovered: false
---

# S06: DNS Cutover & Launch

**Launch-ready: 8 em.ficcc.org redirect rules, GA4 CSP domains, Vitest config fix, and complete DNS cutover runbook**

## What Happened

Two tasks brought the site to launch-ready state. T01 updated vercel.json with 8 permanent redirect rules for em.ficcc.org (mapping old English ministry paths like /home/about/ to new routes like /about), placed before the existing cm.ficcc.org block to ensure correct evaluation order. The same task updated the Content Security Policy to allow GA4: googletagmanager.com added to script-src, and google-analytics.com + googletagmanager.com wildcards added to connect-src — enabling analytics to function in production without CSP violations.

T02 fixed a pre-existing issue where Vitest was discovering Playwright e2e specs and failing, by creating vitest.config.ts with explicit exclude patterns for e2e/ and .gsd/. With that resolved, T02 wrote the complete DNS cutover runbook (docs/launch-runbook.md) covering: prerequisites checklist, Vercel domain configuration steps, exact DNS records for all three domains (ficcc.org, em.ficcc.org, cm.ficcc.org), post-cutover verification checklist with redirect tables matching vercel.json, rollback procedure, and expected timeline.

All verification passed: valid JSON, exactly 8 em.ficcc.org references, GA4 domains in CSP, 27 unit tests passing, build exits 0, runbook exists with 6 sections and no placeholders.

## Verification

vercel.json valid JSON, grep confirms 8 em.ficcc.org redirect rules, CSP includes googletagmanager.com and google-analytics.com domains. npm test passes (27/27 unit tests via Vitest). npm run build exits 0 (24 pages prerendered, Pagefind indexes 24 pages). docs/launch-runbook.md exists with 6 sections and no TBD/TODO placeholders.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Created vitest.config.ts (not in original plan) to fix pre-existing issue where Vitest loaded Playwright e2e specs and failed. This was necessary to get npm test passing cleanly.

## Known Limitations

npm run test:e2e not re-verified in T02 (requires running dev server and Playwright browsers) — but T01 confirmed 112 Playwright tests pass. DNS cutover itself is a manual operational step documented in the runbook but not executed by this slice.

## Follow-ups

Execute DNS cutover per docs/launch-runbook.md when ready to go live. Post-cutover: verify all 3 domains serve correctly, SSL valid, GA4 receiving traffic, Search Console verified.

## Files Created/Modified

- `vercel.json` — Added 8 em.ficcc.org permanent redirect rules and GA4 domains to CSP script-src and connect-src
- `docs/launch-runbook.md` — Complete DNS cutover procedure with prerequisites, domain config, DNS records, verification checklist, rollback, and timeline
- `vitest.config.ts` — New config excluding e2e/ and .gsd/ from Vitest test discovery
- `.gsd/KNOWLEDGE.md` — Added K014: Vitest/Playwright exclusion pattern
- `.gsd/PROJECT.md` — Updated to reflect S06 completion and launch-ready status
