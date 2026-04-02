# S01: Performance & Accessibility Audit — UAT

**Milestone:** M004
**Written:** 2026-04-01T18:08:10.356Z

## UAT: S01 — Performance & Accessibility Audit

### Preconditions
- Repository checked out at post-S01 state
- Node.js 18+ installed
- `npm ci` completed
- Chrome/Chromium available (for LHCI and axe-core)

---

### TC-01: Build succeeds with all optimizations
1. Run `npm run build`
2. **Expected:** Exit code 0, no errors. Static output in `dist/client/`.

### TC-02: Hero uses proper <img> element for LCP
1. Open `src/components/Hero.astro`
2. **Expected:** Contains `<img` with `fetchpriority="high"`, `loading="eager"`, `decoding="async"`, and `object-fit: cover` styling.
3. **Expected:** No CSS `background-image` usage for the hero image.
4. **Expected:** When `backgroundImage` prop is empty/missing, renders solid color fallback (no broken image).

### TC-03: Preconnect hint for Sanity CDN
1. Open `src/layouts/BaseLayout.astro`
2. **Expected:** Contains `<link rel="preconnect" href="https://cdn.sanity.io" crossorigin />` before font links.

### TC-04: WebP default for Sanity images
1. Open `src/lib/sanity.ts`, find `urlForImage()`
2. **Expected:** Function defaults to WebP format (fm=webp) unless caller overrides.
3. Run `npm run build` and inspect any generated HTML containing Sanity image URLs.
4. **Expected:** Image URLs include `fm=webp` parameter.

### TC-05: Skip-to-content link
1. Run `npm run build && npx serve dist/client -l 4321`
2. Open http://localhost:4321/ in browser
3. Press Tab once
4. **Expected:** Skip link appears visually ("Skip to main content"), is the first focusable element.
5. Press Enter on the skip link
6. **Expected:** Focus moves to `#main-content` (the `<main>` element).

### TC-06: main-content ID on all pages
1. Run `grep -rl 'id="main-content"' src/pages/ | wc -l`
2. **Expected:** 27 pages (all pages in src/pages/).

### TC-07: LHCI passes all assertions
1. Run `npm run build && npx lhci autorun`
2. **Expected:** All 10 URLs × 3 runs pass assertions:
   - EN pages: perf ≥ 0.70, a11y ≥ 0.95, SEO ≥ 0.95, best-practices ≥ 0.90
   - ZH pages: perf warn at 0.50, a11y ≥ 0.95
   - Styleguide: perf warn at 0.50, a11y ≥ 0.95
   - 404: perf ≥ 0.70, SEO warn at 0.80
3. **Expected:** No error-level failures.

### TC-08: axe-core integration
1. Verify `grep -q 'axe-core' package.json` exits 0
2. Verify `grep -q 'test:a11y' package.json` exits 0
3. Start preview server: `npx serve dist/client -l 4321`
4. Run `npx @axe-core/cli http://localhost:4321/ http://localhost:4321/contact/ --exit`
5. **Expected:** Zero violations on home page. Contact page shows no contrast or landmark violations for elements fixed in this slice (active tab, sidebar links, aside landmark).

### TC-09: WCAG contrast — contact page
1. Open `src/pages/contact.astro`
2. **Expected:** `.contact-tabs__tab--active` uses `var(--color-terracotta-dark)` not `var(--color-terracotta)`
3. **Expected:** `.contact-info__link` uses `var(--color-terracotta-dark)` not `var(--color-terracotta)`
4. **Expected:** No `<aside>` element — sidebar uses `<div role="region">` with aria-label.

### TC-10: Decorative image alt audit
1. Open `src/components/Card.astro` and `src/components/EventCard.astro`
2. **Expected:** Both use `alt=""` with a comment explaining intentional empty alt for decorative images.

### Edge Cases

### EC-01: Hero with no image
1. In a test page, render `<Hero title="Test" />` with no backgroundImage prop
2. **Expected:** Renders solid color background, no broken image icon, no console errors.

### EC-02: LHCI with slow network
1. LHCI uses simulated 4G throttling by default
2. **Expected:** CJK pages may score 0.50-0.60 perf (warn threshold), but should not error.
3. **Expected:** EN pages score ≥ 0.70 consistently across 3 runs.
