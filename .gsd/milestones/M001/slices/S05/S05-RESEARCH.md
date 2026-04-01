# S05: Forms, SEO & Security Infrastructure — Research

**Date:** 2026-03-31

## Summary

S05 wires up the three infrastructure concerns that S01 left as placeholders: contact form submission, SEO static files, and security header hardening. The work is straightforward — all patterns are well-established and the codebase already has the scaffolding in place.

The contact form (`src/components/ContactForm.astro`) exists with full styling but no submission handler. The `.env.example` already specifies Resend + Cloudflare Turnstile as the intended stack. Since the site is `output: 'static'`, form submission needs a Vercel serverless function (`api/contact.ts`). The CSP in `vercel.json` already allows `challenges.cloudflare.com` for Turnstile and `connect-src 'self'` for API calls. Sitemap is already integrated via `@astrojs/sitemap` in `astro.config.mjs` — it just needs to be verified in the build output. `robots.txt` doesn't exist yet and needs to be added to `public/`.

The Lighthouse CI threshold situation (G6 asks for >= 90 perf, current config uses 0.75/0.50 per K002) is a known tension from S02's CJK font work. S05 should ensure the pipeline stays green and the form page doesn't regress scores, but can't resolve the underlying threshold gap without font architecture changes.

## Recommendation

Three clean tasks: (1) Vercel serverless function for form submission with Turnstile verification + Resend email delivery, (2) SEO files (robots.txt, verify sitemap.xml output, add structured data), (3) security header audit + any CSP adjustments needed for the new API endpoint. Build the API function first since it's the only piece with real integration risk (Turnstile + Resend).

## Implementation Landscape

### Key Files

- `src/components/ContactForm.astro` — Existing styled form, needs `action` attribute pointing to API endpoint, Turnstile widget integration, and client-side JS for submission/feedback
- `api/contact.ts` — New Vercel serverless function. Validates fields, verifies Turnstile token via Cloudflare API, sends email via Resend SDK
- `vercel.json` — Security headers. CSP may need `connect-src` update if API path differs from `'self'`. Review for HSTS addition
- `public/robots.txt` — New static file. Allow all, reference sitemap URL
- `lighthouserc.cjs` — May need URL additions if a /contact page is created
- `.env.example` — Already has RESEND_API_KEY, PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY
- `astro.config.mjs` — Sitemap already configured, verify it generates correctly
- `package.json` — Needs `resend` package added

### Build Order

1. **API function + form wiring** (highest risk) — Create `api/contact.ts` serverless function with Turnstile verification and Resend email. Update ContactForm with Turnstile widget and client-side submission JS. This is the only piece with external service integration risk.
2. **SEO files** (low risk) — Add `public/robots.txt`, verify sitemap.xml in build output, consider basic JSON-LD structured data on index page.
3. **Security hardening** (low risk) — Audit CSP for completeness with new API endpoint, add HSTS if missing, verify all headers with curl against deployed site.

### Verification Approach

- **Form submission:** Build locally, test API endpoint with curl (mock Turnstile in dev). After deploy, submit form end-to-end and verify email arrives via Resend dashboard.
- **SEO:** `npm run build` then check `dist/sitemap-index.xml` and `dist/robots.txt` exist with correct content.
- **Security headers:** `curl -I https://ficcc.vercel.app` to verify all headers present. Run Lighthouse CI to confirm no regression.
- **Lighthouse CI:** `npm run lhci` passes all existing thresholds.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Email delivery | Resend SDK (`resend` npm package) | Already chosen per .env.example. Simple API, generous free tier, good deliverability |
| Spam protection | Cloudflare Turnstile | Already in CSP. Free, privacy-friendly, no user friction (invisible mode available) |
| Sitemap generation | `@astrojs/sitemap` | Already installed and configured in astro.config.mjs |
| Serverless functions | Vercel Functions (api/ directory) | Zero config with Vercel hosting. TypeScript support built-in |

## Constraints

- **Static site output** — No Astro API routes. Must use Vercel serverless functions (`api/` directory at project root) for form handling.
- **CSP already locked down** — Any new external domains (e.g., Resend's API is called server-side so no CSP change needed, but Turnstile's JS is already allowed via `script-src https://challenges.cloudflare.com`).
- **Lighthouse perf threshold** — Currently 0.75 (not 0.90 per G6) due to CJK font weight (K002). S05 maintains existing thresholds; closing the gap requires font architecture work outside this slice's scope.

## Common Pitfalls

- **Turnstile token verification must be server-side** — The token from the widget must be verified via Cloudflare's `siteverify` API from the serverless function, never trusted client-side. The secret key stays in env vars, not in client code.
- **Vercel serverless functions need specific export format** — Must export a default function with `(req: Request) => Response` signature for Edge or `(req, res)` for Node.js runtime. Use the Edge runtime for faster cold starts.
- **CSP connect-src for form submission** — The form submits to `/api/contact` which is same-origin, so `'self'` in `connect-src` already covers it. No CSP change needed.
- **robots.txt sitemap URL must be absolute** — `Sitemap: https://ficcc.org/sitemap-index.xml` not a relative path.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | `astrolicious/agent-skills@astro` | available (2.9K installs) |
| Resend | `resend/resend-skills@resend` | available (4.5K installs) |
| React Email | `resend/react-email@react-email` | available (3.7K installs) |
