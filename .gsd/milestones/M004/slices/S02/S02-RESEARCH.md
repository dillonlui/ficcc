# SEO & Analytics — Research

**Date:** 2026-03-31

## Summary

The SEO infrastructure is already substantial. `src/components/SEO.astro` handles `<title>`, meta description, canonical URL, hreflang (via `getAlternateUrl`), Open Graph, Twitter Card, and a JSON-LD slot. `@astrojs/sitemap` generates `sitemap-index.xml` referenced from `robots.txt`. What's missing: (1) no page passes custom `jsonLd` — every page gets the generic "Church" schema, (2) the referenced `og-default.png` doesn't exist in `public/`, (3) zero analytics instrumentation, and (4) no Google Search Console verification tag.

The SEO component's `jsonLd` prop is already wired but unused. Each page type needs its own schema.org structured data (Church for homepage, Article for sermons, Event for events). Analytics is greenfield — GA4 via `gtag.js` is the obvious choice for a church site that will use Google Search Console. The work is straightforward wiring of existing patterns.

## Recommendation

Wire structured data through the existing `jsonLd` prop on `SEO.astro` — no component changes needed. Create a static OG default image. Add GA4 via a `<script>` in `BaseLayout.astro` gated behind a `PUBLIC_GA_MEASUREMENT_ID` env var. Add a `google-site-verification` meta tag gated on `PUBLIC_GOOGLE_SITE_VERIFICATION`. Use `@astrojs/sitemap`'s `i18n` option to emit proper hreflang in the sitemap XML.

## Implementation Landscape

### Key Files

- `src/components/SEO.astro` — Already accepts `jsonLd` prop, OG, Twitter, hreflang. **No changes needed** to the component itself.
- `src/layouts/BaseLayout.astro` — Where GA4 script and Google site verification meta tag go. Currently has no analytics. Also needs to forward `jsonLd`, `ogImage`, `ogType` props to SEO (currently only passes `title`, `description`, `lang`).
- `src/pages/index.astro` — Needs Church + WebSite structured data, custom `ogImage`/`ogType` passed through BaseLayout → SEO.
- `src/pages/sermons/[slug].astro` — Needs VideoObject structured data (has `videoId`, `speaker`, `date`, `scripture`).
- `src/pages/events.astro` — Needs Event structured data per event item.
- `src/pages/about/index.astro` — Needs Organization structured data.
- `public/og-default.png` — Missing. Referenced by SEO.astro as default. Needs to be created (1200×630).
- `astro.config.mjs` — Sitemap integration needs `i18n` config for hreflang in sitemap XML.
- `.env.example` — Needs `PUBLIC_GA_MEASUREMENT_ID` and `PUBLIC_GOOGLE_SITE_VERIFICATION` entries.

### Build Order

1. **OG default image + sitemap i18n config** — Fixes the broken `og-default.png` reference and improves sitemap hreflang. Zero risk, unblocks OG preview testing.
2. **BaseLayout prop forwarding + GA4 analytics** — Add `jsonLd`, `ogImage`, `ogType` passthrough in BaseLayout. Add GA4 script gated on env var. Includes custom event helpers for sermon plays, form submissions, language switches.
3. **Structured data per page type** — Pass `jsonLd` from pages through BaseLayout to SEO. Church/WebSite for homepage, VideoObject for sermon detail, Event for events listing. Each page is independent work.
4. **Google Search Console verification meta tag** — Single meta tag in BaseLayout, gated on env var.

### Verification Approach

- **Build succeeds:** `npm run build` exits cleanly (Vercel adapter outputs to `dist/client/`).
- **Structured data validation:** Parse JSON-LD from built HTML: `grep -o '<script type="application/ld+json">.*</script>' dist/client/index.html` and validate schema.org types.
- **OG preview:** Check `<meta property="og:image">` resolves to an actual file in built output.
- **Sitemap hreflang:** Inspect `dist/client/sitemap-*.xml` for `<xhtml:link rel="alternate" hreflang="...">` entries.
- **Analytics script:** Confirm `gtag` script appears in built HTML when `PUBLIC_GA_MEASUREMENT_ID` is set, and does NOT appear when unset.
- **Browser verification:** Preview site, inspect `<head>` for structured data, OG tags, analytics script.

## Constraints

- Static output mode — all analytics must be client-side (no server-side tracking).
- `dist/client/` is the build output path (K009).
- GA4 measurement ID must use `PUBLIC_` prefix for Astro client access via `import.meta.env`.
- OG image must be in `public/` for static serving (not a dynamic route).

## Common Pitfalls

- **BaseLayout doesn't forward `jsonLd`/`ogImage` to SEO** — Currently BaseLayout only passes `title`, `description`, `lang` to SEO. Need to add passthrough for `jsonLd`, `ogImage`, `ogType` props. This is the one structural change needed.
- **GA4 blocking render** — Load gtag.js with `async` attribute and place after critical content. Don't make it render-blocking.
- **Sitemap i18n format** — `@astrojs/sitemap` i18n config uses `defaultLocale` + `locales` map. Must match the actual URL structure (`en` at root, `zh` under `/zh/`).
