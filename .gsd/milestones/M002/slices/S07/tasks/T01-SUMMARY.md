---
id: T01
parent: S07
milestone: M002
provides: []
requires: []
affects: []
key_files: ["sanity/schemas/singletons/resourcesPage.ts", "sanity/schemas/index.ts", "src/lib/sanity.ts", "src/pages/resources.astro", "public/newcomer-recommendations.pdf", "public/readathon4.pdf"]
key_decisions: ["Resource categories modeled as nested array-of-objects matching em.ficcc.org structure", "Resource items typed as article/pdf/link with conditional link behavior"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build succeeds with /resources/index.html rendered. T01 verification command passes all four checks: build includes resources, schema registered, GROQ helper present, no client: directives."
completed_at: 2026-04-01T14:31:27.999Z
blocker_discovered: false
---

# T01: Built /resources page with resourcesPage Sanity schema, GROQ helper, and full hardcoded fallback content migrated from em.ficcc.org

> Built /resources page with resourcesPage Sanity schema, GROQ helper, and full hardcoded fallback content migrated from em.ficcc.org

## What Happened
---
id: T01
parent: S07
milestone: M002
key_files:
  - sanity/schemas/singletons/resourcesPage.ts
  - sanity/schemas/index.ts
  - src/lib/sanity.ts
  - src/pages/resources.astro
  - public/newcomer-recommendations.pdf
  - public/readathon4.pdf
key_decisions:
  - Resource categories modeled as nested array-of-objects matching em.ficcc.org structure
  - Resource items typed as article/pdf/link with conditional link behavior
duration: ""
verification_result: passed
completed_at: 2026-04-01T14:31:28.000Z
blocker_discovered: false
---

# T01: Built /resources page with resourcesPage Sanity schema, GROQ helper, and full hardcoded fallback content migrated from em.ficcc.org

**Built /resources page with resourcesPage Sanity schema, GROQ helper, and full hardcoded fallback content migrated from em.ficcc.org**

## What Happened

Created the resourcesPage singleton schema with hero fields and nested resourceCategories array. Registered it in the schema index with EN/ZH singleton doc IDs. Added ResourcesPage interface and getResourcesPage() GROQ helper to sanity.ts. Built the Astro page at /resources with CMS-fetch-with-fallback pattern covering all four categories from em.ficcc.org: Spiritual Growth articles, Bible Readathon PDF, Newcomer Recommendations PDF, and Cornell Campus Ministries list (7 organizations). Created placeholder PDFs in public/. Page is fully static with no client directives.

## Verification

npm run build succeeds with /resources/index.html rendered. T01 verification command passes all four checks: build includes resources, schema registered, GROQ helper present, no client: directives.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build + grep checks (T01 verification)` | 0 | ✅ pass | 10000ms |


## Deviations

None.

## Known Issues

Placeholder PDFs are text files — actual PDF assets need sourcing from em.ficcc.org. Spiritual Growth article URLs not linked since article pages don't exist yet.

## Files Created/Modified

- `sanity/schemas/singletons/resourcesPage.ts`
- `sanity/schemas/index.ts`
- `src/lib/sanity.ts`
- `src/pages/resources.astro`
- `public/newcomer-recommendations.pdf`
- `public/readathon4.pdf`


## Deviations
None.

## Known Issues
Placeholder PDFs are text files — actual PDF assets need sourcing from em.ficcc.org. Spiritual Growth article URLs not linked since article pages don't exist yet.
