---
estimated_steps: 38
estimated_files: 15
skills_used: []
---

# T02: Define all Sanity schema types — documents, singletons, and Portable Text blocks

Create all schema type definitions under `sanity/schemas/`. This includes 5 document types (page, sermon, event, ministry, person), 2 singletons (siteSettings, navigation), 5 object/block types (heroBlock, imageMosaicBlock, accordionBlock, cardGridBlock, youtubeEmbedBlock), and a barrel export. Every document type gets a `language` field with `'en' | 'zh'` options per D003. Wire all schema types into `sanity.config.ts` and complete the structure builder with singleton handling.

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

## Inputs

- ``sanity.config.ts` — root config from T01 to wire schemas into`
- ``sanity/structure.ts` — structure builder skeleton from T01`

## Expected Output

- ``sanity/schemas/objects/heroBlock.ts` — hero block object type`
- ``sanity/schemas/objects/imageMosaicBlock.ts` — image mosaic block type`
- ``sanity/schemas/objects/accordionBlock.ts` — accordion block type`
- ``sanity/schemas/objects/cardGridBlock.ts` — card grid block type`
- ``sanity/schemas/objects/youtubeEmbedBlock.ts` — YouTube embed block type`
- ``sanity/schemas/documents/person.ts` — person document type`
- ``sanity/schemas/documents/sermon.ts` — sermon document type`
- ``sanity/schemas/documents/event.ts` — event document type`
- ``sanity/schemas/documents/ministry.ts` — ministry document type`
- ``sanity/schemas/documents/page.ts` — page document type with modular body`
- ``sanity/schemas/singletons/siteSettings.ts` — site settings singleton`
- ``sanity/schemas/singletons/navigation.ts` — navigation singleton`
- ``sanity/schemas/index.ts` — barrel export of all schema types`
- ``sanity.config.ts` — updated with real schema imports`
- ``sanity/structure.ts` — completed structure builder with singleton handling`

## Verification

npm run build && find sanity/schemas -name '*.ts' | wc -l | grep -q '1[0-9]' && grep -q 'schemas' sanity.config.ts
