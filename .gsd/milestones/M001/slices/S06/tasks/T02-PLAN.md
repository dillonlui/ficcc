---
estimated_steps: 57
estimated_files: 5
skills_used: []
---

# T02: Wire loadQuery helper, VisualEditing component, and presentationTool

## Description

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

## Inputs

- ``astro.config.mjs` — T01's hybrid output config enabling server routes`
- ``src/lib/sanity.ts` — existing Sanity client and GROQ helpers to extend`
- ``src/layouts/BaseLayout.astro` — layout to add VisualEditing component`
- ``sanity.config.ts` — Studio config to add presentationTool`
- ``.env.example` — current env var documentation`
- ``vercel.json` — current CSP and security headers`

## Expected Output

- ``src/lib/sanity.ts` — loadQuery helper added with perspective switching and token handling`
- ``src/layouts/BaseLayout.astro` — VisualEditing component conditionally rendered`
- ``sanity.config.ts` — presentationTool plugin added`
- ``.env.example` — new env vars documented (SANITY_API_READ_TOKEN, PUBLIC_SANITY_VISUAL_EDITING_ENABLED, PUBLIC_SANITY_PREVIEW_URL, VERCEL_DEPLOY_HOOK_URL)`

## Verification

npm run build && grep -q 'loadQuery' src/lib/sanity.ts && grep -q 'VisualEditing' src/layouts/BaseLayout.astro && grep -q 'presentationTool' sanity.config.ts && ! grep -rq 'SANITY_API_READ_TOKEN' src/components/ src/pages/
