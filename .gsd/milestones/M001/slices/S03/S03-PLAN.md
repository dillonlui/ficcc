# S03: Base Components

**Goal:** Build all shared UI components (Header, Footer, Hero, Card, Accordion, ContactForm, ImageMosaic, AudioPlayer) as pure Astro components using design tokens from global.css, and showcase them on the /styleguide page.
**Demo:** After this: All components on /styleguide — Header, Footer, Hero, Cards, Accordion, Forms, ImageMosaic, AudioPlayer

## Tasks
- [x] **T01: Created responsive Header (with hamburger nav) and Footer components, wired both into BaseLayout, added showcase sections to /styleguide** — Create the site Header (with responsive nav and mobile hamburger) and Footer components, wire them into BaseLayout so all pages get the site frame, add any needed design tokens to global.css, and add both components to the styleguide page.

## Steps

1. Add needed tokens to `src/styles/global.css`: `--color-focus` (focus ring color, use terracotta or derive), `--max-width` (content max-width, 72rem to match styleguide). Also add a `--color-bg-dark` or similar for footer background if the Gathered Warmth palette needs it.
2. Create `src/components/Header.astro`:
   - Semantic `<header>` with `<nav>` inside
   - Logo area: text wordmark 'FICCC' or 'First Ithaca Chinese Christian Church' using heading font
   - Nav links: Home, About, Ministries, Sermons, Contact (placeholder hrefs)
   - Language toggle button (EN/中文) — static, no routing logic yet
   - Mobile hamburger: use a `<button>` with `aria-expanded` toggling a nav menu via a small inline `<script>`. CSS hides nav on mobile, JS toggles visibility. Don't use CSS-only checkbox hack (fragile for a11y per research).
   - All styles via scoped `<style>` using CSS custom properties only
   - Responsive: full nav on desktop (≥768px), hamburger + sliding/dropdown menu on mobile
3. Create `src/components/Footer.astro`:
   - Semantic `<footer>` element
   - Content: church name (EN + ZH), address, service times, nav links, copyright with dynamic year
   - Multi-column grid layout on desktop, stacked on mobile
   - All styles via scoped `<style>` using CSS custom properties only
4. Wire Header and Footer into `src/layouts/BaseLayout.astro`:
   - Import both components
   - Render `<Header />` before `<slot />` and `<Footer />` after
5. Add Header and Footer showcase sections to `src/pages/styleguide.astro` below existing token sections, with descriptive headings.
6. Run `npm run build` to verify everything compiles.

## Must-Haves

- [ ] Header uses semantic `<header>` + `<nav>` with proper ARIA attributes
- [ ] Mobile hamburger uses `<button>` with `aria-expanded`, not CSS checkbox hack
- [ ] Footer uses semantic `<footer>` element
- [ ] Both components use only CSS custom properties — no hardcoded colors/sizes
- [ ] BaseLayout renders Header before content and Footer after
- [ ] Both components appear on /styleguide with sample content
- [ ] `npm run build` succeeds

## Verification

- `npm run build` succeeds with 0 errors
- `test -f src/components/Header.astro && test -f src/components/Footer.astro` passes
- `grep -q 'Header' src/layouts/BaseLayout.astro && grep -q 'Footer' src/layouts/BaseLayout.astro` confirms wiring
- `grep -q 'aria-expanded' src/components/Header.astro` confirms accessible hamburger
  - Estimate: 1h
  - Files: src/components/Header.astro, src/components/Footer.astro, src/layouts/BaseLayout.astro, src/styles/global.css, src/pages/styleguide.astro
  - Verify: npm run build && test -f src/components/Header.astro && test -f src/components/Footer.astro && grep -q 'Header' src/layouts/BaseLayout.astro && grep -q 'Footer' src/layouts/BaseLayout.astro
- [x] **T02: Created Hero, Card, and ImageMosaic Astro components using design tokens and added all three with sample data to the /styleguide page** — Create the three visual/content components — Hero (full-width with background image), Card (versatile content card), and ImageMosaic (CSS Grid image gallery) — and add all three to the styleguide page.

## Steps

1. Create `src/components/Hero.astro`:
   - Full-width section with background image (via CSS `background-image` from a prop)
   - Overlay for text readability (semi-transparent dark layer)
   - Props: `title` (string), `subtitle` (string, optional), `ctaText` (string, optional), `ctaHref` (string, optional), `backgroundImage` (string — URL/path)
   - Headline in heading font at `--text-4xl`, subtitle at `--text-lg`, CTA as styled link/button
   - Responsive: scale text sizes on mobile, maintain readable overlay
   - Use `aspect-ratio` or min-height for consistent hero height
2. Create `src/components/Card.astro`:
   - Props: `title` (string), `body` (string, optional), `image` (string — URL/path, optional), `href` (string, optional)
   - Optional image at top with `aspect-ratio: 3/2` + `object-fit: cover`
   - Title as `<h3>`, body as `<p>`, optional wrapping `<a>` if href provided
   - Border radius, subtle border or shadow using tokens
   - Works at various widths (used in grid layouts by parent)
