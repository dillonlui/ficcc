# S04 (Language Toggle & Bilingual Wiring) — Research

**Date:** 2026-03-31

## Summary

S01 built the foundation: Header/Footer accept a `lang` prop, `src/lib/navigation.ts` provides language-aware nav links, and the toggle link exists in the Header — but it currently only links to `/` or `/zh` (the homepage). The slice's core job is making the toggle context-aware so clicking it from `/about` goes to `/zh/about` and vice versa.

The site is statically built (Astro 5, `output: 'static'`), so the toggle is a plain anchor link (D017). There's no server to set cookies — any language preference persistence would require client-side JS. The Astro config already has `i18n` configured with `defaultLocale: 'en'` and `locales: ['en', 'zh']`, and Astro provides `getRelativeLocaleUrl` from `astro:i18n`, but this doesn't help with the asymmetric route mapping (`/visit` ↔ `/zh/sundays`).

The second concern is `hreflang` alternate tags — essential for bilingual SEO. The SEO component currently emits `og:locale` but no `<link rel="alternate" hreflang="...">` tags. These need to be added to every page that has a counterpart in the other language.

## Recommendation

Build a `getAlternateUrl(currentPath, currentLang)` utility in `src/lib/navigation.ts` that maps any page path to its counterpart language URL. This handles the 3 cases: (1) standard prefix swap (`/about` ↔ `/zh/about`), (2) asymmetric routes (`/visit` ↔ `/zh/sundays`), (3) pages with no counterpart (fallback to the other language's homepage). Then:

1. Update `Header.astro` to use `Astro.url.pathname` + `getAlternateUrl()` for the toggle href instead of the hardcoded `/` or `/zh`.
2. Update `SEO.astro` to accept an `alternateUrl` prop and emit `<link rel="alternate" hreflang="en" ...>` and `<link rel="alternate" hreflang="zh" ...>` tags.
3. Update `BaseLayout.astro` to compute and pass the alternate URL to both Header and SEO.
4. Add a small client-side script for cookie-based language preference (set on toggle click, read on homepage to suggest redirect — no auto-redirect to avoid SEO issues).

Skip auto-redirect on the homepage — a suggestion banner or just remembering the preference for the toggle label is sufficient and avoids SEO/caching complexity on a static site.

## Implementation Landscape

### Key Files

- `src/lib/navigation.ts` — Add `getAlternateUrl(pathname: string, currentLang: Lang): string` with an explicit asymmetric route map and prefix-swap logic for standard routes. This is the central piece.
- `src/components/Header.astro` — Replace hardcoded `langToggleHref = lang === 'zh' ? '/' : '/zh'` with computed `getAlternateUrl(Astro.url.pathname, lang)`. Requires `Astro.url.pathname` to be passed in or accessed directly (Header is an Astro component, so `Astro.url` is available).
- `src/components/SEO.astro` — Add optional `alternateUrl` prop. When provided, emit `<link rel="alternate" hreflang="en" href="...">` and `<link rel="alternate" hreflang="zh" href="...">` with absolute URLs.
- `src/layouts/BaseLayout.astro` — Compute `alternateUrl` using `getAlternateUrl(Astro.url.pathname, lang)` and pass it to `SEO` and `Header`.
- All ZH pages (`src/pages/zh/**/*.astro`) — Already pass `lang="zh"` to BaseLayout. No changes needed.
- All EN pages (`src/pages/**/*.astro` excluding zh/) — Already default to `lang='en'`. No changes needed.

### Route Mapping

EN → ZH mapping (asymmetric cases):
| EN Path | ZH Path | Notes |
|---------|---------|-------|
| `/visit` | `/zh/sundays` | Different slug |
| `/resources` | `/zh` | No ZH counterpart, fallback to homepage |
| `/styleguide` | — | Dev-only, no toggle needed |
| `/admin/*` | — | No toggle needed |
| `/404` | — | No toggle needed |

All other routes follow standard prefix swap:
- `/about` ↔ `/zh/about`
- `/about/beliefs` ↔ `/zh/about/beliefs`
- `/sermons` ↔ `/zh/sermons`
- `/sermons/[slug]` ↔ `/zh/sermons/[slug]` (same slug)
- etc.

### Build Order

1. **Route mapping utility** (`navigation.ts`) — This is the core logic that everything else depends on. Build and unit-test this first.
2. **Header toggle wiring** — Swap hardcoded href to computed one. Quick change, immediately verifiable.
3. **SEO hreflang tags** — Update SEO component, thread alternateUrl through BaseLayout. Cross-cutting but mechanical.
4. **Cookie preference** (optional/lightweight) — Small `<script>` that sets `document.cookie` on toggle click. Low value on a static site — could be deferred. The roadmap mentions it but the primary value is the URL-based toggle.

### Verification Approach

1. `npm run build` succeeds.
2. Grep built HTML for toggle hrefs: `grep -r 'lang-toggle' dist/client/about/index.html` should show `/zh/about`, not `/zh`.
3. Grep built HTML for hreflang: `grep 'hreflang' dist/client/about/index.html` should show both en and zh alternates.
4. Verify asymmetric mapping: `grep 'lang-toggle' dist/client/visit/index.html` should show `/zh/sundays`.
5. Verify ZH→EN: `grep 'lang-toggle' dist/client/zh/about/index.html` should show `/about`.
6. Verify fallback: `grep 'lang-toggle' dist/client/resources/index.html` should show `/zh`.
7. No EN content leaks into ZH pages or vice versa.

## Constraints

- Static site — no server-side cookie reading. Cookie is purely client-side JS.
- `Astro.url.pathname` is available in all `.astro` components at build time (confirmed via SEO.astro usage).
- Dynamic routes (`/sermons/[slug]`) will have the same slug in both languages — the slug is language-agnostic (it comes from Sanity's `slug` field).
- The `/visit` ↔ `/zh/sundays` asymmetry is the only confirmed slug mismatch. The mapping must be explicit.

## Common Pitfalls

- **Trailing slashes** — Astro's built output uses `/about/index.html` patterns. `Astro.url.pathname` may or may not include a trailing slash depending on config. The route mapping function must normalize slashes before matching.
- **`Astro.url` in components** — Available in Astro components but NOT in framework components (React/Svelte). Header.astro is an Astro component, so this is fine.
- **hreflang requires absolute URLs** — The SEO component already computes `canonical` from `Astro.site`, so follow the same pattern for alternates.
