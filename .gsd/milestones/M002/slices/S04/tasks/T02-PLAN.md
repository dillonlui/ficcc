---
estimated_steps: 17
estimated_files: 2
skills_used: []
---

# T02: Build sermons listing page with series filter and sermon detail page with YouTube embed

Build both user-facing sermon pages. The listing page at /sermons shows a Hero, a series filter bar, and a grid of SermonCard components. The detail page at /sermons/[slug] shows sermon metadata and a YouTubeEmbed. Both use BaseLayout, try-catch CMS fetching with hardcoded fallbacks, and pure Astro patterns.

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

## Inputs

- ``src/lib/sanity.ts` — getSermons() and getSermonBySlug() helpers, Sermon interface with slug`
- ``src/components/SermonCard.astro` — card component with data-series attribute for filter wiring`
- ``src/components/YouTubeEmbed.astro` — responsive YouTube embed component`
- ``src/components/Hero.astro` — hero banner component`
- ``src/layouts/BaseLayout.astro` — page layout wrapper`
- ``src/pages/index.astro` — reference for CMS try-catch fetch pattern and page structure`

## Expected Output

- ``src/pages/sermons/index.astro` — sermon listing page with series filter and card grid`
- ``src/pages/sermons/[slug].astro` — sermon detail page with metadata and YouTube embed`

## Verification

npm run build 2>&1 | tail -5 && test -f src/pages/sermons/index.astro && test -f 'src/pages/sermons/[slug].astro' && ! grep -q 'client:' src/pages/sermons/index.astro && ! grep -q 'client:' 'src/pages/sermons/[slug].astro'
