---
id: T02
parent: S05
milestone: M001
provides: []
requires: []
affects: []
key_files: ["public/robots.txt", "vercel.json"]
key_decisions: ["HSTS max-age set to 63072000 (2 years) with includeSubDomains and preload per OWASP best practice"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "robots.txt exists with Sitemap directive. Build produces dist/sitemap-index.xml with valid XML. HSTS header present in vercel.json. Lighthouse CI passes all thresholds (performance, accessibility, SEO, best-practices) for / and /styleguide/."
completed_at: 2026-04-01T01:50:14.817Z
blocker_discovered: false
---

# T02: Created robots.txt with absolute Sitemap URL, added HSTS header to vercel.json, verified sitemap-index.xml generation, and confirmed all Lighthouse CI thresholds pass

> Created robots.txt with absolute Sitemap URL, added HSTS header to vercel.json, verified sitemap-index.xml generation, and confirmed all Lighthouse CI thresholds pass

## What Happened
---
id: T02
parent: S05
milestone: M001
key_files:
  - public/robots.txt
  - vercel.json
key_decisions:
  - HSTS max-age set to 63072000 (2 years) with includeSubDomains and preload per OWASP best practice
duration: ""
verification_result: passed
completed_at: 2026-04-01T01:50:14.818Z
blocker_discovered: false
---

# T02: Created robots.txt with absolute Sitemap URL, added HSTS header to vercel.json, verified sitemap-index.xml generation, and confirmed all Lighthouse CI thresholds pass

**Created robots.txt with absolute Sitemap URL, added HSTS header to vercel.json, verified sitemap-index.xml generation, and confirmed all Lighthouse CI thresholds pass**

## What Happened

Created public/robots.txt allowing all crawlers with absolute Sitemap directive. Added Strict-Transport-Security header (2-year max-age, includeSubDomains, preload) to vercel.json global headers. Verified sitemap-index.xml generation via npm run build. Ran Lighthouse CI with all 6 runs passing assertion thresholds across both URLs.

## Verification

robots.txt exists with Sitemap directive. Build produces dist/sitemap-index.xml with valid XML. HSTS header present in vercel.json. Lighthouse CI passes all thresholds (performance, accessibility, SEO, best-practices) for / and /styleguide/.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f public/robots.txt && grep -q 'Sitemap' public/robots.txt` | 0 | ✅ pass | 100ms |
| 2 | `npm run build && test -f dist/sitemap-index.xml` | 0 | ✅ pass | 7200ms |
| 3 | `grep -q 'Strict-Transport-Security' vercel.json` | 0 | ✅ pass | 100ms |
| 4 | `npm run lhci` | 0 | ✅ pass | 75700ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `public/robots.txt`
- `vercel.json`


## Deviations
None.

## Known Issues
None.
