# FICCC — First Ithaca Chinese Christian Church

Unified bilingual website for [First Ithaca Chinese Christian Church](https://ficcc.org), serving both the English Ministry and Chinese Ministry (中文事工) under a single domain.

**Stack:** [Astro](https://astro.build) · [Sanity](https://sanity.io) · [Vercel](https://vercel.com)

## Quick Start

```bash
# Clone
git clone git@github.com-personal:dillonlui/ficcc.git
cd ficcc

# Install
nvm use        # Node 24.x (see .nvmrc)
npm install

# Environment
cp .env.example .env
# Fill in Sanity project values (see below)

# Develop
npm run dev    # Astro dev server at localhost:4321
```

## Project Structure

```
ficcc/
├── src/
│   ├── components/    # Astro components
│   ├── layouts/       # Page layouts
│   ├── lib/           # Utilities (Sanity client, helpers)
│   ├── pages/         # Routes (/ splash, /en/ for EN, /zh/ for Chinese)
│   └── styles/        # Global styles, design tokens
├── sanity/            # Sanity schemas, structure, and migrations
├── public/            # Static assets
├── archive/           # Legacy site screenshots (reference only)
├── vercel.json        # Security headers, redirects
└── lighthouserc.cjs   # Lighthouse CI config
```

## Environment Variables

| Variable | Description | Where |
|---|---|---|
| `SANITY_PROJECT_ID` | Sanity project ID | `.env` + Vercel |
| `SANITY_DATASET` | Dataset name (`production`) | `.env` + Vercel |
| `SANITY_API_READ_TOKEN` | Read token for preview-mode draft queries | Vercel only |
| `PUBLIC_SANITY_PROJECT_ID` | Sanity project ID for embedded Studio | `.env` + Vercel |
| `PUBLIC_SANITY_DATASET` | Dataset name for embedded Studio | `.env` + Vercel |
| `PUBLIC_SANITY_PREVIEW_URL` | Site URL shown inside Sanity Presentation | `.env` + Vercel |
| `PUBLIC_SANITY_STUDIO_URL` | Studio URL for visual editing links, usually `/admin` | `.env` + Vercel |
| `VERCEL_DEPLOY_HOOK_URL` | Secret Vercel deploy-hook URL configured as a Sanity webhook target | Sanity webhook configuration only |
| `RESEND_API_KEY` | Email delivery for form submissions | Vercel only |
| `FROM_EMAIL` | Verified Resend sender, e.g. `FICCC Website <website@notify.ficcc.org>` | Vercel only |
| `FORM_RECIPIENT_CONTACT` | `office@ficcc.org` for general contact messages | Vercel only |
| `FORM_RECIPIENT_CONNECT` | `office@ficcc.org` for newcomer connection requests | Vercel only |
| `FORM_RECIPIENT_RIDE` | `office@ficcc.org` for ride requests | Vercel only |
| `FORM_RECIPIENT_PRAYER_EN` | `empastor@ficcc.org` for English prayer requests | Vercel only |
| `FORM_RECIPIENT_PRAYER_ZH` | `cmpastor@ficcc.org` for Chinese prayer requests | Vercel only |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile spam protection | Vercel only |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile client-side key | `.env` + Vercel |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Astro dev server |
| `npm run build` | Build static site to `dist/client/` |
| `npm run preview` | Preview built site locally |
| `npm run studio` | Run Sanity Studio locally |
| `npm run studio:build` | Build the Sanity Studio bundle |
| `npm run sanity:seed` | Seed current CMS documents into Sanity |
| `npm run lhci` | Build + run Lighthouse CI audit |

## Deployment

- **Preview:** Every PR gets a Vercel preview URL automatically
- **Production:** Merges to `main` deploy to production
- **Content updates:** Sanity publish triggers Vercel redeploy via webhook. Production pages are server-rendered so published Sanity changes are also visible immediately; the webhook remains the cache/build integration check.

## Bilingual Architecture

- Splash: `/` (language-neutral gateway)
- English: `/en/` (prefixed default locale)
- Chinese: `/zh/` (path prefix)
- Content is **bespoke per language route**, not direct translations — EN and ZH have separate Sanity documents tagged with a `language` field
- Ministry-specific Grow pages live at `/en/grow/{audience}` and `/zh/grow/{audience}` with fixed Sanity documents like `growPage-en-youth`
- Shared church facts such as address, contact info, and service times live in `siteSettings-en` and `siteSettings-zh`
- Language toggle persists preference via cookie

## Design Language

"Gathered warmth" — see `ficcc-design-language.docx` for full direction. Key principles: Unhurried, Rooted, Textured, Legible, Familiar, Honest.
