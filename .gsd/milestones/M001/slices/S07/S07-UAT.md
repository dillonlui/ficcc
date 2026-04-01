# S07: Remediation: SEO Components, 404 Page & LHCI CI Pipeline — UAT

**Milestone:** M001
**Written:** 2026-04-01T03:49:38.862Z

# S07: Remediation: SEO Components, 404 Page & LHCI CI Pipeline — UAT

**Milestone:** M001
**Written:** 2026-04-01

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: All deliverables are static build artifacts (HTML files, workflow YAML) verifiable via build output inspection and grep checks. No runtime server needed.

## Preconditions

- Node.js 20+ installed
- `npm ci` completed
- `npm run build` succeeds

## Smoke Test

Run `npm run build && grep -q 'og:title' dist/index.html && grep -q 'og:title' dist/404.html` — confirms SEO component is rendering on both pages.

## Test Cases

### 1. SEO meta tags on homepage

1. Run `npm run build`
2. Open `dist/index.html` in a text editor or grep for tags
3. **Expected:** File contains `<meta property="og:title"`, `<meta property="og:description"`, `<meta property="og:url"`, `<meta property="og:image"` with absolute URL, `<meta name="twitter:card" content="summary_large_image"`, `<link rel="canonical"` with absolute URL

### 2. JSON-LD structured data on homepage

1. Run `npm run build`
2. Search `dist/index.html` for `application/ld+json`
3. **Expected:** A `<script type="application/ld+json">` block containing `"@type":"Church"`, `"@context":"https://schema.org"`, and the site name/description/url

### 3. 404 page renders with site chrome

1. Run `npm run build`
2. Open `dist/404.html`
3. **Expected:** Page contains `<header>` and `<footer>` elements (site chrome from BaseLayout), a heading with "404", a friendly message, and a link to `/`

### 4. 404 page has SEO tags

1. Search `dist/404.html` for `og:title`
2. **Expected:** OG tags, Twitter card tags, canonical link, and JSON-LD block are present (inherited from BaseLayout → SEO.astro)

### 5. LHCI workflow file exists and is valid

1. Open `.github/workflows/lighthouse.yml`
2. **Expected:** Triggers on `pull_request` to `main`. Steps include checkout, Node.js setup, `npm ci`, `npm run build`, and `npx @lhci/cli autorun`

### 6. LHCI autorun passes locally

1. Run `npx @lhci/cli autorun`
2. **Expected:** Runs 3 URLs (index, styleguide, 404) × 3 runs each = 9 total runs. All assertions pass with exit code 0.

## Edge Cases

### OG image URL is absolute

1. Grep `dist/index.html` for `og:image`
2. **Expected:** URL starts with `https://` (absolute, not relative `/og-default.png`)

### Canonical URL uses Astro.site

1. Grep `dist/index.html` for `canonical`
2. **Expected:** href is a full absolute URL matching the site domain, not a relative path

## Failure Signals

- `npm run build` fails — SEO component has a syntax or type error
- `grep -q 'og:title' dist/index.html` fails — SEO component not wired into BaseLayout
- `dist/404.html` missing header/footer — 404 page not using BaseLayout
- `npx @lhci/cli autorun` fails — Lighthouse thresholds regressed or 404 URL not configured in lighthouserc.cjs

## Not Proven By This UAT

- OG image renders correctly when shared on social platforms (no /og-default.png asset exists yet)
- LHCI workflow runs correctly on GitHub Actions (only verified locally)
- Page-specific JSON-LD schemas (Event, Article) — only default Church schema tested

## Notes for Tester

- The /og-default.png file doesn't exist yet — OG image meta tag points to it but the asset is deferred to a future milestone
- LHCI local run takes ~90 seconds due to 9 Lighthouse runs with throttling
- 404 SEO score threshold is set to warn (not error) at 0.8 since 404 pages inherently score lower on SEO
