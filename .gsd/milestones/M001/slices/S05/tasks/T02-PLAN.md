---
estimated_steps: 9
estimated_files: 3
skills_used: []
---

# T02: Add robots.txt, verify sitemap output, harden security headers, and run Lighthouse CI

Complete the SEO and security infrastructure:

1. Create public/robots.txt — Allow all crawlers, include absolute Sitemap URL (https://ficcc.org/sitemap-index.xml). Keep it simple.

2. Verify sitemap — Run npm run build and confirm dist/sitemap-index.xml exists with valid XML content. The @astrojs/sitemap integration is already configured in astro.config.mjs with site: 'https://ficcc.org'.

3. Security header hardening — Add Strict-Transport-Security header to vercel.json (max-age=63072000; includeSubDomains; preload). Review CSP for completeness — the existing CSP already covers the new /api/contact endpoint via connect-src 'self'. Verify no headers are missing per OWASP recommendations.

4. Lighthouse CI — Run npm run build && npm run lhci to confirm all existing thresholds pass. The form page is not a separate route (ContactForm is a component), so no new LHCI URL needed. If any thresholds regress, investigate and fix.

Key constraints:
- robots.txt Sitemap URL must be absolute (https://ficcc.org/sitemap-index.xml)
- HSTS max-age should be at least 1 year (31536000), using 2 years (63072000) per best practice
- Do NOT change Lighthouse performance thresholds — K002 documents why they're at 0.75/0.50

## Inputs

- ``vercel.json` — existing security headers, needs HSTS addition`
- ``astro.config.mjs` — sitemap integration already configured`
- ``lighthouserc.cjs` — existing LHCI config with per-URL thresholds`

## Expected Output

- ``public/robots.txt` — robots.txt with Sitemap directive`
- ``vercel.json` — updated with Strict-Transport-Security header`
- ``dist/sitemap-index.xml` — verified sitemap output from build`

## Verification

test -f public/robots.txt && grep -q 'Sitemap' public/robots.txt && npm run build && test -f dist/sitemap-index.xml && grep -q 'Strict-Transport-Security' vercel.json
