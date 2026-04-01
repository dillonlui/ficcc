# S04: Sermons Library

**Goal:** Sermon library with series-based filtering at /sermons and individual sermon detail pages at /sermons/[slug] with YouTube video embed
**Demo:** After this: Sermon library with series filter, detail page with YouTube embed

## Tasks
- [x] **T01: Added slug field to sermon schema, updated Sermon interface/queries, and built SermonCard and YouTubeEmbed components** — Foundation task: extend the sermon schema with a slug field for SEO-friendly URLs, update the TypeScript interface and add a getSermonBySlug() GROQ helper, then build two reusable components (SermonCard.astro for the listing grid, YouTubeEmbed.astro for responsive video embeds).

## Steps

1. Add `slug` field to `sanity/schemas/documents/sermon.ts` — type `slug`, source `title`, required validation. Place it after the `title` field.
2. Update `Sermon` interface in `src/lib/sanity.ts` — add `slug?: SanitySlug` field. Update the `getSermons()` GROQ query to include `slug` in the projection.
3. Add `getSermonBySlug(slug: string, language?: Language)` helper to `src/lib/sanity.ts` — fetch a single sermon by `slug.current == $slug` with language filter.
4. Create `src/components/SermonCard.astro` — accepts title, speaker, date, series, scripture, href props. Renders as a card with series badge, date, speaker, scripture reference, and links to the detail page. Pure Astro with scoped CSS using CSS custom properties only.
5. Create `src/components/YouTubeEmbed.astro` — accepts videoId prop. Renders a responsive 16:9 iframe wrapper using `youtube-nocookie.com` domain, `loading="lazy"`, and `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"`. Pure Astro with scoped CSS.

## Must-Haves

- [ ] Sermon schema has slug field with `options: { source: 'title' }`
- [ ] Sermon interface includes `slug?: SanitySlug`
- [ ] getSermonBySlug() helper exists and filters by slug + language
- [ ] SermonCard.astro renders title, speaker, date, series badge, scripture, links to detail page
- [ ] SermonCard.astro includes `data-series` attribute on the root element for filter script
- [ ] YouTubeEmbed.astro uses `youtube-nocookie.com` and `loading="lazy"`
- [ ] No `client:*` directives on either component
  - Estimate: 45m
  - Files: sanity/schemas/documents/sermon.ts, src/lib/sanity.ts, src/components/SermonCard.astro, src/components/YouTubeEmbed.astro
  - Verify: grep -q 'slug' sanity/schemas/documents/sermon.ts && grep -q 'getSermonBySlug' src/lib/sanity.ts && test -f src/components/SermonCard.astro && test -f src/components/YouTubeEmbed.astro && grep -q 'youtube-nocookie.com' src/components/YouTubeEmbed.astro && ! grep -q 'client:' src/components/SermonCard.astro && ! grep -q 'client:' src/components/YouTubeEmbed.astro
- [ ] **T02: Build sermons listing page with series filter and sermon detail page with YouTube embed** — Build both user-facing sermon pages. The listing page at /sermons shows a Hero, a series filter bar, and a grid of SermonCard components. The detail page at /sermons/[slug] shows sermon metadata and a YouTubeEmbed. Both use BaseLayout, try-catch CMS fetching with hardcoded fallbacks, and pure Astro patterns.

## Steps

1. Create `src/pages/sermons/index.astro` — import BaseLayout, Hero, SermonCard. Fetch sermons via `getSermons()` wrapped in try-catch (empty array fallback). Extract distinct series values from fetched sermons. Render Hero with title 'Sermons' and a subtitle. Render a filter bar with 'All' button + one button per series. Render sermon cards in a responsive grid. Add an inline `<script>` that listens for filter button clicks and toggles `hidden` attribute on sermon cards based on `data-series` match. Show a 'No sermons available' message when the array is empty.
2. Style the listing page — series filter buttons as pill-style toggles with active state, responsive grid (3 columns desktop, 2 tablet, 1 mobile), consistent spacing using CSS custom properties.
3. Create `src/pages/sermons/[slug].astro` — implement `getStaticPaths()` that fetches all sermons and returns params with slug + full sermon as props. Import BaseLayout, Hero, YouTubeEmbed. Render Hero with sermon title. Show metadata block (speaker, date, scripture, series). Conditionally render YouTubeEmbed when videoId exists. Handle empty getStaticPaths gracefully (returns empty array when no sermons exist).
4. Style the detail page — metadata in a clean layout, YouTube embed centered with max-width, back link to /sermons.
5. Run `npm run build` to verify both pages build successfully and handle empty CMS state.

## Must-Haves

- [ ] /sermons/index.astro renders with Hero, filter bar, and sermon card grid
- [ ] Series filter uses inline script toggling hidden attribute — no client:* directives
- [ ] Filter has 'All' option that shows all sermons
- [ ] /sermons/[slug].astro uses getStaticPaths() with sermon data as props
- [ ] Detail page shows sermon metadata (title, speaker, date, scripture, series)
- [ ] Detail page conditionally renders YouTubeEmbed when videoId is present
- [ ] Both pages use BaseLayout and try-catch CMS fetch pattern
- [ ] npm run build succeeds with empty CMS (zero sermons)
- [ ] No client:* directives on either page
  - Estimate: 1h
  - Files: src/pages/sermons/index.astro, src/pages/sermons/[slug].astro
  - Verify: npm run build 2>&1 | tail -5 && test -f src/pages/sermons/index.astro && test -f 'src/pages/sermons/[slug].astro' && ! grep -q 'client:' src/pages/sermons/index.astro && ! grep -q 'client:' 'src/pages/sermons/[slug].astro'
