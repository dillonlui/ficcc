# S01: ZH Homepage & Core Pages

**Goal:** ZH Homepage and core pages (About, Beliefs, Staff, Sundays) render at /zh/ paths with Chinese fallback content, lang="zh", ZH-specific nav links, and bespoke sections (1983-2009 history timeline, EFCA 11-point statement, 7-stop bus route).
**Demo:** After this: ZH Homepage, About (with 1983-2009 history timeline), Beliefs (EFCA 11-point), Staff, Sundays (with 7-stop bus route)

## Tasks
- [x] **T01: Extracted nav config into src/lib/navigation.ts and made Header/Footer language-aware via lang prop so ZH pages render Chinese labels and hrefs while EN pages are unchanged** — ## Description

Header and Footer currently hardcode English nav links and labels. All ZH pages need ZH nav links pointing to `/zh/...` paths. This task extracts navigation config into a shared module, makes Header/Footer accept a `lang` prop, and threads `lang` from BaseLayout through to both components.

## Steps

1. Create `src/lib/navigation.ts` exporting a `getNavLinks(lang: 'en' | 'zh')` function that returns nav links with labels and hrefs appropriate to the language. EN links: Home→`/`, About→`/about`, Ministries→`/ministries`, Sermons→`/sermons`, Contact→`/contact`. ZH links: 首頁→`/zh`, 關於我們→`/zh/about`, 團契→`/zh/ministries`, 講道→`/zh/sermons`, 聯絡我們→`/zh/contact`. Export a similar `getFooterNav(lang)` function.
2. Update `src/components/Header.astro`:
   - Accept a `lang` prop (default `'en'`) via the Props interface and frontmatter destructuring.
   - Import and call `getNavLinks(lang)` instead of hardcoding the `navLinks` array.
   - Update the logo href to `lang === 'zh' ? '/zh' : '/'`.
   - Update the logo text: keep `FICCC` for EN, show `伊的家` for ZH (or both).
   - Update the language toggle button label to reflect current language.
3. Update `src/components/Footer.astro`:
   - Accept a `lang` prop (default `'en'`).
   - Import and call `getFooterNav(lang)` instead of hardcoding `footerNav`.
   - When `lang === 'zh'`, change the Service Times heading and items to Chinese.
   - Update footer link hrefs to use the language-appropriate paths.
   - Copyright text should use the Chinese church name when `lang === 'zh'`.
4. Update `src/layouts/BaseLayout.astro`:
   - Thread the existing `lang` prop to `<Header lang={lang} />` and `<Footer lang={lang} />`.
5. Verify EN pages are unchanged: `npm run build` succeeds, spot-check `dist/index.html` still has EN nav.

## Must-Haves

- [ ] `src/lib/navigation.ts` exists with typed nav link functions
- [ ] Header accepts `lang` prop, defaults to `'en'`, renders language-appropriate links
- [ ] Footer accepts `lang` prop, defaults to `'en'`, renders language-appropriate links and service times
- [ ] BaseLayout passes `lang` to Header and Footer
- [ ] EN pages build and render identically to before (no regression)

## Verification

- `npm run build` succeeds
- `grep -q '首頁' dist/index.html` returns false (EN homepage unchanged)
- `grep -q 'About' dist/index.html` returns true (EN nav present)

## Inputs

- `src/components/Header.astro` — current hardcoded EN header
- `src/components/Footer.astro` — current hardcoded EN footer
- `src/layouts/BaseLayout.astro` — layout that renders Header/Footer

## Expected Output

- `src/lib/navigation.ts` — shared nav config module
- `src/components/Header.astro` — language-aware header
- `src/components/Footer.astro` — language-aware footer
- `src/layouts/BaseLayout.astro` — threads lang to Header/Footer
  - Estimate: 45m
  - Files: src/lib/navigation.ts, src/components/Header.astro, src/components/Footer.astro, src/layouts/BaseLayout.astro
  - Verify: npm run build && ! grep -q '首頁' dist/index.html && grep -q 'About' dist/index.html
- [x] **T02: Built ZH Homepage with Chinese fallback content at /zh/ rendering lang="zh" with all Chinese text and /zh/ internal links** — ## Description

