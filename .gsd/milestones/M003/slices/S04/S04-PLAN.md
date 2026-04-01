# S04: Language Toggle & Bilingual Wiring

**Goal:** Language toggle navigates to the correct counterpart page in the other language, and every bilingual page emits hreflang alternate tags for SEO.
**Demo:** After this: Language toggle switches between /about and /zh/about. URL, lang attribute, and cookie all update.

## Tasks
- [x] **T01: Added getAlternateUrl utility with asymmetric route map, trailing-slash normalization, and homepage fallback — 20 Vitest unit tests pass** — Add `getAlternateUrl(pathname: string, currentLang: Lang): string` to `src/lib/navigation.ts` and set up Vitest with comprehensive unit tests.

## Steps

1. Install vitest as a dev dependency: `npm i -D vitest`
2. Add `"test": "vitest run"` to package.json scripts if not present
3. Add `getAlternateUrl` function to `src/lib/navigation.ts` with:
   - An explicit asymmetric route map: `{ '/visit': '/zh/sundays', '/zh/sundays': '/visit' }`
   - Trailing slash normalization (strip before matching, don't add back)
   - Standard prefix swap logic: EN `/about` → ZH `/zh/about`, ZH `/zh/about` → EN `/about`
   - Fallback: pages with no counterpart (e.g. `/resources`, `/styleguide`, `/admin/*`, `/404`) → other language homepage (`/zh` or `/`)
   - Handle root paths: `/` → `/zh`, `/zh` → `/`
4. Create `src/lib/navigation.test.ts` with test cases:
   - Standard swap: `/about` (en) → `/zh/about`, `/zh/about` (zh) → `/about`
   - Nested paths: `/about/beliefs` (en) → `/zh/about/beliefs`
   - Asymmetric: `/visit` (en) → `/zh/sundays`, `/zh/sundays` (zh) → `/visit`
   - Root: `/` (en) → `/zh`, `/zh` (zh) → `/`
   - Fallback: `/resources` (en) → `/zh`, `/styleguide` (en) → `/zh`
   - Trailing slash: `/about/` (en) → `/zh/about`
   - Dynamic routes: `/sermons/some-slug` (en) → `/zh/sermons/some-slug`
5. Run `npx vitest run` and confirm all tests pass

## Must-Haves

- [ ] `getAlternateUrl` exported from `src/lib/navigation.ts`
- [ ] Asymmetric route map covers `/visit` ↔ `/zh/sundays`
- [ ] Fallback to homepage for pages with no counterpart
- [ ] Trailing slash normalization
- [ ] All unit tests pass
  - Estimate: 30m
  - Files: src/lib/navigation.ts, src/lib/navigation.test.ts, package.json
  - Verify: npx vitest run --reporter=verbose
- [x] **T02: Wired getAlternateUrl into BaseLayout → Header toggle href and SEO hreflang tags, with lang-pref cookie set on toggle click** — Thread the computed alternate URL from BaseLayout into Header (toggle href) and SEO (hreflang tags), add cookie-set script, and verify with build output.

## Steps

1. Update `src/layouts/BaseLayout.astro`:
   - Import `getAlternateUrl` from `../lib/navigation`
   - Compute `const alternateUrl = getAlternateUrl(Astro.url.pathname, lang as 'en' | 'zh');`
   - Compute absolute alternate URL: `const absoluteAlternateUrl = new URL(alternateUrl, Astro.site ?? 'https://ficcc.org').href;`
   - Pass `alternateUrl` to Header: `<Header lang={lang} langToggleHref={alternateUrl} />`
   - Pass `alternateUrl` and `lang` to SEO: `<SEO ... alternateUrl={absoluteAlternateUrl} />`
   - Add a small inline `<script>` that sets `document.cookie = 'lang-pref=' + document.documentElement.lang + ';path=/;max-age=31536000;SameSite=Lax'` on click of `.lang-toggle` link
2. Update `src/components/Header.astro`:
   - Add `langToggleHref?: string` to Props interface
   - Replace `const langToggleHref = lang === 'zh' ? '/' : '/zh';` with `const langToggleHref = Astro.props.langToggleHref ?? (lang === 'zh' ? '/' : '/zh');` (fallback preserves existing behavior if prop not passed)
3. Update `src/components/SEO.astro`:
   - Add `alternateUrl?: string` to Props interface
   - When `alternateUrl` is provided, emit two `<link rel="alternate">` tags:
     - `<link rel="alternate" hreflang="en" href={lang === 'en' ? canonical : alternateUrl} />`
     - `<link rel="alternate" hreflang="zh" href={lang === 'zh' ? canonical : alternateUrl} />`
     - Also emit `<link rel="alternate" hreflang="x-default" href={lang === 'en' ? canonical : alternateUrl} />` (EN as default)
4. Run `npm run build` and verify:
   - `grep -q 'href="/zh/about"' dist/client/about/index.html` (EN about toggle → ZH about)
   - `grep -q 'href="/about"' dist/client/zh/about/index.html` (ZH about toggle → EN about)
   - `grep -q 'href="/zh/sundays"' dist/client/visit/index.html` (asymmetric mapping)
   - `grep -q 'hreflang="zh"' dist/client/about/index.html` (hreflang present)
   - `grep -q 'hreflang="en"' dist/client/zh/about/index.html` (hreflang present)
   - `grep -q 'lang-pref' dist/client/about/index.html` (cookie script present)
5. Run `npx vitest run` to confirm unit tests still pass

## Must-Haves

- [ ] Header toggle uses computed alternate URL from BaseLayout
- [ ] SEO emits hreflang alternate tags with absolute URLs
- [ ] BaseLayout computes and threads alternateUrl to both components
- [ ] Cookie script sets `lang-pref` on toggle click
- [ ] `npm run build` succeeds
- [ ] All verification greps pass on built output
  - Estimate: 45m
  - Files: src/layouts/BaseLayout.astro, src/components/Header.astro, src/components/SEO.astro
  - Verify: npm run build && grep -q 'href="/zh/about"' dist/client/about/index.html && grep -q 'href="/about"' dist/client/zh/about/index.html && grep -q 'href="/zh/sundays"' dist/client/visit/index.html && grep -q 'hreflang="zh"' dist/client/about/index.html && grep -q 'hreflang="en"' dist/client/zh/about/index.html && grep -q 'lang-pref' dist/client/about/index.html && echo 'ALL CHECKS PASS'
