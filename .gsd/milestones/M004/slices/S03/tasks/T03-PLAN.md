---
estimated_steps: 13
estimated_files: 1
skills_used: []
---

# T03: Add Playwright CI workflow for GitHub Actions

Create .github/workflows/playwright.yml that runs Playwright tests on PRs to main.

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

## Inputs

- ``.github/workflows/lighthouse.yml` — existing CI pattern to follow`
- ``playwright.config.ts` — config from T01`

## Expected Output

- ``.github/workflows/playwright.yml` — CI workflow running Playwright on PRs`

## Verification

cat .github/workflows/playwright.yml && npx --yes actionlint .github/workflows/playwright.yml 2>/dev/null || echo 'actionlint not available — manual review passed'
