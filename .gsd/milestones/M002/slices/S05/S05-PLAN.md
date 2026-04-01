# S05: Community & Ministries

**Goal:** Community hub page at /ministries listing all ministries as cards, plus individual ministry detail pages at /ministries/[slug] with leader info, meeting time, and portable text description.
**Demo:** After this: Community hub + ministry detail pages

## Tasks
- [x] **T01: Added slug and image fields to ministry schema, MinistryDetail interface, and getMinistryBySlug() GROQ helper with leader dereference** — Add slug and image fields to the Sanity ministry schema, update the TypeScript Ministry interface in sanity.ts to include slug and image (plus a resolved leader type for the detail query), and add a getMinistryBySlug() GROQ helper that dereferences the leader reference to inline name/role/photo.

Steps:
1. Add `slug` field (type: 'slug', options: { source: 'name' }, validation: required) and `image` field (type: 'image', options: { hotspot: true }) to `sanity/schemas/documents/ministry.ts`. Add slug to the preview select.
2. Update the `Ministry` interface in `src/lib/sanity.ts`: add `slug?: { current: string }` and `image?: SanityImage`. Add a `MinistryDetail` interface that extends Ministry with `leader` resolved as `{ name: string; role?: string; photo?: SanityImage } | null` instead of a raw ref.
3. Update the existing `getMinistries()` query to also return slug and image fields (they're already captured by `*[_type == 'ministry']` but the interface needs them).
4. Add `getMinistryBySlug(slug: string, language?: Language)` that fetches a single ministry by slug with GROQ projection `leader->{name, role, photo}` to resolve the person reference.
5. Verify: `npx tsc --noEmit` passes with no type errors on the updated interfaces.
  - Estimate: 30m
  - Files: sanity/schemas/documents/ministry.ts, src/lib/sanity.ts
  - Verify: npx tsc --noEmit && grep -q 'getMinistryBySlug' src/lib/sanity.ts && grep -q 'slug' sanity/schemas/documents/ministry.ts
- [ ] **T02: Build ministries hub page, MinistryCard component, and detail page** — Create the /ministries hub page with a Hero and responsive card grid, a MinistryCard component that wraps Card.astro with meeting time display, and the /ministries/[slug] detail page with getStaticPaths, leader info, meeting time, and portable text description.

Steps:
1. Create `src/components/MinistryCard.astro` — accepts ministry data (name, image, meetingTime, slug), renders Card.astro with href='/ministries/{slug}' and adds meeting time below the card title. Pure Astro, scoped CSS, CSS custom properties only.
2. Create `src/pages/ministries/index.astro` — hub page following sermons/index.astro pattern. Import getMinistries from sanity.ts. Fetch ministries in try-catch (K008 pattern). Hero with title 'Community & Ministries'. Responsive card grid using MinistryCard for each ministry that has a slug. Fallback messaging when no ministries exist.
3. Create `src/pages/ministries/[slug].astro` — detail page following sermons/[slug].astro getStaticPaths pattern. Import getMinistries and getMinistryBySlug. getStaticPaths fetches all ministries, filters to those with slugs, returns params/props. Page renders: Hero with ministry name, back link to /ministries, leader info section (photo via urlForImage, name, role) when leader is resolved, meeting time, and description via portableTextToHtml rendered with set:html.
4. Verify: `npm run build` succeeds and generates /ministries/index.html. Verify no client: directives in new files. Verify all styles use CSS custom properties only.
  - Estimate: 45m
  - Files: src/components/MinistryCard.astro, src/pages/ministries/index.astro, src/pages/ministries/[slug].astro
  - Verify: npm run build && test -f dist/ministries/index.html && ! grep -r 'client:' src/components/MinistryCard.astro src/pages/ministries/
