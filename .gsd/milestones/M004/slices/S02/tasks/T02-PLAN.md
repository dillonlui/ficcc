---
estimated_steps: 26
estimated_files: 6
skills_used: []
---

# T02: Wire structured data per page type and add build verification test

Pass page-specific JSON-LD structured data from each page through BaseLayout to SEO, and write a verification test.

## Steps

1. **Create structured data helpers (`src/lib/structured-data.ts`)** — Export pure functions that build JSON-LD objects for each page type:
   - `buildChurchJsonLd()` → Church schema with name, description, url, address (429 Mitchell Street, Ithaca, NY 14850)
   - `buildWebSiteJsonLd(siteUrl: string)` → WebSite schema with name and url
   - `buildVideoObjectJsonLd(sermon: { title, date?, videoId, scripture?, speaker? })` → VideoObject with name, uploadDate, thumbnailUrl (YouTube), embedUrl
   - `buildEventJsonLd(event: { title, date?, location?, description? })` → Event with name, startDate, location as Place
   - `buildOrganizationJsonLd()` → Organization with name, url, address, foundingDate (1968)
   All functions return `Record<string, unknown>` with `@context: 'https://schema.org'`.

2. **Homepage (`src/pages/index.astro`)** — Import `buildChurchJsonLd` and `buildWebSiteJsonLd`. Pass an array (wrapped in `@graph`) as `jsonLd` to BaseLayout. Set `ogType='website'`.

3. **Sermon detail (`src/pages/sermons/[slug].astro`)** — Import `buildVideoObjectJsonLd`. Pass VideoObject jsonLd when `sermon.videoId` exists, otherwise pass default. Set `ogType='article'`. Pass a custom description (speaker + scripture) to BaseLayout.

4. **Events page (`src/pages/events.astro`)** — Import `buildEventJsonLd`. Build an ItemList of events. Pass as jsonLd to BaseLayout.

5. **About page (`src/pages/about/index.astro`)** — Import `buildOrganizationJsonLd`. Pass Organization jsonLd to BaseLayout.

6. **Write verification test (`src/lib/structured-data.test.ts`)** — Vitest tests validating:
   - `buildChurchJsonLd()` returns object with `@type: 'Church'` and required fields
   - `buildVideoObjectJsonLd()` returns `@type: 'VideoObject'` with embedUrl when videoId present
   - `buildEventJsonLd()` returns `@type: 'Event'` with startDate
   - `buildOrganizationJsonLd()` returns `@type: 'Organization'` with foundingDate

7. **Build and verify** — Run `npm test`. Run `npm run build`. Extract JSON-LD from built homepage HTML and confirm `@type` includes Church.

## Must-Haves

- [ ] Homepage emits Church + WebSite JSON-LD
- [ ] Sermon detail emits VideoObject JSON-LD (when videoId present)
- [ ] Events page emits Event JSON-LD per event
- [ ] About page emits Organization JSON-LD
- [ ] `src/lib/structured-data.test.ts` passes with `npm test`
- [ ] `npm run build` succeeds with all structured data in place

## Inputs

- ``src/layouts/BaseLayout.astro` — T01 output with jsonLd/ogImage/ogType forwarding`
- ``src/pages/index.astro` — homepage, needs Church+WebSite jsonLd`
- ``src/pages/sermons/[slug].astro` — sermon detail, needs VideoObject jsonLd`
- ``src/pages/events.astro` — events listing, needs Event jsonLd`
- ``src/pages/about/index.astro` — about page, needs Organization jsonLd`
- ``src/lib/sanity.ts` — Sermon and Event type definitions`

## Expected Output

- ``src/lib/structured-data.ts` — helper functions for building JSON-LD objects`
- ``src/lib/structured-data.test.ts` — Vitest tests validating JSON-LD structure`
- ``src/pages/index.astro` — passes Church+WebSite jsonLd to BaseLayout`
- ``src/pages/sermons/[slug].astro` — passes VideoObject jsonLd to BaseLayout`
- ``src/pages/events.astro` — passes Event jsonLd to BaseLayout`
- ``src/pages/about/index.astro` — passes Organization jsonLd to BaseLayout`

## Verification

npm test && npm run build && node -e "const fs=require('fs'); const html=fs.readFileSync('dist/client/index.html','utf8'); const m=html.match(/application\/ld\+json/g); if(!m||m.length<1) process.exit(1); console.log('JSON-LD found:', m.length)"
