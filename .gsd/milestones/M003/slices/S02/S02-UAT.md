# S02: ZH Community & Ministries — UAT

**Milestone:** M003
**Written:** 2026-04-01T16:56:11.333Z

# S02: ZH Community & Ministries — UAT

**Milestone:** M003
**Written:** 2026-04-01

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: Static site — all output is build-time HTML. No runtime behavior to test.

## Preconditions

- `npm run build` completes successfully
- Build output exists in `dist/client/`

## Smoke Test

Open `dist/client/zh/ministries/index.html` in a browser. Page should display Chinese ministry content with `lang="zh"` on the html element.

## Test Cases

### 1. ZH ministries listing contains all 7 fellowship groups

1. Open `dist/client/zh/ministries/index.html`
2. Verify the following groups are listed: 福音組, 家庭組, 長青組, 校園組, 職青組, 兒童主日學, 青少年組
3. **Expected:** All 7 fellowship groups visible with Chinese names and descriptions

### 2. ZH ministries listing contains 2 ministry programs

1. Open `dist/client/zh/ministries/index.html`
2. Verify 主日學 (Sunday School) and 門徒訓練 (Discipleship) are listed
3. **Expected:** Both ministry programs visible under a separate section heading

### 3. ZH ministries page has correct lang attribute

1. View source of `dist/client/zh/ministries/index.html`
2. Check the `<html>` tag
3. **Expected:** `lang="zh"` attribute present

### 4. EN ministries page is not contaminated with Chinese content

1. Open `dist/client/ministries/index.html`
2. Search for Chinese characters (團契, 福音組, etc.)
3. **Expected:** No Chinese characters found in the EN page

### 5. ZH ministry detail page has Chinese labels

1. Open `src/pages/zh/ministries/[slug].astro`
2. Check back link text and meeting time label
3. **Expected:** Back link reads '← 返回事工', meeting time label reads '聚會時間', links to /zh/ministries

### 6. MinistryCard basePath works for both languages

1. Check `dist/client/zh/ministries/index.html` for ministry card links
2. Check `dist/client/ministries/index.html` for ministry card links
3. **Expected:** ZH cards link to `/zh/ministries/[slug]`, EN cards link to `/ministries/[slug]`

## Edge Cases

### No Sanity data available (fallback content)

1. Build with no Sanity API connection (placeholder project ID)
2. Open `dist/client/zh/ministries/index.html`
3. **Expected:** Page renders with hardcoded Chinese fallback content for all 9 groups/programs

## Failure Signals

- Build fails with errors in zh/ministries pages
- Chinese characters appear on EN ministries page
- Missing fellowship groups or ministry programs on ZH page
- lang attribute missing or set to 'en' on ZH page
- Ministry card links point to wrong language path

## Not Proven By This UAT

- Live Sanity CMS content rendering (tested with fallbacks only)
- Language toggle between EN and ZH ministries (covered by S04)
- Content migration from cm.ficcc.org (covered by S05)

## Notes for Tester

The detail page ([slug].astro) doesn't generate static pages without Sanity data — only the listing page can be fully verified from build output. The detail template was verified by source inspection.
