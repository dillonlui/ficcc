# S04: Sanity Schema & Studio

**Goal:** Sanity Studio with all document types embedded in Astro at /admin, with schema definitions for all content models (pages, sermons, events, ministries, people, singletons) and reusable Portable Text blocks.
**Demo:** After this: Sanity Studio with all document types. Sample content created and queryable.

## Tasks
- [x] **T01: Installed Sanity v5, React 19, @sanity/astro, @astrojs/react and wired Studio at /admin as a client-only React component in static Astro build** — Install `@sanity/astro`, `@astrojs/react`, `sanity`, `react`, `react-dom` and wire the integrations into `astro.config.mjs`. Create root `sanity.config.ts` with empty schema types (will be populated in T02). Update `src/lib/sanity.ts` to use the `sanity:client` module from `@sanity/astro` or keep as thin wrapper. Create `sanity/structure.ts` skeleton for custom desk structure. Verify build succeeds with the new integrations.

## Steps

1. Run `npm install sanity @sanity/astro @astrojs/react react@18 react-dom@18 @sanity/vision`
2. Update `astro.config.mjs`: add `sanity()` integration with `projectId` from env, `dataset` from env, `studioBasePath: '/admin'`; add `react()` integration. Import both at top.
3. Create `sanity.config.ts` at project root with `defineConfig` — name: 'ficcc', title, projectId/dataset from env, plugins: `[structureTool(), visionTool()]`, schema: `{ types: [] }` (empty for now).
4. Create `sanity/structure.ts` exporting a structure builder function skeleton (will be populated in T02 when singleton types exist).
5. Update `src/lib/sanity.ts` to export the client — keep `@sanity/client` direct import since `sanity:client` from `@sanity/astro` may not be available in static mode.
6. Update `.env.example` to document all Sanity env vars needed by `@sanity/astro`.
7. Run `npm run build` to verify the integration doesn't break the static build.

## Must-Haves

- [ ] `@sanity/astro` and `@astrojs/react` listed in package.json dependencies
- [ ] `astro.config.mjs` imports and configures both integrations
- [ ] Root `sanity.config.ts` exists with valid Sanity config
- [ ] Build succeeds (`npm run build` exit 0)

## Verification

- `npm run build` exits 0
- `grep -q 'sanity' astro.config.mjs` confirms integration added
- `test -f sanity.config.ts` confirms root config exists
- `test -f sanity/structure.ts` confirms structure file exists
  - Estimate: 30m
  - Files: package.json, astro.config.mjs, sanity.config.ts, sanity/structure.ts, src/lib/sanity.ts, .env.example
  - Verify: npm run build && grep -q 'sanity' astro.config.mjs && test -f sanity.config.ts && test -f sanity/structure.ts
- [x] **T02: Defined all 12 Sanity schema types (5 documents, 2 singletons, 5 block types) with language fields, barrel export, and singleton-aware structure builder** — Create all schema type definitions under `sanity/schemas/`. This includes 5 document types (page, sermon, event, ministry, person), 2 singletons (siteSettings, navigation), 5 object/block types (heroBlock, imageMosaicBlock, accordionBlock, cardGridBlock, youtubeEmbedBlock), and a barrel export. Every document type gets a `language` field with `'en' | 'zh'` options per D003. Wire all schema types into `sanity.config.ts` and complete the structure builder with singleton handling.

## Key Design Decisions

- **D003**: Separate documents per language, not field-level i18n. Every doc type has `language: defineField({ type: 'string', options: { list: ['en', 'zh'] }, initialValue: 'en' })`
- **D005**: Sermon stores YouTube `videoId` (string), not full URL. Title, speaker, date, series, scripture reference, language.
- Singletons use document IDs like `siteSettings-en`, `siteSettings-zh`. Structure builder shows them as single-doc editors, not lists.
- Page `body` field uses an array of block references: heroBlock, imageMosaicBlock, accordionBlock, cardGridBlock, youtubeEmbedBlock, plus standard Portable Text blocks.
- Person type has name, role, bio (Portable Text), photo (image with hotspot).
- Ministry references person type for leader field.

## Steps

