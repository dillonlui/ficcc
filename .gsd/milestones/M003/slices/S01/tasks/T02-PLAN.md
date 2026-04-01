---
estimated_steps: 36
estimated_files: 1
skills_used: []
---

# T02: Build ZH Homepage with Chinese fallback content

## Description

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

## Inputs

- `src/pages/index.astro`
- `src/lib/navigation.ts`
- `src/layouts/BaseLayout.astro`

## Expected Output

- `src/pages/zh/index.astro`

## Verification

npm run build && test -f dist/zh/index.html && grep -q 'lang="zh"' dist/zh/index.html && grep -q '歡迎' dist/zh/index.html
