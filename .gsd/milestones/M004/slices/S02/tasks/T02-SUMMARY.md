---
id: T02
parent: S02
milestone: M004
provides: []
requires: []
affects: []
key_files: ["src/lib/structured-data.ts", "src/lib/structured-data.test.ts", "src/pages/index.astro", "src/pages/sermons/[slug].astro", "src/pages/events.astro", "src/pages/about/index.astro"]
key_decisions: ["Used @graph wrapper for homepage to combine Church and WebSite schemas in single JSON-LD block", "Events page uses ItemList schema wrapping individual Event items"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm test: 27 tests pass (7 structured data + 20 navigation). npm run build: succeeds. Homepage HTML contains application/ld+json with @graph containing Church and WebSite types. About page emits Organization with foundingDate. Events page emits ItemList with Event items."
completed_at: 2026-04-02T16:50:50.018Z
blocker_discovered: false
---

# T02: Created JSON-LD structured data helpers and wired Church+WebSite (home), VideoObject (sermon), Event ItemList (events), and Organization (about) through BaseLayout, with 7 passing Vitest tests

> Created JSON-LD structured data helpers and wired Church+WebSite (home), VideoObject (sermon), Event ItemList (events), and Organization (about) through BaseLayout, with 7 passing Vitest tests

## What Happened
---
id: T02
parent: S02
milestone: M004
key_files:
  - src/lib/structured-data.ts
  - src/lib/structured-data.test.ts
  - src/pages/index.astro
  - src/pages/sermons/[slug].astro
  - src/pages/events.astro
  - src/pages/about/index.astro
key_decisions:
  - Used @graph wrapper for homepage to combine Church and WebSite schemas in single JSON-LD block
  - Events page uses ItemList schema wrapping individual Event items
duration: ""
verification_result: passed
completed_at: 2026-04-02T16:50:50.019Z
blocker_discovered: false
---

# T02: Created JSON-LD structured data helpers and wired Church+WebSite (home), VideoObject (sermon), Event ItemList (events), and Organization (about) through BaseLayout, with 7 passing Vitest tests

**Created JSON-LD structured data helpers and wired Church+WebSite (home), VideoObject (sermon), Event ItemList (events), and Organization (about) through BaseLayout, with 7 passing Vitest tests**

## What Happened

Created src/lib/structured-data.ts with five pure builder functions for schema.org types. Wired homepage with Church+WebSite @graph, sermon detail with VideoObject (when videoId exists), events page with ItemList of Events, and about page with Organization (foundingDate 1968). Wrote 7 Vitest tests covering all builders including edge cases. All tests pass, build succeeds, and JSON-LD verified in built HTML output.

## Verification

npm test: 27 tests pass (7 structured data + 20 navigation). npm run build: succeeds. Homepage HTML contains application/ld+json with @graph containing Church and WebSite types. About page emits Organization with foundingDate. Events page emits ItemList with Event items.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm test` | 0 | ✅ pass | 2800ms |
| 2 | `npm run build` | 0 | ✅ pass | 10000ms |
| 3 | `node -e "...JSON-LD verification..."` | 0 | ✅ pass | 100ms |


## Deviations

None.

## Known Issues

Sermon detail pages not built without live CMS — VideoObject wiring verified via unit tests only.

## Files Created/Modified

- `src/lib/structured-data.ts`
- `src/lib/structured-data.test.ts`
- `src/pages/index.astro`
- `src/pages/sermons/[slug].astro`
- `src/pages/events.astro`
- `src/pages/about/index.astro`


## Deviations
None.

## Known Issues
Sermon detail pages not built without live CMS — VideoObject wiring verified via unit tests only.
