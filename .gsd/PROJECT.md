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

## Queued Milestones

- **M004**: Performance, Search, Analytics & Launch — Pagefind, Vercel Analytics, DNS cutover

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
