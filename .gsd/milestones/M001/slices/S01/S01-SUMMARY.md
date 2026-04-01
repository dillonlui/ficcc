---
id: S01
parent: M001
milestone: M001
provides:
  - Working Astro scaffold on Vercel
  - CI/CD pipeline (push to deploy)
  - Security headers baseline
  - Lighthouse CI quality gate
requires:
  []
affects:
  - S02
  - S04
  - S05
key_files:
  - package.json
  - astro.config.mjs
  - vercel.json
  - lighthouserc.cjs
  - README.md
  - .env.example
key_decisions:
  - Astro i18n with prefixDefaultLocale: false (EN at /, ZH at /zh/)
  - CSP tailored for YouTube, Sanity CDN, Turnstile, PayPal, Google Fonts
  - Lighthouse CI thresholds: perf >= 90, a11y >= 95, SEO >= 95, best-practices >= 90
  - Public GitHub repo per G8 template goal
patterns_established:
  - Monorepo structure: src/ for Astro, studio/ for Sanity
  - Path aliases: @components, @layouts, @lib, @styles
  - Security headers in vercel.json applied globally
  - Lighthouse CI as quality gate
observability_surfaces:
  - Vercel auto-deploy on push to main
  - Lighthouse CI reports via npm run lhci
  - Security headers verifiable via curl
drill_down_paths:
  - .gsd/milestones/M001/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T03-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T04-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T05-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-31T23:15:57.246Z
blocker_discovered: false
---

# S01: Project Scaffold & CI/CD Pipeline

**Astro + Sanity monorepo scaffolded, deployed to Vercel with security headers and Lighthouse CI**

## What Happened

Built the complete project scaffold from scratch: Astro 5 monorepo with TypeScript strict mode, Sanity Studio placeholder, i18n routing for EN/ZH, sitemap integration. Connected to personal GitHub (public repo dillonlui/ficcc) via SSH. Linked Vercel project with auto-deploy on push — ficcc.vercel.app serving the scaffold with comprehensive security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). Configured Lighthouse CI with strict thresholds matching all PRD performance targets. Documented everything in README with setup instructions.

## Verification

Build succeeds. Vercel deploys automatically. ficcc.vercel.app returns 200 with all security headers. Lighthouse CI passes all thresholds.

## Requirements Advanced

- G6 — Lighthouse CI pipeline established with >= 90 perf threshold

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Used manual Astro init instead of create-astro CLI. Lighthouse config needed .cjs extension for ESM compat.

## Known Limitations

Sanity Studio uses placeholder projectId — replaced in S04. GitHub token not set for LHCI PR annotations.

## Follow-ups

None.

## Files Created/Modified

- `package.json` — Astro + Sanity monorepo configuration
- `astro.config.mjs` — Astro config with sitemap, i18n routing (en/zh)
- `tsconfig.json` — TypeScript strict mode with path aliases
- `src/pages/index.astro` — Placeholder index page with service info
- `src/lib/sanity.ts` — Sanity client helper
- `studio/sanity.config.ts` — Sanity Studio placeholder config
- `vercel.json` — Security headers (CSP, X-Frame, HSTS, etc.)
- `lighthouserc.cjs` — Lighthouse CI thresholds
- `README.md` — Project documentation
- `.env.example` — Environment variables template
