# S02: Design Tokens & Typography — Research

**Date:** 2026-03-31

## Summary

This slice establishes the visual foundation — CSS custom properties for color, spacing, and typography, plus the font stack for both English and Chinese. The primary technical risk is CJK font delivery: full Noto Serif CJK SC is 132MB, far too large for self-hosting naively. Fontsource solves this with automatic unicode-range subsetting, splitting CJK fonts into ~100+ woff2 slices where the browser downloads only what's needed for a given page.

The design direction is well-defined by D007 ("Gathered Warmth"): humanist serif headlines (Lora), clean sans body (Inter), CJK serif pairing (Noto Serif SC). Color palette is warm neutrals (off-white, warm stone) with muted terracotta + deep ink. The work is straightforward CSS custom properties and font configuration — no novel architecture.

The deliverable is a `/styleguide` page showing the full color palette, EN + ZH type scales, and spacing scale — a living reference for S03's component work.

## Recommendation

Use CSS custom properties (no build tool, no preprocessor) for all design tokens. Self-host all fonts via fontsource npm packages (`@fontsource/lora`, `@fontsource/inter`, `@fontsource/noto-serif-sc`). Fontsource provides woff2 with unicode-range subsetting out of the box, which is critical for CJK — the browser fetches only the character slices actually used on each page.

After fonts are self-hosted, remove Google Fonts domains from the CSP in `vercel.json` (tightening security). Keep the existing `/fonts/(.*)` cache header rule in vercel.json for any future static font assets.

Build the token system as a single `global.css` imported in a base layout. The `/styleguide` page is a standalone Astro page that renders all tokens visually.

## Implementation Landscape

### Key Files

- `src/styles/global.css` — **New.** All CSS custom properties (colors, spacing, typography scales, font-face imports). Imported once in the base layout.
- `src/layouts/BaseLayout.astro` — **New.** Base HTML layout wrapping all pages. Imports `global.css`, sets `<html lang>`, includes meta viewport, charset. All pages use this.
- `src/pages/styleguide.astro` — **New.** Visual reference page showing color swatches, type scale (EN + ZH), spacing scale. Uses BaseLayout.
- `src/pages/index.astro` — **Modify.** Migrate from inline HTML to use BaseLayout.
- `vercel.json` — **Modify.** Remove `fonts.googleapis.com` from `style-src` and `fonts.gstatic.com` from `font-src` in CSP (fonts are now self-hosted).
- `package.json` — **Modify.** Add `@fontsource/lora`, `@fontsource/inter`, `@fontsource/noto-serif-sc`.

### Build Order

1. **Font packages + global.css with tokens** — Install fontsource packages, create the token file with all custom properties and font imports. This is the foundation everything else depends on.
2. **BaseLayout.astro** — Create the shared layout that imports global.css. Migrate index.astro to use it. This proves the token system works in a real page.
3. **Styleguide page** — Build the visual reference showing all tokens. This is the slice's demo artifact and proves the type scale works for both EN and ZH.
4. **CSP cleanup** — Remove Google Fonts from CSP now that fonts are self-hosted. Run Lighthouse to verify performance stays ≥ 90.

### Verification Approach

- `npm run build` succeeds with no errors
- `npm run preview` serves the site locally
- `/styleguide` page renders color palette, EN type scale, ZH type scale, spacing scale
- Chinese characters render correctly in Noto Serif SC (not falling back to system font)
- Lighthouse CI passes all thresholds (perf ≥ 90 is the risk — CJK font weight)
- CSP no longer references Google Fonts domains
- `curl -I` on deployed site shows tightened CSP headers

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Font self-hosting + subsetting | `@fontsource/*` npm packages | Provides woff2 with unicode-range subsetting. CJK fonts are split into ~100+ slices — browser downloads only needed characters. No manual font pipeline. |
| CSS reset / normalize | Modern CSS reset (few lines in global.css) | Astro has no built-in reset. A minimal reset (box-sizing, margin, line-height) is sufficient — not a full normalize.css. |

## Constraints

- **Lighthouse perf ≥ 90** (from S01's CI config). Font loading strategy must not regress performance. Use `font-display: swap` to avoid render-blocking.
- **CSP in vercel.json** — Currently allows `fonts.googleapis.com` and `fonts.gstatic.com`. After self-hosting, these should be removed to tighten the policy.
- **Astro static output** — No server-side font optimization. All font files are static assets served from the same origin.
- **Bilingual** — Every typographic decision needs to work for both Latin (EN) and CJK (ZH). Line-height, letter-spacing, and font-size scales differ between scripts.

## Common Pitfalls

- **CJK font-display: swap causes layout shift** — Large CJK fonts load slower than Latin. Use `font-display: swap` but pair with `<link rel="preload">` for the most common CJK subset slice to minimize visible swap. Keep CLS low.
- **Noto Serif SC vs TC** — The church name uses traditional characters (華人基督教會) but the broader ZH content may use simplified. Need to confirm which variant. Noto Serif SC covers simplified Chinese; if traditional characters are needed, may need `@fontsource/noto-serif-tc` instead or in addition. **This should be clarified with the user during planning.**
- **fontsource import path** — Import the variable font variant (`@fontsource-variable/lora`) for Lora and Inter to get a single file covering all weights. For Noto Serif SC, use the standard `@fontsource/noto-serif-sc` which handles subsetting.

## Open Risks

- **CJK font size vs Lighthouse perf** — Even with unicode-range subsetting, a Chinese-heavy page may download several hundred KB of font data. Need to verify Lighthouse perf stays ≥ 90 on the styleguide page which will be the heaviest case.
- **SC vs TC character set** — If the church uses traditional Chinese characters, `noto-serif-sc` may not render all glyphs correctly. The SC variant covers most common traditional characters but not all.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | `astrolicious/agent-skills@astro` | available (2.9K installs) |
| CSS Design Tokens | `laurigates/claude-plugins@design-tokens` | available (62 installs) |

## Sources

- Fontsource provides self-hosted font packages with automatic unicode-range subsetting for CJK (source: [fontsource.org](https://fontsource.org))
- Noto Serif CJK full font is 132MB per language; subsetting is mandatory for web use (source: [notofonts/noto-cjk releases](https://github.com/notofonts/noto-cjk/releases))
