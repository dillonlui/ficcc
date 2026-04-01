---
id: S07
parent: M002
milestone: M002
provides:
  - Resources page at /resources with CMS-with-fallback pattern
  - Complete em.ficcc.org content migration coverage across all EN pages
requires:
  - slice: S02
    provides: aboutPage schema and about page structure
  - slice: S04
    provides: Sanity fetch patterns and GROQ helpers
affects:
  []
key_files:
  - sanity/schemas/singletons/resourcesPage.ts
  - src/pages/resources.astro
  - src/pages/about/index.astro
  - src/pages/contact.astro
  - src/pages/ministries/index.astro
  - sanity/schemas/singletons/aboutPage.ts
  - src/lib/sanity.ts
key_decisions:
  - Resource categories modeled as nested array-of-objects matching em.ficcc.org structure
  - Resource items typed as article/pdf/link with conditional link behavior
  - Vision statement and church stats added as CMS-editable fields on aboutPage
  - Ministries page gets inline fallback group cards instead of empty state
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M002/slices/S07/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S07/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T14:40:18.091Z
blocker_discovered: false
---

# S07: Resources & Content Migration

**Resources page live at /resources with 4 content categories, and full em.ficcc.org content migration audit completed with gaps fixed across about, contact, and ministries pages**

## What Happened

T01 built the /resources page end-to-end: resourcesPage Sanity singleton schema with nested category/resource arrays, GROQ helper, and full hardcoded fallbacks covering Spiritual Growth articles, Bible Readathon PDF, Newcomer Recommendations PDF, and 7 Cornell Campus Ministries with links. T02 systematically audited every Must Migrate and Should Migrate item from SITE-AUDIT.md Section 4 against existing schemas and page fallbacks. Found and fixed: wrong address on contact page (309 College Ave → 429 Mitchell Street), missing vision statement on about page (added "Develop Humble Servants" 3-part vision with CMS fields), missing church stats (added stats grid: ~150 members, ~20 baptisms/yr, 18 ministers sent, 40+ years), and empty ministries fallback (added 6 fellowship group cards). All em.ficcc.org content is now accounted for in Sanity schemas and Astro page fallbacks.

## Verification

npm run build succeeds for both tasks. All 15 static routes prerendered including /resources, /about, /contact, /ministries. T01 verified schema registration, GROQ helper, and no client directives. T02 verified build after audit fixes.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

T02 scope expanded beyond just documenting gaps to actually fixing them (added vision statement, stats, ministry fallbacks, address fix). This was the right call — documenting gaps without fixing them would have left the milestone incomplete.

## Known Limitations

Placeholder PDFs are text files — actual PDF assets need sourcing from em.ficcc.org. Real photos still use placeholder SVGs. Full church history timeline (cm.ficcc.org 40-year history) deferred to M003. PayPal donate button has placeholder hosted_button_id. WeChat contact not on EN pages (ZH-specific).

## Follow-ups

None — remaining content (ZH pages, history timeline, WeChat) is M003 scope.

## Files Created/Modified

- `sanity/schemas/singletons/resourcesPage.ts` — New resourcesPage singleton schema with hero + nested resourceCategories
- `sanity/schemas/index.ts` — Registered resourcesPage with EN/ZH singleton IDs
- `src/lib/sanity.ts` — Added ResourcesPage interface, getResourcesPage() helper, vision/stats fields on AboutPage
- `src/pages/resources.astro` — New resources page with 4 categories and CMS-with-fallback pattern
- `src/pages/about/index.astro` — Added vision statement section and church stats grid
- `src/pages/contact.astro` — Fixed address from 309 College Ave to 429 Mitchell Street
- `src/pages/ministries/index.astro` — Added 6 fallback fellowship group cards replacing empty state
- `sanity/schemas/singletons/aboutPage.ts` — Added visionHeading, visionBody, churchStats fields
