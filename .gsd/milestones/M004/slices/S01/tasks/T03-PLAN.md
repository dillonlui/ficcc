---
estimated_steps: 20
estimated_files: 2
skills_used: []
---

# T03: Expand LHCI coverage, add axe-core, raise thresholds, and run full audit

Expand Lighthouse CI to cover all page archetypes, add axe-core for automated a11y testing, raise performance thresholds to 0.90, and run the full audit to validate T01/T02 fixes.

## Steps

1. **Install axe-core CLI:** Run `npm install -D @axe-core/cli`. This provides `npx @axe-core/cli <url>` for automated WCAG 2.1 violation scanning.

2. **Expand LHCI URL list in `lighthouserc.cjs`:** Add representative URLs for each page archetype. The current list only covers `/`, `/styleguide/`, and `/404.html`. Add: `/about/`, `/sermons/`, `/contact/`, `/events/`, `/visit/`, `/give/`, `/zh/`. Keep the list to one per template type — dynamic routes (`/sermons/[slug]`, `/ministries/[slug]`) can't be tested without known slugs, so skip those for now.

3. **Update LHCI assertMatrix thresholds:** Raise the production page performance threshold from 0.75 to 0.90. Add new URL patterns for the added pages. Keep styleguide at warn/0.50 and 404 at current levels. Add a catch-all pattern for any new production pages at ≥0.90 perf, ≥0.95 a11y.

4. **Add npm script for axe-core:** Add `"test:a11y": "npx @axe-core/cli http://localhost:4321/ http://localhost:4321/about/ http://localhost:4321/contact/ http://localhost:4321/zh/ --exit"` to `package.json` scripts.

5. **Run build + LHCI:** Execute `npm run build` then `npm run lhci` and verify all assertions pass at the new thresholds. If any page scores below 0.90 perf, investigate and fix or adjust threshold with rationale (e.g. YouTube embed pages may need 0.85).

6. **Run axe-core:** Start preview server, run `npx @axe-core/cli` against representative pages, verify zero violations.

## Must-Haves

- [ ] `@axe-core/cli` installed as dev dependency
- [ ] LHCI URL list covers all page archetypes (home, about, sermons, contact, events, visit, give, zh home)
- [ ] Performance threshold raised to ≥0.90 for production pages
- [ ] `test:a11y` npm script added
- [ ] `npm run lhci` passes at new thresholds
- [ ] axe-core reports zero violations on representative pages

## Verification

- `npm run build` exits 0
- `npm run lhci` passes (all assertions green)
- `grep -q 'axe-core' package.json` confirms dependency installed
- `grep -q 'test:a11y' package.json` confirms script added

## Inputs

- `lighthouserc.cjs`
- `package.json`
- `src/components/Hero.astro`
- `src/layouts/BaseLayout.astro`
- `src/lib/sanity.ts`

## Expected Output

- `lighthouserc.cjs`
- `package.json`

## Verification

npm run build && npm run lhci
