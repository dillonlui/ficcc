---
estimated_steps: 27
estimated_files: 7
skills_used: []
---

# T02: Write idempotent Sanity migration script for ZH singleton content

Create `sanity/migrations/cm-content.ts` — a TypeScript migration script using `@sanity/client` that populates 4 ZH singleton documents with actual Chinese Ministry content from cm.ficcc.org (sourced from SITE-AUDIT.md section 3).

Target documents and their singleton IDs (from sanity/schemas/index.ts `singletonDocIds`):
- `homePage-zh` (type: homePage) — heroTitle: 歡迎回家, service times (中文崇拜 11:15am, 主日學 9:45am), pillars, next steps
- `aboutPage-zh` (type: aboutPage) — whoWeAreBody with church history/stats, visionBody, churchStats array, beliefs array (11 EFCA points)
- `siteSettings-zh` (type: siteSettings) — churchName: 以撒迦中國播道會, address, phone, email, WeChat social link
- `visitPage-zh` (type: visitPage) — heroTitle: 主日崇拜, schedule (ZH service times), transportation (bus route info), FAQ items

Critical implementation details:
- Use `createOrReplace` for idempotency
- Body fields (whoWeAreBody, visionBody, whatToExpect, transportation) are Portable Text: `[{_type:'block', _key:'unique', children:[{_type:'span', _key:'unique', text:'...'}], markDefs:[], style:'normal'}]`
- `_key` values must be unique strings — use descriptive keys like 'hero-1', 'pillar-rooted' etc.
- Service times, pillars, next steps, schedule, stats, beliefs are typed object arrays with `_type` and `_key`
- Each document needs `_id`, `_type`, and `language: 'zh'`
- Script should be runnable via `npx ts-node sanity/migrations/cm-content.ts` or `npx tsx sanity/migrations/cm-content.ts`
- Reads SANITY_PROJECT_ID and SANITY_DATASET from env (with fallback to .env)
- Needs SANITY_API_WRITE_TOKEN env var for actual execution
- Include a dry-run mode that logs documents to console when no token is available

Content sources (from SITE-AUDIT.md section 3 and ZH page fallbacks in S01-S03):
- homePage-zh: 歡迎回家 hero, 中文崇拜/主日學 service times, 根植聖經/紮根社區/活出信仰 pillars
- aboutPage-zh: Church history (1983 founding through 2009), ~150 members, ~20 baptisms/yr, 18 ministers, 11 EFCA belief points
- siteSettings-zh: 以撒迦中國播道會, 429 Mitchell St, (607)280-8898, ithacachen@yahoo.com, WeChat: ithacachen
- visitPage-zh: ZH service schedule, 7-stop bus route, summer/holiday variations

Steps:
1. Read all 4 singleton schema files to confirm exact field names and types
2. Read ZH page fallback content from S01-S03 pages for accurate Chinese text
3. Create `sanity/migrations/cm-content.ts` with document definitions matching schemas exactly
4. Verify script compiles with `npx tsc --noEmit sanity/migrations/cm-content.ts` or dry-run execution
5. Verify document field names match schema definitions

## Inputs

- ``sanity/schemas/singletons/homePage.ts` — schema fields for homePage-zh`
- ``sanity/schemas/singletons/aboutPage.ts` — schema fields for aboutPage-zh`
- ``sanity/schemas/singletons/siteSettings.ts` — schema fields for siteSettings-zh`
- ``sanity/schemas/singletons/visitPage.ts` — schema fields for visitPage-zh`
- ``sanity/schemas/index.ts` — singletonDocIds array with exact IDs`
- ``SITE-AUDIT.md` — CM content inventory (section 3)`
- ``src/pages/zh/index.astro` — ZH homepage fallback content for reference`
- ``src/pages/zh/about/index.astro` — ZH about fallback content for reference`
- ``src/pages/zh/about/beliefs.astro` — ZH beliefs fallback content for reference`
- ``src/pages/zh/sundays.astro` — ZH sundays fallback content for reference`

## Expected Output

- ``sanity/migrations/cm-content.ts` — idempotent migration script with 4 ZH singleton documents matching schema field shapes`

## Verification

test -f sanity/migrations/cm-content.ts && node -e "require('fs').readFileSync('sanity/migrations/cm-content.ts','utf8')" && npx tsx sanity/migrations/cm-content.ts 2>&1 | head -20
