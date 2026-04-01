# S01 — Performance & Accessibility Audit Research

**Date:** 2026-03-31

## Summary

The site has a solid accessibility foundation — proper ARIA attributes on the hamburger menu, `role="tablist"`/`role="tab"`/`role="tabpanel"` on the contact page tabs, `role="alert"`/`role="status"` on form banners, `focus-visible` styles throughout, labeled iframes, and `<main>` on every page. However, several concrete gaps exist that will prevent hitting the ≥90 perf / ≥95 a11y targets:

**Performance blockers:** The Hero component uses CSS `background-image` which is invisible to the browser's preload scanner — this is the LCP element on most pages. No `preconnect` hints for `cdn.sanity.io` (images) or `youtube-nocookie.com` (embeds). Sanity images don't request WebP format despite the CDN supporting it. LHCI currently only tests 3 URLs (homepage, styleguide, 404) — needs expansion to cover all page types. Current perf threshold is 0.75, not 0.90.

**Accessibility blockers:** No skip-to-content link. No `id` on `<main>` for skip targets. Two `<img>` elements use empty `alt=""` (EventCard, Card) — may be correct if decorative, but need audit in context. No axe-core automated testing exists. LHCI a11y threshold is already 0.95 which meets the target.

**What's already good:** CJK fonts async-loaded correctly (K001/D008). `loading="lazy"` on 11 elements. Heading hierarchy looks clean. Form labels properly associated. Color tokens use sufficient contrast (ink #1A1A2E on bg #FAF8F5 = ~15:1). LHCI CI pipeline exists with per-URL thresholds.

## Recommendation

Split this into three tasks: (1) Performance fixes — Hero `<img>` conversion, preconnects, WebP format param, LCP optimization; (2) Accessibility fixes — skip-to-content, `<main id>`, audit all images for alt text, keyboard navigation verification; (3) Audit tooling — expand LHCI URLs to cover representative page types, add axe-core integration test, raise perf threshold to 0.90, run full audit and fix anything flagged. Task 1 and 2 are independent; Task 3 depends on both.

## Implementation Landscape

### Key Files

- `src/components/Hero.astro` — LCP bottleneck. Uses CSS `background-image` which the preload scanner can't discover. Needs conversion to `<img>` with `fetchpriority="high"` inside an absolutely-positioned container, preserving the overlay effect.
- `src/layouts/BaseLayout.astro` — Add skip-to-content link, preconnect hints for `cdn.sanity.io` and `youtube-nocookie.com`. Add `id="main-content"` to `<main>` (or inject it via the layout since pages use `<slot />`).
- `src/lib/sanity.ts` — `urlForImage()` should default to `format: 'webp'` for all images unless caller overrides. Single-line change.
- `src/components/Card.astro`, `src/components/EventCard.astro` — Two `<img>` elements with `alt=""`. If these cards have titles, the images are likely decorative and `alt=""` is correct. Verify in context.
- `lighthouserc.cjs` — Expand URL list to cover all page archetypes (home, about, sermons listing, sermon detail, events, contact, give, visit, ministry listing, ZH home). Raise perf threshold from 0.75 to 0.90 for production pages.
- `package.json` — Add `@axe-core/cli` or `axe-playwright` (if Playwright is added in S03) for automated a11y testing.

### Build Order

1. **Performance fixes first** (Hero, preconnects, WebP) — these have the biggest score impact and are self-contained. Hero conversion is the highest-risk change since it touches the visual layout of every page with a hero.
2. **Accessibility fixes** (skip-to-content, main id, alt text audit) — low risk, straightforward additions.
3. **Audit tooling** (LHCI expansion, axe-core, threshold updates, full audit run) — depends on fixes being in place so the audit passes clean.

### Verification Approach

- `npm run build` — confirms no build regressions
- `npm run lhci` — run LHCI locally with expanded URLs and updated thresholds. All pages ≥ 0.90 perf, ≥ 0.95 a11y.
- `npx @axe-core/cli http://localhost:4321/` — zero violations on representative pages
- Manual keyboard test: Tab through homepage, contact page (tabs), sermon listing. Verify focus visibility, skip-to-content works, no focus traps.

## Constraints

- Hero `background-image` to `<img>` conversion must preserve the overlay gradient effect. The image needs `object-fit: cover` with absolute positioning inside a relative container, with the overlay div on top.
- LHCI dynamic routes (`/sermons/[slug]`, `/ministries/[slug]`) need hardcoded example URLs or the build output directory scanned for actual paths.
- The 0.90 perf target may be tight for pages with YouTube embeds (third-party JS). May need to accept 0.85 for embed-heavy pages or use facade patterns.
- CJK font async loading (K001) is already in place — don't regress it.

## Common Pitfalls

- **Hero `<img>` breaks layout on pages without images** — Some pages may pass empty `backgroundImage` to Hero. The conversion needs a fallback (solid color bg when no image).
- **`fetchpriority="high"` on below-fold images** — Only the first/hero image should get this. Lazy-loaded images below fold should not.
- **axe-core false positives on color contrast** — The overlay text on hero images may flag as insufficient contrast since axe can't evaluate the gradient+image background. These may need manual verification and suppression.
- **LHCI URL list grows too large** — Test representative archetypes, not every page. One of each template type is sufficient.

## Open Risks

- YouTube iframe embeds on sermon detail pages load ~800KB of third-party JS. If these pages need ≥0.90 perf, a lite-youtube facade may be required. This would be a scope expansion.
- Sanity CDN WebP support is assumed but not verified — need to confirm `?fm=webp` works on the actual project's images.
