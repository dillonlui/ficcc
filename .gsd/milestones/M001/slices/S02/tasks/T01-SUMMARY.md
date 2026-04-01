---
id: T01
parent: S02
milestone: M001
provides: []
requires: []
affects: []
key_files: ["src/styles/global.css", "src/layouts/BaseLayout.astro", "src/pages/index.astro", "package.json"]
key_decisions: ["Noto Serif SC imported at 400/700 weights only (variable not available via fontsource)", "ZH type scale offset +0.125rem from EN for CJK readability", "BaseLayout defaults lang to 'en', downstream pages pass 'zh'"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "Ran npm run build (success, 1 page in 392ms). Confirmed global.css and BaseLayout.astro exist. Confirmed index.astro references BaseLayout via grep."
completed_at: 2026-04-01T00:07:16.052Z
blocker_discovered: false
---

# T01: Installed Lora/Inter/Noto Serif SC via fontsource, created global.css with full Gathered Warmth design tokens, and built BaseLayout.astro wrapping index.astro

> Installed Lora/Inter/Noto Serif SC via fontsource, created global.css with full Gathered Warmth design tokens, and built BaseLayout.astro wrapping index.astro

## What Happened
---
id: T01
parent: S02
milestone: M001
key_files:
  - src/styles/global.css
  - src/layouts/BaseLayout.astro
  - src/pages/index.astro
  - package.json
key_decisions:
  - Noto Serif SC imported at 400/700 weights only (variable not available via fontsource)
  - ZH type scale offset +0.125rem from EN for CJK readability
  - BaseLayout defaults lang to 'en', downstream pages pass 'zh'
duration: ""
verification_result: passed
completed_at: 2026-04-01T00:07:16.054Z
blocker_discovered: false
---

# T01: Installed Lora/Inter/Noto Serif SC via fontsource, created global.css with full Gathered Warmth design tokens, and built BaseLayout.astro wrapping index.astro

**Installed Lora/Inter/Noto Serif SC via fontsource, created global.css with full Gathered Warmth design tokens, and built BaseLayout.astro wrapping index.astro**

## What Happened

Installed three fontsource packages for self-hosted fonts. Created src/styles/global.css with CSS custom properties for the D007 Gathered Warmth palette (5 colors), 10-step spacing scale, modular EN and ZH type scales, line-height tokens, font family stacks, and a minimal CSS reset with :lang(zh) CJK support. Created src/layouts/BaseLayout.astro with typed Props (title, description, lang) that imports global.css and wraps content via slot. Migrated index.astro to use BaseLayout.

## Verification

Ran npm run build (success, 1 page in 392ms). Confirmed global.css and BaseLayout.astro exist. Confirmed index.astro references BaseLayout via grep.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 2500ms |
| 2 | `test -f src/styles/global.css` | 0 | ✅ pass | 50ms |
| 3 | `test -f src/layouts/BaseLayout.astro` | 0 | ✅ pass | 50ms |
| 4 | `grep -q 'BaseLayout' src/pages/index.astro` | 0 | ✅ pass | 50ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/styles/global.css`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `package.json`


## Deviations
None.

## Known Issues
None.
