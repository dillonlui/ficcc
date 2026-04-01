# S05: CM Content Migration — Research

**Date:** 2026-03-31

## Summary

S05 is straightforward content operations work: (1) write a Sanity migration script that creates ZH singleton documents with actual Chinese Ministry content from cm.ficcc.org, and (2) configure redirects from old cm.ficcc.org URLs to new /zh/ paths.

All 12 ZH pages already exist (built in S01-S03) with hardcoded Chinese fallback content. The Sanity schema already supports `language: 'zh'` on every document type, and singleton IDs follow the `{type}-{lang}` pattern (e.g. `homePage-zh`). The `singletonDocIds` array in `sanity/schemas/index.ts` already defines ZH singletons. The content to migrate is fully inventoried in `SITE-AUDIT.md` (section 3: cm.ficcc.org and section 5: Redirect Map).

No new schemas, no new pages, no new components. The ZH pages will simply render CMS data instead of fallbacks once the Sanity documents exist.

## Recommendation

1. **Sanity migration script** (`sanity/migrations/cm-content.ts` or `.ndjson`) — use `sanity dataset import` or `@sanity/client` `createOrReplace` to populate ZH singleton documents. The script should be idempotent (createOrReplace) so it can be re-run safely.

2. **Redirect map in vercel.json** — add a `redirects` array with 301 redirects from cm.ficcc.org paths to ficcc.org/zh/ paths. Vercel supports cross-domain redirects via the `source` field with hostname matching. Alternatively, if cm.ficcc.org is a separate Vercel project/domain, the redirects may need to be configured at the DNS/Vercel project level rather than in this project's vercel.json.

3. **Verify** — build succeeds, migration script runs without error, redirect config is syntactically valid.

## Implementation Landscape

### Key Files

- `SITE-AUDIT.md` — Complete content inventory from cm.ficcc.org (section 3) and redirect map (section 5). This is the source of truth for all content to migrate.
- `sanity/schemas/index.ts` — `singletonDocIds` array already defines ZH singleton IDs (homePage-zh, aboutPage-zh, siteSettings-zh, visitPage-zh, etc.)
- `sanity/schemas/singletons/*.ts` — Schema definitions showing exact field shapes for each singleton
- `src/lib/sanity.ts` — GROQ helpers already accept `language: 'zh'` — no changes needed
- `src/pages/zh/*.astro` — ZH pages with fallback content — no changes needed (they already try CMS first)
- `vercel.json` — Currently has `headers` only, needs `redirects` array added
- `astro.config.mjs` — Has Sanity integration config with project ID/dataset

### Content to Migrate (from SITE-AUDIT.md section 3)

| Sanity Singleton | Content Source | Key Fields |
|---|---|---|
| `homePage-zh` | cm.ficcc.org homepage | heroTitle: 歡迎回家, service times (中文崇拜 11:15am, 主日學), pillars, next steps |
| `aboutPage-zh` | cm.ficcc.org /home/about/ | Church history 1983-2009, EFCA 11-point beliefs, church stats (~150 members, ~20 baptisms/yr) |
| `siteSettings-zh` | cm.ficcc.org /home/contact/ | churchName, address (429 Mitchell St), phone (607-280-8898), email (ithacachen@yahoo.com), WeChat |
| `visitPage-zh` | cm.ficcc.org /home/worship/ | Bus route (7 stops), schedule, holiday/summer variations |

Document types (ministry, person, event) with `language: 'zh'` can also be populated but are lower priority — the hardcoded fallbacks in ZH pages already cover the essential content.

### Redirect Map (from SITE-AUDIT.md section 5)

| Old URL | New URL |
|---|---|
| cm.ficcc.org/ | ficcc.org/zh/ |
| cm.ficcc.org/home/about/ | ficcc.org/zh/about |
| cm.ficcc.org/home/faith/ | ficcc.org/zh/about/beliefs |
| cm.ficcc.org/home/sermons/ | ficcc.org/zh/sermons |
| cm.ficcc.org/home/worship/ | ficcc.org/zh/sundays |
| cm.ficcc.org/home/fellowships/ | ficcc.org/zh/ministries |
| cm.ficcc.org/home/教會事工/ | ficcc.org/zh/ministries |
| cm.ficcc.org/home/contact/ | ficcc.org/zh/contact |

**Note:** The audit listed `/zh/community` for fellowships, but no such page exists — S02 built `/zh/ministries` for fellowship groups. The redirect should point to `/zh/ministries`.

### Build Order

1. **Redirect map first** (vercel.json) — zero-risk, independent of Sanity, immediately verifiable by JSON validation. This is the most concrete deliverable.
2. **Migration script second** — write the script with content from SITE-AUDIT.md, using `@sanity/client` `createOrReplace`. Can be verified locally if Sanity credentials are available, or verified structurally (valid NDJSON, correct field shapes matching schema).
3. **Build verification** — `npm run build` still passes (should be unaffected since no page code changes).

### Verification Approach

- `npm run build` succeeds (no page changes, so this is a regression check)
- `vercel.json` is valid JSON with correct redirect structure
- Migration script produces valid documents matching schema field shapes
- Each redirect maps to a page that exists in `dist/client/zh/`

## Constraints

- **Cross-domain redirects** — cm.ficcc.org → ficcc.org requires that cm.ficcc.org is configured as a domain in the same Vercel project, OR the redirects are configured at the DNS level. The vercel.json `redirects` array can handle this if both domains point to the same Vercel deployment, but the planner should note this may require Vercel project configuration outside the codebase.
- **Sanity credentials** — The migration script needs `SANITY_PROJECT_ID`, `SANITY_DATASET`, and a write token to actually execute. The script should be written to be runnable but may not be executable in CI without credentials. Verification should focus on structural correctness (valid document shapes) rather than live execution.
- **No page code changes** — ZH pages already have fallback content and call CMS with `'zh'`. Once Sanity documents exist, pages render CMS data automatically. No Astro file modifications needed.

## Common Pitfalls

- **Unicode in vercel.json redirects** — The cm.ficcc.org URL `/home/教會事工/` contains CJK characters. Verify that vercel.json handles URL-encoded paths correctly (may need to use `%E6%95%99%E6%9C%83%E4%BA%8B%E5%B7%A5` encoding).
- **Singleton ID mismatch** — Migration script must use exact IDs from `singletonDocIds` (e.g. `homePage-zh`, not `homepage-zh`). Mismatched IDs create orphan documents that the Studio can't find.
- **Portable Text format** — Fields like `whoWeAreBody` on aboutPage expect Portable Text blocks, not plain strings. The migration script needs to wrap text content in proper `[{_type: 'block', _key: '...', children: [{_type: 'span', text: '...'}]}]` format.
