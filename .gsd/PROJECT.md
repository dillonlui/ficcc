# FICCC Website Rebuild

First Ithaca Chinese Christian Church — bilingual (EN/ZH) church website built with Astro 5, Sanity CMS, and Vercel.

## Current State

**M003: ZH Content & Bilingual Toggle — In Progress (S01 complete).**

M001 (Foundation & Design System) and M002 (EN Content Pages) are complete. M003 is building all Chinese Ministry pages and bilingual wiring.

S01 (Homepage) delivered the full homepage with hero, service times, photo mosaic, pillars, featured content, and next-steps sections — all CMS-editable via a homePage Sanity singleton with hardcoded fallbacks.

S02 (About / Beliefs / Staff) delivered three identity pages: Who We Are with two-column layout, Beliefs with an 8-item accordion, and Staff with a responsive 1/2/3-column card grid. Added aboutPage Sanity singleton, portableTextToHtml() server-side utility, and enhanced Accordion to render HTML content.

S03 (Sundays / Plan a Visit) delivered /visit with CMS-editable hero, Sunday schedule cards, what-to-expect, transportation with embedded Google Maps, 6-question FAQ accordion, and ride request form with Turnstile captcha. Added visitPage Sanity singleton and RideRequestForm component.

S04 (Sermons Library) delivered /sermons listing with series-based pill filter and /sermons/[slug] detail pages with metadata grid and conditional YouTube embed. Added slug field to sermon schema, getSermonBySlug() GROQ helper, SermonCard and YouTubeEmbed reusable components. All filtering is pure inline script — no client:* directives.

S05 (Community & Ministries) delivered /ministries hub with responsive card grid and /ministries/[slug] detail pages with leader info, meeting time, and portable text description. Added slug/image fields to ministry schema, MinistryDetail interface with resolved leader, getMinistryBySlug() GROQ helper, and MinistryCard component.

S06 (Events, Give & Contact) delivered /events with upcoming/past split and CMS-backed EventCard, /give as a static page with PayPal/check/in-person methods, and /contact with 4 tabbed forms (General Contact, Prayer Request, Ride Request, Connect). Built 4 server-side API endpoints with shared Turnstile verification and Resend email delivery. Contact page uses accessible tablist with keyboard navigation and centralized Turnstile widget management (one widget at a time via explicit render mode).

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

M003/S01 (ZH Homepage & Core Pages) delivered 5 Chinese pages at /zh/ paths: Homepage, About (with 1968-2009 history timeline), Beliefs (EFCA 11-point Statement of Faith), Staff, and Sundays (with 7-stop bus route). Established the ZH page pattern: clone EN structure, pass lang='zh' to BaseLayout, Chinese fallback content, /zh/ internal links. Header/Footer are language-aware via shared navigation config in src/lib/navigation.ts.

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
