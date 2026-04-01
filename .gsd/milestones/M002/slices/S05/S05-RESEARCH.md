# S05: Community & Ministries — Research

**Date:** 2026-03-31

## Summary

This slice adds a community hub page at `/ministries` (listing all ministries as cards) and individual ministry detail pages at `/ministries/[slug]`. The work follows established patterns from S01 (homepage sections), S02 (about/staff), and S04 (sermons listing + detail with `getStaticPaths`). The main gap is the ministry Sanity schema — it lacks a `slug` field (needed for detail page URLs) and an `image` field (needed for card thumbnails). Both need to be added, along with a `getMinistryBySlug()` GROQ helper that dereferences the `leader` reference to inline the person's name/role/photo. Everything else — layout, component patterns, CMS-with-fallback data fetching — is well-established.

## Recommendation

1. Extend the ministry schema with `slug` (required, source from name) and `image` fields.
2. Add `getMinistryBySlug()` to `src/lib/sanity.ts` that dereferences the leader reference.
3. Build a MinistryCard component (reusing Card.astro's visual pattern but adding meeting time + leader info).
4. Create `/ministries/index.astro` (hub page with Hero + card grid) and `/ministries/[slug].astro` (detail page with back link, leader info, meeting time, portable text description).
5. All pages follow CMS-with-fallback pattern and use only CSS custom properties.

## Implementation Landscape

### Key Files

- `sanity/schemas/documents/ministry.ts` — Needs `slug` field (type: 'slug', source: 'name') and `image` field (type: 'image', hotspot: true). Currently has: name, description (portable text), leader (reference to person), meetingTime, language.
- `sanity/schemas/index.ts` — No changes needed; ministry is already registered in `schemaTypes`.
- `src/lib/sanity.ts` — Has `Ministry` interface (needs slug + image fields added) and `getMinistries()` (returns all ministries, no leader deref). Needs: updated interface, new `getMinistryBySlug()` with leader deref via GROQ projection `leader->{name, role, photo}`.
- `src/components/Card.astro` — Existing card component with title/body/image/href props. Can be reused directly for ministry listing cards, or a thin `MinistryCard.astro` wrapper can add meeting time display.
- `src/components/Hero.astro` — Reused for both hub and detail page heroes.
- `src/pages/ministries/index.astro` — New: hub page. Hero + responsive card grid listing all ministries. Pattern: sermons/index.astro.
- `src/pages/ministries/[slug].astro` — New: detail page. `getStaticPaths` pattern from sermons/[slug].astro. Shows hero, back link, leader info, meeting time, description (portable text → HTML).
- `src/components/Header.astro` — Already has `{ label: 'Ministries', href: '/ministries' }` in nav. No changes needed.

### Build Order

1. **Schema + data layer first** — Add slug/image to ministry schema, update TypeScript interface, add `getMinistryBySlug()`. This unblocks both pages.
2. **Hub page** — `/ministries/index.astro` with card grid. Proves the data flows and renders.
3. **Detail page** — `/ministries/[slug].astro` with leader deref. Proves dynamic routing and leader reference resolution.

All three steps can be verified with `npm run build` succeeding and visual checks.

### Verification Approach

- `npm run build` succeeds with all new pages generating
- Ministry hub page renders at `/ministries` with responsive card grid
- Ministry detail pages generate at `/ministries/[slug]` for each ministry with a slug
- No `client:*` directives in new components (pure Astro pattern)
- All styles use only CSS custom properties from global.css
- Leader reference resolves on detail page (name/role displayed)
- Portable text description renders as HTML on detail page
- Back link navigates to `/ministries`
- Visual verification at mobile (375px) and desktop (1280px) breakpoints

## Constraints

- Ministry schema currently has no `slug` — adding it won't auto-populate existing documents. Fallback content handles empty CMS state.
- The `leader` field is a reference to `person` — GROQ projection `leader->{name, role, photo}` is needed on the detail page query but not on the listing query (where we just show meeting time).
- Must follow the existing `getStaticPaths` + try-catch pattern for build resilience (K008).
