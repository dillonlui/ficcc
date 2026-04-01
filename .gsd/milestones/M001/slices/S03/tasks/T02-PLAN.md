---
estimated_steps: 38
estimated_files: 4
skills_used: []
---

# T02: Build Hero, Card, and ImageMosaic components

Create the three visual/content components — Hero (full-width with background image), Card (versatile content card), and ImageMosaic (CSS Grid image gallery) — and add all three to the styleguide page.

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

## Inputs

- ``src/styles/global.css` — design tokens`
- ``src/pages/styleguide.astro` — showcase page to extend with new component sections`

## Expected Output

- ``src/components/Hero.astro` — full-width hero with background image, overlay, headline, CTA`
- ``src/components/Card.astro` — versatile content card with optional image and link`
- ``src/components/ImageMosaic.astro` — CSS Grid image gallery with responsive layout`
- ``src/pages/styleguide.astro` — extended with Hero, Card, and ImageMosaic showcase sections`

## Verification

npm run build && test -f src/components/Hero.astro && test -f src/components/Card.astro && test -f src/components/ImageMosaic.astro
