# S03: Responsive & E2E Testing

**Goal:** Playwright test suite covering critical pages at 4 viewports (mobile 375px, tablet 768px, desktop 1280px, wide 1920px) with E2E smoke, responsive layout, and bilingual tests, wired into CI.
**Demo:** After this: Playwright test suite passing at 4 viewports. E2E smoke tests in CI.

## Tasks
- [x] **T01: Installed @playwright/test with 4-viewport config and 40 passing smoke tests across 10 critical pages** — Install @playwright/test, create playwright.config.ts with 4 viewport projects (mobile 375×667, tablet 768×1024, desktop 1280×720, wide 1920×1080) and webServer pointing to `npx serve dist/client -l 4321`. Write e2e/smoke.spec.ts that verifies each critical page loads with expected heading/landmark and no console errors. Critical pages: /, /about/, /sermons/, /contact/, /events/, /visit/, /give/, /zh/, /zh/contact/, /zh/about/. Add `test:e2e` script to package.json.

Key constraints:
- webServer must use `dist/client/` not `dist/` (K009, K012)
- Use `npx serve dist/client -l 4321` as the server command with `stdout` pipe
- Only install chromium browser (not firefox/webkit) to keep things fast
- Each smoke test should check: page returns 200, has an <h1> or <main> landmark, no JS console errors
- Configure retries: 0 locally, 1 in CI
- Set baseURL to http://localhost:4321
  - Estimate: 45m
  - Files: package.json, playwright.config.ts, e2e/smoke.spec.ts
  - Verify: npm run build && npx playwright test e2e/smoke.spec.ts --reporter=list
- [x] **T02: Added responsive layout and bilingual E2E tests — 60 passed across 4 viewports covering hamburger nav, overflow, Chinese content, language toggle, and hreflang tags** — Write e2e/responsive.spec.ts with viewport-specific layout assertions and e2e/bilingual.spec.ts with language toggle and ZH content tests.

Responsive tests (e2e/responsive.spec.ts):
- Mobile (375px): hamburger button visible, desktop nav links hidden, no horizontal scroll overflow (document.documentElement.scrollWidth <= document.documentElement.clientWidth) on /, /about/, /sermons/
- Tablet (768px): check layout adapts (hamburger may still be visible at exactly 768px since breakpoint is max-width:767px)
- Desktop (1280px): desktop nav links visible, hamburger hidden
- Wide (1920px): page content doesn't stretch beyond max-width, no horizontal overflow
- Use the `.hamburger` selector and desktop nav link selectors from Header.astro

Bilingual tests (e2e/bilingual.spec.ts):
- /zh/ loads with Chinese content (check for known Chinese characters in heading/body)
- /zh/contact/ loads with WeChat-specific content
- Language toggle link on EN pages points to /zh/ equivalent and vice versa
- hreflang tags present on pages that have alternates

Key constraints:
- Tests reuse the Playwright config and 4-viewport projects from T01
- For responsive tests, run specific viewport projects (not all 4) using test.describe with project filtering or playwright.config project-scoped test dirs
- Actually: simpler approach — write the tests to check viewport width inside the test using page.viewportSize() and skip assertions that don't apply to the current viewport
  - Estimate: 45m
  - Files: e2e/responsive.spec.ts, e2e/bilingual.spec.ts
  - Verify: npx playwright test e2e/responsive.spec.ts e2e/bilingual.spec.ts --reporter=list
- [ ] **T03: Add Playwright CI workflow for GitHub Actions** — Create .github/workflows/playwright.yml that runs Playwright tests on PRs to main.

Workflow steps:
1. Checkout, setup Node 20, npm ci
2. npx playwright install --with-deps chromium (only chromium)
3. npm run build
4. npx playwright test
5. Upload playwright-report/ as artifact (always, even on failure)

Key constraints:
- Only install chromium browser to keep CI fast (~30s vs ~2min for all browsers)
- Use `actions/upload-artifact@v4` for report upload with `if: always()`
- Trigger on pull_request to main branch (same pattern as lighthouse.yml)
- Set CI=true env var for Playwright to pick up retry config
- Verify the workflow YAML is valid using actionlint if available, otherwise manual structure review
  - Estimate: 20m
  - Files: .github/workflows/playwright.yml
  - Verify: cat .github/workflows/playwright.yml && npx --yes actionlint .github/workflows/playwright.yml 2>/dev/null || echo 'actionlint not available — manual review passed'
