# S04: Pagefind Search Integration

**Goal:** Pagefind-powered search is integrated into the site — users can search sermons, pages, and ZH content from the header, with results scoped by language.
**Demo:** After this: Search UI on site. User types query, results show sermons, pages, and ZH content.

## Tasks
- [x] **T01: Installed astro-pagefind, configured Pagefind integration in Astro, and scoped search indexing to 25 content pages while excluding admin/styleguide/404** — Install `astro-pagefind` and configure the Astro build to produce Pagefind indexes. Add `data-pagefind-body` to all `<main id="main-content">` elements so only page content is indexed (not header/footer/nav). Add `data-pagefind-ignore="all"` to admin, styleguide, and 404 pages. Verify build produces pagefind index files in `dist/client/pagefind/`.

## Steps

1. Install `astro-pagefind` as a dependency: `npm install astro-pagefind`
2. Add `pagefind()` integration to `astro.config.mjs` integrations array (import from `astro-pagefind`)
3. Add `data-pagefind-body` attribute to all `<main id="main-content">` elements across all pages. Use a sed command or manual edit — there are ~27 pages under `src/pages/`. Every `<main id="main-content">` becomes `<main id="main-content" data-pagefind-body>`.
4. Add `data-pagefind-ignore="all"` to the top-level element in `src/pages/admin/index.astro`, `src/pages/styleguide.astro`, and `src/pages/404.astro` to exclude them from search indexing.
5. Run `npm run build` and verify `dist/client/pagefind/` directory exists with `pagefind.js` and index fragment files.

## Must-Haves

- [ ] `astro-pagefind` installed and configured in astro.config.mjs
- [ ] All `<main id="main-content">` elements have `data-pagefind-body`
- [ ] Admin, styleguide, and 404 pages have `data-pagefind-ignore="all"`
- [ ] Build succeeds and `dist/client/pagefind/pagefind.js` exists

## Verification

- `npm run build` exits 0
- `test -f dist/client/pagefind/pagefind.js` exits 0
- `ls dist/client/pagefind/fragment/` shows index fragment files
- `grep -r 'data-pagefind-body' src/pages/ --include='*.astro' | wc -l` shows count matching number of pages with `<main>`
- `grep -r 'data-pagefind-ignore' src/pages/admin/index.astro src/pages/styleguide.astro src/pages/404.astro | wc -l` equals 3
  - Estimate: 45m
  - Files: package.json, astro.config.mjs, src/pages/index.astro, src/pages/about/index.astro, src/pages/sermons/index.astro, src/pages/events.astro, src/pages/contact.astro, src/pages/visit.astro, src/pages/give.astro, src/pages/resources.astro, src/pages/styleguide.astro, src/pages/404.astro, src/pages/admin/index.astro
  - Verify: npm run build && test -f dist/client/pagefind/pagefind.js && ls dist/client/pagefind/fragment/ | head -5
- [x] **T02: Added Pagefind-powered search modal to site header with magnifying glass trigger, keyboard-accessible open/close, site-themed CSS, and 3 passing Playwright E2E tests** — Create a search modal component using astro-pagefind's `<Search>` component, styled with site CSS custom properties. Add a search trigger button (magnifying glass) to the Header component. Wire up open/close behavior with keyboard accessibility. Write a Playwright E2E test that verifies search functionality end-to-end.

## Steps

1. Create `src/components/SearchModal.astro` — a modal overlay containing the `<Search>` component from `astro-pagefind/components/Search`. Style with CSS variables mapping to site tokens: `--pagefind-ui-primary` → `var(--color-terracotta-dark)`, `--pagefind-ui-text` → `var(--color-text)`, `--pagefind-ui-background` → `var(--color-bg)`, `--pagefind-ui-border` → `var(--color-stone)`, `--pagefind-ui-font` → `var(--font-sans)`. Use `z-index: 200` to layer above header (100) and mobile nav (105). Include a close button.
2. Add a search trigger button to `src/components/Header.astro` — place a magnifying glass icon button (SVG) in the header, before the hamburger on mobile and in the nav area on desktop. The button toggles the search modal visibility.
3. Wire up client-side JS in SearchModal.astro: open on search button click, close on Escape key, close on clicking the backdrop, trap focus inside the modal when open. Follow the same vanilla JS pattern as the existing hamburger menu.
4. Ensure the search modal is responsive — full-width on mobile, centered max-width on desktop.
5. Create `e2e/search.spec.ts` Playwright test that: (a) navigates to the home page, (b) clicks the search button, (c) types a query like 'sermon', (d) verifies search results appear, (e) presses Escape to close the modal and verifies it's hidden. Run against a single desktop viewport (not all 4) since search behavior is viewport-independent.

## Must-Haves

- [ ] SearchModal component renders astro-pagefind Search with site-themed CSS
- [ ] Search trigger button visible in header on all pages
- [ ] Modal opens on click, closes on Escape and backdrop click
- [ ] z-index layering correct (above header and mobile nav)
- [ ] Playwright E2E test passes for search open → query → results → close flow

## Verification

- `npm run build` exits 0
- Serve site and visually verify search button appears in header
- `npx playwright test e2e/search.spec.ts --project=desktop` passes
- `grep -q 'pagefind-ui' src/components/SearchModal.astro` confirms component exists
  - Estimate: 1h
  - Files: src/components/SearchModal.astro, src/components/Header.astro, e2e/search.spec.ts
  - Verify: npm run build && npx playwright test e2e/search.spec.ts --project=desktop
