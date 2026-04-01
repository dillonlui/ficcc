---
id: T02
parent: S03
milestone: M003
provides: []
requires: []
affects: []
key_files: ["src/pages/zh/events.astro", "src/pages/zh/give.astro"]
key_decisions: ["Used 活動 for events page title and 奉獻 for give page title", "Translated Bible verse to Chinese Union Version (哥林多後書 9:7)"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build succeeded. Verified dist/client/zh/events/index.html and dist/client/zh/give/index.html exist and contain expected Chinese characters (活動, 奉獻)."
completed_at: 2026-04-01T17:02:28.857Z
blocker_discovered: false
---

# T02: Created Chinese events and give pages at /zh/events/ and /zh/give/ with fully translated UI text, CMS-driven content, and Chinese fallback events

> Created Chinese events and give pages at /zh/events/ and /zh/give/ with fully translated UI text, CMS-driven content, and Chinese fallback events

## What Happened
---
id: T02
parent: S03
milestone: M003
key_files:
  - src/pages/zh/events.astro
  - src/pages/zh/give.astro
key_decisions:
  - Used 活動 for events page title and 奉獻 for give page title
  - Translated Bible verse to Chinese Union Version (哥林多後書 9:7)
duration: ""
verification_result: passed
completed_at: 2026-04-01T17:02:28.858Z
blocker_discovered: false
---

# T02: Created Chinese events and give pages at /zh/events/ and /zh/give/ with fully translated UI text, CMS-driven content, and Chinese fallback events

**Created Chinese events and give pages at /zh/events/ and /zh/give/ with fully translated UI text, CMS-driven content, and Chinese fallback events**

## What Happened

Cloned EN events page to src/pages/zh/events.astro — swapped getEvents('en') to getEvents('zh'), translated hero text, section headings (即將舉行的活動, 過往活動), empty state, and fallback events (主日崇拜, 主日學, 週五團契). Cloned EN give page to src/pages/zh/give.astro — translated all prose including Bible verse to Chinese Union Version (哥林多後書 9:7), giving methods (網上奉獻/PayPal, 支票奉獻, 現場奉獻), and updated contact link to /zh/contact.

## Verification

npm run build succeeded. Verified dist/client/zh/events/index.html and dist/client/zh/give/index.html exist and contain expected Chinese characters (活動, 奉獻).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 8600ms |
| 2 | `test -f dist/client/zh/events/index.html` | 0 | ✅ pass | 100ms |
| 3 | `test -f dist/client/zh/give/index.html` | 0 | ✅ pass | 100ms |
| 4 | `grep -q '活動' dist/client/zh/events/index.html` | 0 | ✅ pass | 100ms |
| 5 | `grep -q '奉獻' dist/client/zh/give/index.html` | 0 | ✅ pass | 100ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/pages/zh/events.astro`
- `src/pages/zh/give.astro`


## Deviations
None.

## Known Issues
None.
