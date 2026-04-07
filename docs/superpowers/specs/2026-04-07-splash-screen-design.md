# Splash Screen / Language Gateway — Design Spec

## Overview

Add a bilingual splash screen at `ficcc.org/` that lets first-time visitors choose between the English and Chinese versions of the site. Returning visitors (who have a `lang-pref` cookie) are redirected server-side before any HTML loads.

This follows the current ficcc.org pattern of a language gateway as the front door, updated to match the "Gathered Warmth / Ithaca Rooted" design language.

## Design Principles

- **Equal hierarchy** — English and Chinese are treated as equals throughout. Same button style, same name size, same color, same weight. Neither language is presented as primary or secondary.
- **Unhurried entry** — Staggered fade-in animation gives the splash a moment of presence before the user clicks through. Matches the "Gathered Warmth" design feel.
- **Minimal gateway** — No header, footer, or nav. Just the logo, church names, and two buttons. Clean entry point.

## Routing & Sitemap

### Before
```
/              → EN homepage
/about         → EN about
/ministries    → EN ministries
/zh/           → ZH homepage
/zh/about      → ZH about
```

### After
```
/              → Splash (language-neutral, not indexed)
/en/           → EN homepage
/en/about      → EN about
/en/ministries → EN ministries
/zh/           → ZH homepage (unchanged)
/zh/about      → ZH about (unchanged)
/admin         → Sanity Studio (unchanged)
```

### Astro i18n config
- Change `prefixDefaultLocale` from `false` to `true`
- EN pages generate under `/en/` automatically
- Splash page lives outside the i18n system at `src/pages/index.astro`

### Risk: Astro i18n + splash coexistence
When `prefixDefaultLocale: true`, Astro may auto-redirect `/` to `/en/` or treat it as part of the EN locale. This must be spiked early to confirm we can serve a standalone page at `/` without interference. Fallback: use Vercel rewrite to serve the splash, or configure the splash page to opt out of i18n routing.

### SEO
- Splash page: `<meta name="robots" content="noindex">`
- Canonical tag on splash points to itself (`/`)
- Hreflang: `en` → `/en/`, `zh` → `/zh/`, `x-default` → `/`
- Sitemap excludes `/`, starts with `/en/` and `/zh/`
- No 301 redirects needed — site is not live yet, no existing SEO to preserve

## Visitor Flow

### First-time visitor (no `lang-pref` cookie)
1. Hits `ficcc.org/`
2. Vercel Edge Middleware checks for `lang-pref` cookie — not found, passes through
3. Splash page renders with staggered fade-in
4. User clicks "English" or "中文"
5. Click sets `lang-pref` cookie (`en` or `zh`), navigates to `/en/` or `/zh/`

### Returning visitor (cookie exists)
1. Hits `ficcc.org/`
2. Vercel Edge Middleware reads `lang-pref` cookie
3. Strict-match against `en` or `zh` only — any other value passes through to splash
4. Returns 302 redirect to `/en/` or `/zh/` before any HTML reaches the browser
5. Zero flash of splash content

### Language toggle on inner pages
- Existing behavior unchanged — toggle updates `lang-pref` cookie on click
- Next visit to `ficcc.org/` redirects to whichever language they last used

### Getting back to splash
- `ficcc.org/?chooselang` bypasses the Edge Middleware redirect and shows the splash regardless of cookie state
- This is a developer/admin convenience — not surfaced in the UI anywhere
- Users switch languages via the header toggle, not by returning to the splash

## Visual Design

### Background
- **Image:** `waterfall.jpg` (from current ficcc.org), moved to `public/images/hero/waterfall-landing.webp`
- Convert to webp for consistency with other hero images (use `sips` or `cwebp` during implementation)
- Generate two sizes: `waterfall-landing-600.webp` (mobile) and `waterfall-landing-1600.webp` (desktop)
- Serve via `<picture>` element with `<source media="(max-width: 768px)">`
- Full viewport coverage (`100vh`, `object-fit: cover`, centered)

### Overlay
- Neutral dark gradient, NOT green-tinted
- `rgba(33, 30, 26)` (close to `--base-900`)
- Gradient: ~65% opacity top → ~40% middle → ~72% bottom
- Lets the waterfall's natural greens show through on their own

### Logo
- Brand icon mark (cross-in-circle with landscape layers)
- Cross: full cream `#F5F2EC`
- Circle ring: `rgba(245, 242, 236, 0.4)`
- Landscape layers: original brand colors at reduced opacity
  - Forest teal (`#49926F`) at 55%
  - Baked clay (`#CFA487`) at 50%
  - Parchment (`#E0DAD0`) at 40%
- ~140px wide on desktop, scales down on mobile

### Church Names (equal hierarchy)
- English: "First Ithaca Chinese Christian Church"
  - Font: Lora (serif), 24px desktop
  - Color: `#F5F2EC`
