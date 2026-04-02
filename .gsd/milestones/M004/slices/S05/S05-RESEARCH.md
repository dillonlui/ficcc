# S05 — Staff Documentation & Training — Research

**Date:** 2026-03-31

## Summary

This slice delivers staff-facing documentation so non-technical church staff can manage content via Sanity Studio without developer help. The roadmap success criterion requires three workflows: publishing a sermon, creating an event, and updating an announcement bar.

The sermon and event schemas already exist (`sanity/schemas/documents/sermon.ts`, `event.ts`) with clear field structures. However, **no announcement bar exists anywhere** — neither in schemas, components, nor frontend rendering. This is the only code change in the slice: adding an `announcementBar` field group to the `siteSettings` singleton, rendering it in `BaseLayout.astro`, and documenting it.

The documentation itself is pure Markdown — step-by-step guides with field descriptions and common-mistake warnings, written for staff who know nothing about web development. The Studio is already embedded at `/admin` via a client-only React component.

## Recommendation

1. **Add announcement bar to siteSettings schema** — add `announcementBarEnabled` (boolean), `announcementBarText` (string), and `announcementBarLink` (optional string) fields. This keeps it in the singleton pattern (K005) and doesn't require a new schema type.
2. **Render the bar in BaseLayout.astro** — conditionally render above `<Header>` when enabled. Fetch from the existing `siteSettings` query path.
3. **Write three Markdown guides** in a new `docs/staff/` directory: `publishing-a-sermon.md`, `creating-an-event.md`, `managing-announcement-bar.md`. Each guide covers: accessing Studio, filling fields, publishing, verifying on the live site, and common mistakes.
4. **Write an overview guide** (`docs/staff/README.md`) covering: Studio access URL, login, the content model (what's a document vs singleton), and the publish → rebuild → live pipeline.

## Implementation Landscape

### Key Files

- `sanity/schemas/singletons/siteSettings.ts` — Add announcementBar fields (enabled boolean, text string, link string)
- `src/lib/sanity.ts` — Existing `getSiteSettings()` GROQ helper already fetches all siteSettings fields; no query changes needed unless it uses explicit field projection
- `src/layouts/BaseLayout.astro` — Render announcement bar conditionally above Header
- `src/styles/global.css` — Minimal announcement bar styles (background, padding, text)
- `docs/staff/README.md` — New: overview guide (Studio access, login, content model, publish pipeline)
- `docs/staff/publishing-a-sermon.md` — New: step-by-step sermon workflow
- `docs/staff/creating-an-event.md` — New: step-by-step event workflow
- `docs/staff/managing-announcement-bar.md` — New: announcement bar toggle/edit workflow

### Build Order

1. **Announcement bar schema + rendering** — This is the only code change and the riskiest part (schema change + frontend rendering + query path). Build and verify first.
2. **Staff guides** — Pure documentation, no dependencies on each other. Can be written in any order after the announcement bar exists.

### Verification Approach

- `npm run build` passes (static build with announcement bar fields)
- Grep confirms announcement bar fields in siteSettings schema
- Grep confirms announcement bar rendering in BaseLayout.astro
- All four docs exist in `docs/staff/` with expected content
- Existing tests still pass (announcement bar is additive, shouldn't break anything)

## Constraints

- Site is `output: 'static'` — announcement bar content is baked at build time, not live-updated. Guides must explain the publish → rebuild → live pipeline.
- siteSettings is a singleton with `{type}-{lang}` IDs (K005) — announcement bar fields go on each language variant separately.
- `getSiteSettings()` in `src/lib/sanity.ts` needs checking — if it projects specific fields, the new announcement bar fields must be added to the projection.

## Common Pitfalls

- **Staff expect instant updates** — Guides must clearly explain that Sanity publish triggers a Vercel rebuild (~2-3 min) before changes appear on the live site. This is the #1 source of staff confusion with static sites.
- **Announcement bar link field left empty** — If the bar renders as a link but `href` is empty, it creates a broken `<a>` tag. Render as `<div>` when no link, `<a>` when link is provided.
- **Language variants forgotten** — Staff may update EN announcement but forget ZH. Guides should mention both language variants need separate updates.
