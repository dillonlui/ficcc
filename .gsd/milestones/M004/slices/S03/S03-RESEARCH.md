# S03 — Responsive & E2E Testing — Research

**Date:** 2026-03-31

## Summary

S03 adds Playwright-based E2E and responsive testing to a site that currently has zero browser tests. The project has Vitest for unit tests (2 test files) and Lighthouse CI in GitHub Actions, but no Playwright. The success criteria is specific: Playwright test suite passing at 4 viewports with E2E smoke tests in CI.

The site is static (Astro + Vercel adapter, output to `dist/client/`), bilingual (EN + ZH), and has ~28 page routes. Media queries are ad-hoc (`max-width: 767px` is the common breakpoint). The existing `npx serve dist/client -l 4321` pattern from LHCI (K012) is the right approach for serving the built site during Playwright tests too.

## Recommendation

Install `@playwright/test`, configure 4 viewports (mobile 375px, tablet 768px, desktop 1280px, wide 1920px), and write smoke tests that cover the critical pages at each viewport. Use a single CI workflow that builds once and runs Playwright against the static output. Keep tests focused on layout correctness (nav visible/collapsed, grid columns, no horizontal overflow) rather than pixel-perfect screenshots — the site doesn't have stable visual baselines yet.

## Implementation Landscape

### Key Files

- `playwright.config.ts` — New. Configures projects for 4 viewports, webServer pointing to `npx serve dist/client -l 4321`, baseURL `http://localhost:4321`.
- `e2e/smoke.spec.ts` — New. Smoke tests: each critical page loads, has expected heading/landmark, no console errors. Runs at all 4 viewports via Playwright projects.
- `e2e/responsive.spec.ts` — New. Responsive-specific assertions: mobile nav hamburger visible/desktop nav links visible, grid layouts collapse correctly, no horizontal scroll overflow at any viewport.
- `e2e/bilingual.spec.ts` — New. Language toggle works, ZH pages load with Chinese content, hreflang tags present.
- `.github/workflows/playwright.yml` — New. CI workflow: checkout, install, build, run Playwright, upload report artifact.
- `package.json` — Add `@playwright/test` devDep, add `test:e2e` script.

### Pages to Cover in Smoke Tests

Critical EN pages (highest traffic/complexity):
- `/` (home — hero, pillars, service times)
- `/about/` (timeline, staff grid)
- `/sermons/` (sermon cards, audio player)
- `/contact/` (tabbed form)
- `/events/` (event cards)
- `/visit/` (map, ride request form)
- `/give/` (giving info)

Critical ZH pages:
- `/zh/` (Chinese home)
- `/zh/contact/` (bespoke WeChat-first layout per K011)
- `/zh/about/` (extended timeline)

### Build Order

1. **Playwright config + smoke tests first** — proves the test harness works end-to-end (install, build, serve, test). This is the riskiest part (getting webServer config right with the Vercel adapter's `dist/client/` output).
2. **Responsive viewport tests** — adds the 4-viewport matrix. Depends on smoke harness working.
3. **Bilingual tests** — language toggle, ZH content verification. Independent from responsive tests but reuses the harness.
4. **CI workflow** — wires everything into GitHub Actions. Must come last since it needs the test files to exist.

### Verification Approach

- `npx playwright test` passes locally with 0 failures
- `npx playwright test --reporter=list` shows tests running at all 4 viewport projects
- CI workflow YAML is valid (actionlint or manual review)
- `npm run test:e2e` script works as convenience alias

### 4 Viewport Sizes

| Name | Width | Rationale |
|------|-------|-----------|
| mobile | 375×667 | iPhone SE / common mobile |
| tablet | 768×1024 | iPad portrait / tablet breakpoint |
| desktop | 1280×720 | Standard laptop |
| wide | 1920×1080 | Full HD desktop |

These align with the ad-hoc `767px` breakpoint already used in components — mobile (375) is below, tablet (768) is right at the boundary, desktop/wide are above.

## Constraints

- Site is static — must build first, then serve `dist/client/` (K009, K012). Cannot test against `astro dev` because the Vercel adapter changes behavior.
- Build requires Sanity env vars or falls back to hardcoded content (K008). CI will use fallback content, which is fine for layout/responsive tests.
- Playwright CI on GitHub Actions needs `npx playwright install --with-deps` for browser binaries.

## Common Pitfalls

- **`dist/` vs `dist/client/` path** — Vercel adapter outputs to `dist/client/` not `dist/` (K009). The webServer command must use `npx serve dist/client -l 4321`.
- **Port conflicts with LHCI** — both LHCI and Playwright want port 4321. Not an issue since they run in separate CI jobs, but locally devs should not run both simultaneously. Document in the config.
- **Playwright browser install in CI** — must add `npx playwright install --with-deps chromium` step before test run. Only install chromium to keep CI fast — no need for firefox/webkit for smoke tests.
