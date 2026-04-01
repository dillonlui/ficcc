# S01: Homepage

**Goal:** Homepage with hero, service times, photo mosaic, pillars, featured content, and next-steps cards — all CMS-editable via Sanity homePage singleton, with hardcoded fallbacks for empty CMS state.
**Demo:** After this: Homepage with hero, service times, photo mosaic, pillars, featured content, next-steps cards

## Tasks
- [x] **T01: Added homePage Sanity singleton schema with hero/service-times/mosaic/pillars/next-steps fields, registered in schema index, and added getHomePage() + urlForImage() helpers** — ## Description

Create the `homePage` Sanity singleton schema that defines the CMS-editable structure for the homepage content. Register it in the schema index, add it to singleton types and document IDs, and add a typed `getHomePage()` GROQ helper plus a `urlForImage()` helper for resolving Sanity image references to CDN URLs.

The schema follows the established `siteSettings` singleton pattern: per-language documents with IDs like `homePage-en`. Fields cover the four CMS-editable sections: hero (image, title, subtitle, CTA), service times (array of label+time pairs), pillars (array of title+description), and next-steps cards (array of title+body+href+image).

## Steps

1. Create `sanity/schemas/singletons/homePage.ts` with `defineType`/`defineField` following the `siteSettings.ts` pattern. Fields:
   - `heroImage` (type: `image`, hotspot enabled)
   - `heroTitle` (string, required)
   - `heroSubtitle` (string)
   - `heroCtaText` (string)
   - `heroCtaHref` (string)
   - `serviceTimes` (array of objects with `label` string + `time` string)
   - `pillars` (array of objects with `title` string + `description` text)
   - `nextSteps` (array of objects with `title` string + `body` string + `href` string + `image` type:image)
   - `language` (string, options list: en/zh, required, initialValue: 'en')
   - `mosaicImages` (array of images with alt text for the photo mosaic section)

2. Register in `sanity/schemas/index.ts`:
   - Add named export: `export { homePage } from './singletons/homePage';`
   - Add import and include in `schemaTypes` array
   - Add `'homePage'` to `singletonTypes` Set
   - Add entries to `singletonDocIds`: `{ id: 'homePage-en', type: 'homePage', title: 'Home Page (EN)' }` and ZH variant

3. Add `HomePage` interface to `src/lib/sanity.ts` matching the schema shape. Include `SanityImage` type for image fields.

4. Add `getHomePage(language)` GROQ helper following the `getSiteSettings` pattern.

5. Add `urlForImage(image: SanityImage): string` helper that constructs a Sanity CDN URL from an image asset reference. Pattern: `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}` where assetId is extracted from `image.asset._ref` by stripping `image-` prefix and replacing the last `-` with `.`. Accept optional width/format query params.

## Must-Haves

- [ ] homePage schema file exists with all fields defined
- [ ] Schema registered in index.ts with singleton types and doc IDs
- [ ] HomePage TypeScript interface matches schema shape
- [ ] getHomePage() GROQ helper works for both 'en' and 'zh'
- [ ] urlForImage() correctly parses Sanity image asset refs to CDN URLs

## Verification

