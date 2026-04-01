---
id: S05
parent: M003
milestone: M003
provides:
  - Cross-domain redirect map from cm.ficcc.org to /zh/ paths
  - Sanity migration script for 4 ZH singleton documents
requires:
  - slice: S01
    provides: ZH page structure and fallback content patterns
  - slice: S02
    provides: ZH Community and Ministries page content
  - slice: S03
    provides: ZH transactional page content
affects:
  []
key_files:
  - vercel.json
  - sanity/migrations/cm-content.ts
key_decisions:
  - Added catch-all redirect as final rule so unmatched cm.ficcc.org paths land on ZH homepage
  - Included both URL-encoded and raw CJK forms for /home/教會事工/ to cover browser-dependent encoding
  - Dry-run mode when SANITY_API_WRITE_TOKEN absent — logs documents to console instead of failing
patterns_established:
  - Sanity migration script pattern: createOrReplace with dry-run fallback, descriptive _key values, env-based token detection
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M003/slices/S05/tasks/T01-SUMMARY.md
  - .gsd/milestones/M003/slices/S05/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T17:27:24.825Z
blocker_discovered: false
---

# S05: CM Content Migration

**10 cross-domain redirects from cm.ficcc.org to /zh/ paths and idempotent Sanity migration script populating 4 ZH singleton documents with actual Chinese Ministry content.**

## What Happened

Two tasks completed the CM content migration. T01 added 10 permanent 301 redirects to vercel.json using Vercel's `has` condition with `type:host` matching for cm.ficcc.org. The 10 entries cover all 8 known cm.ficcc.org pages, both URL-encoded and raw CJK forms for /home/教會事工/, and a catch-all /:path* rule that sends unmatched paths to the ZH homepage. T02 created sanity/migrations/cm-content.ts — a TypeScript migration script using @sanity/client's createOrReplace for idempotent execution. It defines 4 ZH singleton documents (homePage-zh, aboutPage-zh, siteSettings-zh, visitPage-zh) with actual Chinese Ministry content sourced from the SITE-AUDIT.md and ZH page fallbacks built in S01-S03. All Portable Text fields use proper block/span structure, array items have descriptive _key values, and the script supports dry-run mode when no write token is available.

## Verification

JSON parse validation passes for vercel.json. 10 redirects confirmed (≥8 threshold). Migration script exists and executes in dry-run mode via npx tsx, outputting all 4 documents and reporting '4 documents would be created/replaced'. npm run build completes successfully with no regression.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

T01 added 2 extra redirects beyond the 8 specified: both encoded and unencoded CJK path forms for /home/教會事工/, and a catch-all /:path* rule for unmatched paths.

## Known Limitations

Migration script requires SANITY_API_WRITE_TOKEN to actually write to Sanity — dry-run mode only logs documents without a token. The redirects depend on cm.ficcc.org DNS pointing to Vercel to take effect.

## Follow-ups

Run the migration script with a real SANITY_API_WRITE_TOKEN against the production Sanity dataset before launch. Verify cm.ficcc.org DNS is configured to point to Vercel so cross-domain redirects activate.

## Files Created/Modified

- `vercel.json` — Added redirects array with 10 cross-domain 301 redirects from cm.ficcc.org paths to /zh/ equivalents
- `sanity/migrations/cm-content.ts` — Created idempotent migration script populating homePage-zh, aboutPage-zh, siteSettings-zh, visitPage-zh with actual CM content
