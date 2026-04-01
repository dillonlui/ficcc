---
estimated_steps: 15
estimated_files: 4
skills_used: []
---

# T01: Add slug to sermon schema, update data layer, and build SermonCard + YouTubeEmbed components

Foundation task: extend the sermon schema with a slug field for SEO-friendly URLs, update the TypeScript interface and add a getSermonBySlug() GROQ helper, then build two reusable components (SermonCard.astro for the listing grid, YouTubeEmbed.astro for responsive video embeds).

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

## Inputs

- ``sanity/schemas/documents/sermon.ts` — existing sermon schema to extend with slug field`
- ``src/lib/sanity.ts` — existing data layer with Sermon interface and getSermons() helper`
- ``src/components/Card.astro` — reference for card styling patterns and CSS custom property usage`
- ``src/components/Hero.astro` — reference for component structure conventions`

## Expected Output

- ``sanity/schemas/documents/sermon.ts` — updated with slug field`
- ``src/lib/sanity.ts` — updated Sermon interface with slug, updated getSermons projection, new getSermonBySlug() helper`
- ``src/components/SermonCard.astro` — new sermon card component with data-series attribute`
- ``src/components/YouTubeEmbed.astro` — new responsive YouTube embed component`

## Verification

grep -q 'slug' sanity/schemas/documents/sermon.ts && grep -q 'getSermonBySlug' src/lib/sanity.ts && test -f src/components/SermonCard.astro && test -f src/components/YouTubeEmbed.astro && grep -q 'youtube-nocookie.com' src/components/YouTubeEmbed.astro && ! grep -q 'client:' src/components/SermonCard.astro && ! grep -q 'client:' src/components/YouTubeEmbed.astro
