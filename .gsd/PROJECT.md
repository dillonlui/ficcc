# FICCC Website Rebuild

First Ithaca Chinese Christian Church — bilingual (EN/ZH) church website built with Astro 5, Sanity CMS, and Vercel.

## Current State

**All milestones complete. Site is launch-ready pending DNS cutover.**

The FICCC website rebuild is feature-complete across 4 milestones. The site is deployed at ficcc.vercel.app and ready to go live at ficcc.org once DNS cutover is executed per docs/launch-runbook.md.

Infrastructure:
- Astro 5 + Sanity monorepo deployed to Vercel
- Design token system (Gathered Warmth palette) with self-hosted fonts including async CJK loading
- 12 shared UI components, 12 Sanity schema types
- 27 pages (EN + ZH) with bilingual language toggle and hreflang SEO tags
- Contact form API (Vercel Edge Runtime + Turnstile + Resend)
- Sanity Visual Editing preview mode with draft-aware loadQuery
- Sanity Studio at /admin

Quality:
- Lighthouse CI: 10 URLs × 3 runs, per-archetype thresholds (≥0.70 perf, ≥0.95 a11y)
- Playwright E2E: 100 tests across 4 viewports (mobile/tablet/desktop/wide)
- 27 unit tests (7 structured data + 20 navigation)
- axe-core WCAG accessibility auditing
- Security headers: CSP, HSTS, X-Frame-Options

SEO & Analytics:
- JSON-LD structured data on 4 page types (Church, WebSite, VideoObject, Event, Organization)
- Sitemap with hreflang alternates for en/zh
- GA4 analytics with custom event helper (gated on env var)
- Default OG image and meta tags

Search & Content Management:
- Pagefind search indexing 24 content pages with themed modal UI
- Announcement bar CMS feature (toggle + text + optional link)
- Staff documentation: 4 guides for self-service content management
- em.ficcc.org and cm.ficcc.org redirect rules configured

## Completed Milestones

- **M001**: Foundation & Design System
- **M002**: EN Content Pages
- **M003**: ZH Content & Bilingual Toggle
- **M004**: Performance, Search, Analytics & Launch

## Queued Milestones

None — all milestones complete.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Astro 5 (static + per-page SSR opt-in) |
| CMS | Sanity v5 (free tier) |
| Hosting | Vercel (edge CDN, preview deploys) |
| Styling | CSS custom properties, scoped styles |
| Fonts | Lora (variable), Inter (variable), Noto Serif SC (400/700) — self-hosted via fontsource |
| Forms | Vercel Edge Runtime + Cloudflare Turnstile + Resend |
| Analytics | GA4 (gated on PUBLIC_GA_MEASUREMENT_ID) |
| Search | Pagefind (astro-pagefind, 24 pages indexed) |

## Key URLs

- Production: ficcc.vercel.app (ficcc.org after DNS cutover)
- Sanity Studio: ficcc.vercel.app/admin
- Styleguide: ficcc.vercel.app/styleguide
- Repo: github.com/dillonlui/ficcc
