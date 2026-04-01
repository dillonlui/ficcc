---
id: T01
parent: S04
milestone: M001
provides: []
requires: []
affects: []
key_files: ["package.json", "astro.config.mjs", "sanity.config.ts", "sanity/structure.ts", "src/components/Studio.tsx", "src/pages/admin/index.astro", "src/lib/sanity.ts", ".env.example"]
key_decisions: ["Used React 19 instead of React 18 — Sanity v5 requires it", "Dropped studioBasePath from @sanity/astro to keep output:static — embedded Studio via client:only React component at /admin", "Used PUBLIC_ prefixed env vars for client-side Studio config"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "All 4 verification checks pass: npm run build exits 0 (3 pages built including /admin), grep confirms sanity in astro.config.mjs, sanity.config.ts exists, sanity/structure.ts exists."
completed_at: 2026-04-01T01:24:18.229Z
blocker_discovered: false
---

# T01: Installed Sanity v5, React 19, @sanity/astro, @astrojs/react and wired Studio at /admin as a client-only React component in static Astro build

> Installed Sanity v5, React 19, @sanity/astro, @astrojs/react and wired Studio at /admin as a client-only React component in static Astro build

## What Happened
---
id: T01
parent: S04
milestone: M001
key_files:
  - package.json
  - astro.config.mjs
  - sanity.config.ts
  - sanity/structure.ts
  - src/components/Studio.tsx
  - src/pages/admin/index.astro
  - src/lib/sanity.ts
  - .env.example
key_decisions:
  - Used React 19 instead of React 18 — Sanity v5 requires it
  - Dropped studioBasePath from @sanity/astro to keep output:static — embedded Studio via client:only React component at /admin
  - Used PUBLIC_ prefixed env vars for client-side Studio config
duration: ""
verification_result: passed
completed_at: 2026-04-01T01:24:18.230Z
blocker_discovered: false
---

# T01: Installed Sanity v5, React 19, @sanity/astro, @astrojs/react and wired Studio at /admin as a client-only React component in static Astro build

**Installed Sanity v5, React 19, @sanity/astro, @astrojs/react and wired Studio at /admin as a client-only React component in static Astro build**

## What Happened

Installed sanity, @sanity/astro, @astrojs/react, react, react-dom, and @sanity/vision. Adjusted from React 18 to React 19 per Sanity v5 peer requirement. Dropped studioBasePath from @sanity/astro config since it requires server rendering — instead created a manual Studio embed via client:only="react" component at /admin. Created sanity.config.ts with structureTool, visionTool, and empty schema types. Created sanity/structure.ts skeleton. Used PUBLIC_ prefixed env vars for client-side Studio config.

## Verification

All 4 verification checks pass: npm run build exits 0 (3 pages built including /admin), grep confirms sanity in astro.config.mjs, sanity.config.ts exists, sanity/structure.ts exists.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 6700ms |
| 2 | `grep -q 'sanity' astro.config.mjs` | 0 | ✅ pass | 50ms |
| 3 | `test -f sanity.config.ts` | 0 | ✅ pass | 10ms |
| 4 | `test -f sanity/structure.ts` | 0 | ✅ pass | 10ms |


## Deviations

React 19 instead of React 18 (Sanity v5 peer dep). Dropped studioBasePath, created manual Studio embed via client:only component. Added PUBLIC_ prefixed env vars for client-side Studio.

## Known Issues

None.

## Files Created/Modified

- `package.json`
- `astro.config.mjs`
- `sanity.config.ts`
- `sanity/structure.ts`
- `src/components/Studio.tsx`
- `src/pages/admin/index.astro`
- `src/lib/sanity.ts`
- `.env.example`


## Deviations
React 19 instead of React 18 (Sanity v5 peer dep). Dropped studioBasePath, created manual Studio embed via client:only component. Added PUBLIC_ prefixed env vars for client-side Studio.

## Known Issues
None.
