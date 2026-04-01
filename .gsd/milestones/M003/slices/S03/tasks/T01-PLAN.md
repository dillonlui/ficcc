---
estimated_steps: 3
estimated_files: 2
skills_used: []
---

# T01: Create ZH Sermons listing and detail pages

Clone EN sermons listing (src/pages/sermons/index.astro) to src/pages/zh/sermons/index.astro and EN sermon detail (src/pages/sermons/[slug].astro) to src/pages/zh/sermons/[slug].astro. Swap getSermons('en') to getSermons('zh'), translate all user-facing text to Chinese, change internal links to /zh/sermons/ paths, pass lang='zh' to BaseLayout.

The listing page needs: Chinese title/description meta, Hero with Chinese text (證道/講道), series filter bar (labels stay dynamic from CMS), sermon grid with /zh/sermons/[slug] links, Chinese empty state text.

The detail page needs: getStaticPaths calling getSermons('zh'), Chinese meta labels (講員 for Speaker, 日期 for Date, 經文 for Scripture, 系列 for Series), date formatted with zh-CN locale, back link pointing to /zh/sermons with Chinese text, lang='zh' to BaseLayout.

## Inputs

- `src/pages/sermons/index.astro`
- `src/pages/sermons/[slug].astro`
- `src/lib/sanity.ts`
- `src/components/SermonCard.astro`
- `src/components/Hero.astro`
- `src/components/YouTubeEmbed.astro`
- `src/layouts/BaseLayout.astro`

## Expected Output

- `src/pages/zh/sermons/index.astro`
- `src/pages/zh/sermons/[slug].astro`

## Verification

npm run build && test -f dist/client/zh/sermons/index.html && grep -q 'lang="zh"' dist/client/zh/sermons/index.html && grep -q '講' dist/client/zh/sermons/index.html
