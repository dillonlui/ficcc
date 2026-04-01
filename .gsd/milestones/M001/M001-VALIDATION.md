---
verdict: needs-remediation
remediation_round: 0
---

# Milestone Validation: M001

## Success Criteria Checklist
### Success Criteria Checklist

- [x] **SC1: Astro + Sanity monorepo deploys to Vercel with preview URLs on every PR** — PARTIAL. Monorepo deploys to Vercel on push to main (S01 confirmed). However, no GitHub Actions workflow exists for PR preview deploys — Vercel auto-deploys handle previews but Lighthouse CI is not wired into the PR pipeline.
- [x] **SC2: Design tokens implemented with CJK font loading solved under 100KB** — PARTIAL. Design tokens fully implemented (S02). CJK font loading uses async split pattern, but S02 summary explicitly states "240KB CJK font CSS" — exceeds the 100KB target. Mitigation is async loading so it's non-render-blocking, but the byte target is not met.
- [x] **SC3: All base components render at 375px, 768px, and 1280px** — PASS. S03 summary confirms all 8 components built with responsive breakpoints. ImageMosaic has 3/2/1-column layout. Header has mobile hamburger at <768px. Lighthouse a11y ≥ 0.95.
- [x] **SC4: Sanity Studio deployed with all document types and singletons** — PASS. S04 confirms 12 schema types registered, Studio accessible at /admin, structure builder configured with singleton grouping.
- [x] **SC5: Form endpoint works end-to-end: Turnstile → Resend email** — PASS. S05 confirms api/contact.ts with Turnstile verification and Resend delivery. Env vars needed for production but infrastructure is complete.
- [x] **SC6: Sanity preview mode shows draft content on live site** — PASS (infrastructure). S06 confirms loadQuery with previewDrafts perspective, VisualEditing overlay, presentationTool. Wiring complete but not exercised by content pages yet (expected — content pages are future milestones).
- [ ] **SC7: SEO infrastructure: sitemap.xml, robots.txt, meta/OG component, JSON-LD helpers** — PARTIAL FAIL. sitemap.xml and robots.txt confirmed (S05). **No meta/OG component exists.** **No JSON-LD helpers exist.** These were never built in any slice.
- [x] **SC8: Security headers configured** — PASS. S01 established CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy. S05 added HSTS. S02 tightened font-src. Comprehensive header set verified.
- [ ] **SC9: Lighthouse CI runs on every preview deploy** — FAIL. Lighthouse CI runs locally via `npm run lhci` but no GitHub Actions workflow exists to run it on PR preview deploys. This is a CI pipeline gap.
- [ ] **SC10: 404 page and empty state patterns implemented** — FAIL. No 404.astro page exists. No empty state patterns were implemented. These were never addressed in any slice.

## Slice Delivery Audit
### Slice Delivery Audit

| Slice | Claimed Deliverable | Delivered? | Evidence |
|-------|-------------------|------------|----------|
| S01 | Astro + Sanity monorepo deploys to Vercel with preview URLs on PRs | ✅ Mostly | ficcc.vercel.app deploys, security headers present, LHCI passes. No PR-specific CI pipeline. |
| S02 | /styleguide page showing full color palette, EN + ZH type scale, spacing scale | ✅ Yes | /styleguide built with all token sections. Fonts self-hosted. LHCI passes. |
| S03 | All components on /styleguide — Header, Footer, Hero, Cards, Accordion, Forms, ImageMosaic, AudioPlayer | ✅ Yes | All 8 components built, showcased on /styleguide, a11y ≥ 0.95. |
| S04 | Sanity Studio with all document types. Sample content created and queryable. | ✅ Yes | 12 schema types, Studio at /admin, typed GROQ helpers. |
| S05 | Form submission delivers email. sitemap.xml, robots.txt, security headers verified. | ✅ Yes | api/contact.ts with Turnstile+Resend. robots.txt, sitemap, HSTS confirmed. |
| S06 | Editor creates draft in Sanity, clicks Preview, sees draft rendered on live site. Publish triggers redeploy. | ✅ Infrastructure | loadQuery, VisualEditing, presentationTool all wired. Not exercised by content pages yet (expected). Deploy hook documented but not configured. |

## Cross-Slice Integration
### Cross-Slice Integration

- **S01 → S02**: S02 correctly consumed the Astro scaffold and LHCI config from S01. Extended lighthouserc.cjs with assertMatrix.
- **S02 → S03**: S03 correctly consumed design tokens from S02. All components use CSS custom properties only — no hardcoded values. S03 added tokens (--color-focus, --max-width, --color-bg-dark) to global.css.
- **S01 → S04**: S04 correctly consumed the project scaffold. Sanity Studio wired at /admin with React island pattern.
- **S01 → S05**: S05 correctly consumed the deployment config. Added HSTS to vercel.json, created api/contact.ts as Vercel Edge function.
- **S04 + S05 → S06**: S06 correctly consumed Sanity schema from S04 and deployment infrastructure from S05. Added Vercel adapter, loadQuery, VisualEditing, presentationTool.
- **Gap**: No slice produced meta/OG components, JSON-LD helpers, 404 page, or empty state patterns — these success criteria items were not mapped to any slice in the roadmap.

## Requirement Coverage
### Requirement Coverage

The milestone references requirements G3 (CMS maintainability), G4 (bespoke visual identity), G6 (Lighthouse targets), G8 (reusable template foundation).

- **G3**: Addressed by S04 (Sanity schema, Studio, typed queries) and S06 (preview mode). CMS is maintainable with singleton patterns and structured document types.
- **G4**: Addressed by S02 (Gathered Warmth design tokens) and S03 (component library). Visual identity is bespoke with custom palette, CJK typography, and purpose-built components.
- **G6**: Partially addressed. Lighthouse CI thresholds are configured (S01/S02) and pass locally, but the original ≥ 90 perf target was lowered to ≥ 75 for production pages due to CJK font weight. LHCI is not wired into CI/CD pipeline for automated PR checks.
- **G8**: Addressed by S01 (scaffold), S02 (tokens), S03 (components). Foundation is reusable.

No formal requirements table exists in the DB — coverage is assessed against the milestone's stated requirement_coverage field.

## Verdict Rationale
Three success criteria have material gaps: (1) SC7 — meta/OG component and JSON-LD helpers were never built, (2) SC10 — 404 page and empty state patterns were never built, (3) SC9 — Lighthouse CI has no GitHub Actions workflow for PR deploys. These are deliverables explicitly listed in the milestone's success criteria that were not mapped to any slice. A remediation slice is needed to close these gaps before the milestone can be completed.

## Remediation Plan
Add one remediation slice (S07) covering the three undelivered success criteria:

1. **404 page** — Create src/pages/404.astro with proper design using existing components and tokens
2. **Meta/OG component** — Create a reusable SEO component for meta tags, Open Graph, and Twitter Card markup
3. **JSON-LD helpers** — Create JSON-LD structured data helpers (Organization, Church, BreadcrumbList)
4. **Empty state patterns** — Create reusable empty state component for pages with no content
5. **GitHub Actions LHCI workflow** — Create .github/workflows/lighthouse.yml to run LHCI on PR preview deploys

Estimated effort: 1 slice, 2-3 tasks.
