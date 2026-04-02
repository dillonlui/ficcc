# S03: Responsive & E2E Testing — UAT

**Milestone:** M004
**Written:** 2026-04-02T17:02:26.357Z

# S03: Responsive & E2E Testing — UAT

**Milestone:** M004
**Written:** 2026-04-02

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: All tests run against the static build output — no live CMS or runtime services needed. Test results are deterministic.

## Preconditions

- `npm run build` completes successfully (static output in `dist/client/`)
- Chromium browser installed (`npx playwright install chromium`)

## Smoke Test

Run `npm run test:e2e` — expect 100 passed, 20 skipped, 0 failed.

## Test Cases

### 1. All critical pages load without errors

1. Run `npx playwright test e2e/smoke.spec.ts --reporter=list`
2. **Expected:** 40 tests pass (10 pages × 4 viewports). Each page returns 200, has h1 or main, zero console errors.

### 2. Responsive layout — mobile hamburger nav

1. Run `npx playwright test e2e/responsive.spec.ts --project=mobile --reporter=list`
2. **Expected:** Hamburger button visible, desktop nav links hidden, no horizontal overflow on /, /about/, /sermons/.

### 3. Responsive layout — desktop nav

1. Run `npx playwright test e2e/responsive.spec.ts --project=desktop --reporter=list`
2. **Expected:** Desktop nav links visible, hamburger hidden.

### 4. Responsive layout — wide viewport containment

1. Run `npx playwright test e2e/responsive.spec.ts --project=wide --reporter=list`
2. **Expected:** Page content doesn't stretch beyond max-width, no horizontal overflow.

### 5. Bilingual — Chinese content loads

1. Run `npx playwright test e2e/bilingual.spec.ts --reporter=list`
2. **Expected:** /zh/ has Chinese characters in heading. /zh/contact/ has WeChat content. Language toggle links point to correct alternate URLs. hreflang tags present on EN home page.

### 6. CI workflow structure

1. Review `.github/workflows/playwright.yml`
2. **Expected:** Triggers on pull_request to main. Steps: checkout, Node 20, npm ci, chromium install, build, test, upload artifact (always).

## Edge Cases

### No horizontal overflow at any viewport

1. Resize browser to each breakpoint (375, 768, 1280, 1920)
2. Navigate to /, /about/, /sermons/
3. **Expected:** `scrollWidth <= clientWidth` at all sizes — no horizontal scrollbar appears.

### Viewport-specific test skipping

1. Run `npx playwright test e2e/responsive.spec.ts --reporter=list`
2. **Expected:** Mobile-specific tests (hamburger) skip on desktop/wide projects. Desktop-specific tests skip on mobile. 20 total skips.

## Failure Signals

- Any test failure in `npx playwright test` output
- `playwright-report/` contains failure screenshots and traces (on CI, uploaded as artifact)
- Console errors detected in smoke tests indicate broken JS on a page

## Not Proven By This UAT

- Cross-browser compatibility (only chromium tested)
- Actual CI execution in GitHub Actions (workflow validated locally only)
- Visual regression (no screenshot comparison baseline)
- Performance under load (tests run sequentially against static server)

## Notes for Tester

- The 20 skipped tests are intentional — viewport-aware assertions that don't apply to all 4 viewports.
- If tests fail with "port 4321 already in use", kill any existing serve process first.
- The `reuseExistingServer: !CI` config means local runs reuse an already-running server if present.
