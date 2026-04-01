---
id: T01
parent: S07
milestone: M001
provides: []
requires: []
affects: []
key_files: ["src/components/SEO.astro", "src/layouts/BaseLayout.astro"]
key_decisions: ["Used Astro.site from config for canonical/OG URLs rather than hardcoding domain", "Default JSON-LD uses @type Church with name/description/url", "SEO component accepts jsonLd override prop for page-specific structured data"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build exited 0. All 9 grep checks passed against dist/index.html: og:title, og:description, og:url, og:image, application/ld+json, Church, twitter:card, canonical."
completed_at: 2026-04-01T03:43:01.379Z
blocker_discovered: false
---

# T01: Created SEO.astro with full meta/OG/Twitter/JSON-LD markup and wired it into BaseLayout replacing raw title/description tags

> Created SEO.astro with full meta/OG/Twitter/JSON-LD markup and wired it into BaseLayout replacing raw title/description tags

## What Happened
---
id: T01
parent: S07
milestone: M001
key_files:
  - src/components/SEO.astro
  - src/layouts/BaseLayout.astro
key_decisions:
  - Used Astro.site from config for canonical/OG URLs rather than hardcoding domain
  - Default JSON-LD uses @type Church with name/description/url
  - SEO component accepts jsonLd override prop for page-specific structured data
duration: ""
verification_result: passed
completed_at: 2026-04-01T03:43:01.379Z
blocker_discovered: false
---

# T01: Created SEO.astro with full meta/OG/Twitter/JSON-LD markup and wired it into BaseLayout replacing raw title/description tags

**Created SEO.astro with full meta/OG/Twitter/JSON-LD markup and wired it into BaseLayout replacing raw title/description tags**

## What Happened

Built src/components/SEO.astro with typed Props interface accepting title, description, canonicalUrl, ogImage, ogType, lang, and jsonLd. The component renders title tag, meta description, canonical link, Open Graph tags, Twitter card tags, and JSON-LD script block defaulting to Church schema. All URLs are absolute via new URL() against Astro.site. Updated BaseLayout to import SEO and replace raw title/description with the SEO component.

## Verification

npm run build exited 0. All 9 grep checks passed against dist/index.html: og:title, og:description, og:url, og:image, application/ld+json, Church, twitter:card, canonical.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 7500ms |
| 2 | `grep -q 'og:title' dist/index.html` | 0 | ✅ pass | 50ms |
| 3 | `grep -q 'og:description' dist/index.html` | 0 | ✅ pass | 50ms |
| 4 | `grep -q 'og:url' dist/index.html` | 0 | ✅ pass | 50ms |
| 5 | `grep -q 'og:image' dist/index.html` | 0 | ✅ pass | 50ms |
| 6 | `grep -q 'application/ld+json' dist/index.html` | 0 | ✅ pass | 50ms |
| 7 | `grep -q 'Church' dist/index.html` | 0 | ✅ pass | 50ms |
| 8 | `grep -q 'twitter:card' dist/index.html` | 0 | ✅ pass | 50ms |
| 9 | `grep -q 'canonical' dist/index.html` | 0 | ✅ pass | 50ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/components/SEO.astro`
- `src/layouts/BaseLayout.astro`


## Deviations
None.

## Known Issues
None.
