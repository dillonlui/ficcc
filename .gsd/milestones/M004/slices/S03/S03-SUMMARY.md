---
id: S03
parent: M004
milestone: M004
provides:
  - Playwright test suite and CI workflow for E2E regression testing
  - test:e2e npm script for local test runs
requires:
  []
affects:
  - S06
key_files:
  - playwright.config.ts
  - e2e/smoke.spec.ts
  - e2e/responsive.spec.ts
  - e2e/bilingual.spec.ts
  - .github/workflows/playwright.yml
  - package.json
key_decisions:
  - Used domcontentloaded waitUntil instead of networkidle for faster static site tests
  - Used viewport-aware test.skip with page.viewportSize() for responsive test gating
  - Chromium-only install in CI to minimize setup time (~30s vs ~2min)
  - Checked is-open class instead of toBeVisible for off-screen nav panel
patterns_established:
  - Parameterized Playwright smoke tests with page array for easy addition of new pages
  - Viewport-aware test.skip pattern for responsive assertions across 4 viewport projects
  - CI workflow pattern: build → test → upload artifact (always) matching lighthouse.yml structure
observability_surfaces:
  - playwright-report/ artifact uploaded on every CI run (pass or fail)
drill_down_paths:
  - .gsd/milestones/M004/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M004/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M004/slices/S03/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-02T17:02:26.357Z
blocker_discovered: false
---

# S03: Responsive & E2E Testing

**Playwright E2E suite with 100 tests across 4 viewports covering smoke, responsive layout, and bilingual content, plus CI workflow for PRs**

## What Happened

Built a complete Playwright E2E testing infrastructure in three tasks. T01 installed @playwright/test with a 4-viewport config (mobile 375px, tablet 768px, desktop 1280px, wide 1920px) and wrote parameterized smoke tests for all 10 critical pages — each checking HTTP 200, h1/main landmark presence, and zero JS console errors. Used `domcontentloaded` waitUntil instead of `networkidle` for faster static site tests, and `npx serve dist/client -l 4321` as the webServer (matching K009/K012 patterns).

T02 added responsive layout tests (horizontal overflow detection, hamburger toggle, desktop nav visibility, wide-viewport containment) and bilingual tests (Chinese content verification, WeChat section, language toggle hrefs, hreflang tags). Used viewport-aware `test.skip` with `page.viewportSize()` to gate assertions to relevant viewport sizes — this produces 20 intentional skips. One deviation: switched nav visibility check from `toBeVisible` to `is-open` class check because Playwright doesn't detect `translateX` off-screen elements as hidden.

T03 created `.github/workflows/playwright.yml` triggered on PRs to main, installing only chromium (not firefox/webkit) to keep CI fast (~30s setup vs ~2min). The workflow builds the site, runs all Playwright tests, and uploads `playwright-report/` as an artifact regardless of outcome.

## Verification

Full Playwright suite ran against fresh build: 100 passed, 20 skipped (viewport-gated), 0 failed in 5.3s. Smoke tests cover all 10 critical pages × 4 viewports (40 tests). Responsive tests verify hamburger, nav, overflow, and containment. Bilingual tests verify Chinese content, language toggle, and hreflang tags. CI workflow YAML validated via manual review (actionlint not available locally).

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

T02 changed nav visibility test from toBeVisible to is-open class check — Playwright doesn't detect translateX off-screen elements as hidden.

## Known Limitations

CI workflow not yet tested in actual GitHub Actions environment — validated locally and via YAML structure review only. Only chromium browser is tested (no firefox/webkit cross-browser coverage).

## Follow-ups

None.

## Files Created/Modified

- `playwright.config.ts` — Playwright config with 4 viewport projects and webServer pointing to npx serve dist/client
- `e2e/smoke.spec.ts` — Parameterized smoke tests for 10 critical pages × 4 viewports
- `e2e/responsive.spec.ts` — Viewport-aware responsive layout tests (hamburger, nav, overflow, containment)
- `e2e/bilingual.spec.ts` — Bilingual tests (Chinese content, language toggle, hreflang tags)
- `.github/workflows/playwright.yml` — CI workflow running Playwright on PRs to main with chromium-only install
- `package.json` — Added @playwright/test dependency and test:e2e script
