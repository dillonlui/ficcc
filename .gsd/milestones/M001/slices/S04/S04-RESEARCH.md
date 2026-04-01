# S04: Sanity Schema & Studio — Research

**Date:** 2026-03-31

## Summary

S04 needs to deliver a working Sanity Studio with all document types, content blocks, and sample content. The `@sanity/astro` integration provides an embedded Studio at `/admin` within the Astro app, which is cleaner than maintaining a separate `studio/` directory with its own dependencies. This approach requires `@astrojs/react` and the `sanity` core package.

The content model derives directly from architectural decisions: bilingual documents with a `language` field (D003, not i18n field duplication), sermon metadata referencing YouTube video IDs (D005), and modular Portable Text blocks that map to S03's base components (Hero, ImageMosaic, Accordion, Card). Singletons are needed for site settings and navigation structure.

The current codebase has a placeholder `studio/sanity.config.ts` and `src/lib/sanity.ts` client — both need to be replaced/updated. The `@sanity/client` is already installed. CSP headers in `vercel.json` already allow `cdn.sanity.io` and `*.sanity.io`.

## Recommendation

Use `@sanity/astro` integration with embedded Studio at `/admin`. Replace the standalone `studio/` directory approach with the integrated one. This gives us:
- Studio served from the same Astro app (no separate dev server)
- `sanity:client` module for typed client access (replaces manual `src/lib/sanity.ts`)
- Path to Visual Editing in S06

The content model should have these document types:
- **page** — generic pages with modular content blocks (About, Give, Connect, etc.)
- **sermon** — YouTube video metadata (title, speaker, date, series, scripture, videoId)
- **event** — church events (title, date, time, location, description, recurring flag)
- **ministry** — ministry/fellowship groups (name, description, leader, meetingTime)
- **person** — pastoral staff and ministry leaders (name, role, bio, photo)
- **siteSettings** (singleton) — church name, address, phone, email, social links
- **navigation** (singleton) — nav structure for header/footer

All document types get a `language` field (`'en' | 'zh'`) per D003. Singletons get one document per language.

Reusable object types for Portable Text blocks:
- **heroBlock** — heading, subheading, background image, CTA
- **imageMosaicBlock** — array of images with captions
- **accordionBlock** — array of {title, content} items
- **cardGridBlock** — array of card references or inline cards
- **youtubeEmbedBlock** — video ID, caption

## Implementation Landscape

### Key Files

- `studio/sanity.config.ts` — **Delete.** Replaced by root `sanity.config.ts` used by `@sanity/astro`.
- `sanity.config.ts` (root) — **Create.** Studio configuration with schema types, structure builder, plugins.
- `sanity/schemas/` — **Create.** Directory for all schema type definitions (one file per type).
- `sanity/schemas/documents/page.ts` — Page document type with modular body blocks.
- `sanity/schemas/documents/sermon.ts` — Sermon metadata with YouTube video ID.
- `sanity/schemas/documents/event.ts` — Church events.
- `sanity/schemas/documents/ministry.ts` — Ministry/fellowship groups.
- `sanity/schemas/documents/person.ts` — Staff/leaders.
- `sanity/schemas/singletons/siteSettings.ts` — Global site settings.
- `sanity/schemas/singletons/navigation.ts` — Nav structure.
- `sanity/schemas/objects/` — Reusable object types (heroBlock, imageMosaicBlock, etc.).
- `sanity/schemas/index.ts` — Barrel export of all schema types.
- `sanity/structure.ts` — Custom Studio structure (singletons at top, document types below).
- `src/lib/sanity.ts` — **Update.** May switch to `sanity:client` from `@sanity/astro` integration or keep as thin wrapper.
- `astro.config.mjs` — **Update.** Add `@sanity/astro` and `@astrojs/react` integrations.
- `package.json` — **Update.** Add `sanity`, `@sanity/astro`, `@astrojs/react`, `react`, `react-dom` dependencies.
- `.env.example` — **Update.** Ensure `SANITY_PROJECT_ID` and `SANITY_DATASET` documented.

### Build Order

