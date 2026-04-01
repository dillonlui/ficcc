---
id: S01
parent: M003
milestone: M003
provides:
  - ZH page pattern for S02/S03 to follow
  - Language-aware Header/Footer for all ZH pages
  - src/lib/navigation.ts shared nav config
  - 5 ZH pages at /zh/ paths
requires:
  []
affects:
  - S02
  - S03
  - S04
key_files:
  - src/lib/navigation.ts
  - src/pages/zh/index.astro
  - src/pages/zh/about/index.astro
  - src/pages/zh/about/beliefs.astro
  - src/pages/zh/about/staff.astro
  - src/pages/zh/sundays.astro
  - src/components/Header.astro
  - src/components/Footer.astro
  - src/layouts/BaseLayout.astro
key_decisions:
  - D017: Language toggle uses anchor link navigation between / and /zh rather than JS-based toggle
  - History timeline uses CSS-only vertical left-border layout with dot markers
  - Bus route uses numbered circle stops with connecting line visual display
  - ZH Beliefs has all 11 EFCA points vs EN's 8
patterns_established:
  - ZH page pattern: clone EN counterpart at src/pages/zh/*, swap Sanity queries to 'zh', provide Chinese fallback content, pass lang='zh' to BaseLayout, use /zh/ internal links
  - Language-aware components: Header/Footer accept lang prop, use shared navigation config from src/lib/navigation.ts
  - Bespoke ZH content sections (timeline, bus route) as inline styled sections within page files
observability_surfaces:
  - None — static pages with no runtime behavior
drill_down_paths:
  - .gsd/milestones/M003/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M003/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M003/slices/S01/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T16:50:25.490Z
blocker_discovered: false
---

# S01: ZH Homepage & Core Pages

**Delivered 5 ZH pages (Homepage, About with history timeline, Beliefs with EFCA 11-point, Staff, Sundays with bus route) at /zh/ paths with language-aware Header/Footer and shared navigation config.**

## What Happened

Three tasks built the ZH page foundation. T01 extracted hardcoded EN nav links into src/lib/navigation.ts with getNavLinks(lang) and getFooterNav(lang) functions, then updated Header.astro and Footer.astro to accept a lang prop (default 'en'). BaseLayout now threads lang to both components. The language toggle was changed from a non-functional button to an anchor link for actual page navigation between / and /zh.

T02 created src/pages/zh/index.astro by cloning the EN homepage structure. All Sanity queries pass 'zh', fallback content uses Chinese text (歡迎回家, 主日崇拜, 根植聖經, etc.), all internal links point to /zh/ paths, and BaseLayout receives lang="zh". Components are language-agnostic — they render whatever props they receive.

T03 created the 4 remaining core pages: ZH About with a CSS-only vertical timeline covering 1968-2009 church history (7 milestone entries), ZH Beliefs with all 11 EFCA Statement of Faith points in Chinese (vs EN's 8 items), ZH Staff with Chinese role labels, and ZH Sundays with a 7-stop bus route visual display (Church → Hasbrouck → Collegetown → North Campus → Ithaca Commons → East Hill Plaza → Church).

All pages follow the same pattern: clone EN counterpart, swap queries to 'zh', provide Chinese fallback content, pass lang='zh' to BaseLayout, use /zh/ internal links. Build succeeds and all pages render correctly at dist/client/zh/.

## Verification

Build succeeds (8.6s). All 5 ZH pages exist at dist/client/zh/: index.html, about/index.html, about/beliefs/index.html, about/staff/index.html, sundays/index.html. Content verified: lang="zh" attribute present, 1983 history timeline content present in about page, Mitchell St bus route present in sundays page. EN pages unchanged — no Chinese nav labels leaked into EN homepage.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

History timeline expanded to 1968-2009 (7 entries) vs plan's 1983-2009. Beliefs page has 11 EFCA points vs EN's 8 items (ZH version is more complete per EFCA standard). Verification gate commands reference dist/zh/ but Vercel adapter outputs to dist/client/zh/ — all content is correct, path prefix differs.

## Known Limitations

Verification gate commands in the slice plan use dist/ paths but the Vercel adapter outputs static files to dist/client/. Future slice plans and verification gates should use dist/client/ as the base path (see K009).

## Follow-ups

None.

## Files Created/Modified

- `src/lib/navigation.ts` — New shared nav config module with getNavLinks(lang) and getFooterNav(lang)
- `src/components/Header.astro` — Added lang prop, uses navigation.ts, language toggle as anchor link
- `src/components/Footer.astro` — Added lang prop, uses navigation.ts for language-appropriate links and service times
- `src/layouts/BaseLayout.astro` — Threads lang prop to Header and Footer components
- `src/pages/zh/index.astro` — ZH homepage with Chinese fallback content
- `src/pages/zh/about/index.astro` — ZH about page with 1968-2009 history timeline
- `src/pages/zh/about/beliefs.astro` — ZH beliefs page with EFCA 11-point Statement of Faith in Chinese
- `src/pages/zh/about/staff.astro` — ZH staff page with Chinese role labels
- `src/pages/zh/sundays.astro` — ZH sundays page with 7-stop bus route visual display
