---
estimated_steps: 35
estimated_files: 3
skills_used: []
---

# T01: Create homePage Sanity schema and data-fetching layer

## Description

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

## Inputs

- ``sanity/schemas/singletons/siteSettings.ts` — pattern for singleton schema definition`
- ``sanity/schemas/index.ts` — register new schema type, singletons, and doc IDs`
- ``src/lib/sanity.ts` — add HomePage interface, getHomePage() helper, urlForImage() helper`

## Expected Output

- ``sanity/schemas/singletons/homePage.ts` — new homePage singleton schema`
- ``sanity/schemas/index.ts` — updated with homePage registration`
- ``src/lib/sanity.ts` — updated with HomePage interface, getHomePage(), and urlForImage()`

## Verification

test -f sanity/schemas/singletons/homePage.ts && grep -q 'homePage' sanity/schemas/index.ts && grep -q 'getHomePage' src/lib/sanity.ts && grep -q 'urlForImage' src/lib/sanity.ts && npm run build
