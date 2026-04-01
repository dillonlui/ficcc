---
id: S04
parent: M001
milestone: M001
provides:
  - Sanity Studio at /admin with all 12 schema types registered
  - Typed GROQ query helpers (getPageBySlug, getSermons, getEvents, getMinistries, getSiteSettings, getNavigation)
  - Schema barrel export at sanity/schemas/index.ts for extending schema types
requires:
  - slice: S01
    provides: Astro project scaffold, Vercel deployment, env var setup
affects:
  - S06
key_files:
  - sanity.config.ts
  - sanity/structure.ts
  - sanity/schemas/index.ts
  - sanity/schemas/documents/page.ts
  - sanity/schemas/documents/sermon.ts
  - sanity/schemas/documents/event.ts
  - sanity/schemas/documents/ministry.ts
  - sanity/schemas/documents/person.ts
  - sanity/schemas/singletons/siteSettings.ts
  - sanity/schemas/singletons/navigation.ts
  - sanity/schemas/objects/heroBlock.ts
  - sanity/schemas/objects/imageMosaicBlock.ts
  - sanity/schemas/objects/accordionBlock.ts
  - sanity/schemas/objects/cardGridBlock.ts
  - sanity/schemas/objects/youtubeEmbedBlock.ts
  - src/lib/sanity.ts
  - src/components/Studio.tsx
  - src/pages/admin/index.astro
  - astro.config.mjs
  - .env.example
key_decisions:
  - D011: Manual client:only React component at /admin instead of studioBasePath to preserve static output
  - Singleton IDs follow {type}-{lang} pattern for per-language singleton documents
  - Page body accepts standard Portable Text plus all 5 custom block types as an array
  - Structure builder groups singletons under Settings & Navigation, filters them from default document list
  - No CSP changes needed — Studio scripts are self-hosted from Astro build bundle
patterns_established:
  - Sanity schema files organized as sanity/schemas/{objects,documents,singletons}/ with barrel export from index.ts
  - Language field on every document type with 'en' | 'zh' options, initial value 'en'
  - Typed GROQ query helpers in src/lib/sanity.ts accepting language parameter — pattern for all future content fetching
observability_surfaces:
  - none — CMS schema and Studio are design-time artifacts with no runtime monitoring needs
drill_down_paths:
  - .gsd/milestones/M001/slices/S04/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S04/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S04/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T01:38:08.882Z
blocker_discovered: false
---

# S04: Sanity Schema & Studio

**Sanity Studio embedded at /admin with 12 schema types (5 documents, 2 singletons, 5 block types), per-language singleton structure, and 6 typed GROQ query helpers for downstream page building**

## What Happened

Three tasks delivered the full Sanity CMS layer. T01 installed Sanity v5, React 19, @sanity/astro, and @astrojs/react, then embedded Sanity Studio at /admin via a client:only React component (studioBasePath requires server rendering, incompatible with static output). T02 created all 12 schema types: 5 document types (page, sermon, event, ministry, person), 2 singletons (siteSettings, navigation), and 5 Portable Text block types (hero, imageMosaic, accordion, cardGrid, youtubeEmbed). Every document type includes a language field with en/zh options per D003. Singletons use {type}-{lang} IDs and appear as single-doc editors in a dedicated Settings & Navigation group. The page body field accepts standard Portable Text plus all 5 custom block types. T03 added 6 typed GROQ query helpers (getPageBySlug, getSermons, getEvents, getMinistries, getSiteSettings, getNavigation) to src/lib/sanity.ts, removed the old standalone studio/ directory, and confirmed Lighthouse CI passes with no regressions.

## Verification

All verification checks pass across all three tasks: npm run build exits 0 (3 pages built including /admin), 13 schema files found under sanity/schemas/, schemas import confirmed in sanity.config.ts, sanity integration confirmed in astro.config.mjs, sanity.config.ts and sanity/structure.ts exist, old studio/ directory removed, GROQ helpers present (7 exports), Lighthouse CI passes all assertions.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

React 19 used instead of planned React 18 — Sanity v5 requires it as a peer dependency. Dropped @sanity/astro studioBasePath in favor of manual client:only React component embed to preserve output:static mode (documented in D011). Used PUBLIC_ prefixed env vars for client-side Studio config.

## Known Limitations

Studio at /admin is client-rendered only — no SSR preview integration yet (deferred to S06). No sample content seeded — schema types exist but the Sanity dataset is empty until editors create content or a seed script is added. Large Sanity Studio chunks (~5MB pane2 bundle) — acceptable for admin-only route but could benefit from manual chunking if load time becomes an issue.

## Follow-ups

S06 will wire preview mode so editors can see draft content rendered on the live site. Sample content seeding could be added as a convenience script but is not blocking.

## Files Created/Modified

- `package.json` — Added sanity, @sanity/astro, @astrojs/react, react 19, react-dom, @sanity/vision dependencies
- `astro.config.mjs` — Added sanity() and react() integrations
- `sanity.config.ts` — Root Sanity config with structureTool, visionTool, and all 12 schema types
- `sanity/structure.ts` — Custom desk structure with singleton handling and language grouping
- `sanity/schemas/index.ts` — Barrel export of all schema types, singletonTypes set, and singletonDocIds
- `sanity/schemas/documents/page.ts` — Page schema with title, slug, body (Portable Text + custom blocks), language
- `sanity/schemas/documents/sermon.ts` — Sermon schema with videoId, speaker, date, series, scripture, language
- `sanity/schemas/documents/event.ts` — Event schema with date, endDate, time, location, recurring, language
- `sanity/schemas/documents/ministry.ts` — Ministry schema with leader reference, meetingTime, language
- `sanity/schemas/documents/person.ts` — Person schema with name, role, bio, photo with hotspot, language
- `sanity/schemas/singletons/siteSettings.ts` — Site settings singleton with church info and social links
- `sanity/schemas/singletons/navigation.ts` — Navigation singleton with nested nav items
- `sanity/schemas/objects/heroBlock.ts` — Hero block with heading, subheading, background image, CTA
- `sanity/schemas/objects/imageMosaicBlock.ts` — Image mosaic block with array of captioned images
- `sanity/schemas/objects/accordionBlock.ts` — Accordion block with title/content pairs
- `sanity/schemas/objects/cardGridBlock.ts` — Card grid block with inline cards
- `sanity/schemas/objects/youtubeEmbedBlock.ts` — YouTube embed block with videoId and caption
- `src/lib/sanity.ts` — Sanity client + 6 typed GROQ query helpers with TypeScript interfaces
- `src/components/Studio.tsx` — Client-only React component wrapping Sanity Studio
- `src/pages/admin/index.astro` — Admin page hosting Studio via client:only='react'
- `.env.example` — Documented PUBLIC_ prefixed Sanity env vars
