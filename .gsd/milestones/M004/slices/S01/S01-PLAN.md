# S01: Performance & Accessibility Audit

**Goal:** Achieve ≥0.90 Lighthouse performance and ≥0.95 accessibility scores on all production page types, with zero axe-core violations and keyboard-navigable UI.
**Demo:** After this: Lighthouse report showing >= 90 perf, >= 95 a11y on all page types. axe-core zero violations. Manual keyboard test passed.

## Tasks
- [x] **T01: Converted Hero from CSS background-image to <img> with fetchpriority="high", added cdn.sanity.io preconnect, and defaulted Sanity image URLs to WebP** — The Hero component uses CSS `background-image` which is invisible to the browser preload scanner — this is the LCP element on most pages. Convert it to a proper `<img>` element, add preconnect hints, and default all Sanity images to WebP format.

## Steps

1. **Convert Hero from CSS background-image to `<img>`:** Restructure `src/components/Hero.astro` to use an `<img>` element with `fetchpriority="high"`, `loading="eager"`, `decoding="async"`, and `object-fit: cover` inside a relative-positioned container. The overlay gradient div sits on top via absolute positioning. Keep `alt=""` since the image is decorative (text overlay provides content). Handle the case where `backgroundImage` is empty or missing — render a solid color fallback.

2. **Add preconnect hint for cdn.sanity.io:** In `src/layouts/BaseLayout.astro`, add `<link rel="preconnect" href="https://cdn.sanity.io" crossorigin />` in the `<head>` before the CJK font link. This allows early connection setup for Sanity CDN images.

3. **Default urlForImage to WebP format:** In `src/lib/sanity.ts`, modify `urlForImage()` to always append `fm=webp` unless the caller explicitly passes a different format. This is a single-line change: default `options.format` to `'webp'`.

4. **Verify build and visual output:** Run `npm run build` to confirm no regressions. The Hero should render identically — full-width image with gradient overlay and centered text.

## Must-Haves

- [ ] Hero uses `<img>` with `fetchpriority="high"` instead of CSS `background-image`
- [ ] Hero handles empty/missing `backgroundImage` prop gracefully (solid color fallback)
- [ ] Preconnect hint for `cdn.sanity.io` in BaseLayout head
- [ ] `urlForImage()` defaults to WebP format
- [ ] Existing Hero visual appearance preserved (full-width, gradient overlay, centered text)
- [ ] `npm run build` succeeds

## Verification

- `npm run build` exits 0
- `grep -q 'fetchpriority' src/components/Hero.astro` confirms img element
- `grep -q 'preconnect' src/layouts/BaseLayout.astro` confirms preconnect hint
- `grep -q "format.*webp\|fm.*webp\|'webp'" src/lib/sanity.ts` confirms WebP default
  - Estimate: 45m
  - Files: src/components/Hero.astro, src/layouts/BaseLayout.astro, src/lib/sanity.ts
  - Verify: npm run build && grep -q 'fetchpriority' src/components/Hero.astro && grep -q 'preconnect' src/layouts/BaseLayout.astro
- [x] **T02: Added skip-to-content link, id="main-content" on all 27 pages, and audited all img alt attributes site-wide** — Accessibility gaps: no skip-to-content link, no `id` on `<main>` for skip targets, and two `<img>` elements with empty `alt` that need contextual audit.

## Steps

1. **Add skip-to-content link in BaseLayout:** Add a visually-hidden skip link as the first child of `<body>` in `src/layouts/BaseLayout.astro`: `<a href="#main-content" class="skip-to-content">Skip to main content</a>`. Add scoped styles that visually hide it until focused (position off-screen, show on `:focus-visible` with high z-index and visible styling).

2. **Add `id="main-content"` to all `<main>` elements:** Search all pages in `src/pages/` for `<main` tags and add `id="main-content"` to each. There are ~15 pages with `<main>` elements. This is the skip-link target.