- `test -f sanity/schemas/singletons/homePage.ts`
- `grep -q 'homePage' sanity/schemas/index.ts`
- `grep -q 'getHomePage' src/lib/sanity.ts`
- `grep -q 'urlForImage' src/lib/sanity.ts`
- `npm run build` succeeds (schema changes don't break the build)
  - Estimate: 30m
  - Files: sanity/schemas/singletons/homePage.ts, sanity/schemas/index.ts, src/lib/sanity.ts
  - Verify: test -f sanity/schemas/singletons/homePage.ts && grep -q 'homePage' sanity/schemas/index.ts && grep -q 'getHomePage' src/lib/sanity.ts && grep -q 'urlForImage' src/lib/sanity.ts && npm run build
- [ ] **T02: Build homepage section components and compose full page** — ## Description

Build the three new section-level Astro components (ServiceTimes, Pillars, NextSteps), create placeholder images for development, and compose the full homepage in `index.astro` by wiring all sections together with data from `getHomePage()` and existing GROQ helpers. Every section must render with hardcoded fallback content when Sanity returns null.

All components must be pure Astro with scoped CSS using only CSS custom properties from `global.css` (D010, K003). No `client:*` directives.

## Steps

1. Create placeholder images in `public/images/` for development:
   - `hero-placeholder.jpg` — a solid warm-toned placeholder (can generate via ImageMagick or use a small SVG)
   - `placeholder-1.jpg` through `placeholder-6.jpg` — for mosaic and card images
   - Keep them small (< 50KB each) since they're dev-only placeholders

2. Build `src/components/ServiceTimes.astro`:
   - Props: `times: { label: string; time: string }[]`
   - Layout: horizontal banner with warm background (`--color-stone`), centered content
   - Each time entry shows label (e.g. 'Sunday Gathering') and time (e.g. '9:45 AM')
   - Responsive: stack vertically on mobile, row on desktop
   - Use `--font-heading` for times, `--font-body` for labels

3. Build `src/components/Pillars.astro`:
   - Props: `pillars: { title: string; description: string }[]`
   - Layout: 3-column grid on desktop, single column on mobile
   - Each pillar: heading + paragraph in a card-like container
   - Section heading: 'Who We Are' or similar
   - Use `--space-16` vertical padding, `--color-bg` background

4. Build `src/components/NextSteps.astro`:
   - Props: `steps: { title: string; body: string; href: string; image?: string }[]`
   - Layout: grid of cards using existing `Card.astro` component
   - Section heading: 'Next Steps' or similar
   - 3-column on desktop, 1-column on mobile
   - Each card links to its `href`

5. Compose `src/pages/index.astro`:
   - Import and call `getHomePage('en')`, `getSermons('en')`, `getEvents('en')` at top of frontmatter
   - Define fallback data for when CMS returns null (hardcoded hero title, service times, pillars, next-steps)
   - Section order: Hero → ServiceTimes → ImageMosaic (placeholder images) → Pillars → Featured Content (latest sermon + next event as Cards) → NextSteps
   - Pass CMS data to components when available, fallbacks otherwise
   - Use `urlForImage()` for any Sanity image fields
   - Wrap in `BaseLayout` with proper title and description
   - Use proper section landmarks with `<section>` elements and heading hierarchy

6. Verify build and visual rendering:
   - Run `npm run build` — must succeed
   - Start dev server, check homepage renders all sections
   - Check 3 breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop)

## Must-Haves

- [ ] ServiceTimes component renders service schedule in horizontal/vertical layout
- [ ] Pillars component renders church values in responsive grid
- [ ] NextSteps component renders CTA cards using Card.astro
- [ ] index.astro composes all sections in correct order
- [ ] All sections have hardcoded fallback content for empty CMS state
- [ ] No client-side JS — no `client:*` directives in any new component
- [ ] All styles use CSS custom properties from global.css
- [ ] `npm run build` succeeds
- [ ] Page renders correctly at mobile, tablet, and desktop breakpoints

## Verification

- `npm run build` succeeds without errors
- `grep -q 'ServiceTimes' src/pages/index.astro && grep -q 'Pillars' src/pages/index.astro && grep -q 'NextSteps' src/pages/index.astro`
- `! grep -q 'client:' src/components/ServiceTimes.astro && ! grep -q 'client:' src/components/Pillars.astro && ! grep -q 'client:' src/components/NextSteps.astro`
- Visual verification via dev server at 3 breakpoints
  - Estimate: 1h30m
  - Files: src/pages/index.astro, src/components/ServiceTimes.astro, src/components/Pillars.astro, src/components/NextSteps.astro, public/images/hero-placeholder.jpg, public/images/placeholder-1.jpg
  - Verify: npm run build && grep -q 'ServiceTimes' src/pages/index.astro && grep -q 'Pillars' src/pages/index.astro && grep -q 'NextSteps' src/pages/index.astro && ! grep -q 'client:' src/components/ServiceTimes.astro && ! grep -q 'client:' src/components/Pillars.astro && ! grep -q 'client:' src/components/NextSteps.astro
