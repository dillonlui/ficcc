---
estimated_steps: 31
estimated_files: 3
skills_used: []
---

# T02: Create 404 page, LHCI GitHub Actions workflow, and run final verification

## Description

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

## Inputs

- `src/layouts/BaseLayout.astro`
- `src/components/SEO.astro`
- `lighthouserc.cjs`

## Expected Output

- `src/pages/404.astro`
- `lighthouserc.cjs`
- `.github/workflows/lighthouse.yml`

## Verification

npm run build && test -f dist/404.html && grep -q 'og:title' dist/404.html && test -f .github/workflows/lighthouse.yml && npx @lhci/cli autorun
