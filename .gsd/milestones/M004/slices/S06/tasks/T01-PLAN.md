---
estimated_steps: 39
estimated_files: 1
skills_used: []
---

# T01: Add em.ficcc.org redirects and fix CSP for GA4

## Description

Update vercel.json with two changes needed for launch: (1) em.ficcc.org redirect rules mirroring the existing cm.ficcc.org pattern but pointing to EN routes, and (2) CSP header updated to allow GA4 domains so analytics works in production.

## Steps

1. Read `vercel.json` and understand the existing cm.ficcc.org redirect structure.
2. Add 8 em.ficcc.org redirect rules BEFORE the cm.ficcc.org catch-all. Each uses `has: [{ type: 'host', value: 'em.ficcc.org' }]` with `permanent: true`. Specific path rules:
   - `/` → `https://ficcc.org/`
   - `/home/about/` → `https://ficcc.org/about`
   - `/home/faith/` → `https://ficcc.org/about/beliefs`
   - `/home/sermons/` → `https://ficcc.org/sermons`
   - `/home/worship/` → `https://ficcc.org/visit`
   - `/home/fellowships/` → `https://ficcc.org/ministries`
   - `/home/contact/` → `https://ficcc.org/contact`
   - `/:path*` catch-all → `https://ficcc.org/` (MUST be last among em.ficcc.org rules)
3. Update the CSP header `script-src` to add `https://www.googletagmanager.com` after the existing youtube-nocookie.com entry.
4. Update the CSP header `connect-src` to add `https://*.google-analytics.com https://*.googletagmanager.com` after the existing vercel-analytics.com entry.
5. Validate JSON syntax: `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))"`
6. Run `npm run build` to confirm the site builds.
7. Run `npm test` to confirm unit tests pass.
8. Run `npm run test:e2e` to confirm Playwright tests pass.

## Must-Haves

- [ ] 8 em.ficcc.org redirect rules in vercel.json with catch-all last
- [ ] CSP script-src includes `https://www.googletagmanager.com`
- [ ] CSP connect-src includes `https://*.google-analytics.com` and `https://*.googletagmanager.com`
- [ ] vercel.json is valid JSON
- [ ] `npm run build` exits 0
- [ ] `npm test` passes
- [ ] `npm run test:e2e` passes

## Verification

- `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))"` — valid JSON
- `grep -c 'em.ficcc.org' vercel.json` returns 8 (one per redirect rule)
- `grep 'googletagmanager' vercel.json` — GA4 domain in CSP
- `grep 'google-analytics' vercel.json` — GA4 connect-src domain
- `npm run build` exits 0
- `npm test` passes
- `npm run test:e2e` passes

## Inputs

- `vercel.json` — existing security headers and cm.ficcc.org redirect rules

## Expected Output

- `vercel.json` — updated with em.ficcc.org redirects and GA4 CSP domains

## Inputs

- ``vercel.json` — existing security headers and cm.ficcc.org redirect rules`

## Expected Output

- ``vercel.json` — updated with em.ficcc.org redirects and GA4 CSP domains`

## Verification

node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))" && grep -c 'em.ficcc.org' vercel.json && grep -q 'googletagmanager' vercel.json && grep -q 'google-analytics' vercel.json && npm run build && npm test && npm run test:e2e