3. Create `src/components/ImageMosaic.astro`:
   - Props: `images` (array of `{ src: string, alt: string }`)
   - CSS Grid layout with varying cell sizes (some span 2 columns or 2 rows)
   - Images use `object-fit: cover` and `aspect-ratio` to prevent layout shifts
   - Responsive: 3-column on desktop, 2-column on tablet, 1-column on mobile
   - Use `<figure>` for each image cell
4. Add all three components to `src/pages/styleguide.astro` with sample data:
   - Hero with a placeholder gradient background (no real image needed — use CSS gradient as backgroundImage prop)
   - 3 sample Cards in a grid
   - ImageMosaic with 5-6 placeholder colored divs or gradient images
5. Run `npm run build` to verify.

## Must-Haves

- [ ] Hero renders full-width with overlay, headline, subtitle, and CTA
- [ ] Card handles with/without image and with/without link gracefully
- [ ] ImageMosaic uses CSS Grid with responsive columns
- [ ] All images use `aspect-ratio` + `object-fit: cover`
- [ ] All styles use only CSS custom properties
- [ ] All three render on /styleguide with sample data
- [ ] `npm run build` succeeds

## Verification

- `npm run build` succeeds with 0 errors
- `test -f src/components/Hero.astro && test -f src/components/Card.astro && test -f src/components/ImageMosaic.astro` passes
- `grep -q 'Hero' src/pages/styleguide.astro && grep -q 'Card' src/pages/styleguide.astro && grep -q 'ImageMosaic' src/pages/styleguide.astro` confirms styleguide integration
  - Estimate: 1h
  - Files: src/components/Hero.astro, src/components/Card.astro, src/components/ImageMosaic.astro, src/pages/styleguide.astro
  - Verify: npm run build && test -f src/components/Hero.astro && test -f src/components/Card.astro && test -f src/components/ImageMosaic.astro
- [ ] **T03: Build Accordion, ContactForm, and AudioPlayer components, run final verification** — Create the three interactive/media components — Accordion (details/summary), ContactForm (HTML form with styled inputs), AudioPlayer (styled native audio wrapper) — add all three to the styleguide page, and run final build + Lighthouse CI verification for the complete slice.

## Steps

1. Create `src/components/Accordion.astro`:
   - Props: `items` (array of `{ title: string, content: string }`)
   - Use native `<details>` / `<summary>` elements — zero JS, accessible by default
   - Style `summary::marker` or use `list-style: none` + custom chevron icon for cross-browser consistency
   - Spacing between items using tokens, border-bottom separators
   - Summary text in body font at `--text-lg`, content in body font at `--text-base`
2. Create `src/components/ContactForm.astro`:
   - HTML `<form>` with fields: name (text, required), email (email, required), message (textarea, required)
   - Submit button styled with terracotta background, bg/white text
   - Styled inputs: border using `--color-stone`, focus ring using `--color-focus` or `--color-terracotta`, border-radius `--radius-sm`
   - HTML validation attributes: `required`, `type="email"`, `minlength`
   - No `action` attribute — form submission is S05's job. Add a comment noting this.
   - Labels associated with inputs via `for`/`id` attributes
3. Create `src/components/AudioPlayer.astro`:
   - Props: `src` (string), `title` (string), `speaker` (string, optional)
   - Styled wrapper `<div>` with title and speaker metadata displayed above native `<audio controls>`
   - Don't try to fully restyle native audio controls — just wrap them in a styled container
   - Title in heading font, speaker in body font at `--text-sm`
   - Border, padding, border-radius using tokens
4. Add all three components to `src/pages/styleguide.astro` with sample data:
   - Accordion with 3-4 FAQ items
   - ContactForm as-is (no action needed)
   - AudioPlayer with a placeholder src (empty string or `#` — the element renders without a valid source)
5. Run `npm run build` to verify all pages compile.
6. Run Lighthouse CI: `npx @lhci/cli autorun` to verify a11y ≥ 0.95 and perf within thresholds.

## Must-Haves

- [ ] Accordion uses native `<details>`/`<summary>` — no JS
- [ ] ContactForm has proper `<label>` + `for`/`id` associations for all fields
- [ ] ContactForm uses HTML validation attributes (required, type=email)
- [ ] AudioPlayer uses native `<audio controls>` element
- [ ] All styles use only CSS custom properties
- [ ] All three render on /styleguide with sample data
- [ ] `npm run build` succeeds
- [ ] Lighthouse CI passes (a11y ≥ 0.95)

## Verification

- `npm run build` succeeds with 0 errors
- `test -f src/components/Accordion.astro && test -f src/components/ContactForm.astro && test -f src/components/AudioPlayer.astro` passes
- `npx @lhci/cli autorun` passes all assertions
- `grep -q 'details' src/components/Accordion.astro` confirms native element usage
- `grep -q '<label' src/components/ContactForm.astro` confirms proper label associations
- `grep -q '<audio' src/components/AudioPlayer.astro` confirms native audio element
  - Estimate: 1h
  - Files: src/components/Accordion.astro, src/components/ContactForm.astro, src/components/AudioPlayer.astro, src/pages/styleguide.astro
  - Verify: npm run build && test -f src/components/Accordion.astro && test -f src/components/ContactForm.astro && test -f src/components/AudioPlayer.astro && npx @lhci/cli autorun
