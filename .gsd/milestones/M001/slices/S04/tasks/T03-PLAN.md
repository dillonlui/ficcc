---
estimated_steps: 19
estimated_files: 4
skills_used: []
---

# T03: Add GROQ query helpers, update CSP, remove old studio/, verify Lighthouse

Create reusable GROQ query helper functions in `src/lib/sanity.ts` that downstream slices will use to fetch content. Update CSP in `vercel.json` if Studio needs script-src for `cdn.sanity.io`. Remove the old standalone `studio/` directory. Run Lighthouse CI to confirm no performance regression from adding React + Sanity deps.

## Steps

1. Update `src/lib/sanity.ts` with typed GROQ query helpers: `getPageBySlug(slug, language)`, `getSermons(language)`, `getEvents(language)`, `getMinistries(language)`, `getSiteSettings(language)`, `getNavigation(language)`. Each returns a typed result using the Sanity client.
2. Check if `vercel.json` CSP `script-src` needs `https://cdn.sanity.io` for Studio. The Studio at `/admin` is a static HTML page that loads React client-side — its scripts come from the Astro build bundle, not from CDN. But verify by checking `@sanity/astro` output.
3. Remove `studio/sanity.config.ts` — replaced by root `sanity.config.ts`.
4. Remove `studio/` directory entirely if empty after config removal.
5. Run `npm run build` to verify everything still builds.
6. Run Lighthouse CI (`npm run lhci`) to verify perf score hasn't regressed below thresholds. The addition of React as a dependency should not affect production page bundles since `/admin` is a separate route.
7. Update `lighthouserc.cjs` if needed to handle the new `/admin` route (exclude it from assertions since it's a Studio page, not a content page).

## Must-Haves

- [ ] GROQ query helpers exported from `src/lib/sanity.ts`
- [ ] Old `studio/` directory removed
- [ ] Build succeeds
- [ ] Lighthouse CI passes or thresholds adjusted for new route

## Verification

- `npm run build` exits 0
- `! test -d studio` confirms old directory removed
- `grep -c 'export.*function\|export.*const.*=' src/lib/sanity.ts` shows multiple exports
- `npm run lhci` passes (or `npm run build` as minimum if lhci has env issues)

## Inputs

- ``src/lib/sanity.ts` — Sanity client from T01`
- ``vercel.json` — CSP headers from S01`
- ``lighthouserc.cjs` — Lighthouse config from S01`
- ``sanity/schemas/index.ts` — schema types from T02 (for type awareness)`

## Expected Output

- ``src/lib/sanity.ts` — updated with GROQ query helpers`
- ``vercel.json` — CSP updated if needed`
- ``lighthouserc.cjs` — updated if /admin route needs exclusion`

## Verification

npm run build && ! test -d studio && grep -q 'getPageBySlug\|getSermons' src/lib/sanity.ts
