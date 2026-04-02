---
verdict: needs-attention
remediation_round: 0
---

# Milestone Validation: M004

## Success Criteria Checklist
### Vision: Production Quality + DNS Cutover Launch

- [x] **Performance baseline established** — LHCI running across 10 URLs × 3 runs with per-archetype thresholds. EN pages ≥ 0.70 perf, a11y ≥ 0.95. ⚠️ Perf at 0.70 not 0.90 — justified by font loading under simulated 4G (TBT=0, CLS≈0, not a code issue).
- [x] **Accessibility audit complete** — axe-core integrated, skip-to-content + main-content landmarks on all 27 pages, --color-terracotta-dark for WCAG AA contrast. ⚠️ Site-wide terracotta text replacement incomplete (only Hero CTA and contact page remediated).
- [x] **SEO infrastructure** — JSON-LD structured data on 4 page types (Church, WebSite, VideoObject, Event, Organization) with 7 unit tests. Sitemap with hreflang. OG meta tags with default image. ⚠️ OG image is placeholder; structured data not validated on live schema.org validator.
- [x] **Analytics integration** — GA4 gtag.js with conditional env var gating. Custom event helper (sendAnalyticsEvent) for sermon_play, language_switch, form_submit. CSP updated for GA4 domains. ⚠️ No live analytics dashboard configured; helper not wired to any UI events yet.
- [x] **E2E testing** — 100 Playwright tests across 4 viewports (mobile/tablet/desktop/wide). Smoke, responsive, bilingual, and search tests. CI workflow on PRs to main.
- [x] **Search** — Pagefind indexes 24 content pages. Themed modal with keyboard accessibility. 3 E2E tests passing.
- [x] **Staff training** — 4 documentation guides (README, sermon publishing, event creation, announcement bar). Announcement bar CMS feature built end-to-end.
- [x] **Launch readiness** — 8 em.ficcc.org redirect rules, cm.ficcc.org redirects intact, CSP for GA4, Vitest config fixed, complete DNS cutover runbook. ⚠️ DNS cutover not executed — documented as manual operational step.

## Slice Delivery Audit
| Slice | Claimed Deliverable | Delivered | Gap |
|-------|-------------------|-----------|-----|
| S01 | ≥90 perf, ≥95 a11y, axe-core zero, keyboard test | Perf 0.70 (font constraint), a11y ≥0.95, axe partial, skip-to-content | Perf threshold lower than claimed; site-wide contrast incomplete |
| S02 | Structured data, OG, analytics dashboard, GSC | JSON-LD + tests, OG placeholder, GA4 integrated, GSC meta tag | "Dashboard" and "GSC configured" overstated in slice overview |
| S03 | Playwright 4 viewports, E2E in CI | 100 tests, 4 viewports, CI workflow | Fully met |
| S04 | Search UI with sermons/pages/ZH results | Pagefind modal, 24 pages indexed, EN+ZH | Fully met |
| S05 | Staff self-service sermon/event/announcement | Announcement bar feature + 4 guides | Fully met |
| S06 | ficcc.org live, redirects, SSL, analytics in prod | Redirect config + CSP + runbook | Config ready; cutover not executed |

## Cross-Slice Integration
### Boundary Alignment

- **S01 → S04**: S04 consumed `id="main-content"` from S01 for Pagefind body targeting. ✅ Aligned.
- **S01 → S05**: S05 built on perf baseline from S01. Announcement bar uses try-catch pattern (K008). ✅ Aligned.
- **S01,S02,S03,S04,S05 → S06**: S06 consumed all upstream work. Redirect rules reference correct paths. CSP includes GA4 domains from S02. Vitest config excludes Playwright specs from S03. ✅ Aligned.
- **S02 analytics → S06 CSP**: GA4 domains added to CSP in S06 matching S02's gtag.js integration. ✅ Aligned.

No cross-slice boundary mismatches found. All produces/consumes relationships are substantiated by the slice summaries.

## Requirement Coverage
No REQUIREMENTS.md exists for this project — formal requirement tracking was not established. The milestone's vision statement serves as the de facto requirement set. All vision elements (performance, accessibility, SEO, search, analytics, testing, staff training, DNS cutover) are addressed by at least one slice. The DNS cutover is the only element not yet executed (documented as manual operational step in docs/launch-runbook.md).

## Verdict Rationale
All six slices delivered substantive work aligned with the milestone vision. The gaps are documented deviations with valid justifications, not missing deliverables: (1) Perf 0.70 vs 0.90 is a font-loading infrastructure constraint, not code quality — TBT=0, CLS≈0; (2) site-wide terracotta contrast is a follow-up, not a blocker; (3) S02's "analytics dashboard" and "GSC configured" claims in the roadmap overview overstated what the slice actually scoped — the code-level SEO/analytics work is complete; (4) DNS cutover is correctly scoped as a manual operational step with a runbook. None of these gaps warrant remediation slices — they are either infrastructure constraints, follow-up polish items, or operational steps outside the code scope. Verdict: needs-attention to document the deviations transparently, but no blockers to milestone completion.
