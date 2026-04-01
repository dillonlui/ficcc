# S07 — Research

**Date:** 2026-03-31

## Summary

S07 remediates three gaps identified during M001 validation: (1) no SEO meta/OG tags or JSON-LD structured data, (2) no custom 404 page, and (3) no LHCI GitHub Actions CI pipeline. All three are straightforward — Astro has built-in conventions for 404 pages, the SEO work is adding props to BaseLayout and a new SEO component, and LHCI's GitHub Action is well-documented.

BaseLayout currently renders only `<title>` and `<meta name="description">`. It needs OG tags (og:title, og:description, og:image, og:url, og:type, og:locale), Twitter card meta, and a JSON-LD `Church` schema block. A dedicated `SEO.astro` component is the cleanest approach — BaseLayout passes props through to it.

## Recommendation

Build in three independent tasks: (1) SEO component + BaseLayout wiring, (2) 404 page, (3) GitHub Actions LHCI workflow. Tasks 1 and 2 are independent. Task 3 is independent of both but verifies all pages including the 404.

Use a single `SEO.astro` component that accepts typed props and renders all meta tags, OG tags, and JSON-LD. Wire it into BaseLayout so every page gets SEO by default. The 404 page uses BaseLayout (getting site chrome + SEO) with a simple "page not found" message and link home. The LHCI workflow reuses the existing `lighthouserc.cjs` config — just needs a GitHub Actions YAML that installs, builds, and runs `lhci autorun`.

## Implementation Landscape

### Key Files

- `src/components/SEO.astro` — **New.** Renders `<meta>` OG tags, Twitter card tags, and `<script type="application/ld+json">` for Church structured data. Accepts props: title, description, canonicalUrl, ogImage, ogType, lang, jsonLd (optional override).
- `src/layouts/BaseLayout.astro` — Replace hand-written `<title>` and `<meta name="description">` with `<SEO>` component. Pass through existing props (title, description, lang) plus new optional ones (canonicalUrl, ogImage). Add `Astro.url` for canonical URL derivation.
- `src/pages/404.astro` — **New.** Custom 404 page using BaseLayout. Shows heading, friendly message, and link back to home. Astro automatically serves `404.html` for unmatched routes.
- `.github/workflows/lighthouse.yml` — **New.** GitHub Actions workflow triggered on PRs. Installs deps, builds, runs `npx @lhci/cli autorun` using existing `lighthouserc.cjs`.
- `lighthouserc.cjs` — May need the 404 page URL added to the `url` array if we want LHCI to test it.

### Build Order

1. **SEO component + BaseLayout wiring** — This is the most impactful piece (OG tags + JSON-LD visible in page source). Build `SEO.astro`, wire into BaseLayout, verify with `npm run build` and checking page source for meta tags.
2. **404 page** — Simple page using BaseLayout. Verify it renders with site chrome and gets SEO tags.
3. **LHCI GitHub Actions workflow** — Create `.github/workflows/lighthouse.yml`. Verify YAML is valid. Can test locally with existing `npm run lhci` which already works.

### Verification Approach

- `npm run build` succeeds with no errors, output includes 404.html
- Page source of built index.html contains `og:title`, `og:description`, `og:url`, `og:type` meta tags
- Page source contains `<script type="application/ld+json">` with `@type: "Church"`
- `dist/404.html` exists and contains Header/Footer site chrome
- `.github/workflows/lighthouse.yml` exists with valid YAML structure
- `npx @lhci/cli autorun` passes all existing thresholds (SEO score should improve with OG tags)

## Constraints

- `astro.config.mjs` has `site: 'https://ficcc.org'` — use `Astro.site` + `Astro.url.pathname` for canonical URLs, not hardcoded strings.
- CSP in `vercel.json` doesn't need changes — JSON-LD is inline script covered by `'unsafe-inline'` in script-src.
- OG image: no real image exists yet. Use a sensible default path (e.g. `/og-default.png`) that can be replaced later. Don't block on asset creation.
- GitHub Actions LHCI: the workflow needs Node.js setup and npm install. The existing `lighthouserc.cjs` uses `startServerCommand: 'npm run preview'` which handles the build-then-serve flow, but the GH Action should run `npm run build` first and then `lhci autorun` to match the existing `npm run lhci` script pattern.

## Common Pitfalls

- **JSON-LD must be valid JSON** — Use `JSON.stringify()` in the template, don't hand-write JSON in a template literal. Astro's `set:html` directive is needed for script content.
- **OG image URL must be absolute** — Relative paths break on social media crawlers. Derive from `Astro.site`.
- **404 page must be named exactly `404.astro`** — Astro convention. Any other name won't be served as the error page.
- **LHCI in GitHub Actions needs Chrome** — `ubuntu-latest` runners have Chrome pre-installed, but if using a custom runner, `@lhci/cli` may need `--chrome-flags="--no-sandbox"`.
