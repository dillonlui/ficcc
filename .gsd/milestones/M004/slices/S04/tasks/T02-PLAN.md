---
estimated_steps: 18
estimated_files: 3
skills_used: []
---

# T02: Build search UI in header and add Playwright E2E test

Create a search modal component using astro-pagefind's `<Search>` component, styled with site CSS custom properties. Add a search trigger button (magnifying glass) to the Header component. Wire up open/close behavior with keyboard accessibility. Write a Playwright E2E test that verifies search functionality end-to-end.

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

## Inputs

- ``src/components/Header.astro` — existing header to add search trigger to`
- ``src/styles/global.css` — CSS custom properties for theming search UI`
- ``astro.config.mjs` — astro-pagefind already configured (from T01)`
- ``dist/client/pagefind/pagefind.js` — pagefind index exists (from T01 build)`
- ``e2e/smoke.spec.ts` — reference for existing E2E test patterns and setup`

## Expected Output

- ``src/components/SearchModal.astro` — search modal component with styled Pagefind UI`
- ``src/components/Header.astro` — search trigger button added to header`
- ``e2e/search.spec.ts` — Playwright E2E test for search functionality`

## Verification

npm run build && npx playwright test e2e/search.spec.ts --project=desktop