Create the ZH homepage at `src/pages/zh/index.astro` by cloning the EN homepage pattern. This page calls all Sanity helpers with `'zh'`, provides Chinese fallback content, passes `lang='zh'` to BaseLayout, and uses `/zh/...` paths for all internal links. This proves the end-to-end ZH page pattern works.

## Steps

1. Create `src/pages/zh/index.astro` using the EN homepage (`src/pages/index.astro`) as the structural template.
2. Set `lang='zh'` on BaseLayout: `<BaseLayout title={title} description={description} lang="zh">`.
3. Change all Sanity query calls to pass `'zh'`: `getHomePage('zh')`, `getSermons('zh')`, `getEvents('zh')`.
4. Replace all English fallback content with Chinese equivalents:
   - `title`: '伊的家華人基督教會 | First Ithaca Chinese Christian Church'
   - `description`: Chinese meta description
   - `heroTitle`: '歡迎回家' (Welcome Home)
   - `heroSubtitle`: Chinese subtitle about the church
   - `heroCtaText`: '計劃您的來訪' (Plan Your Visit)
   - `heroCtaHref`: '/zh/sundays' (note: ZH uses 'sundays' not 'visit')
   - `fallbackServiceTimes`: Chinese labels ('主日崇拜', '主日學')
   - `fallbackPillars`: Chinese versions of the 3 pillars
   - `fallbackNextSteps`: Chinese versions with `/zh/...` hrefs
5. Ensure the featured section links point to `/zh/sermons` and `/zh/events`.
6. Keep the same component imports (Hero, ServiceTimes, ImageMosaic, Pillars, Card, NextSteps) — they accept props and are language-agnostic.

## Must-Haves

- [ ] `src/pages/zh/index.astro` exists and follows the EN homepage structure
- [ ] All Sanity queries use `'zh'` language parameter
- [ ] Chinese fallback content is complete (not placeholder 'TODO')
- [ ] All internal links point to `/zh/...` paths
- [ ] `lang='zh'` passed to BaseLayout
- [ ] Build succeeds and `dist/zh/index.html` exists

## Verification

- `npm run build` succeeds
- `test -f dist/zh/index.html`
- `grep -q 'lang="zh"' dist/zh/index.html`
- `grep -q '歡迎' dist/zh/index.html` (Chinese content present)

## Inputs

- `src/pages/index.astro` — EN homepage as structural reference
- `src/lib/navigation.ts` — shared nav config from T01
- `src/layouts/BaseLayout.astro` — updated layout from T01

## Expected Output

- `src/pages/zh/index.astro` — ZH homepage
  - Estimate: 30m
  - Files: src/pages/zh/index.astro
  - Verify: npm run build && test -f dist/zh/index.html && grep -q 'lang="zh"' dist/zh/index.html && grep -q '歡迎' dist/zh/index.html
- [ ] **T03: Build ZH About (with history timeline), Beliefs (EFCA 11-point), Staff, and Sundays (with bus route) pages** — ## Description

Create the remaining 4 ZH core pages following the pattern established by the ZH Homepage in T02. Each page clones its EN counterpart, swaps queries to `'zh'`, provides Chinese fallback content, passes `lang='zh'`, and adjusts internal links to `/zh/...`. Two pages have ZH-specific bespoke content: About gets a 1983-2009 history timeline section, and Sundays gets a 7-stop bus route section.

## Steps

1. **ZH About** — Create `src/pages/zh/about/index.astro`:
   - Clone from `src/pages/about/index.astro`.
   - Call `getAboutPage('zh')` instead of `'en'`.
   - Chinese fallback content: heading '我們是誰', body text about FICCC history and mission in Chinese.
   - Chinese vision statement fallback.
   - Chinese stats labels.
   - **Add a History Timeline section** after the vision section. The timeline covers 1983-2009 key milestones of the Chinese Ministry. Implement as a styled `<section>` with a vertical timeline layout (CSS-only, no JS). Include ~5-7 key dates with Chinese descriptions (e.g., 1983: 華人查經班成立, 1986: 正式成立華人教會, etc.). This is hardcoded fallback content — the CMS `whoWeAreBody` portable text field can hold this when populated.

