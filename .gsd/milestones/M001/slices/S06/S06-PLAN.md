# S06: Preview Mode & Integration Wiring

**Goal:** Sanity Visual Editing preview mode wired into the Astro site so editors can see draft content, with publish-triggered redeployment configured.
**Demo:** After this: Editor creates draft in Sanity, clicks Preview, sees draft rendered on live site. Publish triggers redeploy.

## Tasks
- [x] **T01: Added @astrojs/vercel adapter with static output mode, enabling per-page SSR opt-in for future preview routes** — ## Description

This is the riskiest step — changing the Astro build mode from `static` to `hybrid` and adding the Vercel adapter. If anything goes wrong, the entire build breaks. All existing pages must remain statically pre-rendered (hybrid mode defaults to `prerender = true`). The contact form API at `api/contact.ts` sits outside Astro routing and should be unaffected, but must be verified.

## Steps

1. Install `@astrojs/vercel` — run `npm install @astrojs/vercel`
2. Update `astro.config.mjs`:
   - Change `output: 'static'` to `output: 'hybrid'`
   - Add `import vercel from '@astrojs/vercel';` at the top
   - Add `adapter: vercel()` to the config object
   - Keep all existing integrations (sitemap, sanity, react) unchanged
3. Run `npm run build` and verify:
   - Build exits 0
   - Build output lists existing pages (/, /styleguide/, /admin/) as prerendered
   - `dist/` output structure is correct for Vercel deployment
4. Run `npm run lhci` to confirm Lighthouse CI thresholds still pass — no performance regression from the mode switch

## Must-Haves

- [ ] `@astrojs/vercel` added to package.json dependencies
- [ ] `astro.config.mjs` uses `output: 'hybrid'` with `adapter: vercel()`
- [ ] `npm run build` exits 0 with all existing pages prerendered
- [ ] Lighthouse CI passes existing thresholds

## Verification

- `npm run build` exits 0
- Build output contains "prerendered" for existing pages
- `npm run lhci` passes all assertions
- `grep -q 'hybrid' astro.config.mjs`
- `grep -q '@astrojs/vercel' package.json`
  - Estimate: 30m
  - Files: astro.config.mjs, package.json
  - Verify: npm run build && grep -q 'hybrid' astro.config.mjs && grep -q '@astrojs/vercel' package.json
- [x] **T02: Wire loadQuery helper, VisualEditing component, and presentationTool for Sanity preview mode** — ## Description

Core preview functionality: add a draft-aware `loadQuery` helper that uses the `@sanity/astro` module's client, wire the `VisualEditing` overlay into BaseLayout, configure `presentationTool` in sanity.config.ts for Studio iframe preview, and document the deploy hook + webhook setup.

The `loadQuery` helper must use `SANITY_API_READ_TOKEN` (server-only, no PUBLIC_ prefix) to fetch drafts. The `VisualEditing` component from `@sanity/astro/visual-editing` renders as a React island via `client:only="react"`. Both are gated by `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`.

IMPORTANT: The existing query helpers in `src/lib/sanity.ts` (getPageBySlug, getSermons, etc.) must remain unchanged — they're used for static build-time fetching. `loadQuery` is a parallel helper for server-rendered preview contexts.

## Steps

1. Add `loadQuery` function to `src/lib/sanity.ts`:
   - Import the client from `sanity:client` (provided by @sanity/astro integration) for visual editing support
   - Check `import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true'`
   - When enabled: use `perspective: 'drafts'`, `stega: true`, pass `SANITY_API_READ_TOKEN` as token, set `resultSourceMap: true`
   - When disabled: use `perspective: 'published'`, no token, no stega
   - Add a guard: if preview enabled but `SANITY_API_READ_TOKEN` is missing, throw a clear error
   - Keep all existing query helpers (getPageBySlug, getSermons, etc.) untouched
2. Add `VisualEditing` component to `src/layouts/BaseLayout.astro`:
   - Import `{ VisualEditing }` from `@sanity/astro/visual-editing`
   - Add `<VisualEditing />` before `</body>`, rendered only when `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` is `'true'`
   - The component should use `client:only="react"` directive
3. Update `sanity.config.ts`:
   - Import `presentationTool` from `sanity/presentation`
   - Add `presentationTool({ previewUrl: import.meta.env.PUBLIC_SANITY_PREVIEW_URL || 'http://localhost:4321' })` to plugins array
   - This enables the "Preview" button in Sanity Studio
4. Update `.env.example`:
   - Add `SANITY_API_READ_TOKEN=` with comment explaining it's server-only for draft fetching
   - Add `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=` with comment explaining it enables preview mode
   - Add `PUBLIC_SANITY_PREVIEW_URL=` with comment explaining it's the preview site URL for Studio iframe
   - Add `VERCEL_DEPLOY_HOOK_URL=` with comment explaining it's created in Vercel dashboard, used as Sanity webhook target
5. Update CSP in `vercel.json` if needed:
   - Visual Editing communicates with Sanity API — current `connect-src 'self' https://*.sanity.io` should cover it
   - If `presentationTool` needs `frame-ancestors`, that's handled by Studio (hosted separately), not the site
   - Verify no CSP changes needed; if they are, update the Content-Security-Policy header
6. Run `npm run build` to confirm no regressions
7. Run `npm run lhci` to confirm Lighthouse CI passes

## Must-Haves

- [ ] `loadQuery` function exists in `src/lib/sanity.ts` with perspective switching
- [ ] `SANITY_API_READ_TOKEN` used only server-side — never in PUBLIC_ var or client component
- [ ] `VisualEditing` component in BaseLayout, gated by env var
- [ ] `presentationTool` configured in `sanity.config.ts`
- [ ] `.env.example` documents all new env vars
- [ ] Build passes, Lighthouse CI passes
- [ ] Existing GROQ query helpers unchanged

## Failure Modes

| Dependency | On error | On timeout | On malformed response |
|------------|----------|-----------|----------------------|
| Sanity API (draft fetch) | loadQuery throws with context — missing token or API error message | Sanity client has default timeout — error surfaces naturally | GROQ returns null for missing docs — handled by existing null checks |
| @sanity/astro visual-editing | Component fails to render — page still usable without overlay | N/A (client-side component) | N/A |

## Verification

- `npm run build` exits 0
- `grep -q 'loadQuery' src/lib/sanity.ts`
- `grep -q 'VisualEditing' src/layouts/BaseLayout.astro`
- `grep -q 'presentationTool' sanity.config.ts`
- `grep -q 'SANITY_API_READ_TOKEN' .env.example`
- `grep -q 'PUBLIC_SANITY_VISUAL_EDITING_ENABLED' .env.example`
- `! grep -rq 'SANITY_API_READ_TOKEN' src/components/ src/pages/` — token not leaked to client
- `npm run lhci` passes

## Observability Impact

- Signals added: loadQuery logs perspective mode in dev console when visual editing enabled
- How a future agent inspects this: check PUBLIC_SANITY_VISUAL_EDITING_ENABLED value, grep for loadQuery usage
- Failure state exposed: missing SANITY_API_READ_TOKEN throws descriptive error when preview mode is enabled
  - Estimate: 1h
  - Files: src/lib/sanity.ts, src/layouts/BaseLayout.astro, sanity.config.ts, .env.example, vercel.json
  - Verify: npm run build && grep -q 'loadQuery' src/lib/sanity.ts && grep -q 'VisualEditing' src/layouts/BaseLayout.astro && grep -q 'presentationTool' sanity.config.ts && ! grep -rq 'SANITY_API_READ_TOKEN' src/components/ src/pages/
