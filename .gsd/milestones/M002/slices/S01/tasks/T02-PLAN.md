---
estimated_steps: 53
estimated_files: 6
skills_used: []
---

# T02: Build homepage section components and compose full page

## Description

Build the three new section-level Astro components (ServiceTimes, Pillars, NextSteps), create placeholder images for development, and compose the full homepage in `index.astro` by wiring all sections together with data from `getHomePage()` and existing GROQ helpers. Every section must render with hardcoded fallback content when Sanity returns null.

All components must be pure Astro with scoped CSS using only CSS custom properties from `global.css` (D010, K003). No `client:*` directives.

## Steps

1. Create placeholder images in `public/images/` for development:
   - `hero-placeholder.jpg` — a solid warm-toned placeholder (can generate via ImageMagick or use a small SVG)
   - `placeholder-1.jpg` through `placeholder-6.jpg` — for mosaic and card images
   - Keep them small (< 50KB each) since they're dev-only placeholders

2. Build `src/components/ServiceTimes.astro`:
   - Props: `times: { label: string; time: string }[]`
   - Layout: horizontal banner with warm background (`--color-stone`), centered content
   - Each time entry shows label (e.g. 'Sunday Gathering') and time (e.g. '9:45 AM')
   - Responsive: stack vertically on mobile, row on desktop
   - Use `--font-heading` for times, `--font-body` for labels

3. Build `src/components/Pillars.astro`:
   - Props: `pillars: { title: string; description: string }[]`
   - Layout: 3-column grid on desktop, single column on mobile
   - Each pillar: heading + paragraph in a card-like container
   - Section heading: 'Who We Are' or similar
   - Use `--space-16` vertical padding, `--color-bg` background

4. Build `src/components/NextSteps.astro`:
   - Props: `steps: { title: string; body: string; href: string; image?: string }[]`
   - Layout: grid of cards using existing `Card.astro` component
   - Section heading: 'Next Steps' or similar
   - 3-column on desktop, 1-column on mobile
   - Each card links to its `href`

5. Compose `src/pages/index.astro`:
   - Import and call `getHomePage('en')`, `getSermons('en')`, `getEvents('en')` at top of frontmatter
   - Define fallback data for when CMS returns null (hardcoded hero title, service times, pillars, next-steps)
   - Section order: Hero → ServiceTimes → ImageMosaic (placeholder images) → Pillars → Featured Content (latest sermon + next event as Cards) → NextSteps
   - Pass CMS data to components when available, fallbacks otherwise
   - Use `urlForImage()` for any Sanity image fields
   - Wrap in `BaseLayout` with proper title and description
   - Use proper section landmarks with `<section>` elements and heading hierarchy

6. Verify build and visual rendering:
   - Run `npm run build` — must succeed
   - Start dev server, check homepage renders all sections
   - Check 3 breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop)

## Must-Haves

- [ ] ServiceTimes component renders service schedule in horizontal/vertical layout
- [ ] Pillars component renders church values in responsive grid
- [ ] NextSteps component renders CTA cards using Card.astro
- [ ] index.astro composes all sections in correct order
- [ ] All sections have hardcoded fallback content for empty CMS state
- [ ] No client-side JS — no `client:*` directives in any new component
- [ ] All styles use CSS custom properties from global.css
- [ ] `npm run build` succeeds
- [ ] Page renders correctly at mobile, tablet, and desktop breakpoints

## Verification

- `npm run build` succeeds without errors
- `grep -q 'ServiceTimes' src/pages/index.astro && grep -q 'Pillars' src/pages/index.astro && grep -q 'NextSteps' src/pages/index.astro`
- `! grep -q 'client:' src/components/ServiceTimes.astro && ! grep -q 'client:' src/components/Pillars.astro && ! grep -q 'client:' src/components/NextSteps.astro`
- Visual verification via dev server at 3 breakpoints

## Inputs

- ``sanity/schemas/singletons/homePage.ts` — schema shape defines component props`
- ``src/lib/sanity.ts` — getHomePage(), getSermons(), getEvents(), urlForImage()`
- ``src/components/Hero.astro` — existing hero component (backgroundImage, title, subtitle, ctaText, ctaHref props)`
- ``src/components/Card.astro` — existing card component (title, body, image, href props)`
- ``src/components/ImageMosaic.astro` — existing mosaic component (images[{src,alt}] props)`
- ``src/layouts/BaseLayout.astro` — page wrapper with Header/Footer/SEO`
- ``src/styles/global.css` — CSS custom properties for all styling`

## Expected Output

- ``src/components/ServiceTimes.astro` — new service times banner component`
- ``src/components/Pillars.astro` — new church pillars/values grid component`
- ``src/components/NextSteps.astro` — new CTA cards section component`
- ``src/pages/index.astro` — full homepage composition with all sections`
- ``public/images/hero-placeholder.jpg` — placeholder hero image for development`
- ``public/images/placeholder-1.jpg` — placeholder mosaic/card images for development`

## Verification

npm run build && grep -q 'ServiceTimes' src/pages/index.astro && grep -q 'Pillars' src/pages/index.astro && grep -q 'NextSteps' src/pages/index.astro && ! grep -q 'client:' src/components/ServiceTimes.astro && ! grep -q 'client:' src/components/Pillars.astro && ! grep -q 'client:' src/components/NextSteps.astro
