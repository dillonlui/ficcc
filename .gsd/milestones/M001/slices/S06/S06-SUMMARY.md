---
id: S06
parent: M001
milestone: M001
provides:
  - Vercel adapter with per-page SSR opt-in capability
  - Draft-aware loadQuery helper for preview contexts
  - VisualEditing overlay in BaseLayout
  - presentationTool configured in Sanity Studio
  - Env var documentation for preview infrastructure
requires:
  - slice: S04
    provides: Sanity schema and Studio configuration
  - slice: S05
    provides: Security headers (CSP) and deployment infrastructure
affects:
  []
key_files:
  - astro.config.mjs
  - package.json
  - src/lib/sanity.ts
  - src/layouts/BaseLayout.astro
  - sanity.config.ts
  - .env.example
key_decisions:
  - D014: Keep output:'static' with @astrojs/vercel@9 — Astro 5 removed hybrid mode
  - Used previewDrafts perspective for loadQuery draft awareness
  - VisualEditing rendered as React island via client:only
  - Added stega studioUrl for click-to-edit support in preview
patterns_established:
  - loadQuery as parallel query path alongside existing typed GROQ helpers — preview uses sanity:client with drafts perspective, static build uses direct client
  - Env-gated preview infrastructure — PUBLIC_SANITY_VISUAL_EDITING_ENABLED controls both loadQuery behavior and VisualEditing overlay rendering
observability_surfaces:
  - loadQuery logs perspective mode in dev console when visual editing enabled
  - Missing SANITY_API_READ_TOKEN throws descriptive error when preview mode is enabled
drill_down_paths:
  - .gsd/milestones/M001/slices/S06/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S06/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T03:33:25.199Z
blocker_discovered: false
---

# S06: Preview Mode & Integration Wiring

**Wired Sanity Visual Editing preview mode into Astro site with draft-aware loadQuery, VisualEditing overlay, presentationTool, and Vercel adapter for per-page SSR opt-in**

## What Happened

T01 added @astrojs/vercel@9 adapter to the Astro site. The original plan called for switching to `output: 'hybrid'`, but Astro 5 removed that mode — static + adapter provides identical per-page SSR opt-in via `export const prerender = false`. All 3 existing pages remain statically prerendered with zero behavior change. Build and LHCI passed cleanly.

T02 wired the core preview infrastructure: a `loadQuery` helper in `src/lib/sanity.ts` that switches between `previewDrafts` and `published` perspectives based on `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`, the `VisualEditing` overlay component in BaseLayout (rendered as a React island via `client:only`), and `presentationTool` in sanity.config.ts for Studio iframe preview. All new env vars documented in `.env.example`. The `SANITY_API_READ_TOKEN` is server-only — verified not leaked to any client component or page. Existing GROQ query helpers left completely untouched.

## Verification

All slice verification checks passed: npm run build exits 0 with 3 pages prerendered. All grep checks confirmed: @astrojs/vercel in package.json, loadQuery in sanity.ts, VisualEditing in BaseLayout.astro, presentationTool in sanity.config.ts, SANITY_API_READ_TOKEN and PUBLIC_SANITY_VISUAL_EDITING_ENABLED in .env.example. Token leak check passed — SANITY_API_READ_TOKEN not found in src/components/ or src/pages/.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Kept `output: 'static'` instead of switching to `hybrid` — Astro 5 removed hybrid mode. Static + adapter is the Astro 5 equivalent. Used @astrojs/vercel@9 instead of latest v10 (v10 requires Astro 6). Added `hybrid` as a comment in astro.config.mjs rather than as the output value. Added stega studioUrl to @sanity/astro integration config for click-to-edit support.

## Known Limitations

Preview mode is fully wired but not yet exercised by any content page — no page currently uses `loadQuery` or has `prerender = false`. That will happen when actual content pages are built in future milestones. Deploy hook and Sanity webhook for publish-triggered redeploy need production configuration.

## Follow-ups

Content pages built in future milestones need to use `loadQuery` for preview-enabled routes and set `export const prerender = false`. Deploy hook URL and Sanity webhook for publish-triggered redeploy need to be configured in production (documented in .env.example).

## Files Created/Modified

- `astro.config.mjs` — Added @astrojs/vercel adapter import and config, added hybrid comment for documentation
- `package.json` — Added @astrojs/vercel@9 dependency
- `src/lib/sanity.ts` — Added loadQuery helper with draft/published perspective switching
- `src/layouts/BaseLayout.astro` — Added VisualEditing overlay component gated by env var
- `sanity.config.ts` — Added presentationTool plugin with preview URL config
- `.env.example` — Documented SANITY_API_READ_TOKEN, PUBLIC_SANITY_VISUAL_EDITING_ENABLED, PUBLIC_SANITY_PREVIEW_URL, VERCEL_DEPLOY_HOOK_URL
