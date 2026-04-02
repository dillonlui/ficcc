---
id: S02
parent: M004
milestone: M004
provides:
  - JSON-LD structured data infrastructure (Church, WebSite, VideoObject, Event, Organization)
  - GA4 analytics with custom event helper (window.sendAnalyticsEvent)
  - Sitemap with hreflang alternate links
  - SEO prop forwarding (jsonLd, ogImage, ogType) through BaseLayout
requires:
  []
affects:
  - S06
key_files:
  - src/layouts/BaseLayout.astro
  - src/lib/structured-data.ts
  - src/lib/structured-data.test.ts
  - src/pages/index.astro
  - src/pages/sermons/[slug].astro
  - src/pages/events.astro
  - src/pages/about/index.astro
  - astro.config.mjs
  - public/og-default.png
  - .env.example
key_decisions:
  - GA4 script uses define:vars for measurement ID, gated on env var — zero analytics code when unset
  - Custom event helper exposed as window.sendAnalyticsEvent for sermon_play, language_switch, form_submit
  - Used @graph wrapper for homepage to combine Church and WebSite schemas in single JSON-LD block
  - Events page uses ItemList schema wrapping individual Event items
patterns_established:
  - Structured data builders as pure functions in src/lib/structured-data.ts — each returns a schema.org object, composable via @graph
  - Conditional analytics/meta pattern: env var gating in BaseLayout for optional third-party integrations
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M004/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M004/slices/S02/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-02T16:52:49.978Z
blocker_discovered: false
---

# S02: SEO & Analytics

**SEO prop forwarding, GA4 conditional analytics with custom events, JSON-LD structured data on 4 page types, sitemap hreflang, Google site verification meta, and default OG image — all build-verified with 7 structured data unit tests.**

## What Happened

Two tasks delivered the full SEO and analytics infrastructure.

T01 extended BaseLayout's Props interface with jsonLd, ogImage, and ogType, forwarding them to the existing SEO component. Added GA4 gtag.js snippet gated on PUBLIC_GA_MEASUREMENT_ID with a window.sendAnalyticsEvent() helper for custom events (sermon_play, language_switch, form_submit). Added Google site verification meta tag gated on PUBLIC_GOOGLE_SITE_VERIFICATION. Configured the sitemap integration with i18n locales (en/zh) for hreflang alternate links. Created a 1200×630 default OG image placeholder and updated .env.example.

T02 created src/lib/structured-data.ts with five pure builder functions for schema.org types: Church, WebSite, VideoObject, Event, and Organization. Wired homepage with Church+WebSite in an @graph wrapper, sermon detail with VideoObject (when videoId exists), events page with ItemList of Events, and about page with Organization (foundingDate 1968). Wrote 7 Vitest tests covering all builders including edge cases. All 27 tests pass (7 structured data + 20 navigation), build succeeds, and JSON-LD verified in built HTML.

## Verification

All slice-plan verification checks pass:
- npm test: 27 tests pass (7 structured data + 20 navigation)
- npm run build: succeeds cleanly
- public/og-default.png exists at 1200×630
- dist/client/index.html contains og:image meta tag
- dist/client/sitemap-0.xml contains xhtml:link hreflang entries
- dist/client/index.html contains application/ld+json (Church+WebSite @graph)
- dist/client/about/index.html contains Organization JSON-LD
- dist/client/events/index.html contains ItemList JSON-LD
- GA4 script correctly absent when PUBLIC_GA_MEASUREMENT_ID unset, present when set
- Google site verification meta correctly absent when env var unset

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

OG default image is a solid navy rectangle placeholder — should be replaced with a properly designed branded image. Sermon detail VideoObject JSON-LD verified via unit tests only (no live CMS data to build sermon pages).

## Follow-ups

Replace public/og-default.png with a properly designed branded OG image before launch.

## Files Created/Modified

- `src/layouts/BaseLayout.astro` — Extended Props with jsonLd/ogImage/ogType, forwarded to SEO component, added conditional GA4 script and site verification meta
- `src/lib/structured-data.ts` — New file — five pure builder functions for schema.org JSON-LD (Church, WebSite, VideoObject, Event, Organization)
- `src/lib/structured-data.test.ts` — New file — 7 Vitest tests covering all structured data builders
- `src/pages/index.astro` — Added Church+WebSite @graph JSON-LD via BaseLayout
- `src/pages/sermons/[slug].astro` — Added VideoObject JSON-LD when videoId present
- `src/pages/events.astro` — Added ItemList of Event JSON-LD
- `src/pages/about/index.astro` — Added Organization JSON-LD
- `astro.config.mjs` — Added i18n config to sitemap integration for hreflang
- `public/og-default.png` — New file — 1200×630 default OG image placeholder
- `.env.example` — Added PUBLIC_GA_MEASUREMENT_ID and PUBLIC_GOOGLE_SITE_VERIFICATION entries
