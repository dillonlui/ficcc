---
id: M003
title: "ZH Content & Bilingual Toggle"
status: complete
completed_at: 2026-04-01T17:31:17.621Z
key_decisions:
  - D017: Language toggle uses anchor link navigation between / and /zh rather than JS-based toggle — ensures correct SSG page is served, no JS dependency, browser history works naturally
  - Bespoke ZH contact page with WeChat-first design rather than cloning EN 4-tab contact — matches Chinese ministry communication patterns
  - getAlternateUrl as single source of truth for all language-switching URL computation — used by Header toggle and SEO hreflang tags
  - Asymmetric route map (Record<string,string>) for /visit↔/zh/sundays pair — simple extensible pattern for non-parallel routes
  - Cookie stores target language (from toggle href) rather than current page language — semantically correct preference signal
  - basePath prop on MinistryCard for language-aware links without component duplication
key_files:
  - src/lib/navigation.ts — Shared nav config with getNavLinks, getFooterNav, getAlternateUrl
  - src/lib/navigation.test.ts — 20 Vitest unit tests for getAlternateUrl
  - src/layouts/BaseLayout.astro — Threads lang + alternateUrl to Header, Footer, SEO
  - src/components/Header.astro — Language-aware nav with toggle href
  - src/components/Footer.astro — Language-aware footer with lang-appropriate service times
  - src/components/SEO.astro — hreflang en/zh/x-default link tag emission
  - src/pages/zh/index.astro — ZH homepage
  - src/pages/zh/about/index.astro — ZH about with 1968-2009 history timeline
  - src/pages/zh/about/beliefs.astro — ZH beliefs with EFCA 11-point Statement of Faith
  - src/pages/zh/sundays.astro — ZH sundays with 7-stop bus route
  - src/pages/zh/contact.astro — Bespoke ZH contact with WeChat section
  - src/pages/zh/ministries/index.astro — ZH ministries listing (7 fellowships + 2 programs)
  - src/pages/zh/sermons/index.astro — ZH sermons listing
  - src/pages/zh/events.astro — ZH events page
  - src/pages/zh/give.astro — ZH give page with Chinese Union Version verse
  - vercel.json — 10 cross-domain redirects from cm.ficcc.org
  - sanity/migrations/cm-content.ts — Idempotent migration script for 4 ZH singletons
lessons_learned:
  - ZH page pattern (clone EN, swap queries to 'zh', Chinese fallback, lang='zh' to BaseLayout) scaled well across all 10 pages — establishing the pattern in S01 before parallel work paid off
  - Bespoke page design is the right call when ZH content needs differ significantly from EN (contact page WeChat-first vs EN form-first) — don't force translation when the UX should be different
  - Vercel adapter outputs static files to dist/client/ not dist/ — verification commands must account for this path prefix (K009)
  - CJK URL paths need both encoded and raw forms in redirect rules to handle browser-dependent encoding differences
  - Sanity migration scripts benefit from dry-run fallback when write token is absent — enables verification in CI/dev without credentials
---

# M003: ZH Content & Bilingual Toggle

**Built all Chinese Ministry pages with bespoke content, wired bilingual language toggle with hreflang SEO, and configured cm.ficcc.org migration redirects — completing the unified bilingual site.**

## What Happened

M003 delivered the complete Chinese-language side of the FICCC website in 5 slices over 11 tasks.

S01 established the ZH page pattern: extract shared nav config into src/lib/navigation.ts, make Header/Footer language-aware, then build 5 core ZH pages (Homepage, About with 1968-2009 history timeline, Beliefs with all 11 EFCA points, Staff, Sundays with 7-stop bus route). This pattern — clone EN structure, swap Sanity queries to 'zh', provide Chinese fallback content, pass lang='zh' to BaseLayout — became the template for all subsequent slices.

S02 added ZH ministries with 7 fellowship groups and 2 programs (Sunday School, Discipleship), plus a detail page template. Added basePath prop to MinistryCard for language-aware links without component duplication.