1. **Install dependencies and configure integrations** — `@sanity/astro`, `@astrojs/react`, `sanity`, `react`, `react-dom`. Update `astro.config.mjs`. This unblocks everything else.
2. **Define schema types** — Start with singletons (siteSettings, navigation) and the person type (no dependencies). Then documents that reference person (ministry, sermon). Then page (depends on object block types). Build object types alongside page.
3. **Configure Studio structure** — Custom desk structure with singletons, organized document lists filtered by language.
4. **Seed sample content** — Create sample documents in both EN and ZH via Sanity CLI or Studio. At minimum: one siteSettings per language, one page, one sermon, one event, one ministry, one person.
5. **Verify GROQ queries** — Write and test representative queries (pages by language, sermons by series, upcoming events). These verify the schema design works for the frontend.

### Verification Approach

- `npm run build` succeeds (no schema or integration errors)
- Sanity Studio loads at `/admin` in dev mode (`npm run dev`)
- All document types appear in Studio with correct fields
- Singletons show as single-document editors (not lists)
- Sample content is created and visible in Studio
- GROQ queries return expected results (test via `@sanity/vision` plugin or a simple test script)
- Language filtering works: querying `*[_type == "page" && language == "en"]` returns only English pages

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Embedding Studio in Astro | `@sanity/astro` integration | Handles route injection, client module, and Visual Editing prep. Maintained by Sanity team. |
| Portable Text rendering | `@portabletext/astro` (or `astro-portabletext`) | Will be needed in later milestones for rendering body content. Not needed in S04 but worth noting. |
| GROQ query testing | `@sanity/vision` plugin | Built-in Studio plugin for testing GROQ queries interactively. |

## Constraints

- `output: 'static'` in `astro.config.mjs` — The `@sanity/astro` integration generates a static HTML shell for Studio at `/admin` that loads React client-side. This works with static output. Visual Editing (S06) will require switching to `output: 'hybrid'` or `'server'` with the Vercel adapter, but that's out of scope for S04.
- The project needs a real Sanity project ID. The `.env.example` has placeholders. The executor will need `secure_env_collect` to set `SANITY_PROJECT_ID` (or create a new Sanity project via `npx sanity init`).
- Adding `@astrojs/react` introduces React as a dependency. This is fine — it's scoped to Studio and doesn't affect the static Astro pages (no React islands in the frontend). Bundle impact is zero for production pages since `/admin` is a separate route.

## Common Pitfalls

- **Singleton documents need structure builder** — Without custom structure, singletons appear as regular document lists. Must use `S.document().schemaType('siteSettings').documentId('siteSettings')` pattern to show them as single editors.
- **Language field on singletons** — With D003's approach, singletons need one document per language. The document ID should encode the language (e.g., `siteSettings-en`, `siteSettings-zh`) to avoid collisions.
- **React version conflicts** — `sanity` ships its own React dependency. Ensure the root `react` and `react-dom` versions are compatible (React 18.x). Don't install React 19.
- **Studio route vs CSP** — Studio loads from `cdn.sanity.io` and `api.sanity.io`. The CSP in `vercel.json` already covers `cdn.sanity.io` in img-src and `*.sanity.io` in connect-src. The script-src may need `https://cdn.sanity.io` if Studio loads scripts from CDN — verify during implementation.

## Open Risks

- The Sanity project may not exist yet. If `SANITY_PROJECT_ID` is not set, Studio won't connect. The executor will need to either use an existing project or create one via `npx sanity init --bare`.
- `@sanity/astro` with `output: 'static'` and `studioBasePath` — need to confirm the integration generates a proper static page for Studio. If it requires SSR, we'd need to switch to `hybrid` output early (pulling work from S06).

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Sanity CMS | `sanity-io/agent-toolkit@sanity-best-practices` | available (1.5K installs) |
| Sanity content modeling | `sanity-io/agent-toolkit@content-modeling-best-practices` | available (1.1K installs) — directly relevant |
| Sanity SEO | `sanity-io/agent-toolkit@seo-aeo-best-practices` | available (1.5K installs) — relevant for S05 |

## Sources

- Sanity Studio v3 schema API: `defineType`, `defineField` for type-safe schema definitions (source: [Sanity docs via Context7](/sanity-io/sanity))
- `@sanity/astro` integration: embeds Studio at configurable base path, provides `sanity:client` module, requires `@astrojs/react` (source: [sanity-astro README](/sanity-io/sanity-astro))
- Structure Builder API for custom desk organization including singleton pattern (source: [Sanity docs via Context7](/sanity-io/sanity))
