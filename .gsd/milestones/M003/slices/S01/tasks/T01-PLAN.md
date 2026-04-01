---
estimated_steps: 38
estimated_files: 4
skills_used: []
---

# T01: Make Header and Footer language-aware via shared nav config

## Description

Header and Footer currently hardcode English nav links and labels. All ZH pages need ZH nav links pointing to `/zh/...` paths. This task extracts navigation config into a shared module, makes Header/Footer accept a `lang` prop, and threads `lang` from BaseLayout through to both components.

## Steps

1. Create `src/lib/navigation.ts` exporting a `getNavLinks(lang: 'en' | 'zh')` function that returns nav links with labels and hrefs appropriate to the language. EN links: Home→`/`, About→`/about`, Ministries→`/ministries`, Sermons→`/sermons`, Contact→`/contact`. ZH links: 首頁→`/zh`, 關於我們→`/zh/about`, 團契→`/zh/ministries`, 講道→`/zh/sermons`, 聯絡我們→`/zh/contact`. Export a similar `getFooterNav(lang)` function.
2. Update `src/components/Header.astro`:
   - Accept a `lang` prop (default `'en'`) via the Props interface and frontmatter destructuring.
   - Import and call `getNavLinks(lang)` instead of hardcoding the `navLinks` array.
   - Update the logo href to `lang === 'zh' ? '/zh' : '/'`.
   - Update the logo text: keep `FICCC` for EN, show `伊的家` for ZH (or both).
   - Update the language toggle button label to reflect current language.
3. Update `src/components/Footer.astro`:
   - Accept a `lang` prop (default `'en'`).
   - Import and call `getFooterNav(lang)` instead of hardcoding `footerNav`.
   - When `lang === 'zh'`, change the Service Times heading and items to Chinese.
   - Update footer link hrefs to use the language-appropriate paths.
   - Copyright text should use the Chinese church name when `lang === 'zh'`.
4. Update `src/layouts/BaseLayout.astro`:
   - Thread the existing `lang` prop to `<Header lang={lang} />` and `<Footer lang={lang} />`.
5. Verify EN pages are unchanged: `npm run build` succeeds, spot-check `dist/index.html` still has EN nav.

## Must-Haves

- [ ] `src/lib/navigation.ts` exists with typed nav link functions
- [ ] Header accepts `lang` prop, defaults to `'en'`, renders language-appropriate links
- [ ] Footer accepts `lang` prop, defaults to `'en'`, renders language-appropriate links and service times
- [ ] BaseLayout passes `lang` to Header and Footer
- [ ] EN pages build and render identically to before (no regression)

## Verification

- `npm run build` succeeds
- `grep -q '首頁' dist/index.html` returns false (EN homepage unchanged)
- `grep -q 'About' dist/index.html` returns true (EN nav present)

## Inputs

- `src/components/Header.astro` — current hardcoded EN header
- `src/components/Footer.astro` — current hardcoded EN footer
- `src/layouts/BaseLayout.astro` — layout that renders Header/Footer

## Expected Output

- `src/lib/navigation.ts` — shared nav config module
- `src/components/Header.astro` — language-aware header
- `src/components/Footer.astro` — language-aware footer
- `src/layouts/BaseLayout.astro` — threads lang to Header/Footer

## Inputs

- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/layouts/BaseLayout.astro`

## Expected Output

- `src/lib/navigation.ts`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/layouts/BaseLayout.astro`

## Verification

npm run build && ! grep -q '首頁' dist/index.html && grep -q 'About' dist/index.html
