# FICCC Website Rebuild

First Ithaca Chinese Christian Church — bilingual (EN/ZH) church website built with Astro 5, Sanity CMS, and Vercel.

## Current State

**M003: ZH Content & Bilingual Toggle — In Progress (S01–S04 complete, S05 remaining).**

M001 (Foundation & Design System) and M002 (EN Content Pages) are complete. M003 is building all Chinese Ministry pages and bilingual wiring.

M003/S01 delivered 5 ZH core pages: Homepage, About (1968-2009 timeline), Beliefs (EFCA 11-point), Staff, and Sundays (7-stop bus route). Established the ZH page pattern — clone EN structure, pass lang='zh' to BaseLayout, Chinese fallback content, /zh/ internal links.

M003/S02 delivered ZH Community (7 fellowship groups) and Ministries (Sunday School, Discipleship) pages.

M003/S03 delivered 5 ZH transactional pages: Sermons listing + detail at /zh/sermons/, Events at /zh/events/, Give at /zh/give/, and Contact at /zh/contact/. Contact page is bespoke — prominent WeChat section with QR placeholder, simplified 3-field form, and Chinese church info sidebar (not a clone of the EN 4-tab contact page).

M003/S04 delivered bilingual wiring: `getAlternateUrl` utility in `src/lib/navigation.ts` computes the counterpart URL for any page, handling asymmetric routes (`/visit` ↔ `/zh/sundays`), trailing-slash normalization, and fallback to homepage for EN-only pages. BaseLayout threads the computed URL to Header (toggle href) and SEO (hreflang en/zh/x-default tags). A `lang-pref` cookie is set on toggle click. 20 Vitest unit tests cover all cases.

Remaining: S05 (CM Content Migration).

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

## Queued Milestones

- **M002**: EN Content Pages — build all English pages with real Sanity content
- **M003**: ZH Content & Bilingual Toggle — Chinese ministry pages, language switching
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
