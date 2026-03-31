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
│   ├── pages/         # Routes (/ for EN, /zh/ for Chinese)
│   └── styles/        # Global styles, design tokens
├── studio/            # Sanity Studio (CMS)
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
| `SANITY_API_TOKEN` | Read token for build-time queries | Vercel only |
| `RESEND_API_KEY` | Email delivery for form submissions | Vercel only |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile spam protection | Vercel only |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile client-side key | `.env` + Vercel |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Astro dev server |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview built site locally |
| `npm run lhci` | Build + run Lighthouse CI audit |

## Deployment

- **Preview:** Every PR gets a Vercel preview URL automatically
- **Production:** Merges to `main` deploy to production
- **Content updates:** Sanity publish triggers Vercel redeploy via webhook

## Bilingual Architecture

- English: `/` (default locale)
- Chinese: `/zh/` (path prefix)
- Content is **bespoke per ministry**, not translations — EN and ZH have separate Sanity documents tagged with a `language` field
- Language toggle persists preference via cookie

## Design Language

"Gathered warmth" — see `ficcc-design-language.docx` for full direction. Key principles: Unhurried, Rooted, Textured, Legible, Familiar, Honest.
