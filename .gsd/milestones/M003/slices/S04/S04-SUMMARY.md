---
id: S04
parent: M003
milestone: M003
provides:
  - getAlternateUrl utility for bilingual URL resolution
  - hreflang SEO tags on all bilingual pages
  - lang-pref cookie for language preference persistence
  - Vitest test infrastructure
requires:
  - slice: S01
    provides: ZH page structure and /zh/ route convention
affects:
  - S05
key_files:
  - src/lib/navigation.ts
  - src/lib/navigation.test.ts
  - src/layouts/BaseLayout.astro
  - src/components/Header.astro
  - src/components/SEO.astro
  - package.json
key_decisions:
  - Asymmetric route map as simple Record — only /visit↔/zh/sundays pair exists currently
  - NO_COUNTERPART list for EN-only pages falling back to other-language homepage
  - Cookie stores target language (derived from toggle href) rather than current page language
patterns_established:
  - getAlternateUrl as single source of truth for all language-switching URL computation — used by both Header toggle and SEO hreflang tags
  - Vitest unit testing infrastructure (first test suite in the project)
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M003/slices/S04/tasks/T01-SUMMARY.md
  - .gsd/milestones/M003/slices/S04/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T17:16:45.271Z
blocker_discovered: false
---

# S04: Language Toggle & Bilingual Wiring

**Language toggle navigates to correct counterpart page with asymmetric route support, hreflang SEO tags, and lang-pref cookie — backed by 20 unit tests**

## What Happened

Built the bilingual wiring in two tasks. T01 created `getAlternateUrl` in `src/lib/navigation.ts` — a pure function that maps any pathname to its counterpart in the other language. It handles standard `/zh/` prefix swapping, an asymmetric route map (`/visit` ↔ `/zh/sundays`), trailing-slash normalization, and fallback to the other-language homepage for EN-only pages (styleguide, admin, resources, 404). Installed Vitest and wrote 20 unit tests covering all cases.

T02 wired `getAlternateUrl` into the existing layout pipeline. BaseLayout computes the alternate URL from `Astro.url.pathname` and threads it to two consumers: Header (as `langToggleHref` prop replacing the previous hardcoded toggle) and SEO (as `alternateUrl` for hreflang tag emission). SEO now emits `hreflang="en"`, `hreflang="zh"`, and `hreflang="x-default"` link tags with absolute URLs on every bilingual page. An inline script on `.lang-toggle` click sets a `lang-pref` cookie storing the target language with 1-year expiry.

Cookie design decision: the script stores the *target* language (derived from the toggle href) rather than the current page's language. This is semantically correct — when a user clicks the toggle, they're expressing preference for the language they're navigating *to*.

## Verification

- `npm run build` succeeds (8.8s)
- `npx vitest run` — 20/20 tests pass (98ms)
- 6 verification greps on built output all pass:
  - EN `/about` toggle → `/zh/about` ✓
  - ZH `/zh/about` toggle → `/about` ✓
  - EN `/visit` toggle → `/zh/sundays` (asymmetric) ✓
  - `hreflang="zh"` present on EN about page ✓
  - `hreflang="en"` present on ZH about page ✓
  - `lang-pref` cookie script present ✓

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Cookie script stores target language (from toggle href) instead of current page language — a deliberate improvement over the plan's `document.documentElement.lang` approach.

## Known Limitations

None. All planned features delivered.

## Follow-ups

None.

## Files Created/Modified

- `src/lib/navigation.ts` — Added getAlternateUrl function with asymmetric route map, prefix swap, trailing-slash normalization, and no-counterpart fallback
- `src/lib/navigation.test.ts` — New file — 20 Vitest unit tests for getAlternateUrl
- `src/layouts/BaseLayout.astro` — Computes alternateUrl and threads to Header (langToggleHref) and SEO (alternateUrl); adds lang-pref cookie script
- `src/components/Header.astro` — Accepts langToggleHref prop, falls back to hardcoded logic if not provided
- `src/components/SEO.astro` — Emits hreflang en/zh/x-default link tags when alternateUrl provided
- `package.json` — Added vitest dev dependency and test script
