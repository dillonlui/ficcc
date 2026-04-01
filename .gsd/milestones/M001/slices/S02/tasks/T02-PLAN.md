---
estimated_steps: 8
estimated_files: 2
skills_used: []
---

# T02: Build /styleguide page showing all design tokens

Create `src/pages/styleguide.astro` using BaseLayout. The page is the slice's demo artifact and S03's design reference.

**Sections to include:**
1. **Color Palette** — Render swatches for each CSS custom property color: background, stone, terracotta, deep-ink, body-text. Show hex value and variable name.
2. **Typography Scale (EN)** — Show each heading level (h1-h4) and body text in Lora/Inter with the actual font-size, line-height, and font-family.
3. **Typography Scale (ZH)** — Same heading levels and body text rendered in Chinese characters using Noto Serif SC. Use sample text like '伊的家華人基督教會' for headings and a paragraph of Chinese lorem for body.
4. **Spacing Scale** — Visual blocks showing each spacing token value (4px through 128px) with labels.

Each section should use semantic HTML (headings, definition lists or similar). Style the page itself using only the design tokens from global.css — no inline styles or additional CSS files. This proves the tokens are sufficient for real layout work.

Also update `lighthouserc.cjs` to add `/styleguide` to the URL list so Lighthouse CI tests both pages.

## Inputs

- `src/styles/global.css`
- `src/layouts/BaseLayout.astro`
- `lighthouserc.cjs`

## Expected Output

- `src/pages/styleguide.astro`
- `lighthouserc.cjs`

## Verification

npm run build && grep -q 'styleguide' lighthouserc.cjs && test -f dist/styleguide/index.html
