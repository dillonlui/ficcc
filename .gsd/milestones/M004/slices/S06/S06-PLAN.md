# S06: DNS Cutover & Launch

**Goal:** ficcc.org is launch-ready: em.ficcc.org redirects configured, CSP allows GA4, all tests pass, and DNS cutover procedure documented.
**Demo:** After this: ficcc.org serves the new site. em.ficcc.org and cm.ficcc.org redirect correctly. SSL valid. Analytics receiving production traffic.

## Tasks
- [x] **T01: Added 8 em.ficcc.org redirect rules and GA4 domains to CSP in vercel.json for production launch** — ## Description

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
  - Estimate: 30m
  - Files: vercel.json
  - Verify: node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))" && grep -c 'em.ficcc.org' vercel.json && grep -q 'googletagmanager' vercel.json && grep -q 'google-analytics' vercel.json && npm run build && npm test && npm run test:e2e
- [x] **T02: Created docs/launch-runbook.md with full DNS cutover procedure and fixed Vitest config to exclude Playwright e2e specs** — ## Description

Create docs/launch-runbook.md documenting the exact DNS cutover procedure for ficcc.org, em.ficcc.org, and cm.ficcc.org. This is the final deliverable — a staff/developer reference for executing the launch.

## Steps

1. Create `docs/launch-runbook.md` with the following sections:
2. **Prerequisites** — list what must be true before cutover: Vercel deployment live at ficcc.vercel.app, all tests passing, env vars set (PUBLIC_GA_MEASUREMENT_ID, PUBLIC_GOOGLE_SITE_VERIFICATION), Sanity dataset populated.
3. **Vercel Domain Configuration** — step-by-step for adding ficcc.org, em.ficcc.org, and cm.ficcc.org as custom domains in Vercel dashboard. Note that Vercel auto-provisions SSL via Let's Encrypt.
4. **DNS Records** — exact record types and values:
   - ficcc.org: A record → 76.76.21.21, AAAA → 2606:4700:20::681a:... (or CNAME to cname.vercel-dns.com for subdomain)
   - em.ficcc.org: CNAME → cname.vercel-dns.com
   - cm.ficcc.org: CNAME → cname.vercel-dns.com
5. **Post-Cutover Verification** — checklist:
   - ficcc.org loads new site (check for skip-to-content or main-content landmark)
   - em.ficcc.org/home/about/ redirects to ficcc.org/about (301)
   - cm.ficcc.org/home/about/ redirects to ficcc.org/zh/about (301)
   - SSL valid on all three domains (check padlock)
   - GA4 receiving hits (check Real-Time report in Google Analytics)
   - Search console verified
   - Sitemap accessible at ficcc.org/sitemap-index.xml
6. **Rollback** — how to revert DNS if issues are found.
7. **Timeline** — expected propagation times (DNS: 5min–48hr, SSL: usually immediate with Vercel).

## Must-Haves

- [ ] docs/launch-runbook.md exists and is non-empty
- [ ] Contains sections for prerequisites, domain config, DNS records, post-cutover verification, rollback
- [ ] No TBD or TODO placeholders

## Verification

- `test -f docs/launch-runbook.md` — file exists
- `grep -c '^## ' docs/launch-runbook.md` returns >= 5 (5+ sections)
- `! grep -qi 'TBD\|TODO' docs/launch-runbook.md` — no placeholders

## Inputs

- `vercel.json` — redirect rules to reference in post-cutover verification
- `.env.example` — env vars to list in prerequisites

## Expected Output

- `docs/launch-runbook.md` — complete DNS cutover and launch procedure
  - Estimate: 20m
  - Files: docs/launch-runbook.md
  - Verify: test -f docs/launch-runbook.md && test $(grep -c '^## ' docs/launch-runbook.md) -ge 5 && ! grep -qi 'TBD\|TODO' docs/launch-runbook.md
