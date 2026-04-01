---
estimated_steps: 25
estimated_files: 4
skills_used: []
---

# T01: Create aboutPage Sanity singleton schema and data layer helpers

Create the `aboutPage` Sanity singleton schema with structured fields for Who We Are narrative (heading, body blocks, image), beliefs array (title + rich-text content per item), and staff ordering. Register it in the schema index, singleton types, singleton doc IDs, and desk structure. Add TypeScript interfaces, GROQ helpers (`getAboutPage()`, `getStaff()`), and a `portableTextToHtml()` utility to `src/lib/sanity.ts`.

## Steps

1. Create `sanity/schemas/singletons/aboutPage.ts` with fields:
   - `whoWeAreHeading` (string, default 'Who We Are')
   - `whoWeAreBody` (array of blocks — Portable Text)
   - `whoWeAreImage` (image with hotspot)
   - `beliefs` (array of objects: `title` string + `content` array of blocks)
   - `staffOrder` (array of references to person documents)
   - `language` field (string, 'en'|'zh', required)
2. Register in `sanity/schemas/index.ts`: add export, add to `schemaTypes`, `singletonTypes`, `singletonDocIds` (EN + ZH entries with pattern `aboutPage-en`, `aboutPage-zh`)
3. Add aboutPage to desk structure in `sanity/structure.ts` — add entries to the Settings & Navigation list
4. In `src/lib/sanity.ts`:
   - Add `AboutPage` interface matching the schema shape
   - Add `Person` interface (name, role, bio blocks, photo, language)
   - Add `getAboutPage(language)` GROQ helper fetching the singleton
   - Add `getStaff(language)` GROQ helper fetching person documents ordered by name
   - Add `portableTextToHtml(blocks)` utility — converts simple Portable Text blocks (paragraphs, bold, italic, links) to HTML strings server-side. ~20-30 lines, handles `block` type with `normal` style, `strong`/`em` marks, and `link` annotations.
5. Verify `npm run build` succeeds

## Must-Haves

- [ ] aboutPage singleton schema file exists with all fields
- [ ] Schema registered in index.ts exports, schemaTypes, singletonTypes, singletonDocIds
- [ ] Desk structure includes aboutPage entries
- [ ] getAboutPage() and getStaff() helpers exist in sanity.ts
- [ ] portableTextToHtml() converts blocks to HTML strings
- [ ] npm run build succeeds

## Inputs

- ``sanity/schemas/index.ts` — existing schema registration pattern to follow`
- ``sanity/structure.ts` — existing desk structure to extend`
- ``src/lib/sanity.ts` — existing GROQ helpers and type patterns to follow`
- ``sanity/schemas/documents/person.ts` — person schema shape for interface and query design`
- ``sanity/schemas/objects/accordionBlock.ts` — accordion item structure for beliefs field design`

## Expected Output

- ``sanity/schemas/singletons/aboutPage.ts` — new aboutPage singleton schema`
- ``sanity/schemas/index.ts` — updated with aboutPage registration`
- ``sanity/structure.ts` — updated with aboutPage desk entries`
- ``src/lib/sanity.ts` — updated with AboutPage/Person interfaces, getAboutPage(), getStaff(), portableTextToHtml()`

## Verification

test -f sanity/schemas/singletons/aboutPage.ts && grep -q 'aboutPage' sanity/schemas/index.ts && grep -q 'getAboutPage' src/lib/sanity.ts && grep -q 'getStaff' src/lib/sanity.ts && grep -q 'portableTextToHtml' src/lib/sanity.ts && npm run build
