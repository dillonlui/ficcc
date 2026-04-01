# S02 ("ZH Community & Ministries") — Research

**Date:** 2026-03-31

## Summary

S02 is straightforward application of the ZH page pattern established in S01. The EN site has a single `/ministries` page (`src/pages/ministries/index.astro`) that combines community groups and ministries into one listing, plus a `ministries/[slug].astro` detail page for Sanity-driven ministry entries. The ZH version needs the same structure at `/zh/ministries/`, with Chinese fallback content for 7 fellowship groups and ministry programs (Sunday School, Discipleship).

The Sanity `ministry` schema already has a `language` field, and `getMinistries('zh')` works out of the box. The `MinistryCard` component is language-agnostic (renders whatever props it receives). The nav config in `src/lib/navigation.ts` already has the ZH ministries link pointing to `/zh/ministries`.

No new technology, no architectural decisions needed. Clone the EN pages, swap to 'zh', provide Chinese fallback content.

## Recommendation

Create two files: `src/pages/zh/ministries/index.astro` (community & ministries listing) and `src/pages/zh/ministries/[slug].astro` (detail page). Follow the S01 pattern exactly — clone EN counterpart, call Sanity with `'zh'`, provide Chinese fallback content, pass `lang='zh'` to BaseLayout, use `/zh/` internal links.

The ZH fallback content should have two sections: (1) Fellowship groups — 7 groups matching cm.ficcc.org content (e.g. 福音組, 家庭組, 長青組, 校園組, 職青組, 兒童主日學, 青少年組), and (2) Ministry programs — Sunday School (主日學) and Discipleship (門徒訓練).

This can be done in a single task since both files follow the established pattern and share the same verification.

## Implementation Landscape

### Key Files

- `src/pages/ministries/index.astro` — EN ministries listing to clone. Has Sanity CMS path (`getMinistries('en')`) and fallback groups array. Uses `MinistryCard` for CMS entries and inline `group-card` divs for fallback.
- `src/pages/ministries/[slug].astro` — EN ministry detail page to clone. Uses `getMinistryBySlug()` with leader info, meeting time, portable text description. Back link goes to `/ministries`.
- `src/components/MinistryCard.astro` — Wraps `Card` component, adds meeting time. Language-agnostic, no changes needed.
- `src/lib/sanity.ts` — `getMinistries(lang)` and `getMinistryBySlug(slug, lang)` already accept language parameter. No changes needed.
- `src/lib/navigation.ts` — Already has ZH nav link for `/zh/ministries`. No changes needed.
- `sanity/schemas/documents/ministry.ts` — Ministry schema with `language` field. No changes needed.

### Build Order

Single task: create both ZH pages simultaneously. No dependencies between the listing and detail page beyond sharing the same Sanity query. The listing page is the primary deliverable (fallback content with 7 fellowship groups + ministry programs); the detail page is a clone with `/zh/` back link.

### Verification Approach

1. `npm run build` succeeds
2. `test -f dist/client/zh/ministries/index.html` — ZH ministries listing exists
3. `grep -q '團契' dist/client/zh/ministries/index.html` — Chinese fellowship content present
4. `grep -q 'lang="zh"' dist/client/zh/ministries/index.html` — Correct language attribute
5. EN ministries page unchanged — no Chinese content leaked
