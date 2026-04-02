---
id: T01
parent: S02
milestone: M004
provides: []
requires: []
affects: []
key_files: ["src/layouts/BaseLayout.astro", "astro.config.mjs", "public/og-default.png", ".env.example"]
key_decisions: ["GA4 script uses define:vars for measurement ID, placed after visual editing block", "Custom event helper exposed as window.sendAnalyticsEvent for sermon_play, language_switch, form_submit"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "Build succeeds. OG image exists at 1200×630. og:image present in built HTML. Sitemap contains xhtml:link hreflang entries. GA4 and verification meta correctly absent when env vars unset, correctly present when set."
completed_at: 2026-04-02T16:47:54.708Z
blocker_discovered: false
---

# T01: Wired SEO prop forwarding through BaseLayout, added conditional GA4 analytics with custom event helper, site verification meta, sitemap hreflang, and default OG image

> Wired SEO prop forwarding through BaseLayout, added conditional GA4 analytics with custom event helper, site verification meta, sitemap hreflang, and default OG image

## What Happened
---
id: T01
parent: S02
milestone: M004
key_files:
  - src/layouts/BaseLayout.astro
  - astro.config.mjs
  - public/og-default.png
  - .env.example
key_decisions:
  - GA4 script uses define:vars for measurement ID, placed after visual editing block
  - Custom event helper exposed as window.sendAnalyticsEvent for sermon_play, language_switch, form_submit
duration: ""
verification_result: passed
completed_at: 2026-04-02T16:47:54.709Z
blocker_discovered: false
---

# T01: Wired SEO prop forwarding through BaseLayout, added conditional GA4 analytics with custom event helper, site verification meta, sitemap hreflang, and default OG image

**Wired SEO prop forwarding through BaseLayout, added conditional GA4 analytics with custom event helper, site verification meta, sitemap hreflang, and default OG image**

## What Happened

Extended BaseLayout's Props interface with jsonLd, ogImage, and ogType and forwarded them to the SEO component. Added GA4 gtag.js snippet gated on PUBLIC_GA_MEASUREMENT_ID with window.sendAnalyticsEvent() helper for custom events. Added Google site verification meta tag gated on PUBLIC_GOOGLE_SITE_VERIFICATION. Configured sitemap integration with i18n locales (en/zh) for hreflang alternate links. Created 1200×630 default OG image. Updated .env.example.

## Verification

Build succeeds. OG image exists at 1200×630. og:image present in built HTML. Sitemap contains xhtml:link hreflang entries. GA4 and verification meta correctly absent when env vars unset, correctly present when set.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 11200ms |
| 2 | `test -f public/og-default.png` | 0 | ✅ pass | 100ms |
| 3 | `grep -q 'og:image' dist/client/index.html` | 0 | ✅ pass | 100ms |
| 4 | `grep -q 'xhtml:link' dist/client/sitemap-0.xml` | 0 | ✅ pass | 100ms |
| 5 | `grep -c 'googletagmanager' dist/client/index.html (no env)` | 1 | ✅ pass (correctly absent) | 100ms |
| 6 | `PUBLIC_GA_MEASUREMENT_ID=G-TEST123 npm run build + grep` | 0 | ✅ pass | 9800ms |


## Deviations

None.

## Known Issues

OG default image is a solid navy rectangle placeholder — should be replaced with a properly designed image when available.

## Files Created/Modified

- `src/layouts/BaseLayout.astro`
- `astro.config.mjs`
- `public/og-default.png`
- `.env.example`


## Deviations
None.

## Known Issues
OG default image is a solid navy rectangle placeholder — should be replaced with a properly designed image when available.