3. **Audit Card and EventCard alt text:** `src/components/Card.astro` and `src/components/EventCard.astro` both use `alt=""`. These cards have titles displayed as text content, so the images are decorative — `alt=""` is correct per WCAG. However, add a comment explaining the intentional decision: `<!-- Decorative: card title provides text alternative -->`. Also check if any `<img>` elements across the site are missing `alt` entirely.

4. **Verify:** Run `npm run build`. Confirm skip-to-content link exists. Confirm all `<main>` elements have `id="main-content"`.

## Must-Haves

- [ ] Skip-to-content link as first focusable element on every page
- [ ] Skip link targets `#main-content` and is visually hidden until focused
- [ ] All `<main>` elements have `id="main-content"`
- [ ] Card/EventCard alt text audited and documented
- [ ] `npm run build` succeeds

## Verification

- `npm run build` exits 0
- `grep -q 'skip-to-content' src/layouts/BaseLayout.astro` confirms skip link
- `grep -c 'id="main-content"' src/pages/*.astro src/pages/**/*.astro` shows all pages have it
  - Estimate: 30m
  - Files: src/layouts/BaseLayout.astro, src/components/Card.astro, src/components/EventCard.astro, src/pages/index.astro, src/pages/contact.astro, src/pages/sermons/index.astro, src/pages/about/index.astro
  - Verify: npm run build && grep -q 'skip-to-content' src/layouts/BaseLayout.astro && grep -rq 'id="main-content"' src/pages/
- [ ] **T03: Expand LHCI coverage, add axe-core, raise thresholds, and run full audit** — Expand Lighthouse CI to cover all page archetypes, add axe-core for automated a11y testing, raise performance thresholds to 0.90, and run the full audit to validate T01/T02 fixes.

## Steps

1. **Install axe-core CLI:** Run `npm install -D @axe-core/cli`. This provides `npx @axe-core/cli <url>` for automated WCAG 2.1 violation scanning.

2. **Expand LHCI URL list in `lighthouserc.cjs`:** Add representative URLs for each page archetype. The current list only covers `/`, `/styleguide/`, and `/404.html`. Add: `/about/`, `/sermons/`, `/contact/`, `/events/`, `/visit/`, `/give/`, `/zh/`. Keep the list to one per template type — dynamic routes (`/sermons/[slug]`, `/ministries/[slug]`) can't be tested without known slugs, so skip those for now.

3. **Update LHCI assertMatrix thresholds:** Raise the production page performance threshold from 0.75 to 0.90. Add new URL patterns for the added pages. Keep styleguide at warn/0.50 and 404 at current levels. Add a catch-all pattern for any new production pages at ≥0.90 perf, ≥0.95 a11y.

4. **Add npm script for axe-core:** Add `"test:a11y": "npx @axe-core/cli http://localhost:4321/ http://localhost:4321/about/ http://localhost:4321/contact/ http://localhost:4321/zh/ --exit"` to `package.json` scripts.

5. **Run build + LHCI:** Execute `npm run build` then `npm run lhci` and verify all assertions pass at the new thresholds. If any page scores below 0.90 perf, investigate and fix or adjust threshold with rationale (e.g. YouTube embed pages may need 0.85).

6. **Run axe-core:** Start preview server, run `npx @axe-core/cli` against representative pages, verify zero violations.

## Must-Haves

- [ ] `@axe-core/cli` installed as dev dependency
- [ ] LHCI URL list covers all page archetypes (home, about, sermons, contact, events, visit, give, zh home)
- [ ] Performance threshold raised to ≥0.90 for production pages
- [ ] `test:a11y` npm script added
- [ ] `npm run lhci` passes at new thresholds
- [ ] axe-core reports zero violations on representative pages

## Verification

- `npm run build` exits 0
- `npm run lhci` passes (all assertions green)
- `grep -q 'axe-core' package.json` confirms dependency installed
- `grep -q 'test:a11y' package.json` confirms script added
  - Estimate: 1h
  - Files: lighthouserc.cjs, package.json
  - Verify: npm run build && npm run lhci
