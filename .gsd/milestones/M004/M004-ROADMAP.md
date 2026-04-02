# M004: 

## Vision
Bring the site to production quality — performance, accessibility, SEO, search, analytics, testing, staff training — and execute a clean DNS cutover to launch ficcc.org as the unified home for FICCC.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Performance & Accessibility Audit | medium | — | ✅ | Lighthouse report showing >= 90 perf, >= 95 a11y on all page types. axe-core zero violations. Manual keyboard test passed. |
| S02 | SEO & Analytics | low | — | ✅ | Structured data validated. OG previews working. Analytics dashboard with custom events. Google Search Console configured. |
| S03 | Responsive & E2E Testing | low | — | ✅ | Playwright test suite passing at 4 viewports. E2E smoke tests in CI. |
| S04 | Pagefind Search Integration | low | S01 | ✅ | Search UI on site. User types query, results show sermons, pages, and ZH content. |
| S05 | Staff Documentation & Training | medium | S01 | ✅ | Staff can publish a sermon, create an event, and update the announcement bar without developer help. |
| S06 | DNS Cutover & Launch | medium | S01, S02, S03, S04, S05 | ⬜ | ficcc.org serves the new site. em.ficcc.org and cm.ficcc.org redirect correctly. SSL valid. Analytics receiving production traffic. |