S03 completed 5 transactional pages: Sermons listing/detail, Events, Give (with Chinese Union Version Bible verse), and a bespoke Contact page with WeChat-first design — deliberately different from EN's 4-tab form layout to match Chinese ministry communication patterns.

S04 built the bilingual wiring: getAlternateUrl utility with asymmetric route support (/visit ↔ /zh/sundays), hreflang en/zh/x-default SEO tags on all pages, and a lang-pref cookie on toggle click. 20 Vitest unit tests cover all mapping cases — this is the project's first test suite.

S05 closed migration: 10 cross-domain 301 redirects from cm.ficcc.org paths (including CJK URL-encoded variants and catch-all) in vercel.json, plus an idempotent Sanity migration script populating 4 ZH singleton documents with actual CM content.

Total: 10 new ZH pages, language-aware shared components, 20 unit tests, 10 redirects, 1 migration script. Build succeeds in ~8.5s. All pages render with correct lang attributes.

## Success Criteria Results

- [x] **All ZH pages live with real CM content** — 10 ZH pages at dist/client/zh/ (homepage, about, beliefs, staff, sundays, ministries, sermons, events, give, contact). Migration script covers 4 ZH singletons.
- [x] **Language toggle works end-to-end** — EN→ZH and ZH→EN navigation confirmed on all page pairs. Asymmetric /visit↔/zh/sundays handled. 20 unit tests pass.
- [x] **hreflang tags on all bilingual pages** — SEO.astro emits hreflang="en", hreflang="zh", hreflang="x-default" with absolute URLs. Verified on EN and ZH about pages.
- [x] **7-stop bus route rendered on ZH Sundays** — Church→Hasbrouck→Collegetown→North Campus→Ithaca Commons→East Hill Plaza→Church. Content confirmed in built HTML.
- [x] **WeChat contact on ZH side** — Bespoke /zh/contact/ with brand-green WeChat icon, QR placeholder, simplified 3-field form.
- [x] **Church history (1983-2009) on ZH About** — Timeline expanded to 1968-2009 with 7 milestone entries. Exceeds spec.
- [x] **All CM content migrated from cm.ficcc.org** — 10 redirects in vercel.json (8 specific + CJK variant + catch-all). Migration script creates 4 ZH singletons.
- [x] **lang attribute correct** — EN pages: lang="en", ZH pages: lang="zh". Verified on homepage pair and about pages.

## Definition of Done Results

- [x] All 5 slices complete (S01 ✅, S02 ✅, S03 ✅, S04 ✅, S05 ✅)
- [x] All slice summaries written and verified
- [x] Cross-slice integration verified: S01 pattern used by S02/S03, S04 getAlternateUrl works with all /zh/ paths from S01-S03, S05 redirects target correct /zh/ pages
- [x] Build succeeds with all ZH pages in output
- [x] 20 unit tests pass (getAlternateUrl)
- [x] Milestone validation passed (verdict: pass, round 0)

## Requirement Outcomes

No REQUIREMENTS.md exists for this project. The milestone addressed informal goals from the roadmap vision:
- G1 (unified bilingual domain): ZH pages at /zh/ paths, cm.ficcc.org redirects configured
- G2 (ZH visitors find service time quickly): ZH homepage + sundays page with schedule and bus route
- G3 (CM content in Sanity): Migration script for 4 ZH singleton documents
- G5 (clear next steps for Chinese speakers): WeChat contact, fellowship groups, events, giving all accessible from ZH nav

## Deviations

History timeline expanded from planned 1983-2009 to 1968-2009 (7 entries). ZH Beliefs has 11 EFCA points vs EN's 8 (ZH is more complete per EFCA standard). T03 built bespoke ZH contact instead of cloning EN 4-tab contact. S05 added 2 extra redirects (CJK URL encoding variant + catch-all).

## Follow-ups

Run Sanity migration script with real SANITY_API_WRITE_TOKEN against production dataset before launch. Configure cm.ficcc.org DNS to point to Vercel for cross-domain redirects. Provide actual WeChat QR code image to replace placeholder. Wire ZH contact form backend (Turnstile + Resend) if server-side form handling needed for Chinese contact. ZH sermon content needs to be created in Sanity for detail pages to generate.
