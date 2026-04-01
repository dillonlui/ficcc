---
id: T01
parent: S04
milestone: M003
provides: []
requires: []
affects: []
key_files: ["src/lib/navigation.ts", "src/lib/navigation.test.ts", "package.json"]
key_decisions: ["Asymmetric route map as simple Record — only one pair exists", "NO_COUNTERPART list for EN-only pages falling back to other-language homepage"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npx vitest run --reporter=verbose: 20/20 tests pass, 1 test file, 95ms"
completed_at: 2026-04-01T17:12:46.612Z
blocker_discovered: false
---

# T01: Added getAlternateUrl utility with asymmetric route map, trailing-slash normalization, and homepage fallback — 20 Vitest unit tests pass

> Added getAlternateUrl utility with asymmetric route map, trailing-slash normalization, and homepage fallback — 20 Vitest unit tests pass

## What Happened
---
id: T01
parent: S04
milestone: M003
key_files:
  - src/lib/navigation.ts
  - src/lib/navigation.test.ts
  - package.json
key_decisions:
  - Asymmetric route map as simple Record — only one pair exists
  - NO_COUNTERPART list for EN-only pages falling back to other-language homepage
duration: ""
verification_result: passed
completed_at: 2026-04-01T17:12:46.613Z
blocker_discovered: false
---

# T01: Added getAlternateUrl utility with asymmetric route map, trailing-slash normalization, and homepage fallback — 20 Vitest unit tests pass

**Added getAlternateUrl utility with asymmetric route map, trailing-slash normalization, and homepage fallback — 20 Vitest unit tests pass**

## What Happened

Installed vitest, added test script to package.json, built getAlternateUrl in src/lib/navigation.ts with asymmetric route lookup, prefix swap logic, trailing-slash normalization, and no-counterpart fallback. Created 20 unit tests covering all specified cases.

## Verification

npx vitest run --reporter=verbose: 20/20 tests pass, 1 test file, 95ms

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx vitest run --reporter=verbose` | 0 | ✅ pass | 95ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/lib/navigation.ts`
- `src/lib/navigation.test.ts`
- `package.json`


## Deviations
None.

## Known Issues
None.