- Chinese: "以撒迦中华基督教会"
  - Font: Noto Serif SC, 24px desktop
  - Color: `#F5F2EC`
- Same size, same color, same weight — true equals
- Chinese text wrapped in `<span lang="zh">` for proper screen reader pronunciation

### Buttons (equal hierarchy)
- **Desktop:** Side by side, centered
- **Mobile:** Stacked vertically
- Both identical styling:
  - Background: `rgba(245, 242, 236, 0.12)`
  - Border: `1.5px solid rgba(245, 242, 236, 0.3)`
  - Text: `#F5F2EC`, 16px, font-weight 500
  - Border-radius: 8px
  - Min-width: 180px, padding: 14px 48px
- Hover: brighter fill (`rgba(245, 242, 236, 0.2)`), subtle `translateY(-1px)` lift
- Implemented as `<a>` tags linking to `/en/` and `/zh/`

### Entrance Animation
Staggered fade-in, ~1.5s total:
1. Logo: 0s delay, 0.6s duration (fade + slight translateY upward)
2. Church names: 0.3s delay
3. Buttons: 0.6s delay

- CSS `@keyframes` with `opacity` and `translateY`
- `will-change: opacity` for GPU compositing
- Respects `prefers-reduced-motion: reduce` — skip animation, show everything immediately

### Semantic HTML
- `<main>` landmark
- Buttons are real `<a>` elements, keyboard-navigable
- `aria-label="Enter English site"` / `aria-label="进入中文网站"`
- Page `lang="en"` with `<span lang="zh">` on Chinese text
- No header/footer/nav on splash — just the gateway content

## Cookie Security

Update `lang-pref` cookie across all set-points to include `Secure`:
```
lang-pref=en;path=/;max-age=31536000;SameSite=Lax;Secure
```
Applies to:
- Splash page button clicks (new)
- Language toggle in BaseLayout (existing, update)

## Edge Middleware

New file: `middleware.ts` (Vercel Edge Middleware at project root)

```
Request to / → has ?chooselang param? → yes → pass through to splash HTML
                                      → no  → read lang-pref cookie → strict match en|zh → 302 redirect
                                                                     → no match → pass through to splash HTML
```

- Strict-match cookie value — do not pass arbitrary cookie content into redirect URLs
- Only intercepts requests to `/` exactly — all other routes pass through
- Must be spiked early to confirm compatibility with `output: 'static'` + Vercel adapter

## Performance

- Responsive background image (srcset) to avoid serving 1600px image on mobile
- Webp format for smaller file size
- `fetchpriority="high"` on background image for fast LCP
- Animation uses `opacity` + `transform` only (composited, no layout thrashing)
- Edge Middleware redirect means returning visitors never download splash HTML at all
- Add splash page to Lighthouse CI audit list

## Files Changed

### New
- `src/pages/index.astro` — Splash page
- `middleware.ts` — Vercel Edge Middleware for cookie-based redirect

### Moved
- `public/images/waterfall.jpg` → `public/images/hero/waterfall-landing.webp`
- `src/pages/index.astro` (current EN homepage) → `src/pages/en/index.astro`
- All EN pages under `src/pages/` move into `src/pages/en/` directory
  - `about/`, `contact.astro`, `events.astro`, `give.astro`, `ministries/`, `resources.astro`, `sermons/`, `visit.astro`

### Modified
- `astro.config.mjs` — `prefixDefaultLocale: true`
- `src/lib/navigation.ts` — EN link arrays add `/en/` prefix, `getAlternateUrl()` updated, `ASYMMETRIC_ROUTES` and `NO_COUNTERPART` updated
- `src/lib/navigation.test.ts` — All 20 tests updated for `/en/` prefix
- `src/components/Header.astro` — Any hardcoded `/` references
- `src/components/Footer.astro` — Same
- `src/components/SEO.astro` — Hreflang logic, x-default handling
- `src/layouts/BaseLayout.astro` — Cookie script adds `Secure` flag
- `vercel.json` — Legacy redirect destinations update to `/en/` prefix
- `lighthouserc.cjs` — EN URL patterns update, add splash page
- Grep all `.astro` files for hardcoded EN paths (`href="/about"`, `href="/contact"`, etc.) — update any found outside of `navigation.ts`

### Unchanged
- All ZH pages (`src/pages/zh/`) — no changes
- `src/pages/admin/` — stays at `/admin`
- Sanity schemas — no CMS changes
- `src/styles/global.css` — no new tokens needed

## Open Questions

1. **Astro i18n spike** — Can we serve a standalone page at `/` with `prefixDefaultLocale: true`? Must verify before committing to this approach.
2. **Edge Middleware spike** — Confirm Vercel Edge Middleware works with `output: 'static'` + `@astrojs/vercel` adapter for the cookie redirect.