1. Create `sanity/schemas/objects/heroBlock.ts` — heading (string), subheading (string), backgroundImage (image), ctaText (string), ctaLink (string)
2. Create `sanity/schemas/objects/imageMosaicBlock.ts` — array of images with caption
3. Create `sanity/schemas/objects/accordionBlock.ts` — array of {title, content (Portable Text)}
4. Create `sanity/schemas/objects/cardGridBlock.ts` — array of inline cards (title, description, image, link)
5. Create `sanity/schemas/objects/youtubeEmbedBlock.ts` — videoId (string), caption (string)
6. Create `sanity/schemas/documents/person.ts` — name, role, bio, photo, language
7. Create `sanity/schemas/documents/sermon.ts` — title, speaker, date, series, scripture, videoId, language
8. Create `sanity/schemas/documents/event.ts` — title, date, endDate, time, location, description, recurring, language
9. Create `sanity/schemas/documents/ministry.ts` — name, description, leader (ref to person), meetingTime, language
10. Create `sanity/schemas/documents/page.ts` — title, slug, body (array of block types), language
11. Create `sanity/schemas/singletons/siteSettings.ts` — churchName, address, phone, email, socialLinks array, language
12. Create `sanity/schemas/singletons/navigation.ts` — navItems array (label, href, children), language
13. Create `sanity/schemas/index.ts` — barrel export aggregating all types
14. Update `sanity.config.ts` to import schema types from barrel export
15. Update `sanity/structure.ts` with full structure builder: singletons at top (one per language), document types below filtered by language
16. Run `npm run build` to verify all schemas are valid

## Must-Haves

- [ ] All 5 document types defined with language field
- [ ] Both singletons defined with language field
- [ ] All 5 Portable Text block types defined
- [ ] Barrel export in `sanity/schemas/index.ts` exports all types
- [ ] `sanity.config.ts` imports and registers all schema types
- [ ] Structure builder handles singletons as single-doc editors
- [ ] Build succeeds

## Verification

- `npm run build` exits 0
- `node -e "import('./sanity/schemas/index.ts')"` — won't work directly but `grep -c 'defineType' sanity/schemas/**/*.ts` counts schema files
- All 13 schema files exist under `sanity/schemas/`
- `sanity.config.ts` imports from `./sanity/schemas`
  - Estimate: 1h
  - Files: sanity/schemas/objects/heroBlock.ts, sanity/schemas/objects/imageMosaicBlock.ts, sanity/schemas/objects/accordionBlock.ts, sanity/schemas/objects/cardGridBlock.ts, sanity/schemas/objects/youtubeEmbedBlock.ts, sanity/schemas/documents/person.ts, sanity/schemas/documents/sermon.ts, sanity/schemas/documents/event.ts, sanity/schemas/documents/ministry.ts, sanity/schemas/documents/page.ts, sanity/schemas/singletons/siteSettings.ts, sanity/schemas/singletons/navigation.ts, sanity/schemas/index.ts, sanity.config.ts, sanity/structure.ts
  - Verify: npm run build && find sanity/schemas -name '*.ts' | wc -l | grep -q '1[0-9]' && grep -q 'schemas' sanity.config.ts
- [x] **T03: Added 6 typed GROQ query helpers to src/lib/sanity.ts, removed old studio/ directory, confirmed build and Lighthouse CI pass with no regressions** — Create reusable GROQ query helper functions in `src/lib/sanity.ts` that downstream slices will use to fetch content. Update CSP in `vercel.json` if Studio needs script-src for `cdn.sanity.io`. Remove the old standalone `studio/` directory. Run Lighthouse CI to confirm no performance regression from adding React + Sanity deps.

## Steps

1. Update `src/lib/sanity.ts` with typed GROQ query helpers: `getPageBySlug(slug, language)`, `getSermons(language)`, `getEvents(language)`, `getMinistries(language)`, `getSiteSettings(language)`, `getNavigation(language)`. Each returns a typed result using the Sanity client.
2. Check if `vercel.json` CSP `script-src` needs `https://cdn.sanity.io` for Studio. The Studio at `/admin` is a static HTML page that loads React client-side — its scripts come from the Astro build bundle, not from CDN. But verify by checking `@sanity/astro` output.
3. Remove `studio/sanity.config.ts` — replaced by root `sanity.config.ts`.
4. Remove `studio/` directory entirely if empty after config removal.
5. Run `npm run build` to verify everything still builds.
6. Run Lighthouse CI (`npm run lhci`) to verify perf score hasn't regressed below thresholds. The addition of React as a dependency should not affect production page bundles since `/admin` is a separate route.
7. Update `lighthouserc.cjs` if needed to handle the new `/admin` route (exclude it from assertions since it's a Studio page, not a content page).

## Must-Haves

- [ ] GROQ query helpers exported from `src/lib/sanity.ts`
- [ ] Old `studio/` directory removed
- [ ] Build succeeds
- [ ] Lighthouse CI passes or thresholds adjusted for new route

## Verification

- `npm run build` exits 0
- `! test -d studio` confirms old directory removed
- `grep -c 'export.*function\|export.*const.*=' src/lib/sanity.ts` shows multiple exports
- `npm run lhci` passes (or `npm run build` as minimum if lhci has env issues)
  - Estimate: 30m
  - Files: src/lib/sanity.ts, vercel.json, lighthouserc.cjs, studio/sanity.config.ts
  - Verify: npm run build && ! test -d studio && grep -q 'getPageBySlug\|getSermons' src/lib/sanity.ts
