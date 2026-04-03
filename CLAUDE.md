# FICCC — First Ithaca Chinese Christian Church

Unified bilingual website for [First Ithaca Chinese Christian Church](https://ficcc.org), serving both the English Ministry and Chinese Ministry under a single domain.

<!-- GSD:project-start source:PROJECT.md -->
## Project

All 4 milestones complete. Site is live at ficcc.org. Built with the GSD2 methodology — planning artifacts live in `.gsd/` (PROJECT.md, STATE.md, KNOWLEDGE.md, milestones/).
<!-- GSD:project-end -->

<!-- GSD:stack-start -->
## Technology Stack

| Layer | Choice | Version |
|-------|--------|---------|
| Framework | Astro | 5.5.5 |
| CMS | Sanity | v5 (free tier) |
| Hosting | Vercel | Edge CDN + preview deploys |
| Styling | CSS Custom Properties | No Tailwind — scoped + global |
| Fonts | Lora, Inter (variable), Noto Serif SC | Self-hosted via @fontsource |
| Forms | Vercel Edge Runtime + Turnstile + Resend | — |
| Search | Pagefind (astro-pagefind) | 24 pages indexed |
| Analytics | GA4 | Gated on env var |
| Testing | Vitest + Playwright + axe-core + Lighthouse CI | — |

**Runtime:** Node 24.x (see `.nvmrc`), npm, ES modules (`"type": "module"`)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start -->
## Conventions

### Commands
```bash
npm run dev          # Astro dev server at localhost:4321
npm run build        # Static build to dist/client/ (Vercel adapter)
npm run preview      # npx serve dist/client -l 4321
npm test             # Vitest unit tests
npm run test:e2e     # Playwright (4 viewports)
npm run test:a11y    # axe-core on 3 key pages
npm run lhci         # Build + Lighthouse CI audit
```

### Styling
- **No Tailwind.** All styling uses CSS custom properties defined in `src/styles/global.css`.
- Use design tokens (`--primary-500`, `--space-4`, `--text-lg`, etc.) — never hardcode colors, spacing, or font sizes.
- If a component needs a token that doesn't exist, add it to `global.css` first.
- Component styles are scoped inside `.astro` files.
- Reference `/styleguide` page for the live token catalog.

### Accessibility
- **WCAG AA minimum.** Lighthouse CI enforces >=0.95 accessibility score.
- `--color-terracotta` (#C4745A) **fails** WCAG AA for text (3.31:1). Use `--color-terracotta-dark` (#A85E42, 4.56:1) for all text and interactive elements. Terracotta is fine for button backgrounds with light text or decorative accents. (K013)

### TypeScript
- Strict mode. Path aliases: `@/*`, `@components/*`, `@layouts/*`, `@lib/*`, `@styles/*`.
- Configured in `tsconfig.json`, extending Astro's strict config.

### File Organization
```
src/
├── components/     # 22 Astro components (+ Studio.tsx for React)
├── layouts/        # BaseLayout.astro — single master layout
├── lib/            # sanity.ts, navigation.ts, structured-data.ts, form-helpers.ts
├── pages/          # Routes: / for EN, /zh/ for Chinese
│   ├── api/        # Form endpoints (contact, connect, prayer-request, ride-request)
│   └── zh/         # Chinese pages (bespoke, not translations)
└── styles/         # global.css (tokens), cjk-fonts.css (async loaded)
```
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start -->
## Architecture

### Bilingual Routing
- English: `/` (default locale, no prefix)
- Chinese: `/zh/` (path prefix)
- Astro i18n config: `defaultLocale: 'en'`, `locales: ['en', 'zh']`, `prefixDefaultLocale: false`
- Content is **bespoke per ministry** — EN and ZH have separate Sanity documents, not translations.
- When ZH UX needs differ significantly, build a bespoke page (e.g., `/zh/contact` uses WeChat-first design). (K011)
- Use `getAlternateUrl(pathname)` from `src/lib/navigation.ts` for all EN<->ZH URL mapping. It handles asymmetric routes like `/visit` <-> `/zh/sundays`. (K010)
- Language toggle persists preference via cookie.

### Sanity CMS
- **Schema:** `sanity/schemas/` — documents (sermon, event, ministry, page, person), singletons (homePage, aboutPage, visitPage, resourcesPage, navigation, siteSettings), block/object types.
- **Singletons** use `{type}-{lang}` IDs (e.g., `siteSettings-en`, `homePage-zh`).
- **Every document** has a `language: 'en' | 'zh'` field.
- **Queries:** Use typed GROQ helpers in `src/lib/sanity.ts` — each accepts a `language` parameter defaulting to `'en'`.
- **Preview mode:** `loadQuery` with `previewDrafts` perspective + `SANITY_API_READ_TOKEN`. Never use the token in `PUBLIC_` vars or client components. (K006)
- **Build resilience:** Wrap CMS fetches in try-catch so builds succeed with fallback content when Sanity is unavailable. (K008)
- **Studio:** Embedded via `client:only="react"` at `/admin` — no server rendering needed. (K004)

### Astro + Vercel
- `output: 'static'` with `@astrojs/vercel@9` adapter enables per-page SSR opt-in (`export const prerender = false`). Do NOT use `output: 'hybrid'` — removed in Astro 5. (K005a)
- Static files output to `dist/client/`, not `dist/`. (K009)
- `vercel.json` manages security headers (CSP, HSTS), legacy redirects (em.ficcc.org, cm.ficcc.org), and font caching.

### CJK Font Loading
- `@fontsource/noto-serif-sc` produces ~240KB CSS. Always load via async pattern: `media="print" onload="this.media='all'"`. (K001)
- Font CSS lives in `src/styles/cjk-fonts.css`, loaded separately from global CSS.
- Chinese text uses its own type scale (`--text-zh-base: 1.125rem`) and line height (`--leading-cjk: 1.8`).

### Forms & API
- Form endpoints in `src/pages/api/` use Vercel Edge Runtime.
- EN forms use Cloudflare Turnstile for spam protection; ZH contact uses WeChat QR approach.
- Email delivery via Resend.

### Testing
- **Unit:** Vitest — `vitest.config.ts` excludes `e2e/` and `.gsd/` dirs. (K014)
- **E2E:** Playwright — 4 viewports (375px, 768px, 1280px, 1920px), config in `playwright.config.ts`.
- **Lighthouse CI:** `lighthouserc.cjs` — 3 runs per URL, per-URL thresholds. Use `npx serve dist/client -l 4321` not `astro preview`. (K002, K012)
- **a11y:** axe-core on homepage, about, and contact pages.

### SEO & Structured Data
- `src/components/SEO.astro` handles meta tags, hreflang, OG tags.
- `src/lib/structured-data.ts` generates JSON-LD (Church, Organization, WebSite, VideoObject, Event).
- Sitemap with hreflang alternates generated by `@astrojs/sitemap`.
<!-- GSD:architecture-end -->

## Design Language

**"Gathered Warmth"** — Unhurried, Rooted, Textured, Legible, Familiar, Honest.

Inspired by the Finger Lakes landscape: forest canopy, gorge stone, baked clay trails, slate water.

### Palette: "Ithaca Rooted"
| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Primary | `--primary-500` | #2B5B45 | CTAs, links, active states (Forest Teal) |
| Secondary | `--secondary-400` | #BF7E58 | Warm accents, secondary CTAs (Baked Clay) |
| Base | `--base-50` | #FAFAF7 | Page background (Warm Parchment) |
| Text | `--base-900` | #33302A | Headings, primary text |
| Body | `--base-700` | #6E675D | Body text |
| Accent | `--accent-500` | #505962 | Metadata, subtle UI (Gorge Slate) |

Each color has a full 50-900 ramp. See `src/styles/global.css` for all tokens.

### Typography
- **Headings:** Lora Variable (serif) + Noto Serif SC (CJK)
- **Body:** Inter Variable (sans) — with DM Sans as display alternative
- **Chinese:** Dedicated ZH type scale (slightly larger base) + `--leading-cjk: 1.8` line height

### Design Assets
- Full palette reference: `design-system/ficcc-ithaca-rooted-palette.html`
- Brand/logo guide: `design-system/ficcc-logo-brand-guide.html`
- Design language spec: `design-system/ficcc-design-language.docx`
- Logo SVGs: `design-system/logo svg/`

<!-- GSD:workflow-start -->
## GSD Workflow

This project was built using the GSD2 methodology. Planning artifacts live in `.gsd/`:
- `PROJECT.md` — Project overview and milestone status
- `STATE.md` — Current phase and active work
- `KNOWLEDGE.md` — 14 architectural decisions (K001-K014) — **read this before making structural changes**
- `DECISIONS.md` — Decision log
- `milestones/` — M001-M004 with slices and tasks

For ongoing work, use GSD commands (`/gsd:quick`, `/gsd:debug`, `/gsd:execute-phase`) to keep planning artifacts in sync. Direct edits are fine for small changes when explicitly requested.
<!-- GSD:workflow-end -->
