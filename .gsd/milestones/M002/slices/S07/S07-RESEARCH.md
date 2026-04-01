# S07: Resources & Content Migration — Research

**Date:** 2026-03-31

## Summary

S07 has two concerns: (1) build a `/resources` page and (2) verify all em.ficcc.org content is represented in Sanity schemas with hardcoded fallbacks in the Astro pages.

The Resources page on the legacy em.ficcc.org site contains spiritual growth recommendations, articles on baptism/membership/keeping faith in college/building community, a Bible Readathon reading plan PDF, a newcomer recommendations PDF, and a list of 7 Cornell campus ministries with links. This is a content-heavy page with categorized links and downloadable assets — no complex interactivity.

The "content migration" aspect is an audit: every page built in S01–S06 already has hardcoded fallback content and CMS fetch patterns. The task is to verify completeness — that all content identified in SITE-AUDIT.md's "Must Migrate" and "Should Migrate" lists for em.ficcc.org has a home in Sanity schemas and fallback data. This is verification + gap-filling, not a rewrite.

## Recommendation

**Resources page:** Create a `resourcesPage` singleton schema (like `aboutPage`, `visitPage`) with structured fields for resource categories, each containing title, description, and an array of resource links (title, url, description, type). Build `/resources` page using the established pattern: CMS fetch with try-catch, hardcoded fallback content from the legacy site. Reuse the Card component for resource items or use a simpler link-list layout depending on content density.

**Content migration audit:** Systematically compare SITE-AUDIT.md content inventory against existing schemas, GROQ helpers, and fallback data. Fill any gaps — likely minor since S01–S06 covered all major pages.

**Keep it simple.** This is the final English Ministry slice. No new architectural patterns needed.

## Implementation Landscape

### Key Files

- `sanity/schemas/singletons/resourcesPage.ts` — **New.** Singleton schema for Resources page content (resource categories with link arrays)
- `sanity/schemas/index.ts` — Register resourcesPage in schemaTypes, singletonTypes, singletonDocIds (EN/ZH)
- `src/lib/sanity.ts` — Add ResourcesPage interface and getResourcesPage() GROQ helper
- `src/pages/resources.astro` — **New.** Resources page with Hero, categorized resource sections, Card/link components
- `src/pages/index.astro` — May need fallback content updates if audit finds gaps
- Other existing pages — Minor fallback content updates if audit identifies missing em.ficcc.org content

### Existing Patterns to Follow

- **Singleton schema pattern:** `sanity/schemas/singletons/aboutPage.ts` and `visitPage.ts` — define fields, add to index.ts barrel exports, add EN/ZH singleton doc IDs
- **GROQ helper pattern:** `getAboutPage()` / `getVisitPage()` in `src/lib/sanity.ts` — typed interface + fetch by language
- **Page pattern:** Any of `/about`, `/visit`, `/give` — BaseLayout + Hero + try-catch CMS fetch + hardcoded fallback
- **Desk structure:** Auto-discovers singletons from `singletonDocIds` array — no manual structure.ts edits needed (proven in S02)

### Build Order

1. **Resources page (schema + page)** — the only new user-facing deliverable. Build the Sanity singleton schema first, then the Astro page with fallback content from the legacy site audit. This is the riskiest piece (new page) so build it first.
2. **Content migration audit** — verify all em.ficcc.org "Must Migrate" and "Should Migrate" content from SITE-AUDIT.md has a corresponding Sanity schema field and hardcoded fallback in the appropriate Astro page. Document any gaps found and fix them.

### Verification Approach

- `npm run build` succeeds with `/resources` in the output
- Resources page has no `client:*` directives (static page)
- `resourcesPage` singleton registered in schema index (EN/ZH)
- `getResourcesPage()` helper exists in sanity.ts
- Fallback content on resources page matches legacy site content (spiritual growth, campus ministries, PDFs)
- Content migration audit: every "Must Migrate" item from SITE-AUDIT.md has a corresponding field in a Sanity schema and fallback data in an Astro page

## Constraints

- `output: 'static'` — all pages must be statically renderable with fallback content when Sanity is unreachable (K008)
- PDFs referenced on the legacy Resources page (newcomer-recommendations.pdf, readathon4.pdf) need to be hosted somewhere — either in `public/` as static assets or linked externally. Since this is a static site, placing them in `public/` is simplest.
- The generic `page` document type exists in Sanity schemas but has no frontend consumer (no `[slug].astro` at root level). The Resources page should use a dedicated singleton rather than the generic page type, keeping consistency with all other bespoke pages.

## Common Pitfalls

- **Forgetting to add both EN and ZH singleton doc IDs** — every singleton needs two entries in `singletonDocIds` array. Easy to miss the ZH entry.
- **PDF links breaking on build** — if referencing PDFs in `public/`, paths must be absolute (`/newcomer-recommendations.pdf`), not relative.
