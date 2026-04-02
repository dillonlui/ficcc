---
estimated_steps: 16
estimated_files: 2
skills_used: []
---

# T02: Add responsive layout and bilingual E2E tests

Write e2e/responsive.spec.ts with viewport-specific layout assertions and e2e/bilingual.spec.ts with language toggle and ZH content tests.

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

## Inputs

- ``playwright.config.ts` — 4 viewport projects from T01`
- ``e2e/smoke.spec.ts` — patterns established in T01`
- ``src/components/Header.astro` — hamburger and nav selectors`
- ``src/lib/navigation.ts` — bilingual URL mapping logic`

## Expected Output

- ``e2e/responsive.spec.ts` — responsive layout assertions across viewports`
- ``e2e/bilingual.spec.ts` — bilingual content and language toggle tests`

## Verification

npx playwright test e2e/responsive.spec.ts e2e/bilingual.spec.ts --reporter=list
