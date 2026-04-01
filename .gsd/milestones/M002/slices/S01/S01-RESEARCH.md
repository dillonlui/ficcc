# S01 Homepage — Research

**Date:** 2026-03-31

## Summary

The homepage slice composes existing M001 components (Hero, Card, ImageMosaic) with new homepage-specific sections into a full landing page. All the building blocks exist — Hero with background image + overlay, Card with optional image/link, ImageMosaic with responsive grid. The current `index.astro` is a placeholder with a heading and address line.

The main decisions are: (1) how to make homepage content CMS-editable vs. hardcoded, and (2) what new section components to build. A `homePage` singleton in Sanity gives editors control over the hero, pillars, and next-steps without code deploys. Dynamic content (latest sermon, upcoming events) can be fetched with existing GROQ helpers (`getSermons`, `getEvents`). New homepage-specific section components (ServiceTimes, Pillars, NextSteps) follow the established pattern of pure Astro components with scoped CSS and CSS custom properties only (D010).

## Recommendation

Create a `homePage` Sanity singleton (following the `siteSettings` pattern) with fields for hero content, church pillars, and next-steps cards. Build 3 new section-level Astro components for the homepage-specific layouts. Compose everything in `index.astro` using a mix of Sanity-fetched content and existing components. Use placeholder images from `/public/images/` until real church photos are available (real photos are a hard requirement per D007 but can be swapped later via CMS).

This keeps the established patterns intact — no new client-side JS, no new dependencies, just new Astro components and a Sanity schema addition.

## Implementation Landscape

### Key Files

- `src/pages/index.astro` — Current placeholder, will become the full homepage composing all sections
- `src/components/Hero.astro` — Existing hero component, used as-is for homepage hero
- `src/components/Card.astro` — Existing card component, used for next-steps and featured content
- `src/components/ImageMosaic.astro` — Existing mosaic component, used for community photo grid
- `src/lib/sanity.ts` — Needs new `getHomePage()` GROQ helper and `HomePage` interface
- `sanity/schemas/singletons/homePage.ts` — New: homepage singleton schema with hero, pillars, nextSteps fields
- `sanity/schemas/index.ts` — Register new homePage schema, add to `singletonTypes` and `singletonDocIds`
- `sanity/structure.ts` — No change needed (singletons auto-populate from `singletonDocIds`)
- `src/components/ServiceTimes.astro` — New: service times banner section
- `src/components/Pillars.astro` — New: church pillars/values section (e.g., Worship, Community, Mission)
- `src/components/NextSteps.astro` — New: call-to-action cards section (Plan a Visit, Get Connected, etc.)
- `src/styles/global.css` — May need 1-2 new tokens (e.g., section spacing) but existing tokens cover most needs

### Build Order

1. **Sanity schema first** — Create the `homePage` singleton schema and register it. This defines the data shape everything else depends on. Add `getHomePage()` to `src/lib/sanity.ts`. Seed a test document via Sanity Studio or GROQ mutation.
2. **New section components** — Build ServiceTimes, Pillars, NextSteps as pure Astro components with scoped CSS. Each accepts typed props (not Sanity types directly — map in the page).
3. **Compose index.astro** — Wire up all sections: Hero (from Sanity homePage), ServiceTimes, ImageMosaic (placeholder images), Pillars (from Sanity), featured content cards (latest sermon + upcoming event from existing queries), NextSteps (from Sanity), and appropriate SEO metadata.
4. **Visual verification** — Run dev server and verify all sections render, responsive layout works at mobile/tablet/desktop, Lighthouse scores stay ≥ 0.75.

### Verification Approach

- `npm run dev` — visual inspection of all homepage sections at 3 breakpoints (mobile 375px, tablet 768px, desktop 1280px)
- `npm run build` — confirms static build succeeds with Sanity data (or graceful fallbacks if CMS is empty)
- Lighthouse CI — performance ≥ 0.75, accessibility ≥ 0.90 (existing thresholds from lighthouserc.cjs)
- No new client-side JS — verify no `<script>` tags or `client:*` directives added to homepage components

## Constraints

- **No client-side JS framework** (D010) — all homepage components must be pure Astro with scoped CSS. Interactive behavior via native HTML only.
- **CSS custom properties only** (K003) — no hardcoded colors, sizes, or fonts. Reference tokens from `global.css`.
- **Real photos not yet available** — use placeholder images that match expected aspect ratios. The CMS fields accept images, so real photos can be uploaded later without code changes.
- **CJK font async loading** (K001) — already handled by BaseLayout. No additional font concerns for homepage.
- **Sanity free tier** — no performance concerns for a singleton fetch at build time.

## Common Pitfalls

- **Sanity image URL resolution** — Sanity images are stored as `{ asset: { _ref } }`, not direct URLs. Need `@sanity/image-url` or manual URL construction (`cdn.sanity.io/images/{projectId}/{dataset}/{assetId}`) to get renderable URLs. Check if `@sanity/image-url` is already installed; if not, it's a lightweight dependency worth adding.
- **Empty CMS state during development** — The homepage will be built before content editors populate Sanity. Every section should handle missing/empty data gracefully — show placeholder content or skip the section, never crash the build.
- **Hero background image performance** — Large hero images can tank LCP. Use Sanity's image CDN with `?w=1600&auto=format` parameters for optimized delivery, and add `fetchpriority="high"` for the hero image.

## Open Risks

- **Placeholder images for mosaic** — The ImageMosaic component expects `{ src, alt }[]` but we have no real church photos in the repo. Need to decide: use stock placeholders in `/public/images/` or use Sanity image references. If Sanity, need the `@sanity/image-url` helper.
- **Homepage singleton not yet seeded** — The first build after schema creation will have no homepage document. The page must handle this gracefully (fallback content) or the schema creation task must include seeding initial content.
