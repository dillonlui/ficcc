---
estimated_steps: 6
estimated_files: 3
skills_used: []
---

# T02: Build ministries hub page, MinistryCard component, and detail page

Create the /ministries hub page with a Hero and responsive card grid, a MinistryCard component that wraps Card.astro with meeting time display, and the /ministries/[slug] detail page with getStaticPaths, leader info, meeting time, and portable text description.

Steps:
1. Create `src/components/MinistryCard.astro` — accepts ministry data (name, image, meetingTime, slug), renders Card.astro with href='/ministries/{slug}' and adds meeting time below the card title. Pure Astro, scoped CSS, CSS custom properties only.
2. Create `src/pages/ministries/index.astro` — hub page following sermons/index.astro pattern. Import getMinistries from sanity.ts. Fetch ministries in try-catch (K008 pattern). Hero with title 'Community & Ministries'. Responsive card grid using MinistryCard for each ministry that has a slug. Fallback messaging when no ministries exist.
3. Create `src/pages/ministries/[slug].astro` — detail page following sermons/[slug].astro getStaticPaths pattern. Import getMinistries and getMinistryBySlug. getStaticPaths fetches all ministries, filters to those with slugs, returns params/props. Page renders: Hero with ministry name, back link to /ministries, leader info section (photo via urlForImage, name, role) when leader is resolved, meeting time, and description via portableTextToHtml rendered with set:html.
4. Verify: `npm run build` succeeds and generates /ministries/index.html. Verify no client: directives in new files. Verify all styles use CSS custom properties only.

## Inputs

- ``src/lib/sanity.ts` — Ministry interface, getMinistries(), getMinistryBySlug(), urlForImage(), portableTextToHtml()`
- ``src/components/Card.astro` — existing card component to wrap in MinistryCard`
- ``src/components/Hero.astro` — reused for both pages`
- ``src/layouts/BaseLayout.astro` — page layout wrapper`
- ``src/pages/sermons/index.astro` — pattern reference for hub page`
- ``src/pages/sermons/[slug].astro` — pattern reference for getStaticPaths detail page`

## Expected Output

- ``src/components/MinistryCard.astro` — new component rendering ministry as a card with meeting time`
- ``src/pages/ministries/index.astro` — hub page with hero and responsive ministry card grid`
- ``src/pages/ministries/[slug].astro` — detail page with leader info, meeting time, and portable text description`

## Verification

npm run build && test -f dist/ministries/index.html && ! grep -r 'client:' src/components/MinistryCard.astro src/pages/ministries/