2. **ZH Beliefs** — Create `src/pages/zh/about/beliefs.astro`:
   - Clone from `src/pages/about/beliefs.astro`.
   - Call `getAboutPage('zh')`.
   - Provide the EFCA 11-point Statement of Faith in Chinese as the fallback beliefs array. The EN version has 8 items; the ZH version should have all 11 points per the EFCA statement: (1) God, (2) The Bible, (3) The Human Condition, (4) Jesus Christ, (5) Christ's Work on the Cross, (6) The Holy Spirit, (7) The Church, (8) Christian Living, (9) Christ's Return, (10) Response and Eternal Destiny, (11) Last Things. Each with a Chinese title and content paragraph.
   - Chinese intro paragraph.

3. **ZH Staff** — Create `src/pages/zh/about/staff.astro`:
   - Clone from `src/pages/about/staff.astro`.
   - Call `getStaff('zh')`.
   - Chinese fallback: heading '教牧同工', intro text in Chinese, same fallback staff names (names stay in English/Chinese as-is, roles translated to Chinese: '主任牧師', '副牧師', etc.).

4. **ZH Sundays** — Create `src/pages/zh/sundays.astro`:
   - Clone from `src/pages/visit.astro` (note: different URL — `/zh/sundays` not `/zh/visit`).
   - Call `getVisitPage('zh')`.
   - Chinese fallback content for all sections: schedule, what to expect, transportation, FAQ.
   - **Add a Bus Route section** after the transportation section. The 7-stop Sunday shuttle route: Church (429 Mitchell St) → Hasbrouck Apartments → Collegetown (College Ave & Dryden) → North Campus (Robert Purcell) → Ithaca Commons → East Hill Plaza → Church. Implement as a styled ordered list or visual route display (CSS-only). Include pickup times.
   - Chinese FAQ items.
   - Chinese ride request section text.

5. Verify all 4 pages build and contain correct content.

## Must-Haves

- [ ] `src/pages/zh/about/index.astro` exists with Chinese fallbacks and history timeline
- [ ] `src/pages/zh/about/beliefs.astro` exists with EFCA 11-point Statement of Faith in Chinese
- [ ] `src/pages/zh/about/staff.astro` exists with Chinese fallbacks
- [ ] `src/pages/zh/sundays.astro` exists with Chinese fallbacks and 7-stop bus route
- [ ] All 4 pages pass `lang='zh'` to BaseLayout
- [ ] All internal links on all 4 pages point to `/zh/...` paths
- [ ] Build succeeds with all 4 pages in dist

## Verification

- `npm run build` succeeds
- `test -f dist/zh/about/index.html && test -f dist/zh/about/beliefs/index.html && test -f dist/zh/about/staff/index.html && test -f dist/zh/sundays/index.html`
- `grep -q 'lang="zh"' dist/zh/about/index.html`
- `grep -q '1983' dist/zh/about/index.html` (history timeline present)
- `grep -q 'Mitchell' dist/zh/sundays/index.html` (bus route present)

## Inputs

- `src/pages/about/index.astro` — EN about page as structural reference
- `src/pages/about/beliefs.astro` — EN beliefs page as structural reference
- `src/pages/about/staff.astro` — EN staff page as structural reference
- `src/pages/visit.astro` — EN visit page as structural reference
- `src/pages/zh/index.astro` — ZH homepage from T02 as pattern reference
- `src/lib/navigation.ts` — shared nav config from T01

## Expected Output

- `src/pages/zh/about/index.astro` — ZH about page with history timeline
- `src/pages/zh/about/beliefs.astro` — ZH beliefs page with EFCA 11-point
- `src/pages/zh/about/staff.astro` — ZH staff page
- `src/pages/zh/sundays.astro` — ZH sundays page with bus route
  - Estimate: 1h30m
  - Files: src/pages/zh/about/index.astro, src/pages/zh/about/beliefs.astro, src/pages/zh/about/staff.astro, src/pages/zh/sundays.astro
  - Verify: npm run build && test -f dist/zh/about/index.html && test -f dist/zh/about/beliefs/index.html && test -f dist/zh/about/staff/index.html && test -f dist/zh/sundays/index.html && grep -q 'lang="zh"' dist/zh/about/index.html && grep -q '1983' dist/zh/about/index.html && grep -q 'Mitchell' dist/zh/sundays/index.html
