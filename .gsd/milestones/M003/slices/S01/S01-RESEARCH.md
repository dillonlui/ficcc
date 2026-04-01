# S01 — ZH Homepage & Core Pages — Research

**Date:** 2026-03-31

## Summary

The entire CMS and component infrastructure for ZH content is already in place. Every Sanity schema has a `language` field, every GROQ helper accepts a `language` parameter, and ZH singleton doc IDs are pre-registered in the schema barrel export (`homePage-zh`, `aboutPage-zh`, `visitPage-zh`, `navigation-zh`, `siteSettings-zh`). All Astro components are data-driven with no language assumptions — they accept props and render them.

The work is: create `src/pages/zh/` directory structure mirroring the EN pages, pass `'zh'` to all Sanity queries, provide Chinese fallback content for when the CMS is unreachable, and set `lang="zh"` on BaseLayout. The roadmap mentions two ZH-specific content features — a "1983-2009 history timeline" on About and a "7-stop bus route" on Sundays — which can be implemented as fallback content sections in the ZH page templates without schema changes.

## Recommendation

Clone the EN page structure into `src/pages/zh/` with these changes per page:
1. Call GROQ helpers with `'zh'` instead of `'en'`
2. Pass `lang="zh"` to BaseLayout (already sets `<html lang>`)
3. Provide Chinese hardcoded fallbacks mirroring the EN pattern
4. For ZH-specific sections (history timeline, bus route), add them directly in the page templates with fallback content — no schema changes needed since `whoWeAreBody` (portable text) and `transportation` (portable text) can hold this content when populated in the CMS

The Header and Footer currently have hardcoded EN nav links. For S01, the ZH pages should use a ZH-specific Header variant or pass language-aware nav links. However, the full language toggle wiring is S04's scope — S01 just needs the ZH pages to render with reasonable ZH navigation. The simplest approach: create a shared `navLinks` config module that returns links based on language, and use it in both Header and the ZH page headers.

**Important scope boundary:** S01 builds the pages. S04 wires the language toggle. S01 pages should link to `/zh/...` internally but don't need a working toggle.

## Implementation Landscape

### Key Files

- `src/pages/index.astro` — EN homepage. Clone to `src/pages/zh/index.astro`, change all queries to `'zh'`, provide Chinese fallbacks.
- `src/pages/about/index.astro` — EN about. Clone to `src/pages/zh/about/index.astro`. Add history timeline section with Chinese fallback content.
- `src/pages/about/beliefs.astro` — EN beliefs. Clone to `src/pages/zh/about/beliefs.astro`. EFCA 11-point statement of faith in Chinese (roadmap says "EFCA 11-point" — currently 8 items; ZH version should have 11 per EFCA).
- `src/pages/about/staff.astro` — EN staff. Clone to `src/pages/zh/about/staff.astro`. Straightforward — same component, `'zh'` queries.
- `src/pages/visit.astro` — EN visit/Sundays. Clone to `src/pages/zh/sundays.astro` (note: ZH page is called "Sundays" per roadmap, not "Visit"). Add bus route section with 7-stop route fallback.
- `src/lib/sanity.ts` — No changes needed. All helpers already accept `language` param.
- `src/layouts/BaseLayout.astro` — Already accepts `lang` prop, sets `<html lang>`. No changes needed.
- `src/components/Header.astro` — Currently hardcodes EN nav links. Needs to become language-aware or ZH pages need a way to pass ZH nav.
- `src/components/Footer.astro` — Also hardcodes EN nav and service times. Same concern.
- `sanity/schemas/index.ts` — Singleton doc IDs for ZH already registered. No changes needed.

### Build Order

1. **Header/Footer language awareness** — Extract nav links into a shared config or make Header/Footer accept a `lang` prop that switches internal links to `/zh/...`. This unblocks all ZH pages since every page uses BaseLayout→Header/Footer.
2. **ZH Homepage** (`src/pages/zh/index.astro`) — Highest visibility, proves the pattern works. Clone EN homepage, swap to `'zh'` queries and Chinese fallbacks.
3. **ZH About + History Timeline** (`src/pages/zh/about/index.astro`) — Add a timeline section for 1983-2009 church history as a ZH-specific feature.
4. **ZH Beliefs** (`src/pages/zh/about/beliefs.astro`) — EFCA 11-point statement in Chinese.
5. **ZH Staff** (`src/pages/zh/about/staff.astro`) — Simplest page, same component pattern.
6. **ZH Sundays** (`src/pages/zh/sundays.astro`) — Clone visit page, add 7-stop bus route section.

### Verification Approach

- `npm run build` succeeds with all ZH pages in the output (`dist/zh/index.html`, `dist/zh/about/index.html`, etc.)
- Dev server (`npm run dev`) renders each ZH page at `/zh/`, `/zh/about`, `/zh/about/beliefs`, `/zh/about/staff`, `/zh/sundays`
- Each page has `<html lang="zh">` in the output
- Chinese fallback content renders when CMS is unreachable (which is the current state — placeholder project ID)
- ZH-specific sections (history timeline, bus route) render on their respective pages
- All internal links on ZH pages point to `/zh/...` paths

## Constraints

- **No schema changes in S01.** The existing schemas (aboutPage, visitPage, homePage) already have portable text fields that can hold the ZH-specific content when CMS content is populated. Fallbacks in the page templates handle the interim.
- **Header/Footer are shared components.** Making them language-aware must not break EN pages. The `lang` prop approach is safest — default to `'en'` behavior when no prop is passed.
- **CMS is unreachable during builds** (placeholder project ID). All ZH pages must have complete Chinese fallback content so the build succeeds and pages render meaningfully.
- **ZH page naming differs from EN.** The EN "visit" page becomes ZH "sundays" (`/zh/sundays`). The EN "about" structure (`/about`, `/about/beliefs`, `/about/staff`) maps to the same ZH structure (`/zh/about`, `/zh/about/beliefs`, `/zh/about/staff`).

## Common Pitfalls

- **Forgetting `lang="zh"` on BaseLayout** — If omitted, the page renders with `<html lang="en">` which breaks CJK font loading, screen readers, and search engine language detection. Every ZH page must pass `lang="zh"`.
- **Internal links pointing to EN paths** — ZH pages must link to `/zh/...` for all internal navigation. Easy to miss in fallback content (e.g., next-steps CTA linking to `/visit` instead of `/zh/sundays`).
- **CJK font CSS already async-loaded** — No additional work needed for font handling. The `cjk-fonts.css` async pattern in BaseLayout applies globally. K001 is already handled.
