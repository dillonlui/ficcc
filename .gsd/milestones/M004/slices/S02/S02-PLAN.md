# S02: SEO & Analytics

**Goal:** Structured data validated on all page types. OG previews working. GA4 analytics with custom events. Google Search Console verification tag. Sitemap with hreflang.
**Demo:** After this: Structured data validated. OG previews working. Analytics dashboard with custom events. Google Search Console configured.

## Tasks
- [x] **T01: Wired SEO prop forwarding through BaseLayout, added conditional GA4 analytics with custom event helper, site verification meta, sitemap hreflang, and default OG image** — Wire the foundational SEO and analytics infrastructure that all pages will use.

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
  - Estimate: 45m
  - Files: src/layouts/BaseLayout.astro, astro.config.mjs, public/og-default.png, .env.example
  - Verify: npm run build && test -f public/og-default.png && grep -q 'og:image' dist/client/index.html && grep -q 'xhtml:link' dist/client/sitemap-0.xml
- [x] **T02: Created JSON-LD structured data helpers and wired Church+WebSite (home), VideoObject (sermon), Event ItemList (events), and Organization (about) through BaseLayout, with 7 passing Vitest tests** — Pass page-specific JSON-LD structured data from each page through BaseLayout to SEO, and write a verification test.

## Steps

1. **Create structured data helpers (`src/lib/structured-data.ts`)** — Export pure functions that build JSON-LD objects for each page type:
   - `buildChurchJsonLd()` → Church schema with name, description, url, address (429 Mitchell Street, Ithaca, NY 14850)
   - `buildWebSiteJsonLd(siteUrl: string)` → WebSite schema with name and url
   - `buildVideoObjectJsonLd(sermon: { title, date?, videoId, scripture?, speaker? })` → VideoObject with name, uploadDate, thumbnailUrl (YouTube), embedUrl
   - `buildEventJsonLd(event: { title, date?, location?, description? })` → Event with name, startDate, location as Place
   - `buildOrganizationJsonLd()` → Organization with name, url, address, foundingDate (1968)
   All functions return `Record<string, unknown>` with `@context: 'https://schema.org'`.

2. **Homepage (`src/pages/index.astro`)** — Import `buildChurchJsonLd` and `buildWebSiteJsonLd`. Pass an array (wrapped in `@graph`) as `jsonLd` to BaseLayout. Set `ogType='website'`.

3. **Sermon detail (`src/pages/sermons/[slug].astro`)** — Import `buildVideoObjectJsonLd`. Pass VideoObject jsonLd when `sermon.videoId` exists, otherwise pass default. Set `ogType='article'`. Pass a custom description (speaker + scripture) to BaseLayout.

4. **Events page (`src/pages/events.astro`)** — Import `buildEventJsonLd`. Build an ItemList of events. Pass as jsonLd to BaseLayout.

5. **About page (`src/pages/about/index.astro`)** — Import `buildOrganizationJsonLd`. Pass Organization jsonLd to BaseLayout.

6. **Write verification test (`src/lib/structured-data.test.ts`)** — Vitest tests validating:
   - `buildChurchJsonLd()` returns object with `@type: 'Church'` and required fields
   - `buildVideoObjectJsonLd()` returns `@type: 'VideoObject'` with embedUrl when videoId present
   - `buildEventJsonLd()` returns `@type: 'Event'` with startDate
   - `buildOrganizationJsonLd()` returns `@type: 'Organization'` with foundingDate

7. **Build and verify** — Run `npm test`. Run `npm run build`. Extract JSON-LD from built homepage HTML and confirm `@type` includes Church.

## Must-Haves

- [ ] Homepage emits Church + WebSite JSON-LD
- [ ] Sermon detail emits VideoObject JSON-LD (when videoId present)
- [ ] Events page emits Event JSON-LD per event
- [ ] About page emits Organization JSON-LD
- [ ] `src/lib/structured-data.test.ts` passes with `npm test`
- [ ] `npm run build` succeeds with all structured data in place
  - Estimate: 45m
  - Files: src/lib/structured-data.ts, src/lib/structured-data.test.ts, src/pages/index.astro, src/pages/sermons/[slug].astro, src/pages/events.astro, src/pages/about/index.astro
  - Verify: npm test && npm run build && node -e "const fs=require('fs'); const html=fs.readFileSync('dist/client/index.html','utf8'); const m=html.match(/application\/ld\+json/g); if(!m||m.length<1) process.exit(1); console.log('JSON-LD found:', m.length)"
