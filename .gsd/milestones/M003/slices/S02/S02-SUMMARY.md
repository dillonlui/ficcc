---
id: S02
parent: M003
milestone: M003
provides:
  - ZH ministries listing page at /zh/ministries/
  - ZH ministry detail page at /zh/ministries/[slug]
  - MinistryCard basePath prop for language-aware links
requires:
  - slice: S01
    provides: ZH page pattern (clone EN, swap to zh, Chinese fallback, lang='zh' threading)
affects:
  - S05
key_files:
  - src/pages/zh/ministries/index.astro
  - src/pages/zh/ministries/[slug].astro
  - src/components/MinistryCard.astro
key_decisions:
  - Added basePath prop to MinistryCard for language-aware links instead of duplicating component
patterns_established:
  - ZH ministry pages follow same clone-and-swap pattern as S01 ZH pages: clone EN counterpart, swap Sanity query to 'zh', provide Chinese fallback content, pass lang='zh' to BaseLayout
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M003/slices/S02/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T16:56:11.333Z
blocker_discovered: false
---

# S02: ZH Community & Ministries

**ZH ministries listing at /zh/ministries/ with 7 fellowship groups, 2 ministry programs, and a Chinese-labeled detail page — all with lang='zh' and /zh/ routing.**

## What Happened

Cloned the EN ministries listing and detail pages to src/pages/zh/ministries/. The listing page calls getMinistries('zh') with Chinese fallback content for 7 fellowship groups (福音組, 家庭組, 長青組, 校園組, 職青組, 兒童主日學, 青少年組) and 2 ministry programs (主日學 Sunday School, 門徒訓練 Discipleship), organized under section headings for better UX. The detail page uses getMinistryBySlug with Chinese labels ('聚會時間', '← 返回事工') and /zh/ministries back link. Added a basePath prop to MinistryCard for language-aware links without duplicating the component or breaking EN pages. Build succeeds with all 9 groups/programs present, lang="zh" set, and EN pages unaffected.

## Verification

Build passed. Verified: (1) dist/client/zh/ministries/index.html exists, (2) contains 團契 (fellowship), (3) contains lang="zh", (4) EN ministries page does not contain Chinese content, (5) all 9 groups/programs confirmed present in output HTML, (6) detail page template has Chinese back link.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Added basePath prop to MinistryCard component (not in plan) for language-aware links. Organized ZH fallback content into two sections with headings for better UX.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `src/pages/zh/ministries/index.astro` — New ZH ministries listing with 7 fellowship groups and 2 ministry programs
- `src/pages/zh/ministries/[slug].astro` — New ZH ministry detail page with Chinese labels and /zh/ routing
- `src/components/MinistryCard.astro` — Added basePath prop for language-aware ministry links
