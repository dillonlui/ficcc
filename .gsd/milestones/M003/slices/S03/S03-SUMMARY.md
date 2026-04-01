---
id: S03
parent: M003
milestone: M003
provides:
  - ZH sermons listing and detail pages at /zh/sermons/
  - ZH events page at /zh/events/
  - ZH give page at /zh/give/
  - ZH contact page at /zh/contact/ with WeChat section
requires:
  - slice: S01
    provides: BaseLayout lang='zh' support, ZH Header/Footer navigation, /zh/ routing pattern
affects:
  - S04
  - S05
key_files:
  - src/pages/zh/sermons/index.astro
  - src/pages/zh/sermons/[slug].astro
  - src/pages/zh/events.astro
  - src/pages/zh/give.astro
  - src/pages/zh/contact.astro
key_decisions:
  - Built ZH contact as bespoke page with WeChat-first design rather than cloning EN 4-tab contact
  - Used WeChat brand green (#07c160) for contact page icon
  - Inline QR placeholder box instead of external SVG asset
  - Used Chinese Union Version for Bible verse translation (哥林多後書 9:7)
patterns_established:
  - ZH transactional pages follow same clone-and-swap pattern as ZH core pages: getX('zh'), lang='zh' to BaseLayout, translated UI text, /zh/ internal links
  - Bespoke page design when ZH needs differ significantly from EN (contact page WeChat-first vs EN form-first)
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M003/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M003/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M003/slices/S03/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T17:07:13.970Z
blocker_discovered: false
---

# S03: ZH Sermons, Events & Transactional

**Delivered ZH Sermons listing/detail, Events, Give, and Contact pages — completing all Chinese transactional pages with bespoke WeChat-first contact experience**

## What Happened

Three tasks delivered five ZH pages at /zh/ paths, completing the Chinese transactional page set.

T01 cloned EN sermons to /zh/sermons/ (listing + [slug] detail). Listing uses getSermons('zh'), Chinese hero text (證道), translated filter labels, and /zh/sermons/ links. Detail pages format dates with zh-CN locale and use Chinese meta labels (講員/日期/經文/系列). No detail pages generate yet since no ZH sermon content exists in Sanity — the listing renders an empty state in Chinese.

T02 cloned EN events and give pages. Events at /zh/events/ uses getEvents('zh') with Chinese fallback events (主日崇拜, 主日學, 週五團契). Give at /zh/give/ translates all prose including the Bible verse to Chinese Union Version (哥林多後書 9:7), with giving methods (網上奉獻/PayPal, 支票奉獻, 現場奉獻) and /zh/contact cross-link.

T03 built a bespoke contact page at /zh/contact/ — deliberately NOT a clone of the EN 4-tab contact page (1,450 LOC). Instead: a hero (聯繫我們), prominent WeChat section with brand-green icon and inline QR placeholder, simplified 3-field form (姓名/電郵/訊息) with client-side validation in Chinese, and a church info sidebar with Chinese labels. All CSS uses design tokens from global.css.

## Verification

Full build (npm run build) succeeded in 8.19s. All output files verified:
- dist/client/zh/sermons/index.html: exists, contains lang="zh" and 講
- dist/client/zh/events/index.html: exists, contains 活動 and 主日崇拜
- dist/client/zh/give/index.html: exists, contains 奉獻
- dist/client/zh/contact/index.html: exists, contains WeChat/微信, lang="zh", and 聯繫
- Give page correctly cross-links to /zh/contact

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

T03 used an inline SVG QR placeholder box instead of /images/wechat-qr-placeholder.svg — avoids external asset dependency while maintaining visual structure.

## Known Limitations

ZH sermon detail pages don't generate yet — requires ZH sermon content in Sanity. Contact form uses action='#' placeholder — no server-side form handling for ZH contact (EN contact has Turnstile + Resend API). No Turnstile integration on ZH contact form.

## Follow-ups

WeChat QR code image needs to be provided by church staff to replace the placeholder box. ZH contact form backend (Turnstile + Resend) can be wired in S05 or a later slice if needed.

## Files Created/Modified

- `src/pages/zh/sermons/index.astro` — ZH sermons listing with getSermons('zh'), Chinese UI, series filter
- `src/pages/zh/sermons/[slug].astro` — ZH sermon detail with zh-CN date format, Chinese meta labels
- `src/pages/zh/events.astro` — ZH events with getEvents('zh'), Chinese fallback events
- `src/pages/zh/give.astro` — ZH give page with Chinese prose, Bible verse, giving methods
- `src/pages/zh/contact.astro` — Bespoke ZH contact with WeChat section, simplified form, Chinese sidebar
