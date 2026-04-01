# S02: Design Tokens & Typography — UAT

**Milestone:** M001
**Written:** 2026-04-01T00:48:31.098Z

# S02: Design Tokens & Typography — UAT

**Milestone:** M001
**Written:** 2026-03-31

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: All outputs are static build artifacts (CSS files, HTML pages, Lighthouse reports). No runtime behavior to test.

## Preconditions

- Node.js installed, `npm install` completed
- `npm run build` succeeds

## Smoke Test

Run `npm run build` — should complete with 2 pages (index, styleguide). Run `npm run preview` and visit http://localhost:4321/styleguide/ — page should render with visible color swatches, typography samples, and spacing bars.

## Test Cases

### 1. Design tokens defined in global.css

1. Open `src/styles/global.css`
2. Verify CSS custom properties exist for: `--color-bg` (#FAF8F5), `--color-stone` (#E8E0D8), `--color-terracotta` (#C4745A), `--color-ink` (#1A1A2E), `--color-body` (#2D2D2D)
3. Verify spacing tokens: `--space-1` (4px) through `--space-32` (128px)
4. Verify EN type scale: `--text-xs` through `--text-4xl`
5. Verify ZH type scale: `--text-zh-base` through `--text-zh-3xl`
6. Verify font families: `--font-heading`, `--font-body`, `--font-cjk`
7. **Expected:** All tokens present with correct values matching D007 Gathered Warmth specification

### 2. Fonts self-hosted via fontsource

1. Run `npm run build`
2. Check `dist/_astro/` for `.woff2` font files
3. Check `vercel.json` CSP header for `font-src 'self'` (no external font domains)
4. **Expected:** Font files in dist, CSP allows only self-hosted fonts

### 3. Styleguide color palette section

1. Run `npm run preview`, open http://localhost:4321/styleguide/
2. Locate "Color Palette" section
3. Verify 5 color swatches displayed with hex values and variable names
4. **Expected:** All 5 Gathered Warmth colors visible with correct labels

### 4. Styleguide EN typography scale

1. On /styleguide, locate "Typography Scale (EN)" section
2. Verify h1-h4 headings rendered in Lora serif font
3. Verify body text in Inter sans-serif
4. Verify font-size and line-height labels shown
5. **Expected:** Clear visual hierarchy with Lora headings and Inter body text

### 5. Styleguide ZH typography scale

1. On /styleguide, locate "Typography Scale (ZH)" section
2. Verify Chinese characters rendered (e.g. '伊的家華人基督教會')
3. Verify Noto Serif SC font applied (CJK serif, not fallback system font)
4. Verify ZH sizes are slightly larger than EN equivalents
5. **Expected:** Chinese text renders in Noto Serif SC with appropriate sizing

### 6. Styleguide spacing scale

1. On /styleguide, locate "Spacing Scale" section
2. Verify visual bars for 4px through 128px tokens
3. Verify token names and pixel values labeled
4. **Expected:** Progressive spacing bars from small to large with labels

### 7. BaseLayout wraps all pages

1. Open `src/pages/index.astro`
2. Verify it imports and uses `BaseLayout`
3. Check rendered `/index.html` includes `<html lang="en">`, meta charset, meta viewport
4. **Expected:** All pages use BaseLayout with proper HTML structure

### 8. Lighthouse CI passes

1. Run `npm run lhci`
2. Verify all assertions pass (6 runs total, 3 per URL)
3. **Expected:** Home page perf ≥ 0.75, styleguide perf ≥ 0.50 (warn), all pages a11y ≥ 0.95, SEO ≥ 0.95, best-practices ≥ 0.90

## Edge Cases

### CJK font async loading

1. Open /styleguide in a browser with network throttling (Slow 3G)
2. Observe initial page load
3. **Expected:** Page content renders immediately with fallback fonts, CJK fonts swap in after async CSS loads

### No-JS CJK font fallback

1. Disable JavaScript in browser
2. Open /styleguide
3. **Expected:** CJK fonts still load via noscript fallback link tag

## Failure Signals

- `npm run build` fails or produces only 1 page
- `npm run lhci` exits with code 1
- Styleguide page shows no color swatches or blank sections
- Chinese text renders in system default font instead of Noto Serif SC
- CSP errors in browser console related to font loading

## Not Proven By This UAT

- Production deployment behavior (Vercel CDN font caching, HTTP/2 push)
- Actual CJK font rendering on Windows/Linux (only tested in macOS Lighthouse Chrome)
- Design token sufficiency for all S03 components (proven only for styleguide layout)

## Notes for Tester

- CJK fonts take 1-2 seconds to swap in on first load — this is expected with font-display: swap
- Lighthouse perf scores for /styleguide will be low (0.5-0.6 range) due to CJK font weight — this is a dev-only page and the threshold is set to warn, not error
- The styleguide uses only CSS custom properties for layout — no additional CSS files — intentionally proving the tokens are sufficient
