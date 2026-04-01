---
estimated_steps: 8
estimated_files: 4
skills_used: []
---

# T01: Install self-hosted fonts, create design tokens and BaseLayout

Install fontsource packages for Lora (variable), Inter (variable), and Noto Serif SC. Create `src/styles/global.css` with all CSS custom properties (color palette from D007 'Gathered Warmth', spacing scale, typography scale for EN and ZH), font-face imports from fontsource, and a minimal CSS reset. Create `src/layouts/BaseLayout.astro` that imports global.css, sets charset/viewport/lang, and wraps page content in a slot. Migrate `src/pages/index.astro` to use BaseLayout.

**Design tokens from D007:**
- Colors: off-white background (#FAF8F5), warm stone (#E8E0D8), muted terracotta (#C4745A), deep ink (#1A1A2E), body text (#2D2D2D)
- Fonts: Lora (headline serif), Inter (body sans), Noto Serif SC (CJK serif)
- Spacing: 4px base scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128)
- Type scale: modular scale for both EN and ZH with appropriate line-heights (1.5 for Latin body, 1.7-1.8 for CJK body)

**Font loading:** Use `font-display: swap` for all fonts. Import variable font variants for Lora and Inter (`@fontsource-variable/lora`, `@fontsource-variable/inter`). Use standard `@fontsource/noto-serif-sc` which handles unicode-range subsetting automatically.

**BaseLayout:** Must include `<html lang>` attribute (parameterized for i18n), meta charset, meta viewport, slot for page content. Import global.css in the frontmatter.

## Inputs

- `package.json`
- `src/pages/index.astro`
- `astro.config.mjs`

## Expected Output

- `package.json`
- `src/styles/global.css`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`

## Verification

npm run build && test -f src/styles/global.css && test -f src/layouts/BaseLayout.astro && grep -q 'BaseLayout' src/pages/index.astro
