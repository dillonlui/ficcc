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

## K004: @sanity/astro studioBasePath requires server rendering — use manual embed for static sites
**Context:** `@sanity/astro`'s `studioBasePath` option injects a server-rendered route, requiring `output: 'server'` or `'hybrid'` with an adapter. This is incompatible with the project's `output: 'static'` mode.
**Rule:** Embed Sanity Studio via a `client:only="react"` component (`src/components/Studio.tsx`) on a dedicated Astro page (`src/pages/admin/index.astro`). Use `PUBLIC_` prefixed env vars for project ID and dataset since Studio runs client-side. See D011.
**Files:** `src/components/Studio.tsx`, `src/pages/admin/index.astro`, `sanity.config.ts`

## K005a: Astro 5 removed `output: 'hybrid'` — use static + adapter instead
**Context:** Astro 5 merged hybrid into static mode. Adding an adapter (e.g. `@astrojs/vercel`) to a `static` site enables per-page SSR opt-in via `export const prerender = false`. The `output: 'hybrid'` config value no longer exists.
**Rule:** Don't set `output: 'hybrid'` — it errors on Astro 5. Keep `output: 'static'` and add the adapter. Use `@astrojs/vercel@9` (v10 requires Astro 6). See D014.
**Files:** `astro.config.mjs`, `package.json`

## K006: Sanity preview mode architecture — loadQuery vs existing GROQ helpers
**Context:** `src/lib/sanity.ts` has two parallel query paths: (1) typed GROQ helpers (`getPageBySlug`, `getSermons`, etc.) for static build-time fetching, and (2) `loadQuery` for server-rendered preview contexts with draft awareness.
**Rule:** Never modify the existing GROQ helpers when adding preview support. `loadQuery` uses `sanity:client` (from @sanity/astro integration) with `previewDrafts` perspective and `SANITY_API_READ_TOKEN`. The token must never appear in `PUBLIC_` vars or client components.
**Files:** `src/lib/sanity.ts`, `src/layouts/BaseLayout.astro`

## K007: Remediation slices are normal — plan for validation gaps
**Context:** M001 validation after S06 revealed three gaps: no reusable SEO component, no 404 page, no LHCI CI pipeline. These were foundational requirements that slipped through initial planning because they cut across multiple slices.
**Rule:** After completing all planned slices, validate the milestone's success criteria before marking complete. Expect 1-2 remediation slices for cross-cutting concerns that don't naturally belong to any single slice.

## K008: Wrap CMS fetches in try-catch for static build resilience
**Context:** During `npm run build`, Sanity GROQ queries fail if the project ID is a placeholder or the API is unreachable. This breaks the entire static build even though hardcoded fallbacks exist.
**Rule:** Wrap all `getHomePage()` / `getSermons()` / `getEvents()` calls in try-catch (or use `Promise.allSettled`) so the build succeeds with fallback content when Sanity is unavailable. This is especially important for the homepage which aggregates data from multiple content types.
**Files:** `src/pages/index.astro`

## K005: Sanity schema organization and query pattern
**Context:** 12 schema types organized under `sanity/schemas/{objects,documents,singletons}/` with barrel export from `index.ts`. Every document type has a `language` field with `'en' | 'zh'`. Singletons use `{type}-{lang}` IDs (e.g. `siteSettings-en`).
**Rule:** Use the typed GROQ helpers in `src/lib/sanity.ts` for all content fetching — each accepts a `language` parameter defaulting to `'en'`. When adding new schema types, add them to the barrel export and update the structure builder in `sanity/structure.ts`.
**Files:** `sanity/schemas/index.ts`, `src/lib/sanity.ts`, `sanity/structure.ts`
