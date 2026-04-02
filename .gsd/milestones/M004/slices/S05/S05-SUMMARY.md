---
id: S05
parent: M004
milestone: M004
provides:
  - Announcement bar CMS feature (schema + rendering + styles)
  - Staff documentation for sermon publishing, event creation, and announcement bar management
requires:
  - slice: S01
    provides: Performance baseline — announcement bar rendering must not regress
affects:
  - S06
key_files:
  - sanity/schemas/singletons/siteSettings.ts
  - src/lib/sanity.ts
  - src/layouts/BaseLayout.astro
  - src/styles/global.css
  - docs/staff/README.md
  - docs/staff/publishing-a-sermon.md
  - docs/staff/creating-an-event.md
  - docs/staff/managing-announcement-bar.md
key_decisions:
  - Announcement bar fields use conditional visibility in Sanity Studio (hidden when disabled)
  - Bar renders as <a> when link provided, <div> when not — no client JS
  - Staff guides document exact field names from Sanity schemas rather than paraphrasing
patterns_established:
  - Staff documentation pattern: docs/staff/ with README overview + per-workflow guides with field tables and common mistakes
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M004/slices/S05/tasks/T01-SUMMARY.md
  - .gsd/milestones/M004/slices/S05/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-02T17:22:43.161Z
blocker_discovered: false
---

# S05: Staff Documentation & Training

**Announcement bar CMS feature with conditional rendering and four staff workflow guides enabling content self-service**

## What Happened

Two tasks delivered the slice goal of staff self-service content management.

T01 added announcement bar functionality end-to-end: three new fields on the siteSettings Sanity schema (enabled boolean, text string, optional link URL) with conditional Studio visibility so fields hide when the bar is disabled. The SiteSettings TypeScript interface was updated. BaseLayout.astro now fetches siteSettings via getSiteSettings wrapped in try-catch (K008 resilience pattern), rendering a full-width banner conditionally when enabled and text is present. The bar renders as an anchor when a link is provided, a div otherwise — no client JS needed. Styled with existing design tokens in global.css.

T02 created four staff documentation guides in docs/staff/. The README covers Studio access (/admin), login, content model overview (documents vs singletons, language variants), and the publish → rebuild → live pipeline with its 2-3 minute delay. Three workflow guides cover sermon publishing (field table, YouTube ID extraction, common mistakes), event creation (field table, hotspot/rich text tips), and announcement bar management (enable/disable/edit workflow, both-language reminder). All field names and types were extracted directly from the Sanity schemas for accuracy.

## Verification

Build verification: `npm run build` passes (exit 0, 24 pages indexed). T01 code checks: grep confirms announcementBarEnabled in schema and interface, announcementBar in BaseLayout, announcement-bar in global.css. T02 doc checks: all 4 files exist, no TBD/TODO placeholders, README has 3+ H2 headings.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

Announcement bar is not visually testable without Sanity content — no seed data for the bar exists. Staff guides assume the /admin Studio route is accessible, which requires the site to be deployed.

## Follow-ups

None.

## Files Created/Modified

- `sanity/schemas/singletons/siteSettings.ts` — Added announcementBarEnabled, announcementBarText, announcementBarLink fields with conditional visibility
- `src/lib/sanity.ts` — Updated SiteSettings interface with optional announcement bar fields
- `src/layouts/BaseLayout.astro` — Added getSiteSettings fetch with try-catch and conditional announcement bar rendering
- `src/styles/global.css` — Added .announcement-bar styles using existing design tokens
- `docs/staff/README.md` — Studio overview, login, content model, publish pipeline explanation
- `docs/staff/publishing-a-sermon.md` — Step-by-step sermon publishing guide with field table
- `docs/staff/creating-an-event.md` — Step-by-step event creation guide with field table
- `docs/staff/managing-announcement-bar.md` — Announcement bar enable/disable/edit workflow guide
