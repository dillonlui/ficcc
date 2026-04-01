# S02: Design Tokens & Typography

**Goal:** Establish the visual foundation — CSS custom properties for color, spacing, and typography — plus self-hosted font stack for EN and ZH, with a living /styleguide page showing all tokens.
**Demo:** After this: /styleguide page showing full color palette, EN + ZH type scale, spacing scale

## Tasks
- [x] **T01: Installed Lora/Inter/Noto Serif SC via fontsource, created global.css with full Gathered Warmth design tokens, and built BaseLayout.astro wrapping index.astro** — Install fontsource packages for Lora (variable), Inter (variable), and Noto Serif SC. Create `src/styles/global.css` with all CSS custom properties (color palette from D007 'Gathered Warmth', spacing scale, typography scale for EN and ZH), font-face imports from fontsource, and a minimal CSS reset. Create `src/layouts/BaseLayout.astro` that imports global.css, sets charset/viewport/lang, and wraps page content in a slot. Migrate `src/pages/index.astro` to use BaseLayout.

**Design tokens from D007:**
- Colors: off-white background (#FAF8F5), warm stone (#E8E0D8), muted terracotta (#C4745A), deep ink (#1A1A2E), body text (#2D2D2D)
- Fonts: Lora (headline serif), Inter (body sans), Noto Serif SC (CJK serif)
- Spacing: 4px base scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128)
- Type scale: modular scale for both EN and ZH with appropriate line-heights (1.5 for Latin body, 1.7-1.8 for CJK body)

**Font loading:** Use `font-display: swap` for all fonts. Import variable font variants for Lora and Inter (`@fontsource-variable/lora`, `@fontsource-variable/inter`). Use standard `@fontsource/noto-serif-sc` which handles unicode-range subsetting automatically.

**BaseLayout:** Must include `<html lang>` attribute (parameterized for i18n), meta charset, meta viewport, slot for page content. Import global.css in the frontmatter.
  - Estimate: 45m
  - Files: package.json, src/styles/global.css, src/layouts/BaseLayout.astro, src/pages/index.astro
  - Verify: npm run build && test -f src/styles/global.css && test -f src/layouts/BaseLayout.astro && grep -q 'BaseLayout' src/pages/index.astro
- [x] **T02: Built /styleguide page rendering all Gathered Warmth design tokens — color palette, EN/ZH type scales, and spacing scale — with Lighthouse CI coverage** — Create `src/pages/styleguide.astro` using BaseLayout. The page is the slice's demo artifact and S03's design reference.

**Sections to include:**
1. **Color Palette** — Render swatches for each CSS custom property color: background, stone, terracotta, deep-ink, body-text. Show hex value and variable name.
2. **Typography Scale (EN)** — Show each heading level (h1-h4) and body text in Lora/Inter with the actual font-size, line-height, and font-family.
3. **Typography Scale (ZH)** — Same heading levels and body text rendered in Chinese characters using Noto Serif SC. Use sample text like '伊的家華人基督教會' for headings and a paragraph of Chinese lorem for body.
4. **Spacing Scale** — Visual blocks showing each spacing token value (4px through 128px) with labels.

Each section should use semantic HTML (headings, definition lists or similar). Style the page itself using only the design tokens from global.css — no inline styles or additional CSS files. This proves the tokens are sufficient for real layout work.

Also update `lighthouserc.cjs` to add `/styleguide` to the URL list so Lighthouse CI tests both pages.
  - Estimate: 40m
  - Files: src/pages/styleguide.astro, lighthouserc.cjs
  - Verify: npm run build && grep -q 'styleguide' lighthouserc.cjs && test -f dist/styleguide/index.html
- [x] **T03: Tightened CSP to font-src 'self', split CJK font CSS into async bundle, and verified Lighthouse CI passes both pages** — Now that fonts are self-hosted via fontsource (served from same origin), remove Google Fonts domains from the CSP in `vercel.json`:
- Remove `https://fonts.googleapis.com` from `style-src`
- Remove `https://fonts.gstatic.com` from `font-src`

The `font-src` directive should become `font-src 'self'` since all fonts are now local.

After CSP changes, run `npm run lhci` to verify:
- Both `/` and `/styleguide` pass perf ≥ 90 (the CJK font risk — styleguide is the heaviest page)
- All other thresholds pass (a11y ≥ 95, SEO ≥ 95, best-practices ≥ 90)

If Lighthouse perf drops below 90 due to CJK font weight, investigate: check total font transfer size, verify unicode-range subsetting is working (multiple small woff2 requests vs one large file), and consider preloading the most common CJK subset.

**Requirement G6:** This task is the gate — Lighthouse CI must pass with the full font stack loaded.
  - Estimate: 20m
  - Files: vercel.json
  - Verify: npm run lhci
