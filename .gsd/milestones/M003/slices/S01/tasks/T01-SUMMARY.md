---
id: T01
parent: S01
milestone: M003
provides: []
requires: []
affects: []
key_files: ["src/lib/navigation.ts", "src/components/Header.astro", "src/components/Footer.astro", "src/layouts/BaseLayout.astro"]
key_decisions: ["Changed lang toggle from button to anchor link so it navigates between /zh and / without JS"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build succeeded. EN homepage confirmed unchanged: no Chinese nav labels present, English nav links present."
completed_at: 2026-04-01T16:42:14.775Z
blocker_discovered: false
---

# T01: Extracted nav config into src/lib/navigation.ts and made Header/Footer language-aware via lang prop so ZH pages render Chinese labels and hrefs while EN pages are unchanged

> Extracted nav config into src/lib/navigation.ts and made Header/Footer language-aware via lang prop so ZH pages render Chinese labels and hrefs while EN pages are unchanged

## What Happened
---
id: T01
parent: S01
milestone: M003
key_files:
  - src/lib/navigation.ts
  - src/components/Header.astro
  - src/components/Footer.astro
  - src/layouts/BaseLayout.astro
key_decisions:
  - Changed lang toggle from button to anchor link so it navigates between /zh and / without JS
duration: ""
verification_result: passed
completed_at: 2026-04-01T16:42:14.776Z
blocker_discovered: false
---

# T01: Extracted nav config into src/lib/navigation.ts and made Header/Footer language-aware via lang prop so ZH pages render Chinese labels and hrefs while EN pages are unchanged

**Extracted nav config into src/lib/navigation.ts and made Header/Footer language-aware via lang prop so ZH pages render Chinese labels and hrefs while EN pages are unchanged**

## What Happened

Created src/lib/navigation.ts with typed exports for nav links, footer nav, service times, and church name by language. Updated Header.astro and Footer.astro to accept a lang prop and use the shared config. Updated BaseLayout.astro to thread lang to both components. Changed language toggle from non-functional button to anchor link for actual navigation between language versions.

## Verification

npm run build succeeded. EN homepage confirmed unchanged: no Chinese nav labels present, English nav links present.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 9400ms |
| 2 | `! grep -q '首頁' dist/client/index.html` | 0 | ✅ pass | 100ms |
| 3 | `grep -q 'About' dist/client/index.html` | 0 | ✅ pass | 100ms |


## Deviations

Changed language toggle from button to anchor link for actual navigation between / and /zh.

## Known Issues

None.

## Files Created/Modified

- `src/lib/navigation.ts`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/layouts/BaseLayout.astro`


## Deviations
Changed language toggle from button to anchor link for actual navigation between / and /zh.

## Known Issues
None.
