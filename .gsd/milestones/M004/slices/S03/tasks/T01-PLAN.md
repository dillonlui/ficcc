---
estimated_steps: 8
estimated_files: 3
skills_used: []
---

# T01: Install Playwright, configure 4 viewports, and write smoke tests

Install @playwright/test, create playwright.config.ts with 4 viewport projects (mobile 375×667, tablet 768×1024, desktop 1280×720, wide 1920×1080) and webServer pointing to `npx serve dist/client -l 4321`. Write e2e/smoke.spec.ts that verifies each critical page loads with expected heading/landmark and no console errors. Critical pages: /, /about/, /sermons/, /contact/, /events/, /visit/, /give/, /zh/, /zh/contact/, /zh/about/. Add `test:e2e` script to package.json.

Key constraints:
- webServer must use `dist/client/` not `dist/` (K009, K012)
- Use `npx serve dist/client -l 4321` as the server command with `stdout` pipe
- Only install chromium browser (not firefox/webkit) to keep things fast
- Each smoke test should check: page returns 200, has an <h1> or <main> landmark, no JS console errors
- Configure retries: 0 locally, 1 in CI
- Set baseURL to http://localhost:4321

## Inputs

- ``package.json` — existing scripts and dependencies`
- ``src/pages/` — page routes to derive test URLs`

## Expected Output

- ``playwright.config.ts` — Playwright config with 4 viewport projects and webServer`
- ``e2e/smoke.spec.ts` — smoke tests for 10 critical pages`
- ``package.json` — updated with @playwright/test devDep and test:e2e script`

## Verification

npm run build && npx playwright test e2e/smoke.spec.ts --reporter=list
