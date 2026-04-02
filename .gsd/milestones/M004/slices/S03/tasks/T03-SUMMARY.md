---
id: T03
parent: S03
milestone: M004
provides: []
requires: []
affects: []
key_files: [".github/workflows/playwright.yml"]
key_decisions: ["Chromium-only install in CI to minimize setup time (~30s vs ~2min for all browsers)"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "Confirmed YAML structure via cat, actionlint not available locally so manual review passed. Full Playwright suite ran: 100 passed, 20 skipped, 5.3s."
completed_at: 2026-04-02T17:00:56.030Z
blocker_discovered: false
---

# T03: Created .github/workflows/playwright.yml running Playwright E2E tests on PRs to main with chromium-only install and report artifact upload

> Created .github/workflows/playwright.yml running Playwright E2E tests on PRs to main with chromium-only install and report artifact upload

## What Happened
---
id: T03
parent: S03
milestone: M004
key_files:
  - .github/workflows/playwright.yml
key_decisions:
  - Chromium-only install in CI to minimize setup time (~30s vs ~2min for all browsers)
duration: ""
verification_result: mixed
completed_at: 2026-04-02T17:00:56.030Z
blocker_discovered: false
---

# T03: Created .github/workflows/playwright.yml running Playwright E2E tests on PRs to main with chromium-only install and report artifact upload

**Created .github/workflows/playwright.yml running Playwright E2E tests on PRs to main with chromium-only install and report artifact upload**

## What Happened

Created the CI workflow following the existing lighthouse.yml pattern. The workflow triggers on pull_request to main, sets up Node 20 with npm cache, installs only chromium (with system deps), builds the site, runs the full Playwright test suite, and uploads playwright-report/ as an artifact regardless of test outcome. CI=true env var is set at job level so Playwright picks up retry and worker config from playwright.config.ts.

## Verification

Confirmed YAML structure via cat, actionlint not available locally so manual review passed. Full Playwright suite ran: 100 passed, 20 skipped, 5.3s.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `cat .github/workflows/playwright.yml` | 0 | ✅ pass | 100ms |
| 2 | `npx --yes actionlint .github/workflows/playwright.yml` | 1 | ⚠️ not installed — manual review | 500ms |
| 3 | `npx playwright test` | 0 | ✅ pass | 6100ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `.github/workflows/playwright.yml`


## Deviations
None.

## Known Issues
None.
