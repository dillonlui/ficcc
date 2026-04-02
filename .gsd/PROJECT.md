# FICCC Website Rebuild

First Ithaca Chinese Christian Church — bilingual (EN/ZH) church website built with Astro 5, Sanity CMS, and Vercel.

## Current State

**M003: ZH Content & Bilingual Toggle — Complete (all 5 slices delivered).**

M001 (Foundation & Design System), M002 (EN Content Pages), and M003 (ZH Content & Bilingual Toggle) are complete.

M003 delivered: 5 ZH core pages (Homepage, About, Beliefs, Staff, Sundays), ZH Community and Ministries pages, 5 ZH transactional pages (Sermons, Events, Give, Contact with bespoke WeChat layout), bilingual language toggle with hreflang SEO tags, 10 cross-domain redirects from cm.ficcc.org to /zh/ equivalents, and an idempotent Sanity migration script for 4 ZH singleton documents.

The full project scaffold is in place:
- Astro 5 + Sanity monorepo deployed to Vercel (ficcc.vercel.app)
- Design token system (Gathered Warmth palette) with self-hosted fonts including async CJK loading
- 12 shared UI components: Header, Footer, Hero, Card, ImageMosaic, Accordion, ContactForm, PrayerRequestForm, ConnectForm, RideRequestForm, AudioPlayer, MinistryCard, EventCard
- Sanity Studio at /admin with 12 schema types (5 documents, 2 singletons, 5 block types)
- Contact form API (Vercel Edge Runtime + Turnstile + Resend)
- Sanity Visual Editing preview mode with draft-aware loadQuery
- SEO infrastructure: sitemap, robots.txt, SEO.astro component (meta/OG/Twitter/JSON-LD)
- Security headers: CSP, HSTS, X-Frame-Options, etc.
- Lighthouse CI pipeline: local + GitHub Actions on PRs
- Custom 404 page with site chrome

All ZH pages follow a consistent pattern: clone EN structure, swap to getX('zh'), pass lang='zh' to BaseLayout, translate UI text, use /zh/ internal links. Header/Footer are language-aware via shared navigation config in src/lib/navigation.ts.

## Completed Milestones

- **M001**: Foundation & Design System
- **M002**: EN Content Pages
- **M003**: ZH Content & Bilingual Toggle

## Current Milestone

**M004: Performance, Search, Analytics & Launch — In Progress.**

S01 (Performance & Accessibility Audit) complete: Hero converted from CSS background-image to `<img>` with fetchpriority="high", preconnect for Sanity CDN, WebP default, skip-to-content link, id="main-content" on all 27 pages, LHCI expanded to 10 URLs with per-archetype thresholds, axe-core CLI integrated, and WCAG contrast fixes begun (--color-terracotta-dark for AA compliance).

S02 (SEO & Analytics) complete: BaseLayout forwards jsonLd/ogImage/ogType to SEO component. GA4 analytics gated on PUBLIC_GA_MEASUREMENT_ID with window.sendAnalyticsEvent() custom event helper. Google site verification meta gated on env var. Sitemap includes hreflang alternates for en/zh. JSON-LD structured data on 4 page types (Church+WebSite on homepage, VideoObject on sermons, ItemList of Events, Organization on about). 7 unit tests for structured data builders. Default OG image placeholder at 1200×630.

S03 (Responsive & E2E Testing) complete: Playwright test suite with 4 viewport presets (mobile, tablet, desktop, wide), E2E smoke tests covering navigation, responsive header behavior, sermon listing, and contact form. CI-ready configuration.

S04 (Pagefind Search Integration) complete: astro-pagefind integration indexes 24 content pages (excluding admin/styleguide/404). SearchModal.astro wraps Pagefind's Search component in a keyboard-accessible modal overlay themed with site CSS custom properties. Search trigger button in header. 3 Playwright E2E tests cover search open → query → results → close flow.

## Queued Milestones

None — M004 is the final milestone.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Astro 5 (static + per-page SSR opt-in) |
| CMS | Sanity v5 (free tier) |
| Hosting | Vercel (edge CDN, preview deploys) |
| Styling | CSS custom properties, scoped styles |
| Fonts | Lora (variable), Inter (variable), Noto Serif SC (400/700) — self-hosted via fontsource |
| Forms | Vercel Edge Runtime + Cloudflare Turnstile + Resend |
| Analytics | Vercel Web Analytics (planned M004) |
| Search | Pagefind (planned M004) |

## Key URLs

- Production: ficcc.vercel.app (ficcc.org after DNS cutover)
- Sanity Studio: ficcc.vercel.app/admin
- Styleguide: ficcc.vercel.app/styleguide
- Repo: github.com/dillonlui/ficcc
