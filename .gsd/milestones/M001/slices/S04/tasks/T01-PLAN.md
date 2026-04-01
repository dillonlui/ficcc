---
estimated_steps: 19
estimated_files: 6
skills_used: []
---

# T01: Install Sanity/React deps and configure @sanity/astro integration

Install `@sanity/astro`, `@astrojs/react`, `sanity`, `react`, `react-dom` and wire the integrations into `astro.config.mjs`. Create root `sanity.config.ts` with empty schema types (will be populated in T02). Update `src/lib/sanity.ts` to use the `sanity:client` module from `@sanity/astro` or keep as thin wrapper. Create `sanity/structure.ts` skeleton for custom desk structure. Verify build succeeds with the new integrations.

## Steps

1. Run `npm install sanity @sanity/astro @astrojs/react react@18 react-dom@18 @sanity/vision`
2. Update `astro.config.mjs`: add `sanity()` integration with `projectId` from env, `dataset` from env, `studioBasePath: '/admin'`; add `react()` integration. Import both at top.
3. Create `sanity.config.ts` at project root with `defineConfig` — name: 'ficcc', title, projectId/dataset from env, plugins: `[structureTool(), visionTool()]`, schema: `{ types: [] }` (empty for now).
4. Create `sanity/structure.ts` exporting a structure builder function skeleton (will be populated in T02 when singleton types exist).
5. Update `src/lib/sanity.ts` to export the client — keep `@sanity/client` direct import since `sanity:client` from `@sanity/astro` may not be available in static mode.
6. Update `.env.example` to document all Sanity env vars needed by `@sanity/astro`.
7. Run `npm run build` to verify the integration doesn't break the static build.

## Must-Haves

- [ ] `@sanity/astro` and `@astrojs/react` listed in package.json dependencies
- [ ] `astro.config.mjs` imports and configures both integrations
- [ ] Root `sanity.config.ts` exists with valid Sanity config
- [ ] Build succeeds (`npm run build` exit 0)

## Verification

- `npm run build` exits 0
- `grep -q 'sanity' astro.config.mjs` confirms integration added
- `test -f sanity.config.ts` confirms root config exists
- `test -f sanity/structure.ts` confirms structure file exists

## Inputs

- ``astro.config.mjs` — current Astro config to add integrations to`
- ``package.json` — current dependencies`
- ``src/lib/sanity.ts` — existing Sanity client helper`
- ``.env.example` — env var documentation`

## Expected Output

- ``package.json` — updated with sanity, @sanity/astro, @astrojs/react, react, react-dom deps`
- ``astro.config.mjs` — updated with sanity() and react() integrations`
- ``sanity.config.ts` — new root Sanity Studio configuration`
- ``sanity/structure.ts` — new structure builder skeleton`
- ``src/lib/sanity.ts` — updated Sanity client`
- ``.env.example` — updated env var docs`

## Verification

npm run build && grep -q 'sanity' astro.config.mjs && test -f sanity.config.ts && test -f sanity/structure.ts
