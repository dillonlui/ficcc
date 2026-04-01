# S04: Sermons Library — Research

**Date:** 2026-03-31

## Summary

The sermon infrastructure is largely in place. The `sermon` Sanity schema already defines all required fields (title, speaker, date, series, scripture, videoId, language) and the `Sermon` TypeScript interface plus `getSermons()` GROQ helper exist in `src/lib/sanity.ts`. The header and footer already link to `/sermons`. The homepage already fetches sermons and shows the latest one as a featured card.

What's missing: (1) the `/sermons` listing page with series-based filtering, (2) individual sermon detail pages at `/sermons/[slug]` with YouTube video embed, and (3) a `slug` field on the sermon schema to enable human-readable URLs. The `series` field is a plain string — filtering will use distinct series values from the fetched sermons rather than a separate series document type.

This is straightforward application of established patterns (BaseLayout, Hero, try-catch CMS fetch, hardcoded fallbacks, pure Astro + scoped CSS). No new technology or risky integration.

## Recommendation

Follow the established page patterns exactly. Add a `slug` field to the sermon schema for SEO-friendly URLs. Build the listing page with client-side series filtering (no JS framework needed — a small inline script toggling CSS classes or `hidden` attributes, consistent with the hamburger toggle pattern from D010). Build the detail page using Astro dynamic routes (`[slug].astro`) with a YouTube iframe embed. All new components should be pure Astro with scoped CSS per D010.

## Implementation Landscape

### Key Files

- `sanity/schemas/documents/sermon.ts` — Add `slug` field (type: `slug`, source: `title`). Existing fields are complete otherwise.
- `sanity/schemas/index.ts` — No changes needed (sermon already registered).
- `src/lib/sanity.ts` — Add `getSermonBySlug(slug, language)` helper. Add `getSermonSeries(language)` helper or just extract distinct series from `getSermons()` results. Update `Sermon` interface to include `slug` field.
- `src/pages/sermons/index.astro` — **New.** Listing page with Hero, sermon cards in a grid, series filter UI. Uses `getSermons()` with try-catch fallback.
- `src/pages/sermons/[slug].astro` — **New.** Detail page with `getStaticPaths()` returning all sermon slugs. Shows sermon metadata (title, speaker, date, scripture, series) and YouTube embed iframe. Uses `getSermonBySlug()`.
- `src/components/SermonCard.astro` — **New.** Card component for the listing grid, showing title, speaker, date, series badge, and scripture. Links to detail page.
- `src/components/YouTubeEmbed.astro` — **New.** Responsive 16:9 YouTube iframe component. Lazy-loaded, privacy-enhanced (`youtube-nocookie.com`). Reusable for other pages.

### Build Order

1. **Schema + data layer first** — Add slug to sermon schema, add `getSermonBySlug()` and update `Sermon` interface. This unblocks both pages.
2. **Reusable components** — Build `SermonCard.astro` and `YouTubeEmbed.astro`. These are independent of each other.
3. **Listing page** — `/sermons/index.astro` with Hero, series filter, and sermon card grid. Depends on SermonCard.
4. **Detail page** — `/sermons/[slug].astro` with metadata display and YouTube embed. Depends on YouTubeEmbed and `getSermonBySlug()`.

### Verification Approach

- `npm run build` succeeds with both new pages in output
- `/sermons` renders with fallback content when Sanity is empty
- `/sermons/[slug]` generates pages via `getStaticPaths()` (will be empty with no CMS data, but build shouldn't fail)
- YouTube embed uses `youtube-nocookie.com` domain and `loading="lazy"`
- No `client:*` directives on new components (series filter uses inline script only)
- Visual check at desktop (1280px) and mobile (375px) breakpoints

## Constraints

- **No client JS framework** — D010 mandates pure Astro components. Series filtering must use a small inline `<script>` or CSS-only approach.
- **Static site with dynamic routes** — `[slug].astro` needs `getStaticPaths()`. With no CMS data, it returns an empty array (zero pages generated), which is fine.
- **YouTube embed privacy** — Use `youtube-nocookie.com` to avoid setting tracking cookies before user interaction.
- **Slug migration** — Existing sermon documents in Sanity won't have slugs. The slug field should have `options: { source: 'title' }` for auto-generation. Pages should handle the case where no sermons exist gracefully.

## Common Pitfalls

- **Empty getStaticPaths** — If no sermons exist in Sanity (likely during development), `getStaticPaths()` returns `[]`. This is valid in Astro and won't cause build errors, but verify this doesn't trip any assertion.
- **Series filter with no JS framework** — Keep the inline script minimal. Data attributes on sermon cards (`data-series="Series Name"`) let the script toggle visibility without DOM querying complexity.
- **YouTube iframe performance** — Use `loading="lazy"` and consider a facade/placeholder image pattern if performance is a concern, though for a sermon detail page (below the fold on a specific page) lazy loading alone should suffice.
