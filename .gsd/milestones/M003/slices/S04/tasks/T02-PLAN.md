---
estimated_steps: 33
estimated_files: 3
skills_used: []
---

# T02: Wire alternate URL into Header toggle, SEO hreflang, and BaseLayout

Thread the computed alternate URL from BaseLayout into Header (toggle href) and SEO (hreflang tags), add cookie-set script, and verify with build output.

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

## Inputs

- ``src/lib/navigation.ts` — getAlternateUrl function from T01`
- ``src/layouts/BaseLayout.astro` — existing layout with lang prop`
- ``src/components/Header.astro` — existing header with hardcoded toggle href`
- ``src/components/SEO.astro` — existing SEO component with canonical URL logic`

## Expected Output

- ``src/layouts/BaseLayout.astro` — computes and threads alternateUrl to Header and SEO, adds cookie script`
- ``src/components/Header.astro` — uses langToggleHref prop instead of hardcoded value`
- ``src/components/SEO.astro` — emits hreflang alternate link tags`

## Verification

npm run build && grep -q 'href="/zh/about"' dist/client/about/index.html && grep -q 'href="/about"' dist/client/zh/about/index.html && grep -q 'href="/zh/sundays"' dist/client/visit/index.html && grep -q 'hreflang="zh"' dist/client/about/index.html && grep -q 'hreflang="en"' dist/client/zh/about/index.html && grep -q 'lang-pref' dist/client/about/index.html && echo 'ALL CHECKS PASS'
