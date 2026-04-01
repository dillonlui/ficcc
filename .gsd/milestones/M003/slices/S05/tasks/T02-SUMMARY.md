---
id: T02
parent: S05
milestone: M003
provides: []
requires: []
affects: []
key_files: ["sanity/migrations/cm-content.ts"]
key_decisions: ["Used descriptive _key values for stability and readability", "Dry-run mode when SANITY_API_WRITE_TOKEN absent"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "File exists check passed. Script compiles and executes via npx tsx without errors. Dry-run mode correctly outputs all 4 documents and reports '4 documents would be created/replaced'. All field names verified against schema definitions."
completed_at: 2026-04-01T17:26:03.446Z
blocker_discovered: false
---

# T02: Created idempotent Sanity migration script with 4 ZH singleton documents (homePage, aboutPage, siteSettings, visitPage) using createOrReplace

> Created idempotent Sanity migration script with 4 ZH singleton documents (homePage, aboutPage, siteSettings, visitPage) using createOrReplace

## What Happened
---
id: T02
parent: S05
milestone: M003
key_files:
  - sanity/migrations/cm-content.ts
key_decisions:
  - Used descriptive _key values for stability and readability
  - Dry-run mode when SANITY_API_WRITE_TOKEN absent
duration: ""
verification_result: passed
completed_at: 2026-04-01T17:26:03.446Z
blocker_discovered: false
---

# T02: Created idempotent Sanity migration script with 4 ZH singleton documents (homePage, aboutPage, siteSettings, visitPage) using createOrReplace

**Created idempotent Sanity migration script with 4 ZH singleton documents (homePage, aboutPage, siteSettings, visitPage) using createOrReplace**

## What Happened

Read all 4 singleton schemas to confirm exact field names and types. Cross-referenced with ZH page fallback content for accurate Chinese text. Created sanity/migrations/cm-content.ts with homePage-zh (hero, service times, pillars, next steps), aboutPage-zh (church history, vision, stats, 11 EFCA beliefs), siteSettings-zh (church name, contact info, WeChat), and visitPage-zh (schedule, what to expect, transportation, FAQ). All array items use correct _type and _key values matching schema definitions. Portable Text fields use proper block/span structure. Script supports dry-run mode (no token) and live mode with per-document success/failure logging.

## Verification

File exists check passed. Script compiles and executes via npx tsx without errors. Dry-run mode correctly outputs all 4 documents and reports '4 documents would be created/replaced'. All field names verified against schema definitions.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f sanity/migrations/cm-content.ts` | 0 | ✅ pass | 100ms |
| 2 | `node -e "require('fs').readFileSync('sanity/migrations/cm-content.ts','utf8')"` | 0 | ✅ pass | 200ms |
| 3 | `SANITY_PROJECT_ID=test123 npx tsx sanity/migrations/cm-content.ts` | 0 | ✅ pass | 3000ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sanity/migrations/cm-content.ts`


## Deviations
None.

## Known Issues
None.
