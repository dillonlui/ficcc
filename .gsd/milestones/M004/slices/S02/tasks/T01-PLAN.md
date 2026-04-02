---
estimated_steps: 17
estimated_files: 4
skills_used: []
---

# T01: BaseLayout prop forwarding, OG image, sitemap i18n, GA4, and site verification

Wire the foundational SEO and analytics infrastructure that all pages will use.

## Steps

1. **Create `public/og-default.png`** — Generate a 1200×630 OG default image. Use a simple branded placeholder (solid background with church name text). The file must exist so the SEO component's default `ogImage='/og-default.png'` resolves.

2. **Extend BaseLayout props** — Add `jsonLd?: Record<string, unknown>`, `ogImage?: string`, `ogType?: string` to BaseLayout's `Props` interface. Pass them through to the `<SEO>` component. Keep existing defaults in SEO.astro unchanged.

3. **Add GA4 analytics script** — In BaseLayout, before the closing `</body>` tag (after existing scripts), add the gtag.js snippet gated on `import.meta.env.PUBLIC_GA_MEASUREMENT_ID`. Use `async` attribute on the script tag to avoid render-blocking. Include a helper that sends custom events (sermon_play, language_switch, form_submit) via `gtag('event', ...)`. The analytics script should only render when the env var is set.

4. **Add Google site verification meta tag** — In BaseLayout `<head>`, add `<meta name="google-site-verification" content={...}>` gated on `import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION`. Only render when set.

5. **Configure sitemap i18n** — In `astro.config.mjs`, add the `i18n` option to the `sitemap()` integration call: `{ defaultLocale: 'en', locales: { en: 'en', zh: 'zh' } }`. This makes the generated sitemap XML include `<xhtml:link rel="alternate" hreflang="...">` entries.

6. **Update `.env.example`** — Add `PUBLIC_GA_MEASUREMENT_ID=` and `PUBLIC_GOOGLE_SITE_VERIFICATION=` entries with comments.

7. **Verify** — Run `npm run build`. Confirm OG image file exists. Grep built HTML for `og:image`. Check sitemap XML for hreflang links. Build with and without analytics env var to confirm conditional rendering.

## Must-Haves

- [ ] `public/og-default.png` exists at 1200×630
- [ ] BaseLayout forwards jsonLd, ogImage, ogType to SEO component
- [ ] GA4 script renders only when PUBLIC_GA_MEASUREMENT_ID is set
- [ ] Google site verification meta renders only when PUBLIC_GOOGLE_SITE_VERIFICATION is set
- [ ] Sitemap XML includes hreflang entries
- [ ] `.env.example` updated with new env vars
- [ ] `npm run build` succeeds

## Inputs

- ``src/layouts/BaseLayout.astro` — current layout, needs prop forwarding added`
- ``src/components/SEO.astro` — already accepts jsonLd/ogImage/ogType props, no changes needed`
- ``astro.config.mjs` — needs sitemap i18n config`
- ``.env.example` — needs new env var entries`

## Expected Output

- ``src/layouts/BaseLayout.astro` — extended with jsonLd/ogImage/ogType forwarding, GA4 script, site verification meta`
- ``astro.config.mjs` — sitemap integration updated with i18n config`
- ``public/og-default.png` — 1200×630 OG default image`
- ``.env.example` — updated with PUBLIC_GA_MEASUREMENT_ID and PUBLIC_GOOGLE_SITE_VERIFICATION`

## Verification

npm run build && test -f public/og-default.png && grep -q 'og:image' dist/client/index.html && grep -q 'xhtml:link' dist/client/sitemap-0.xml
