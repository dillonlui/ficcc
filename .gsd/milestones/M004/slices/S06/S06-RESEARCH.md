# S06: DNS Cutover & Launch — Research

**Date:** 2026-03-31

## Summary

S06 is primarily configuration and verification work — no new application code is needed. The site is fully built and deployed to Vercel at ficcc.vercel.app. The slice needs: (1) em.ficcc.org redirect rules added to vercel.json (cm.ficcc.org rules already exist from M003), (2) CSP header updated to allow GA4 domains (currently missing `googletagmanager.com` and `google-analytics.com`), (3) a pre-launch verification checklist covering SSL, redirects, analytics, and SEO, and (4) documentation of the DNS cutover procedure for ficcc.org, em.ficcc.org, and cm.ficcc.org.

The hard infrastructure is done: Vercel adapter, security headers (HSTS, CSP, X-Frame-Options, etc.), CM redirects, GA4 conditional script, sitemap with hreflang, structured data, Playwright E2E tests, LHCI pipeline. The gaps are small but launch-blocking.

## Recommendation

Three tasks:
1. **Fix vercel.json** — add em.ficcc.org redirect rules (mirroring cm.ficcc.org pattern but pointing to EN routes), update CSP to include GA4 domains in script-src and connect-src.
2. **Pre-launch verification** — build the site, run E2E tests, LHCI, verify redirects in vercel.json syntax, confirm all env vars documented.
3. **Launch runbook** — create a docs/launch-runbook.md documenting DNS configuration steps, domain verification in Vercel, SSL provisioning, post-cutover verification checks.

## Implementation Landscape

### Key Files

- `vercel.json` — Needs em.ficcc.org redirect rules added (currently only has cm.ficcc.org). CSP `script-src` needs `https://www.googletagmanager.com` and CSP `connect-src` needs `https://*.google-analytics.com https://*.googletagmanager.com` for GA4 to function in production.
- `astro.config.mjs` — Already has `site: 'https://ficcc.org'` which is correct for production. No changes needed.
- `.env.example` — Already documents all required env vars. No changes needed.
- `src/layouts/BaseLayout.astro` — GA4 script already gated on `PUBLIC_GA_MEASUREMENT_ID`. No changes needed.
- `package.json` — All scripts (build, test, test:e2e, lhci, test:a11y) already exist.

### em.ficcc.org Redirect Mapping

The em.ficcc.org site was the English ministry site. Redirects should mirror the cm.ficcc.org pattern but point to EN (root) routes:

| Old em.ficcc.org path | New ficcc.org path |
|---|---|
| `/` | `https://ficcc.org/` |
| `/home/about/` | `https://ficcc.org/about` |
| `/home/faith/` | `https://ficcc.org/about/beliefs` |
| `/home/sermons/` | `https://ficcc.org/sermons` |
| `/home/worship/` | `https://ficcc.org/visit` |
| `/home/fellowships/` | `https://ficcc.org/ministries` |
| `/home/contact/` | `https://ficcc.org/contact` |
| `/:path*` (catch-all) | `https://ficcc.org/` |

All permanent (301) redirects using `has: [{ type: "host", value: "em.ficcc.org" }]` pattern.

### CSP Fix

Current CSP `script-src` is:
```
script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.youtube-nocookie.com
```

Needs:
```
script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.youtube-nocookie.com https://www.googletagmanager.com
```

Current CSP `connect-src` is:
```
connect-src 'self' https://*.sanity.io https://*.vercel-analytics.com
```

Needs:
```
connect-src 'self' https://*.sanity.io https://*.vercel-analytics.com https://*.google-analytics.com https://*.googletagmanager.com
```

### Build Order

1. **vercel.json updates first** — em.ficcc.org redirects + CSP fix. This is the riskiest part (syntax errors break the deploy). Verify with `npx vercel build` or JSON linting.
2. **Pre-launch verification** — run full test suite (build, vitest, playwright, LHCI) to confirm nothing regressed and all launch criteria are met.
3. **Launch runbook last** — documentation that captures the exact DNS steps. This is pure docs, no risk.

### Verification Approach

- `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))"` — vercel.json is valid JSON
- `npm run build` — site builds successfully
- `npm test` — unit tests pass (27 tests including structured data + navigation)
- `npm run test:e2e` — Playwright E2E tests pass (100 tests)
- `grep "em.ficcc.org" vercel.json` — em.ficcc.org redirects present
- `grep "googletagmanager" vercel.json` — GA4 domains in CSP
- `grep "google-analytics" vercel.json` — GA4 connect-src domain present
- `test -f docs/launch-runbook.md` — launch documentation exists

## Constraints

- Vercel free tier limits: 100 redirects max per vercel.json. Current count is ~10 (cm.ficcc.org). Adding ~8 more for em.ficcc.org stays well under limit.
- DNS changes are manual steps performed in the domain registrar — the agent cannot execute DNS cutover, only document it.
- Vercel domain verification and SSL provisioning happen automatically once DNS is pointed, but require manual domain addition in Vercel dashboard first.
- All em.ficcc.org redirect paths are inferred from cm.ficcc.org patterns (same old Squarespace site structure for both ministries). The agent should confirm these with the user or note them as best-effort.

## Common Pitfalls

- **CSP blocks GA4 silently** — Without `googletagmanager.com` in script-src, the GA4 script loads but gtag calls fail silently. Must add to both script-src and connect-src.
- **Redirect ordering in vercel.json** — Vercel processes redirects top-to-bottom, first match wins. The catch-all `/:path*` rule must come LAST for each domain, otherwise specific path redirects are unreachable.
- **HSTS preload implications** — The HSTS header includes `preload` directive. Once DNS is pointed and HSTS kicks in, there's no going back to HTTP. This is correct for launch but worth noting.
