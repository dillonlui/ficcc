---
estimated_steps: 25
estimated_files: 2
skills_used: []
---

# T01: Switch to hybrid output mode with Vercel adapter

## Description

This is the riskiest step — changing the Astro build mode from `static` to `hybrid` and adding the Vercel adapter. If anything goes wrong, the entire build breaks. All existing pages must remain statically pre-rendered (hybrid mode defaults to `prerender = true`). The contact form API at `api/contact.ts` sits outside Astro routing and should be unaffected, but must be verified.

## Steps

1. Install `@astrojs/vercel` — run `npm install @astrojs/vercel`
2. Update `astro.config.mjs`:
   - Change `output: 'static'` to `output: 'hybrid'`
   - Add `import vercel from '@astrojs/vercel';` at the top
   - Add `adapter: vercel()` to the config object
   - Keep all existing integrations (sitemap, sanity, react) unchanged
3. Run `npm run build` and verify:
   - Build exits 0
   - Build output lists existing pages (/, /styleguide/, /admin/) as prerendered
   - `dist/` output structure is correct for Vercel deployment
4. Run `npm run lhci` to confirm Lighthouse CI thresholds still pass — no performance regression from the mode switch

## Must-Haves

- [ ] `@astrojs/vercel` added to package.json dependencies
- [ ] `astro.config.mjs` uses `output: 'hybrid'` with `adapter: vercel()`
- [ ] `npm run build` exits 0 with all existing pages prerendered
- [ ] Lighthouse CI passes existing thresholds

## Verification

- `npm run build` exits 0
- Build output contains "prerendered" for existing pages
- `npm run lhci` passes all assertions
- `grep -q 'hybrid' astro.config.mjs`
- `grep -q '@astrojs/vercel' package.json`

## Inputs

- ``astro.config.mjs` — current static config to modify`
- ``package.json` — current dependencies`

## Expected Output

- ``astro.config.mjs` — updated with hybrid output and Vercel adapter`
- ``package.json` — @astrojs/vercel added to dependencies`

## Verification

npm run build && grep -q 'hybrid' astro.config.mjs && grep -q '@astrojs/vercel' package.json
