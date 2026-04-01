---
estimated_steps: 9
estimated_files: 1
skills_used: []
---

# T03: Tighten CSP for self-hosted fonts and verify Lighthouse passes

Now that fonts are self-hosted via fontsource (served from same origin), remove Google Fonts domains from the CSP in `vercel.json`:
- Remove `https://fonts.googleapis.com` from `style-src`
- Remove `https://fonts.gstatic.com` from `font-src`

The `font-src` directive should become `font-src 'self'` since all fonts are now local.

After CSP changes, run `npm run lhci` to verify:
- Both `/` and `/styleguide` pass perf ≥ 90 (the CJK font risk — styleguide is the heaviest page)
- All other thresholds pass (a11y ≥ 95, SEO ≥ 95, best-practices ≥ 90)

If Lighthouse perf drops below 90 due to CJK font weight, investigate: check total font transfer size, verify unicode-range subsetting is working (multiple small woff2 requests vs one large file), and consider preloading the most common CJK subset.

**Requirement G6:** This task is the gate — Lighthouse CI must pass with the full font stack loaded.

## Inputs

- `vercel.json`
- `src/pages/styleguide.astro`
- `src/styles/global.css`
- `lighthouserc.cjs`

## Expected Output

- `vercel.json`

## Verification

npm run lhci
