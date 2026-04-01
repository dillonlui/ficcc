---
id: S07
parent: M001
milestone: M001
provides:
  - SEO.astro component for meta/OG/Twitter/JSON-LD on all pages
  - Custom 404 page with site chrome
  - LHCI GitHub Actions workflow for PR-level Lighthouse CI
requires:
  - slice: S02
    provides: Design tokens used in 404 page styling
  - slice: S03
    provides: Header/Footer components rendered via BaseLayout
  - slice: S05
    provides: sitemap.xml and robots.txt infrastructure
affects:
  []
key_files:
  - src/components/SEO.astro
  - src/layouts/BaseLayout.astro
  - src/pages/404.astro
  - lighthouserc.cjs
  - .github/workflows/lighthouse.yml
key_decisions:
  - SEO.astro uses Astro.site for absolute canonical/OG URLs
  - Default JSON-LD uses @type Church with name/description/url
  - SEO component accepts jsonLd override prop for page-specific structured data
  - 404 SEO threshold set to warn at 0.8 instead of error at 0.95
patterns_established:
  - Reusable SEO.astro component in BaseLayout head — all pages get meta/OG/Twitter/JSON-LD automatically
  - Per-URL LHCI assertMatrix pattern for pages with different performance/SEO characteristics
observability_surfaces:
  - LHCI autorun in GitHub Actions on PRs — catches Lighthouse regressions before merge
drill_down_paths:
  - .gsd/milestones/M001/slices/S07/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S07/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T03:49:38.861Z
blocker_discovered: false
---

# S07: Remediation: SEO Components, 404 Page & LHCI CI Pipeline

**Reusable SEO.astro component delivers meta/OG/Twitter/JSON-LD on every page, custom 404 renders with full site chrome, and LHCI GitHub Actions workflow gates PRs on Lighthouse scores.**

## What Happened

T01 built src/components/SEO.astro with a typed Props interface (title, description, canonicalUrl, ogImage, ogType, lang, jsonLd). The component renders title, meta description, canonical link, full Open Graph tags, Twitter card tags, and a JSON-LD script block defaulting to Church schema. All URLs are absolute via new URL() against Astro.site. BaseLayout was updated to import SEO.astro and replace the hand-written title/description tags, so every page using BaseLayout automatically gets complete SEO markup.

T02 created src/pages/404.astro using BaseLayout — which means the 404 page gets site chrome (Header/Footer) and full SEO tags for free. The page renders a centered 404 heading, friendly message, and styled "Back to Home" link using design tokens. lighthouserc.cjs was updated to include the 404.html URL with a per-URL assertMatrix entry (SEO threshold set to warn at 0.8 for 404). .github/workflows/lighthouse.yml was created to run LHCI autorun on PRs to main. LHCI autorun was verified locally — 9 runs across 3 URLs (index, styleguide, 404) all passed assertions.

## Verification

npm run build exited 0 producing 4 pages including dist/404.html. Grep checks confirmed og:title, og:description, og:url, og:image, application/ld+json, Church, twitter:card, and canonical present in dist/index.html. Grep checks confirmed header, footer, and og:title present in dist/404.html. .github/workflows/lighthouse.yml exists. npx @lhci/cli autorun passed all assertions across 9 runs (3 URLs × 3 runs each).

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

JSON-LD defaults to Church schema — page-specific schemas (Event, Article) will need to pass jsonLd prop when those page types are built. OG image defaults to /og-default.png which doesn't exist yet — needs a real image asset in a future milestone.

## Follow-ups

Create /og-default.png image asset for social sharing. Add page-specific JSON-LD schemas when sermon/event pages are built. Monitor LHCI workflow on first real PR to confirm GitHub Actions runner performance matches local.

## Files Created/Modified

- `src/components/SEO.astro` — New reusable SEO component rendering meta/OG/Twitter/JSON-LD tags
- `src/layouts/BaseLayout.astro` — Replaced raw title/description with SEO component import
- `src/pages/404.astro` — New custom 404 page using BaseLayout with site chrome
- `lighthouserc.cjs` — Added 404.html URL and assertMatrix entry
- `.github/workflows/lighthouse.yml` — New LHCI workflow triggered on PRs to main
