---
id: T02
parent: S03
milestone: M002
provides: []
requires: []
affects: []
key_files: ["src/pages/visit.astro"]
key_decisions: ["Used backtick template literals for FAQ answers containing apostrophes", "Built schedule as custom card grid (not ServiceTimes) to support description field", "Embedded Google Maps iframe in transportation section"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "All 9 verification checks pass: file exists, Accordion component used, getVisitPage present, no client: directives, npm run build exits 0 with /visit in output, plus all 4 slice-level checks (visitPage schema exists, registered in index, getVisitPage and VisitPage in sanity.ts)."
completed_at: 2026-04-01T13:41:17.382Z
blocker_discovered: false
---

# T02: Built complete /visit page with Hero, Sunday schedule cards, what-to-expect, transportation/directions with embedded map, and 6-question FAQ accordion — all CMS-wired with hardcoded fallbacks

> Built complete /visit page with Hero, Sunday schedule cards, what-to-expect, transportation/directions with embedded map, and 6-question FAQ accordion — all CMS-wired with hardcoded fallbacks

## What Happened
---
id: T02
parent: S03
milestone: M002
key_files:
  - src/pages/visit.astro
key_decisions:
  - Used backtick template literals for FAQ answers containing apostrophes
  - Built schedule as custom card grid (not ServiceTimes) to support description field
  - Embedded Google Maps iframe in transportation section
duration: ""
verification_result: passed
completed_at: 2026-04-01T13:41:17.382Z
blocker_discovered: false
---

# T02: Built complete /visit page with Hero, Sunday schedule cards, what-to-expect, transportation/directions with embedded map, and 6-question FAQ accordion — all CMS-wired with hardcoded fallbacks

**Built complete /visit page with Hero, Sunday schedule cards, what-to-expect, transportation/directions with embedded map, and 6-question FAQ accordion — all CMS-wired with hardcoded fallbacks**

## What Happened

Created src/pages/visit.astro following the index.astro CMS-fetch pattern. The page fetches visitPage data via getVisitPage('en') with try-catch fallback. Five content sections: Hero (reused component), Schedule (custom card grid with time + label + description), What to Expect (portable text or fallback HTML), Getting Here (two-column with transportation text and Google Maps iframe), and FAQ (6 items via Accordion component). All scoped CSS using only global.css custom properties. Responsive layout. No client directives.

## Verification

All 9 verification checks pass: file exists, Accordion component used, getVisitPage present, no client: directives, npm run build exits 0 with /visit in output, plus all 4 slice-level checks (visitPage schema exists, registered in index, getVisitPage and VisitPage in sanity.ts).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f src/pages/visit.astro` | 0 | ✅ pass | 100ms |
| 2 | `grep -q 'Accordion' src/pages/visit.astro` | 0 | ✅ pass | 100ms |
| 3 | `grep -q 'getVisitPage' src/pages/visit.astro` | 0 | ✅ pass | 100ms |
| 4 | `npm run build` | 0 | ✅ pass | 7900ms |
| 5 | `test -f sanity/schemas/singletons/visitPage.ts` | 0 | ✅ pass | 100ms |
| 6 | `grep -q 'visitPage' sanity/schemas/index.ts` | 0 | ✅ pass | 100ms |


## Deviations

Switched two FAQ answer strings from single quotes to backtick template literals to fix curly apostrophe parse errors.

## Known Issues

None.

## Files Created/Modified

- `src/pages/visit.astro`


## Deviations
Switched two FAQ answer strings from single quotes to backtick template literals to fix curly apostrophe parse errors.

## Known Issues
None.
