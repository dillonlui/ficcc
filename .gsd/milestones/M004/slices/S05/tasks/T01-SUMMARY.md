---
id: T01
parent: S05
milestone: M004
provides: []
requires: []
affects: []
key_files: ["sanity/schemas/singletons/siteSettings.ts", "src/lib/sanity.ts", "src/layouts/BaseLayout.astro", "src/styles/global.css"]
key_decisions: ["Announcement bar fields use conditional visibility in Sanity Studio (hidden when disabled)", "Bar renders as <a> when link provided, <div> when not — no JS needed", "Used role='banner' for accessibility semantics"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build passed. Grep confirms announcementBarEnabled in schema and interface, announcementBar in BaseLayout, announcement-bar in global.css."
completed_at: 2026-04-02T17:19:30.677Z
blocker_discovered: false
---

# T01: Added announcement bar schema fields, TypeScript interface, and conditional BaseLayout rendering with CMS resilience

> Added announcement bar schema fields, TypeScript interface, and conditional BaseLayout rendering with CMS resilience

## What Happened
---
id: T01
parent: S05
milestone: M004
key_files:
  - sanity/schemas/singletons/siteSettings.ts
  - src/lib/sanity.ts
  - src/layouts/BaseLayout.astro
  - src/styles/global.css
key_decisions:
  - Announcement bar fields use conditional visibility in Sanity Studio (hidden when disabled)
  - Bar renders as <a> when link provided, <div> when not — no JS needed
  - Used role='banner' for accessibility semantics
duration: ""
verification_result: passed
completed_at: 2026-04-02T17:19:30.678Z
blocker_discovered: false
---

# T01: Added announcement bar schema fields, TypeScript interface, and conditional BaseLayout rendering with CMS resilience

**Added announcement bar schema fields, TypeScript interface, and conditional BaseLayout rendering with CMS resilience**

## What Happened

Added three announcement bar fields to siteSettings Sanity schema (enabled boolean, text string, optional link URL) with conditional Studio visibility. Updated SiteSettings TypeScript interface. Added getSiteSettings call to BaseLayout with try-catch per K008, rendering a conditional banner as <a> or <div> depending on link presence. Added announcement-bar CSS styles using existing design tokens.

## Verification

npm run build passed. Grep confirms announcementBarEnabled in schema and interface, announcementBar in BaseLayout, announcement-bar in global.css.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 10000ms |
| 2 | `grep -q 'announcementBarEnabled' sanity/schemas/singletons/siteSettings.ts && grep -q 'announcementBarEnabled' src/lib/sanity.ts && grep -q 'announcementBar' src/layouts/BaseLayout.astro && grep -q 'announcement-bar' src/styles/global.css` | 0 | ✅ pass | 100ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sanity/schemas/singletons/siteSettings.ts`
- `src/lib/sanity.ts`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`


## Deviations
None.

## Known Issues
None.
