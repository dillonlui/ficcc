# S05: Forms, SEO & Security Infrastructure

**Goal:** Wire up contact form submission (Turnstile + Resend), add SEO static files, and harden security headers so the infrastructure layer is complete for page-building milestones.
**Demo:** After this: Form submission delivers email. sitemap.xml, robots.txt, security headers all verified.

## Tasks
- [x] **T01: Build Edge API endpoint at api/contact.ts with Turnstile verification and Resend email delivery, update ContactForm.astro with widget, fetch submission, and loading/success/error states** — Create the Vercel serverless function at api/contact.ts that handles form submissions. Install the resend package. The function must: (1) parse and validate form fields (name, email, message — all required, email format check), (2) verify the Turnstile token via Cloudflare's siteverify API, (3) send email via Resend SDK to a configured recipient, (4) return structured JSON responses with appropriate status codes. Then update ContactForm.astro to include the Cloudflare Turnstile widget (using PUBLIC_TURNSTILE_SITE_KEY from env), add client-side JavaScript for form submission via fetch to /api/contact, and implement loading/success/error UI states. The form JS should do client-side validation before submission, show a spinner during submit, display success confirmation, and show field-level or general error messages on failure.

Key constraints:
- Use Vercel Edge Runtime for fast cold starts (export const config = { runtime: 'edge' })
- Turnstile verification is server-side only — secret key never reaches client
- CSP in vercel.json already allows challenges.cloudflare.com for script-src and frame-src, and connect-src 'self' covers /api/contact
- Rate limiting is not in scope — Turnstile provides sufficient spam protection
- The Turnstile widget script must be loaded from https://challenges.cloudflare.com/turnstile/v0/api.js
- For dev/test without real keys, the API should return clear error messages about missing env vars rather than crashing
  - Estimate: 1h30m
  - Files: api/contact.ts, src/components/ContactForm.astro, package.json, .env.example
  - Verify: npm run build && test -f api/contact.ts && grep -q 'turnstile' src/components/ContactForm.astro && grep -q 'resend' package.json
- [x] **T02: Created robots.txt with absolute Sitemap URL, added HSTS header to vercel.json, verified sitemap-index.xml generation, and confirmed all Lighthouse CI thresholds pass** — Complete the SEO and security infrastructure:

1. Create public/robots.txt — Allow all crawlers, include absolute Sitemap URL (https://ficcc.org/sitemap-index.xml). Keep it simple.

2. Verify sitemap — Run npm run build and confirm dist/sitemap-index.xml exists with valid XML content. The @astrojs/sitemap integration is already configured in astro.config.mjs with site: 'https://ficcc.org'.

3. Security header hardening — Add Strict-Transport-Security header to vercel.json (max-age=63072000; includeSubDomains; preload). Review CSP for completeness — the existing CSP already covers the new /api/contact endpoint via connect-src 'self'. Verify no headers are missing per OWASP recommendations.

4. Lighthouse CI — Run npm run build && npm run lhci to confirm all existing thresholds pass. The form page is not a separate route (ContactForm is a component), so no new LHCI URL needed. If any thresholds regress, investigate and fix.

Key constraints:
- robots.txt Sitemap URL must be absolute (https://ficcc.org/sitemap-index.xml)
- HSTS max-age should be at least 1 year (31536000), using 2 years (63072000) per best practice
- Do NOT change Lighthouse performance thresholds — K002 documents why they're at 0.75/0.50
  - Estimate: 30m
  - Files: public/robots.txt, vercel.json, lighthouserc.cjs
  - Verify: test -f public/robots.txt && grep -q 'Sitemap' public/robots.txt && npm run build && test -f dist/sitemap-index.xml && grep -q 'Strict-Transport-Security' vercel.json
