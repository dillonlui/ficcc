# S06: Preview Mode & Integration Wiring — Research

**Date:** 2026-03-31

## Summary

S06 wires Sanity's Visual Editing into the Astro site so editors can preview draft content, and configures a Vercel deploy hook so publishing in Sanity triggers a production rebuild. The core challenge is that the site is currently `output: 'static'` (D011, K004) — all pages are pre-rendered at build time, and there's no server to handle request-time draft fetching. Sanity Visual Editing requires server-rendered routes to fetch drafts with the `drafts` perspective and a read token.

The recommended approach is switching to `output: 'hybrid'` with the `@astrojs/vercel` adapter. Hybrid mode keeps all existing pages statically pre-rendered by default (zero behavior change) while allowing specific routes to opt into server-rendering via `export const prerender = false`. This lets us add a server-rendered preview API route or page without touching any existing page.

The `@sanity/astro` integration already ships a `VisualEditing` component (`@sanity/astro/visual-editing`) and provides a `sanity:client` module. The recommended pattern from the @sanity/astro README is a `loadQuery` helper that switches between `published` and `drafts` perspective based on an env flag, with stega encoding for click-to-edit overlays.

## Recommendation

**Switch to `output: 'hybrid'` + `@astrojs/vercel` adapter.** Create a `loadQuery` helper that respects a `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` env var to toggle between published/drafts perspective. Add the `VisualEditing` component to `BaseLayout.astro` behind the same flag. Set up a Vercel deploy hook and register it as a Sanity webhook so publish events trigger rebuilds. All existing pages remain statically pre-rendered — no performance or behavior regression.

## Implementation Landscape

### Key Files

- `astro.config.mjs` — Change `output: 'static'` → `output: 'hybrid'`, add `adapter: vercel()` import. The `sanity()` integration is already configured.
- `src/lib/sanity.ts` — Existing Sanity client and GROQ helpers. Needs a parallel `loadQuery` function that uses `sanity:client` (from @sanity/astro) with `perspective: 'drafts'`, `stega: true`, `token`, and `resultSourceMap` when visual editing is enabled. Existing query helpers remain for build-time static use.
- `src/layouts/BaseLayout.astro` — Add `<VisualEditing enabled={visualEditingEnabled} />` from `@sanity/astro/visual-editing` before `</body>`. Conditionally enabled via `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`.
- `vercel.json` — No changes needed for the adapter itself, but CSP `connect-src` may need updating if stega/visual-editing makes additional Sanity API calls from the browser. Currently allows `https://*.sanity.io` which should suffice.
- `.env.example` — Add `SANITY_API_READ_TOKEN` (server-only, for draft fetching) and `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` (client-side flag).
- `sanity.config.ts` — May need `presentationTool` plugin added for the Presentation tool's iframe preview (enables "Preview" button in Studio that opens the site in an iframe within Studio).
- `package.json` — Add `@astrojs/vercel` dependency.

### Build Order

1. **Hybrid mode + adapter** — Switch `output` to `'hybrid'`, install and configure `@astrojs/vercel`. Verify `npm run build` still produces static pages for all existing routes. This is the riskiest step (could break the build) and unblocks everything else.
2. **`loadQuery` helper + VisualEditing component** — Create the draft-aware query helper and wire the VisualEditing overlay into BaseLayout. This is the core preview functionality.
3. **Deploy hook + Sanity webhook** — Create a Vercel deploy hook, document/configure the Sanity webhook to call it on publish. Add Presentation tool to sanity.config.ts if warranted. Verify end-to-end: draft visible in preview, publish triggers rebuild.

### Verification Approach

- `npm run build` exits 0 with all existing pages still pre-rendered (check build output for "prerendered" pages)
- `loadQuery` helper exists and correctly branches on `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`
- `VisualEditing` component is present in BaseLayout, conditioned on env var
- With `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true` and a valid `SANITY_API_READ_TOKEN`, a server-rendered page fetches drafts (perspective: 'drafts')
- Vercel deploy hook URL is documented; Sanity webhook configuration is documented
- CSP in vercel.json allows visual editing to function (no console CSP errors)
- Lighthouse CI continues to pass (existing pages are still static, no perf regression)

## Constraints

- `output: 'hybrid'` is required — `'static'` cannot serve draft content at request time. This is a hard architectural constraint.
- `SANITY_API_READ_TOKEN` is a **server-side secret** (no `PUBLIC_` prefix) — it must only be used in server-rendered routes or build-time code, never exposed to the client bundle.
- The `VisualEditing` component requires `@astrojs/react` (already installed) and renders via `client:only="react"`.
- `presentationTool()` in sanity.config.ts requires knowing the preview URL — for local dev this is `http://localhost:4321`, for production it's the Vercel deployment URL. May need env-based configuration.

## Common Pitfalls

- **Breaking existing static pages** — When switching to `hybrid`, all existing `.astro` pages default to `prerender = true` (static). But if any page does something that requires server context at request time, it could fail. Verify build output carefully after the switch.
- **Token leakage** — The `SANITY_API_READ_TOKEN` must never be in a `PUBLIC_`-prefixed var or used in client-side code. The `loadQuery` helper must ensure the token is only sent server-side (Astro's server-only modules or runtime checks).
- **CSP blocking visual editing** — The `VisualEditing` component loads `@sanity/visual-editing` which communicates with Sanity's API. Current CSP allows `connect-src 'self' https://*.sanity.io` which should cover this, but test explicitly.
- **Vercel adapter + existing API routes** — The `api/contact.ts` Vercel Edge function exists outside Astro's routing. Verify it still works after adding the Vercel adapter (it should — Vercel adapter handles Astro routes, `api/` directory is separate).

## Open Risks

- The Presentation tool iframe preview (editor clicks "Preview" in Studio) requires the Studio to know the preview site URL. For production this is straightforward, but for local dev or Vercel preview deployments the URL varies. May need a `SANITY_STUDIO_PREVIEW_URL` env var or similar configuration.
- Vercel deploy hooks are simple (POST to a URL triggers deploy) but there's no built-in way to verify the webhook is correctly configured from the codebase alone — it requires manual Vercel dashboard setup. Documentation is the deliverable here.

## Sources

- @sanity/astro README: `loadQuery` pattern with perspective switching, VisualEditing component usage, SSR requirement (source: [sanity-astro GitHub](https://github.com/sanity-io/sanity-astro))
- Astro hybrid output mode: keeps pages static by default, opt-in SSR per route via `export const prerender = false` (source: [Astro docs](https://docs.astro.build/en/guides/server-side-rendering/))
