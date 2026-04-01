# S03: Base Components — Research

**Date:** 2026-03-31

## Summary

S03 builds the shared UI component library: Header, Footer, Hero, Cards, Accordion, Forms, ImageMosaic, and AudioPlayer. All are Astro `.astro` components using scoped `<style>` blocks and CSS custom properties from `global.css` (K003). No UI framework is needed — Astro's template syntax handles everything. The only client-side JS is minimal: Accordion needs a toggle (`<details>`/`<summary>` avoids JS entirely), AudioPlayer uses native `<audio>`. Forms are pure HTML at this stage (S05 wires submission).

The work is straightforward component authoring against established tokens. The primary risk is scope — eight components is a lot for one slice — but each is independent and can be built/verified in isolation. The styleguide page gets extended to showcase all components.

## Recommendation

Build all components as pure Astro components in `src/components/`. Use scoped `<style>` blocks referencing only CSS custom properties from `global.css`. No additional CSS files, no framework, no build-time CSS tooling. Use semantic HTML throughout (nav, header, footer, figure, details/summary, form elements). Extend the existing `/styleguide` page to render each component with sample data.

For Accordion, use native `<details>`/`<summary>` elements — zero JS, accessible by default, keyboard-navigable. For AudioPlayer, use native `<audio controls>` with styled wrapper. For ImageMosaic, use CSS Grid with `object-fit: cover`.

Build order should start with layout components (Header, Footer) since they establish the page frame, then content components (Hero, Cards, ImageMosaic), then interactive components (Accordion, AudioPlayer, Forms).

## Implementation Landscape

### Key Files

- `src/styles/global.css` — Design token source. May need 1-2 new tokens (e.g., `--color-focus` for form focus rings, `--max-width` for content containers) but the existing set covers most needs.
- `src/layouts/BaseLayout.astro` — Will import Header/Footer once they exist. Currently just `<slot />` in `<body>`.
- `src/pages/styleguide.astro` — Extend with component showcase sections below the existing token displays.
- `src/components/Header.astro` — **New.** Site header with logo text, nav links, language toggle. Responsive (hamburger on mobile).
- `src/components/Footer.astro` — **New.** Site footer with contact info, service times, nav links, copyright.
- `src/components/Hero.astro` — **New.** Full-width hero with background image, headline, subtitle, CTA button. Props for content.
- `src/components/Card.astro` — **New.** Versatile card (image, title, body, optional link). Used for ministries, events, news.
- `src/components/Accordion.astro` — **New.** Uses `<details>`/`<summary>`. Props: items array of {title, content}.
- `src/components/ContactForm.astro` — **New.** HTML form with name, email, message fields. Styled inputs, validation via HTML attributes. No submission handler (S05).
- `src/components/ImageMosaic.astro` — **New.** CSS Grid image gallery with varying cell sizes. Props: images array.
- `src/components/AudioPlayer.astro` — **New.** Styled wrapper around native `<audio>` element. Props: src, title, speaker.

### Build Order

1. **Header + Footer** — Layout frame components. Proves the component pattern (scoped styles, props, slots). Header needs responsive nav (CSS-only hamburger or minimal JS). Footer is static. Once done, BaseLayout can integrate them for all pages.
2. **Hero + Card** — Core content components. Hero proves full-width image handling within the design system. Card proves the reusable content pattern that most pages will use.
3. **Accordion + ContactForm** — Interactive components. Accordion proves `<details>`/`<summary>` styling. Form proves input/button styling against design tokens.
4. **ImageMosaic + AudioPlayer** — Media components. Mosaic proves CSS Grid image layout. AudioPlayer proves media element styling. Both are more contained/less risky.
5. **Styleguide integration** — Extend `/styleguide` with a component showcase section rendering all eight components with sample data.

### Verification Approach

- `npm run build` succeeds with no errors (all components render at build time)
- `/styleguide` page visually renders all eight components with sample data
- Lighthouse CI passes (a11y ≥ 0.95 confirms semantic HTML, perf within existing thresholds)
- Manual check: all component styles use only CSS custom properties (no hardcoded colors/sizes)
- Responsive: Header nav collapses on mobile viewports

## Constraints

- All styles must use CSS custom properties from `global.css` exclusively (K003). If a component needs a value that doesn't exist as a token, add it to `global.css` first.
- CSP in `vercel.json` restricts inline scripts to `'unsafe-inline'` — keep client JS minimal. `<details>`/`<summary>` and `<audio>` avoid JS entirely.
- `media-src 'self' https://cdn.sanity.io` in CSP — AudioPlayer sources must come from self or Sanity CDN.
- Components must work for both EN and ZH content. Use `lang` prop or inherit from parent where CJK text needs different font/line-height.
- No Sanity data fetching in this slice — all components use static props/sample data. S04 handles CMS integration.

## Common Pitfalls

- **Hamburger menu JS vs CSS-only** — CSS-only hamburger (checkbox hack) is fragile for accessibility. A small inline `<script>` toggling `aria-expanded` on a button is cleaner and CSP-compliant (`script-src 'unsafe-inline'`). Don't overthink this.
- **`<details>`/`<summary>` styling inconsistencies** — Browser default triangle markers vary. Use `summary::marker` or `list-style: none` with a custom icon for consistency. Test in both Chrome and Safari.
- **AudioPlayer native controls styling** — `<audio controls>` has limited CSS customizability. A styled wrapper div with title/speaker metadata around the native element is sufficient; don't try to fully restyle the controls.
- **Image aspect ratios in Card/Mosaic** — Use `aspect-ratio` + `object-fit: cover` to prevent layout shifts. Don't rely on intrinsic image dimensions.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | astrolicious/agent-skills@astro | available (2.9K installs) |
