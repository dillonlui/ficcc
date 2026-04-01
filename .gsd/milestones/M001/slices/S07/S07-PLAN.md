# S07: Remediation: SEO Components, 404 Page & LHCI CI Pipeline

**Goal:** Add SEO meta/OG tags and JSON-LD structured data to all pages via a reusable SEO component, create a custom 404 page with site chrome, and add a GitHub Actions LHCI workflow for PR-level Lighthouse CI.
**Demo:** After this: 404 page renders with site chrome. Meta/OG tags visible in page source. JSON-LD structured data in page head. GitHub Actions runs LHCI on PRs.

## Tasks
- [x] **T01: Created SEO.astro with full meta/OG/Twitter/JSON-LD markup and wired it into BaseLayout replacing raw title/description tags** — ## Description

Build `src/components/SEO.astro` that renders all meta/OG tags, Twitter card tags, and JSON-LD structured data for the church. Wire it into `BaseLayout.astro` replacing the hand-written `<title>` and `<meta name="description">` tags. Every page using BaseLayout will automatically get full SEO markup.

## Steps

1. Create `src/components/SEO.astro` with typed Props interface:
   - `title` (required string)
   - `description` (optional string, default to site description)
   - `canonicalUrl` (optional string — derived from `Astro.url` if not provided)
   - `ogImage` (optional string, default `/og-default.png`)
   - `ogType` (optional string, default `website`)
   - `lang` (optional string, default `en`)
   - `jsonLd` (optional object — override for custom structured data)
2. In SEO.astro, render:
   - `<title>{title}</title>`
   - `<meta name="description">` 
   - `<link rel="canonical">` using `new URL(Astro.url.pathname, Astro.site).href`
   - OG tags: `og:title`, `og:description`, `og:url` (same as canonical), `og:image` (absolute URL via `new URL(ogImage, Astro.site).href`), `og:type`, `og:locale` (map `en`→`en_US`, `zh`→`zh_CN`)
   - Twitter card: `twitter:card` = `summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
   - JSON-LD: Default to Church schema (`@context: https://schema.org`, `@type: Church`, name, description, url). Use `JSON.stringify()` for the JSON content. Use Astro's `set:html` for the script tag content to avoid HTML escaping.
3. Update `BaseLayout.astro`:
   - Import SEO component
   - Remove the existing `<title>` and `<meta name="description">` tags
   - Add `<SEO title={title} description={description} lang={lang} />` in the `<head>`
   - Pass `Astro.url` and `Astro.site` implicitly (SEO.astro uses its own Astro context)
4. Run `npm run build` and verify the built index.html contains OG tags, canonical URL, and JSON-LD block.

## Must-Haves

- [ ] SEO.astro renders og:title, og:description, og:url, og:image, og:type meta tags
- [ ] SEO.astro renders twitter:card, twitter:title, twitter:description, twitter:image meta tags
- [ ] SEO.astro renders JSON-LD script with @type Church and JSON.stringify (not hand-written JSON)
- [ ] Canonical URL derived from Astro.site + Astro.url.pathname (not hardcoded)
- [ ] OG image URL is absolute (derived from Astro.site)
- [ ] BaseLayout no longer has raw <title> or <meta name="description"> — SEO component handles both
- [ ] `npm run build` succeeds

## Verification

- `npm run build` exits 0
- `grep -q 'og:title' dist/index.html` succeeds
- `grep -q 'og:description' dist/index.html` succeeds  
- `grep -q 'og:url' dist/index.html` succeeds
- `grep -q 'og:image' dist/index.html` succeeds
- `grep -q 'application/ld+json' dist/index.html` succeeds
- `grep -q 'Church' dist/index.html` succeeds (JSON-LD @type)
- `grep -q 'twitter:card' dist/index.html` succeeds
- `grep -q 'canonical' dist/index.html` succeeds
  - Estimate: 30m
  - Files: src/components/SEO.astro, src/layouts/BaseLayout.astro
  - Verify: npm run build && grep -q 'og:title' dist/index.html && grep -q 'application/ld+json' dist/index.html && grep -q 'twitter:card' dist/index.html && grep -q 'canonical' dist/index.html
- [ ] **T02: Create 404 page, LHCI GitHub Actions workflow, and run final verification** — ## Description

Create the custom 404 page using BaseLayout (gets site chrome + SEO automatically from T01), add the 404 URL to lighthouserc.cjs, create the GitHub Actions LHCI workflow YAML, and run full LHCI verification.

## Steps

1. Create `src/pages/404.astro`:
   - Import and use `BaseLayout` with title="Page Not Found" and appropriate description
   - Render a centered message: heading ("404 — Page Not Found"), friendly paragraph, and a link back to `/`
   - Style with scoped CSS using design tokens from global.css (--color-ink, --color-accent, --space-*, --text-*)
   - Astro automatically serves this as 404.html for unmatched routes
2. Add `http://localhost:4321/404.html` to the `url` array in `lighthouserc.cjs` so LHCI tests the 404 page. Add a matching assertMatrix entry for 404 with same thresholds as the homepage pattern.
3. Create `.github/workflows/lighthouse.yml`:
   - Trigger: `pull_request` on main branch
   - Job: runs on `ubuntu-latest`
   - Steps: checkout, setup Node.js (use node version from package.json or 20), `npm ci`, `npm run build`, `npx @lhci/cli autorun`
   - The existing `lighthouserc.cjs` config handles `startServerCommand` and assertions
4. Run `npm run build` and verify 404.html exists in dist/ with Header/Footer chrome.
5. Run `npx @lhci/cli autorun` and verify all thresholds pass including the new 404 page.

## Must-Haves

- [ ] `src/pages/404.astro` exists using BaseLayout with site chrome
- [ ] 404 page has heading, message, and link home
- [ ] `lighthouserc.cjs` includes 404 page URL and assertMatrix entry
- [ ] `.github/workflows/lighthouse.yml` exists with valid PR-triggered workflow
- [ ] `npm run build` produces dist/404.html
- [ ] `npx @lhci/cli autorun` passes all thresholds

## Verification

- `npm run build` exits 0
- `test -f dist/404.html` succeeds
- `grep -q 'Header' dist/404.html || grep -q 'header' dist/404.html` (site chrome present)
- `grep -q 'Footer' dist/404.html || grep -q 'footer' dist/404.html` (site chrome present)
- `grep -q 'og:title' dist/404.html` (SEO tags present from BaseLayout)
- `test -f .github/workflows/lighthouse.yml` succeeds
- `npx @lhci/cli autorun` exits 0
  - Estimate: 30m
  - Files: src/pages/404.astro, lighthouserc.cjs, .github/workflows/lighthouse.yml
  - Verify: npm run build && test -f dist/404.html && grep -q 'og:title' dist/404.html && test -f .github/workflows/lighthouse.yml && npx @lhci/cli autorun
