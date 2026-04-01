---
id: T02
parent: S04
milestone: M003
provides: []
requires: []
affects: []
key_files: ["src/layouts/BaseLayout.astro", "src/components/Header.astro", "src/components/SEO.astro"]
key_decisions: ["Cookie stores target language (derived from toggle href) rather than current language"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build succeeded. 20/20 vitest tests pass. All 6 verification greps pass: EN about→/zh/about, ZH about→/about, visit→/zh/sundays (asymmetric), hreflang tags present on both EN and ZH pages, cookie script present."
completed_at: 2026-04-01T17:15:09.217Z
blocker_discovered: false
---

# T02: Wired getAlternateUrl into BaseLayout → Header toggle href and SEO hreflang tags, with lang-pref cookie set on toggle click

> Wired getAlternateUrl into BaseLayout → Header toggle href and SEO hreflang tags, with lang-pref cookie set on toggle click

## What Happened
---
id: T02
parent: S04
milestone: M003
key_files:
  - src/layouts/BaseLayout.astro
  - src/components/Header.astro
  - src/components/SEO.astro
key_decisions:
  - Cookie stores target language (derived from toggle href) rather than current language
duration: ""
verification_result: passed
completed_at: 2026-04-01T17:15:09.218Z
blocker_discovered: false
---

# T02: Wired getAlternateUrl into BaseLayout → Header toggle href and SEO hreflang tags, with lang-pref cookie set on toggle click

**Wired getAlternateUrl into BaseLayout → Header toggle href and SEO hreflang tags, with lang-pref cookie set on toggle click**

## What Happened

Updated BaseLayout to import getAlternateUrl, compute alternate URLs, and thread them to Header (langToggleHref prop) and SEO (alternateUrl prop with absolute URL). Header falls back to previous hardcoded logic if prop not passed. SEO emits hreflang en/zh/x-default link tags when alternateUrl is provided. Added inline script that sets lang-pref cookie to the target language on .lang-toggle click.

## Verification

npm run build succeeded. 20/20 vitest tests pass. All 6 verification greps pass: EN about→/zh/about, ZH about→/about, visit→/zh/sundays (asymmetric), hreflang tags present on both EN and ZH pages, cookie script present.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 8900ms |
| 2 | `npx vitest run` | 0 | ✅ pass | 2700ms |
| 3 | `grep -q href=/zh/about dist/client/about/index.html` | 0 | ✅ pass | 100ms |
| 4 | `grep -q href=/about dist/client/zh/about/index.html` | 0 | ✅ pass | 100ms |
| 5 | `grep -q href=/zh/sundays dist/client/visit/index.html` | 0 | ✅ pass | 100ms |
| 6 | `grep -q hreflang=zh dist/client/about/index.html` | 0 | ✅ pass | 100ms |
| 7 | `grep -q hreflang=en dist/client/zh/about/index.html` | 0 | ✅ pass | 100ms |
| 8 | `grep -q lang-pref dist/client/about/index.html` | 0 | ✅ pass | 100ms |


## Deviations

Cookie script stores target language (from toggle href) instead of document.documentElement.lang — semantically correct since user is navigating to their preferred language.

## Known Issues

None.

## Files Created/Modified

- `src/layouts/BaseLayout.astro`
- `src/components/Header.astro`
- `src/components/SEO.astro`


## Deviations
Cookie script stores target language (from toggle href) instead of document.documentElement.lang — semantically correct since user is navigating to their preferred language.

## Known Issues
None.
