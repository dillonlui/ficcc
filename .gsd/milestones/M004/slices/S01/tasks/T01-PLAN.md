---
estimated_steps: 18
estimated_files: 3
skills_used: []
---

# T01: Optimize Hero component and image pipeline for LCP performance

The Hero component uses CSS `background-image` which is invisible to the browser preload scanner — this is the LCP element on most pages. Convert it to a proper `<img>` element, add preconnect hints, and default all Sanity images to WebP format.

## Steps

1. **Convert Hero from CSS background-image to `<img>`:** Restructure `src/components/Hero.astro` to use an `<img>` element with `fetchpriority="high"`, `loading="eager"`, `decoding="async"`, and `object-fit: cover` inside a relative-positioned container. The overlay gradient div sits on top via absolute positioning. Keep `alt=""` since the image is decorative (text overlay provides content). Handle the case where `backgroundImage` is empty or missing — render a solid color fallback.

2. **Add preconnect hint for cdn.sanity.io:** In `src/layouts/BaseLayout.astro`, add `<link rel="preconnect" href="https://cdn.sanity.io" crossorigin />` in the `<head>` before the CJK font link. This allows early connection setup for Sanity CDN images.

3. **Default urlForImage to WebP format:** In `src/lib/sanity.ts`, modify `urlForImage()` to always append `fm=webp` unless the caller explicitly passes a different format. This is a single-line change: default `options.format` to `'webp'`.

4. **Verify build and visual output:** Run `npm run build` to confirm no regressions. The Hero should render identically — full-width image with gradient overlay and centered text.

## Must-Haves

- [ ] Hero uses `<img>` with `fetchpriority="high"` instead of CSS `background-image`
- [ ] Hero handles empty/missing `backgroundImage` prop gracefully (solid color fallback)
- [ ] Preconnect hint for `cdn.sanity.io` in BaseLayout head
- [ ] `urlForImage()` defaults to WebP format
- [ ] Existing Hero visual appearance preserved (full-width, gradient overlay, centered text)
- [ ] `npm run build` succeeds

## Verification

- `npm run build` exits 0
- `grep -q 'fetchpriority' src/components/Hero.astro` confirms img element
- `grep -q 'preconnect' src/layouts/BaseLayout.astro` confirms preconnect hint
- `grep -q "format.*webp\|fm.*webp\|'webp'" src/lib/sanity.ts` confirms WebP default

## Inputs

- `src/components/Hero.astro`
- `src/layouts/BaseLayout.astro`
- `src/lib/sanity.ts`

## Expected Output

- `src/components/Hero.astro`
- `src/layouts/BaseLayout.astro`
- `src/lib/sanity.ts`

## Verification

npm run build && grep -q 'fetchpriority' src/components/Hero.astro && grep -q 'preconnect' src/layouts/BaseLayout.astro
