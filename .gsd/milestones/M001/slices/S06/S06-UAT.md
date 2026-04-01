# S06: Preview Mode & Integration Wiring — UAT

**Milestone:** M001
**Written:** 2026-04-01T03:33:25.199Z

# S06: Preview Mode & Integration Wiring — UAT

**Milestone:** M001
**Written:** 2026-03-31

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: Preview mode infrastructure is wired but no content pages consume it yet. Verification confirms the plumbing is correctly installed — build passes, components are present, tokens are secure. Live preview testing requires deployed Sanity content and a running preview server, which is out of scope until content pages exist.

## Preconditions

- Repository cloned with all dependencies installed (`npm install`)
- Node.js 18+ available
- No Sanity API token needed for build verification (preview is env-gated off by default)

## Smoke Test

Run `npm run build` — should exit 0 with 3 pages prerendered (/, /styleguide/, /admin/).

## Test Cases

### 1. Vercel adapter installed and configured

1. Run `grep '@astrojs/vercel' package.json`
2. Run `grep 'vercel' astro.config.mjs`
3. **Expected:** Both commands find matches. package.json has @astrojs/vercel@9 in dependencies. astro.config.mjs imports and configures the vercel adapter.

### 2. Build succeeds with all pages prerendered

1. Run `npm run build`
2. Check output for page generation lines
3. **Expected:** Exit code 0. Output shows `/admin/index.html`, `/styleguide/index.html`, `/index.html` all generated as static pages.

### 3. loadQuery helper exists with correct perspective switching

1. Run `grep -A5 'loadQuery' src/lib/sanity.ts`
2. **Expected:** Function exists. Uses `previewDrafts` perspective when `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` is `'true'`, `published` otherwise. References `SANITY_API_READ_TOKEN` for draft fetching.

### 4. VisualEditing component wired into BaseLayout

1. Run `grep -B2 -A2 'VisualEditing' src/layouts/BaseLayout.astro`
2. **Expected:** Component imported from `@sanity/astro/visual-editing` or a wrapper. Rendered conditionally when `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` is `'true'`.

### 5. presentationTool configured in Sanity Studio

1. Run `grep -B2 -A2 'presentationTool' sanity.config.ts`
2. **Expected:** `presentationTool` imported from `sanity/presentation` and added to plugins array with a `previewUrl` option.

### 6. API token not leaked to client code

1. Run `grep -r 'SANITY_API_READ_TOKEN' src/components/ src/pages/`
2. **Expected:** No matches. The token must only appear in server-side code (src/lib/sanity.ts).

### 7. Environment variables documented

1. Run `cat .env.example`
2. **Expected:** Contains entries for `SANITY_API_READ_TOKEN`, `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`, `PUBLIC_SANITY_PREVIEW_URL`, and `VERCEL_DEPLOY_HOOK_URL` with explanatory comments.

## Edge Cases

### Preview disabled by default

1. Run `npm run build` without setting `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`
2. **Expected:** Build succeeds normally. No preview-related errors. VisualEditing component not rendered. loadQuery uses published perspective.

### Missing token with preview enabled

1. Set `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true` without setting `SANITY_API_READ_TOKEN`
2. Attempt to use loadQuery in a server-rendered page
3. **Expected:** Clear error thrown indicating SANITY_API_READ_TOKEN is required for preview mode.

## Failure Signals

- `npm run build` fails or produces fewer than 3 pages
- SANITY_API_READ_TOKEN found in client-side code (src/components/ or src/pages/)
- VisualEditing or presentationTool missing from their respective files
- .env.example missing documentation for new env vars

## Not Proven By This UAT

- Live draft preview rendering (requires deployed Sanity content + preview server)
- Publish-triggered redeploy via webhook (requires production Vercel deploy hook)
- Visual Editing click-to-edit overlay functionality (requires running Sanity Studio + preview server)
- Performance impact of VisualEditing component when enabled

## Notes for Tester

- Preview mode is off by default — all checks work without any Sanity credentials
- The `hybrid` grep check finds a comment in astro.config.mjs explaining why static is used instead (Astro 5 removed hybrid mode)
- Large Vite chunk warnings during build are expected (Sanity Studio bundles are large) and do not indicate a problem
