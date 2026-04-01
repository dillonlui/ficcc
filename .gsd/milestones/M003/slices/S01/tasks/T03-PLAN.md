---
estimated_steps: 53
estimated_files: 4
skills_used: []
---

# T03: Build ZH About (with history timeline), Beliefs (EFCA 11-point), Staff, and Sundays (with bus route) pages

## Description

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

## Inputs

- `src/pages/about/index.astro`
- `src/pages/about/beliefs.astro`
- `src/pages/about/staff.astro`
- `src/pages/visit.astro`
- `src/pages/zh/index.astro`
- `src/lib/navigation.ts`

## Expected Output

- `src/pages/zh/about/index.astro`
- `src/pages/zh/about/beliefs.astro`
- `src/pages/zh/about/staff.astro`
- `src/pages/zh/sundays.astro`

## Verification

npm run build && test -f dist/zh/about/index.html && test -f dist/zh/about/beliefs/index.html && test -f dist/zh/about/staff/index.html && test -f dist/zh/sundays/index.html && grep -q 'lang="zh"' dist/zh/about/index.html && grep -q '1983' dist/zh/about/index.html && grep -q 'Mitchell' dist/zh/sundays/index.html
