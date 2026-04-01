# S02: About / Beliefs / Staff

**Goal:** Deliver three identity pages — About (Who We Are), Beliefs, and Staff — all CMS-editable via an aboutPage Sanity singleton with hardcoded fallbacks, following established S01 patterns (pure Astro, scoped CSS, try-catch CMS fetches).
**Demo:** After this: Bespoke Who We Are layout, Beliefs accordion, Staff grid

## Tasks
- [x] **T01: Created aboutPage singleton schema with whoWeAre, beliefs, staffOrder fields plus GROQ helpers and portableTextToHtml utility** — Create the `aboutPage` Sanity singleton schema with structured fields for Who We Are narrative (heading, body blocks, image), beliefs array (title + rich-text content per item), and staff ordering. Register it in the schema index, singleton types, singleton doc IDs, and desk structure. Add TypeScript interfaces, GROQ helpers (`getAboutPage()`, `getStaff()`), and a `portableTextToHtml()` utility to `src/lib/sanity.ts`.

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
  - Estimate: 45m
  - Files: sanity/schemas/singletons/aboutPage.ts, sanity/schemas/index.ts, sanity/structure.ts, src/lib/sanity.ts
  - Verify: test -f sanity/schemas/singletons/aboutPage.ts && grep -q 'aboutPage' sanity/schemas/index.ts && grep -q 'getAboutPage' src/lib/sanity.ts && grep -q 'getStaff' src/lib/sanity.ts && grep -q 'portableTextToHtml' src/lib/sanity.ts && npm run build
- [x] **T02: Created /about and /about/beliefs pages with CMS-editable content and modified Accordion to render HTML via set:html** — Create the `/about` and `/about/beliefs` pages. Modify the Accordion component to accept HTML content via `set:html`. Both pages fetch from the `aboutPage` singleton via `getAboutPage()` with try-catch and hardcoded fallbacks.

## Steps

1. Modify `src/components/Accordion.astro`:
   - Change the content rendering from `<p>{item.content}</p>` to `<div class="accordion__content-inner"><Fragment set:html={item.content} /></div>`
   - This is non-breaking: plain text strings render identically, HTML strings render as HTML
   - Update the `.accordion__content p` styles to `.accordion__content` styles that work for both plain text and rich HTML
2. Create `src/pages/about/index.astro` — Who We Are page:
   - Import BaseLayout, use `getAboutPage()` wrapped in try-catch
   - Hardcoded fallback with real FICCC content (church history/mission narrative)
   - Render heading, body text (via `portableTextToHtml` or fallback), optional image
   - Use `urlForImage()` for any CMS images
   - Pure Astro with scoped CSS, responsive layout
3. Create `src/pages/about/beliefs.astro` — Beliefs page:
   - Import BaseLayout, Accordion, use `getAboutPage()` wrapped in try-catch
   - Hardcoded fallback beliefs array with real doctrinal statements (e.g., Scripture, God, Salvation, Church — use common evangelical statement of faith content)
   - Convert each belief's Portable Text content to HTML via `portableTextToHtml()`, or use fallback HTML strings
   - Pass items to Accordion component
   - Page intro text above the accordion
4. Verify both pages build and render

## Must-Haves

- [ ] Accordion accepts HTML content without breaking existing usage
- [ ] /about page renders Who We Are narrative with heading, body, optional image
- [ ] /about/beliefs page renders beliefs accordion with rich-text content
- [ ] Both pages use try-catch CMS fetch with realistic hardcoded fallbacks
- [ ] No client:* directives
- [ ] npm run build succeeds
  - Estimate: 45m
  - Files: src/components/Accordion.astro, src/pages/about/index.astro, src/pages/about/beliefs.astro
  - Verify: test -f src/pages/about/index.astro && test -f src/pages/about/beliefs.astro && grep -q 'set:html' src/components/Accordion.astro && ! grep -rq 'client:' src/pages/about/index.astro src/pages/about/beliefs.astro && npm run build
- [ ] **T03: Build Staff grid page with StaffCard component** — Create the `/about/staff` page with a responsive staff grid and a new StaffCard component. Fetches person documents via `getStaff()` with try-catch and hardcoded fallbacks.

## Steps

1. Create `src/components/StaffCard.astro`:
   - Props: name (string), role (string), photoUrl (string, optional)
   - Render a card with photo (1:1 aspect ratio, `object-fit: cover`), name, role
   - Use placeholder SVG or CSS gradient when no photo
   - Pure Astro with scoped CSS using CSS custom properties
   - Responsive: works as grid child
2. Create `src/pages/about/staff.astro`:
   - Import BaseLayout, StaffCard, use `getStaff()` wrapped in try-catch
   - Hardcoded fallback with 3-4 realistic staff entries (Pastor, Associate Pastor, etc.)
   - Use `urlForImage()` for person photos from CMS
   - CSS Grid layout: 1 col on mobile (< 640px), 2 col tablet, 3 col desktop
   - Page heading and optional intro text
   - No client:* directives
3. Verify the page builds and the grid is responsive

## Must-Haves

- [ ] StaffCard component renders photo, name, role with 1:1 aspect ratio photo container
- [ ] /about/staff page renders responsive grid of staff cards
- [ ] Try-catch CMS fetch with realistic hardcoded fallbacks
- [ ] No client:* directives
- [ ] npm run build succeeds
  - Estimate: 30m
  - Files: src/components/StaffCard.astro, src/pages/about/staff.astro
  - Verify: test -f src/components/StaffCard.astro && test -f src/pages/about/staff.astro && ! grep -rq 'client:' src/components/StaffCard.astro src/pages/about/staff.astro && npm run build
