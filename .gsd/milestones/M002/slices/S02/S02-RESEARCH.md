# S02: About / Beliefs / Staff — Research

**Date:** 2026-03-31

## Summary

This slice delivers three identity pages: About (Who We Are), Beliefs, and Staff. All follow established patterns from S01 — pure Astro components with scoped CSS, CMS data via GROQ helpers with hardcoded fallbacks, BaseLayout shell. The `person` schema already exists with name/role/bio/photo/language fields, and the `accordionBlock` object schema supports rich-text content items. No new Sanity schemas are needed for About or Staff pages. Beliefs needs an `aboutPage` singleton (or equivalent) to hold beliefs accordion data, the "Who We Are" narrative, and staff display order — or these three pages can use the existing generic `page` document type with slug-based routing.

The main design decision is whether to use dedicated singletons (like `homePage`) for bespoke structured fields, or the generic `page` type with its block-based body. Given the roadmap calls for "bespoke Who We Are layout" and a "Beliefs accordion" with specific structure, dedicated singletons give the CMS editor a better experience and give the frontend predictable typed data. The `person` documents are already a collection type — just need a GROQ helper to fetch them.

## Recommendation

Create an `aboutPage` Sanity singleton with structured fields for all three sections: a "Who We Are" narrative section (heading, body text, optional image), a beliefs array (title + rich text content per item), and a staff ordering/visibility mechanism. Staff members stay as individual `person` documents — the singleton just controls display order. Build three Astro pages (`/about`, `/about/beliefs`, `/about/staff`) sharing a consistent sub-navigation pattern, plus two new components (StaffGrid, BeliefsList). Extend the existing Accordion component to accept HTML content (rendered server-side from Portable Text) rather than plain strings — this keeps the Accordion pure Astro while supporting rich text.

For Portable Text rendering, use `@portabletext/toolkit` to convert blocks to plain HTML strings server-side in the GROQ helper or page frontmatter, avoiding a client-side dependency. Alternatively, a lightweight server-side render function (~20 lines) can handle the simple block types (paragraphs, bold, italic, links) that beliefs content will use.

## Implementation Landscape

### Key Files

- `sanity/schemas/singletons/aboutPage.ts` — **New.** Singleton schema with `whoWeAre` (heading, body blocks, image), `beliefs` (array of {title, content blocks}), and optional `staffOrder` (array of person references) fields.
- `sanity/schemas/index.ts` — Register `aboutPage` in exports, `schemaTypes`, `singletonTypes`, `singletonDocIds`.
- `sanity/structure.ts` — Add `aboutPage` singleton entries to the desk structure.
- `src/lib/sanity.ts` — Add `AboutPage` interface, `getAboutPage()` GROQ helper, `getStaff()` helper (fetches person docs by language, ordered by name). Add a `portableTextToHtml()` utility for simple block→HTML conversion.
- `src/pages/about/index.astro` — **New.** Who We Are page with narrative layout (heading, body text, optional hero/image).
- `src/pages/about/beliefs.astro` — **New.** Beliefs page using Accordion component with rich-text content.
- `src/pages/about/staff.astro` — **New.** Staff grid page using StaffCard components.
- `src/components/StaffCard.astro` — **New.** Card-like component showing photo, name, role. Pure Astro, scoped CSS.
- `src/components/Accordion.astro` — **Modify.** Accept `content: string` as HTML (via `set:html`) instead of wrapping in `<p>`. Non-breaking — plain text callers still work.

### Build Order

1. **Sanity schema + data layer first** — Create `aboutPage` singleton, register it, add GROQ helpers and `portableTextToHtml`. This unblocks all three pages and can be verified with `npm run build`.
2. **About page (Who We Are)** — Simplest of the three, establishes the `/about/` route prefix and sub-nav pattern.
3. **Beliefs page** — Depends on Accordion modification and `portableTextToHtml`. Medium complexity.
4. **Staff page** — Depends on `getStaff()` helper and new StaffCard component. Independent of beliefs work.

### Verification Approach

- `npm run build` succeeds after each task (no broken imports, no Sanity fetch errors)
- All three pages render at their routes in dev server
- Visual verification at mobile (375px) and desktop (1280px) breakpoints
- Accordion opens/closes with keyboard (Enter/Space on summary) — native `<details>` behavior
- Staff grid is responsive (1 col mobile → 2 col tablet → 3-4 col desktop)
- No `client:*` directives on any new component (pure Astro pattern)

## Constraints

- No Portable Text client library is installed as a direct dependency. Beliefs rich-text content must be rendered server-side — either via a lightweight custom `portableTextToHtml()` function or by adding `@portabletext/toolkit` as a dependency.
- The existing Accordion component takes `content: string` per item. To support rich text from Sanity blocks, either the component accepts pre-rendered HTML (simpler, keeps component pure) or it's extended with a slot-based API (more complex).
- All components must be pure Astro with scoped CSS using only CSS custom properties — no client:* directives (D010 pattern).
- CMS fetches must be wrapped in try-catch with hardcoded fallbacks (K008 pattern).

## Common Pitfalls

- **Accordion `set:html` XSS** — Content comes from Sanity CMS (trusted source, editor-authored), so `set:html` is safe. But the Accordion must use `<Fragment set:html={item.content} />` inside the content div, not interpolation.
- **Staff photo aspect ratios** — Person photos will vary in aspect ratio. StaffCard should use `object-fit: cover` with a fixed aspect ratio container (1:1 square or 3:4 portrait) to keep the grid uniform.
- **Empty CMS state** — All three pages need realistic hardcoded fallbacks since Sanity likely has no aboutPage document or person documents yet. Fallback beliefs should include real FICCC doctrinal content, not lorem ipsum.
