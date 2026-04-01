# KNOWLEDGE — Project-Specific Rules, Patterns & Lessons

## K001: Fontsource CJK fonts generate massive CSS bundles
**Context:** `@fontsource/noto-serif-sc` at 2 weights produces ~240 `@font-face` rules (~240KB CSS) due to unicode-range subsetting. If imported normally, this becomes render-blocking.
**Rule:** Always load CJK font CSS via async pattern (`media="print" onload="this.media='all'"`). Use Astro's `?url` import to get a separate CSS file path instead of bundling into global CSS.
**Files:** `src/styles/cjk-fonts.css`, `src/layouts/BaseLayout.astro`

## K002: Lighthouse CI needs per-URL thresholds and 3 runs
**Context:** Under simulated 4G throttling, CJK font subset downloads cause perf scores to swing ±0.15 between runs. The styleguide page (heavy CJK text) scores 0.59, home page scores 0.76-0.77. A single global threshold either flakes or suppresses regressions.
**Rule:** Use `numberOfRuns: 3` and `assertMatrix` with `matchingUrlPattern` for per-URL thresholds. Production pages ≥ 0.75, dev-only pages (styleguide) ≥ 0.50 (warn). See D009.
**Files:** `lighthouserc.cjs`

## K003: Styleguide page is the design token reference for component work
**Context:** `/styleguide` renders all CSS custom properties visually — use it as the definitive reference when building S03 components. All styles on the styleguide use only CSS custom properties from global.css with no additional stylesheets.
**Rule:** When building components in S03, reference `/styleguide` token names rather than hardcoding values. If a component needs a token that doesn't exist, add it to global.css first.
**Files:** `src/pages/styleguide.astro`, `src/styles/global.css`
