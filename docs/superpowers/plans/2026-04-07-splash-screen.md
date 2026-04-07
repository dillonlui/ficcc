# Splash Screen / Language Gateway — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual splash screen at `/` that lets first-time visitors choose English or Chinese, with server-side cookie redirect for returning visitors. All EN pages move under `/en/` prefix.

**Architecture:** Astro i18n `prefixDefaultLocale: true` moves EN pages to `/en/`. A standalone splash page at `src/pages/index.astro` serves the language gateway. Vercel Edge Middleware reads the `lang-pref` cookie and 302-redirects returning visitors before HTML loads. The splash has no header/footer — just logo, bilingual church name, and two equal-hierarchy buttons with a staggered fade-in animation.

**Tech Stack:** Astro 5.18, Vercel Edge Middleware, CSS animations, existing design tokens from `src/styles/global.css`

**Spec:** `docs/superpowers/specs/2026-04-07-splash-screen-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `astro.config.mjs` | Modify | Set `prefixDefaultLocale: true` |
| `src/pages/index.astro` | Replace | Splash page (currently EN homepage) |
| `src/pages/en/index.astro` | Create (move) | EN homepage (moved from `src/pages/index.astro`) |
| `src/pages/en/about/index.astro` | Create (move) | Moved from `src/pages/about/index.astro` |
| `src/pages/en/about/beliefs.astro` | Create (move) | Moved from `src/pages/about/beliefs.astro` |
| `src/pages/en/contact.astro` | Create (move) | Moved from `src/pages/contact.astro` |
| `src/pages/en/events.astro` | Create (move) | Moved from `src/pages/events.astro` |
| `src/pages/en/give.astro` | Create (move) | Moved from `src/pages/give.astro` |
| `src/pages/en/ministries/index.astro` | Create (move) | Moved from `src/pages/ministries/index.astro` |
| `src/pages/en/ministries/[slug].astro` | Create (move) | Moved from `src/pages/ministries/[slug].astro` |
| `src/pages/en/resources.astro` | Create (move) | Moved from `src/pages/resources.astro` |
| `src/pages/en/sermons/index.astro` | Create (move) | Moved from `src/pages/sermons/index.astro` |
| `src/pages/en/sermons/[slug].astro` | Create (move) | Moved from `src/pages/sermons/[slug].astro` |
| `src/pages/en/visit.astro` | Create (move) | Moved from `src/pages/visit.astro` |
| `middleware.ts` | Create | Vercel Edge Middleware for cookie redirect |
| `src/lib/navigation.ts` | Modify | Update all EN paths to `/en/` prefix |
| `src/lib/navigation.test.ts` | Modify | Update all test expectations for `/en/` prefix |
| `src/components/Header.astro` | Modify | Update `logoHref` and hardcoded paths |
| `src/components/Footer.astro` | Modify | Update logo home link |
| `src/components/SEO.astro` | Modify | Update `x-default` hreflang to point to `/` (splash) |
| `src/layouts/BaseLayout.astro` | Modify | Add `Secure` flag to cookie script |
| `src/lib/structured-data.ts` | Modify | Update `url` from `https://ficcc.org` to `https://ficcc.org/en/` |
| `vercel.json` | Modify | Update legacy redirect destinations to `/en/` prefix |
| `lighthouserc.cjs` | Modify | Update EN URL paths, add splash page |
| `e2e/smoke.spec.ts` | Modify | Update EN page URLs to `/en/` prefix |
| `e2e/bilingual.spec.ts` | Modify | Update EN URLs and lang toggle expectations |
| `public/images/waterfall.jpg` | Move+convert | Move to `public/images/hero/waterfall-landing.webp` |

---

## Task 1: Spike — Astro i18n `prefixDefaultLocale: true` + standalone root page

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/pages/en/index.astro` (temporary test copy)

This task validates the riskiest assumption: can we serve a standalone page at `/` while EN pages live under `/en/`?

- [ ] **Step 1: Create a minimal test page at `src/pages/en/index.astro`**

```astro
---
// Temporary spike file — will be replaced with the real EN homepage in Task 4
---
<html><body><h1>EN Home (spike test)</h1></body></html>
```

- [ ] **Step 2: Change `prefixDefaultLocale` to `true` in `astro.config.mjs`**

In `astro.config.mjs`, change line 39:

```js
// Before:
prefixDefaultLocale: false,

// After:
prefixDefaultLocale: true,
```

- [ ] **Step 3: Build and verify both routes exist**

Run:
```bash
npm run build 2>&1 | tail -20
```

Then check:
```bash
test -f dist/client/index.html && echo "/ exists" || echo "/ MISSING"
test -f dist/client/en/index.html && echo "/en/ exists" || echo "/en/ MISSING"
```

Expected: Both files exist. The root `/` should serve the current `src/pages/index.astro` content, and `/en/` should serve the spike test page.

- [ ] **Step 4: If the spike fails, investigate and document the workaround**

If Astro auto-redirects `/` to `/en/`, we need an alternative approach. Check the built HTML for `<meta http-equiv="refresh">` or redirect logic:

```bash
head -20 dist/client/index.html
```

Document findings before proceeding.

- [ ] **Step 5: Clean up spike — remove temporary `src/pages/en/index.astro`**

```bash
rm src/pages/en/index.astro
rmdir src/pages/en 2>/dev/null
```

- [ ] **Step 6: Revert `astro.config.mjs` change (will be re-applied in Task 3)**

```bash
git checkout astro.config.mjs
```

No commit — this was exploratory.

---

## Task 2: Prepare waterfall image

**Files:**
- Move: `public/images/waterfall.jpg` → `public/images/hero/waterfall-landing.webp`

- [ ] **Step 1: Convert waterfall.jpg to webp and generate responsive sizes**

```bash
# Full-size desktop version (1600px wide)
sips -Z 1600 public/images/waterfall.jpg -s format jpeg --out /tmp/waterfall-1600.jpg
cwebp -q 80 /tmp/waterfall-1600.jpg -o public/images/hero/waterfall-landing-1600.webp

# Mobile version (600px wide)
sips -Z 600 public/images/waterfall.jpg -s format jpeg --out /tmp/waterfall-600.jpg
cwebp -q 80 /tmp/waterfall-600.jpg -o public/images/hero/waterfall-landing-600.webp
```

If `cwebp` is not installed, use the fallback:
```bash
sips -Z 1600 public/images/waterfall.jpg -s format jpeg --out public/images/hero/waterfall-landing-1600.jpg
sips -Z 600 public/images/waterfall.jpg -s format jpeg --out public/images/hero/waterfall-landing-600.jpg
```

- [ ] **Step 2: Remove the original file**

```bash
rm public/images/waterfall.jpg
```

- [ ] **Step 3: Verify files exist**

```bash
ls -la public/images/hero/waterfall-landing-*
```

Expected: Two files (600 and 1600 variants).

- [ ] **Step 4: Commit**

```bash
git add public/images/hero/waterfall-landing-* 
git rm public/images/waterfall.jpg 2>/dev/null; git add -u public/images/waterfall.jpg
git commit -m "chore: convert waterfall to responsive webp for splash screen"
```

---

## Task 3: Update Astro config and move EN pages

**Files:**
- Modify: `astro.config.mjs`
- Move: All EN pages from `src/pages/` to `src/pages/en/`

- [ ] **Step 1: Set `prefixDefaultLocale: true`**

In `astro.config.mjs`, change:

```js
// Before (line 36-41):
routing: {
  prefixDefaultLocale: false,
},

// After:
routing: {
  prefixDefaultLocale: true,
  redirectToDefaultLocale: false,
},
```

- [ ] **Step 2: Create EN directory structure and move all EN pages**

```bash
mkdir -p src/pages/en/about src/pages/en/sermons src/pages/en/ministries

# Move top-level EN pages (NOT index.astro yet — that becomes the splash in Task 6)
cp src/pages/index.astro src/pages/en/index.astro
mv src/pages/contact.astro src/pages/en/contact.astro
mv src/pages/events.astro src/pages/en/events.astro
mv src/pages/give.astro src/pages/en/give.astro
mv src/pages/resources.astro src/pages/en/resources.astro
mv src/pages/visit.astro src/pages/en/visit.astro

# Move subdirectories
mv src/pages/about/index.astro src/pages/en/about/index.astro
mv src/pages/about/beliefs.astro src/pages/en/about/beliefs.astro
mv src/pages/sermons/index.astro src/pages/en/sermons/index.astro
mv src/pages/sermons/[slug].astro src/pages/en/sermons/[slug].astro
mv src/pages/ministries/index.astro src/pages/en/ministries/index.astro
mv src/pages/ministries/[slug].astro src/pages/en/ministries/[slug].astro

# Clean up empty directories
rmdir src/pages/about src/pages/sermons src/pages/ministries
```

- [ ] **Step 3: Update relative imports in moved files**

All moved files import from `../layouts/`, `../lib/`, `../components/`. After moving one level deeper, these become `../../layouts/`, etc. However, the project uses path aliases (`@layouts/*`, `@lib/*`, `@components/*`). Check if the moved files use relative or aliased imports:

```bash
grep -r "from '\.\." src/pages/en/ | head -20
```

If files use relative imports like `from '../layouts/BaseLayout.astro'`, update them to `from '../../layouts/BaseLayout.astro'`. If they use aliases like `from '@layouts/BaseLayout.astro'`, no changes needed.

For the EN homepage specifically (`src/pages/en/index.astro`), update its relative import:

```astro
// Before:
import BaseLayout from '../layouts/BaseLayout.astro';
import { getHomePage, getSermons, getEvents, urlForImage } from '../lib/sanity';
import { buildChurchJsonLd, buildWebSiteJsonLd } from '../lib/structured-data';

// After:
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getHomePage, getSermons, getEvents, urlForImage } from '../../lib/sanity';
import { buildChurchJsonLd, buildWebSiteJsonLd } from '../../lib/structured-data';
```

Repeat for every moved file that uses relative imports. Check each:

```bash
grep -rn "from '\.\.\/" src/pages/en/
```

And update each `../` to `../../`.

- [ ] **Step 4: Update hardcoded EN links in moved page templates**

These links in EN pages need `/en/` prefix. From the grep results:

`src/pages/en/index.astro`:
- `href="/visit"` → `href="/en/visit"` (lines 84, 122)
- `href="/about"` → `href="/en/about"` (line 104)
- `href="/ministries"` → `href="/en/ministries"` (line 140)
- `href="/sermons"` → `href="/en/sermons"` (line 157)
- `href="/contact"` → `href="/en/contact"` (line 177)

`src/pages/en/give.astro`:
- `href="/contact"` → `href="/en/contact"`

`src/pages/en/about/index.astro`:
- `href="/about/beliefs"` → `href="/en/about/beliefs"`

`src/pages/en/about/beliefs.astro`:
- `href="/ministries"` → `href="/en/ministries"`

`src/pages/en/sermons/index.astro`:
- `href="/visit"` → `href="/en/visit"`

`src/pages/en/sermons/[slug].astro`:
- `href="/sermons"` → `href="/en/sermons"`

`src/pages/en/ministries/index.astro`:
- `href="/sermons"` → `href="/en/sermons"`

`src/pages/en/ministries/[slug].astro`:
- `href="/ministries"` → `href="/en/ministries"`

- [ ] **Step 5: Build to verify EN pages generate under `/en/`**

```bash
npm run build 2>&1 | tail -5
test -f dist/client/en/index.html && echo "EN home OK" || echo "FAIL"
test -f dist/client/en/about/index.html && echo "EN about OK" || echo "FAIL"
test -f dist/client/en/contact/index.html && echo "EN contact OK" || echo "FAIL"
test -f dist/client/zh/index.html && echo "ZH home OK" || echo "FAIL"
```

Expected: All pass. EN pages now at `/en/`, ZH unchanged at `/zh/`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: move EN pages under /en/ prefix with prefixDefaultLocale: true"
```

---

## Task 4: Update navigation, header, footer, and SEO

**Files:**
- Modify: `src/lib/navigation.ts`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/SEO.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/lib/structured-data.ts`

- [ ] **Step 1: Update `src/lib/navigation.ts` — EN link arrays**

```ts
// Before:
const navLinksEN: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Sermons', href: '/sermons' },
  { label: 'Contact', href: '/contact' },
];

// After:
const navLinksEN: NavLink[] = [
  { label: 'Home', href: '/en/' },
  { label: 'About', href: '/en/about' },
  { label: 'Ministries', href: '/en/ministries' },
  { label: 'Sermons', href: '/en/sermons' },
  { label: 'Contact', href: '/en/contact' },
];
```

Do the same for `footerNavEN`:

```ts
// Before:
const footerNavEN: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Sermons', href: '/sermons' },
  { label: 'Contact', href: '/contact' },
];

// After:
const footerNavEN: NavLink[] = [
  { label: 'Home', href: '/en/' },
  { label: 'About', href: '/en/about' },
  { label: 'Ministries', href: '/en/ministries' },
  { label: 'Sermons', href: '/en/sermons' },
  { label: 'Contact', href: '/en/contact' },
];
```

- [ ] **Step 2: Update `getAlternateUrl` in `src/lib/navigation.ts`**

The function currently assumes EN pages have no prefix. Now EN pages live under `/en/`. Update the logic:

```ts
/**
 * Asymmetric route map — updated for /en/ prefix.
 */
const ASYMMETRIC_ROUTES: Record<string, string> = {
  '/en/visit': '/zh/sundays',
  '/zh/sundays': '/en/visit',
};

/**
 * Pages with no counterpart — updated for /en/ prefix.
 */
const NO_COUNTERPART = ['/en/resources', '/styleguide', '/admin', '/404'];

export function getAlternateUrl(pathname: string, currentLang: Lang): string {
  // Normalize: strip trailing slash (but keep "/" as-is)
  const normalized = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  // Check asymmetric routes first
  if (ASYMMETRIC_ROUTES[normalized]) {
    return ASYMMETRIC_ROUTES[normalized];
  }

  // Check if this page has no counterpart → fall back to other-language homepage
  if (NO_COUNTERPART.some((p) => normalized === p || normalized.startsWith(p + '/'))) {
    return currentLang === 'en' ? '/zh' : '/en/';
  }

  if (currentLang === 'en') {
    // EN → ZH: replace /en prefix with /zh
    if (normalized === '/en') {
      return '/zh';
    }
    return normalized.replace(/^\/en/, '/zh');
  }

  // ZH → EN: replace /zh prefix with /en
  if (normalized === '/zh') {
    return '/en/';
  }
  return normalized.replace(/^\/zh/, '/en');
}
```

- [ ] **Step 3: Update `src/components/Header.astro` — logo and about paths**

```astro
// Before (line 11):
const logoHref = lang === 'zh' ? '/zh' : '/';

// After:
const logoHref = lang === 'zh' ? '/zh' : '/en/';
```

```astro
// Before (line 20):
const aboutPrefix = lang === 'zh' ? '/zh/about' : '/about';

// After:
const aboutPrefix = lang === 'zh' ? '/zh/about' : '/en/about';
```

```astro
// Before (line 24):
{ label: lang === 'zh' ? '來訪我們' : 'Visit Us', href: lang === 'zh' ? '/zh/sundays' : '/visit' },

// After:
{ label: lang === 'zh' ? '來訪我們' : 'Visit Us', href: lang === 'zh' ? '/zh/sundays' : '/en/visit' },
```

```astro
// Before (line 26):
const isAboutHref = (href: string) => href === '/about' || href === '/zh/about';

// After:
const isAboutHref = (href: string) => href === '/en/about' || href === '/zh/about';
```

- [ ] **Step 4: Update `src/components/Footer.astro` — logo home link**

```astro
// Before (line 23):
<a href={lang === 'zh' ? '/zh' : '/'} class="footer-logo-link" aria-label="Home">

// After:
<a href={lang === 'zh' ? '/zh' : '/en/'} class="footer-logo-link" aria-label="Home">
```

- [ ] **Step 5: Update `src/components/SEO.astro` — `x-default` hreflang**

The `x-default` should now point to the splash page at `/`, not the EN version:

```astro
// Before (lines 49-55):
{alternateUrl && (
  <>
    <link rel="alternate" hreflang="en" href={lang === 'en' ? canonical : alternateUrl} />
    <link rel="alternate" hreflang="zh" href={lang === 'zh' ? canonical : alternateUrl} />
    <link rel="alternate" hreflang="x-default" href={lang === 'en' ? canonical : alternateUrl} />
  </>
)}

// After:
{alternateUrl && (
  <>
    <link rel="alternate" hreflang="en" href={lang === 'en' ? canonical : alternateUrl} />
    <link rel="alternate" hreflang="zh" href={lang === 'zh' ? canonical : alternateUrl} />
    <link rel="alternate" hreflang="x-default" href={new URL('/', siteUrl).href} />
  </>
)}
```

- [ ] **Step 6: Update `src/layouts/BaseLayout.astro` — cookie `Secure` flag**

```ts
// Before (line 101):
document.cookie = 'lang-pref=' + targetLang + ';path=/;max-age=31536000;SameSite=Lax';

// After:
document.cookie = 'lang-pref=' + targetLang + ';path=/;max-age=31536000;SameSite=Lax;Secure';
```

- [ ] **Step 7: Update `src/lib/structured-data.ts` — church URL**

```ts
// Before (line 19):
url: 'https://ficcc.org',

// After:
url: 'https://ficcc.org/en/',
```

Also update `buildOrganizationJsonLd` (line 119):

```ts
// Before:
url: 'https://ficcc.org',

// After:
url: 'https://ficcc.org/en/',
```

- [ ] **Step 8: Build and verify navigation links**

```bash
npm run build 2>&1 | tail -5
grep -o 'href="/en/about"' dist/client/en/index.html | head -1
grep -o 'href="/zh/about"' dist/client/zh/index.html | head -1
grep -o 'hreflang="x-default"' dist/client/en/index.html
```

Expected: EN nav links point to `/en/`, ZH nav links unchanged, x-default hreflang present.

- [ ] **Step 9: Commit**

```bash
git add src/lib/navigation.ts src/components/Header.astro src/components/Footer.astro src/components/SEO.astro src/layouts/BaseLayout.astro src/lib/structured-data.ts
git commit -m "feat: update navigation, header, footer, SEO for /en/ prefix"
```

---

## Task 5: Update unit tests for navigation

**Files:**
- Modify: `src/lib/navigation.test.ts`

- [ ] **Step 1: Update all test expectations**

Replace the full contents of `src/lib/navigation.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { getAlternateUrl } from './navigation';

describe('getAlternateUrl', () => {
  describe('standard prefix swap', () => {
    it('EN /en/about → ZH /zh/about', () => {
      expect(getAlternateUrl('/en/about', 'en')).toBe('/zh/about');
    });

    it('ZH /zh/about → EN /en/about', () => {
      expect(getAlternateUrl('/zh/about', 'zh')).toBe('/en/about');
    });

    it('EN /en/contact → ZH /zh/contact', () => {
      expect(getAlternateUrl('/en/contact', 'en')).toBe('/zh/contact');
    });

    it('ZH /zh/sermons → EN /en/sermons', () => {
      expect(getAlternateUrl('/zh/sermons', 'zh')).toBe('/en/sermons');
    });
  });

  describe('nested paths', () => {
    it('EN /en/about/beliefs → ZH /zh/about/beliefs', () => {
      expect(getAlternateUrl('/en/about/beliefs', 'en')).toBe('/zh/about/beliefs');
    });

    it('ZH /zh/about/staff → EN /en/about/staff', () => {
      expect(getAlternateUrl('/zh/about/staff', 'zh')).toBe('/en/about/staff');
    });
  });

  describe('asymmetric routes', () => {
    it('EN /en/visit → ZH /zh/sundays', () => {
      expect(getAlternateUrl('/en/visit', 'en')).toBe('/zh/sundays');
    });

    it('ZH /zh/sundays → EN /en/visit', () => {
      expect(getAlternateUrl('/zh/sundays', 'zh')).toBe('/en/visit');
    });
  });

  describe('root paths', () => {
    it('EN /en → ZH /zh', () => {
      expect(getAlternateUrl('/en', 'en')).toBe('/zh');
    });

    it('EN /en/ → ZH /zh', () => {
      expect(getAlternateUrl('/en/', 'en')).toBe('/zh');
    });

    it('ZH /zh → EN /en/', () => {
      expect(getAlternateUrl('/zh', 'zh')).toBe('/en/');
    });
  });

  describe('fallback to homepage for pages with no counterpart', () => {
    it('EN /en/resources → ZH /zh', () => {
      expect(getAlternateUrl('/en/resources', 'en')).toBe('/zh');
    });

    it('EN /styleguide → ZH /zh', () => {
      expect(getAlternateUrl('/styleguide', 'en')).toBe('/zh');
    });

    it('EN /admin/anything → ZH /zh', () => {
      expect(getAlternateUrl('/admin/anything', 'en')).toBe('/zh');
    });

    it('EN /404 → ZH /zh', () => {
      expect(getAlternateUrl('/404', 'en')).toBe('/zh');
    });
  });

  describe('trailing slash normalization', () => {
    it('EN /en/about/ → ZH /zh/about', () => {
      expect(getAlternateUrl('/en/about/', 'en')).toBe('/zh/about');
    });

    it('ZH /zh/about/ → EN /en/about', () => {
      expect(getAlternateUrl('/zh/about/', 'zh')).toBe('/en/about');
    });

    it('EN /en/visit/ → ZH /zh/sundays (asymmetric with trailing slash)', () => {
      expect(getAlternateUrl('/en/visit/', 'en')).toBe('/zh/sundays');
    });
  });

  describe('dynamic routes', () => {
    it('EN /en/sermons/some-slug → ZH /zh/sermons/some-slug', () => {
      expect(getAlternateUrl('/en/sermons/some-slug', 'en')).toBe('/zh/sermons/some-slug');
    });

    it('ZH /zh/sermons/some-slug → EN /en/sermons/some-slug', () => {
      expect(getAlternateUrl('/zh/sermons/some-slug', 'zh')).toBe('/en/sermons/some-slug');
    });

    it('EN /en/ministries/youth → ZH /zh/ministries/youth', () => {
      expect(getAlternateUrl('/en/ministries/youth', 'en')).toBe('/zh/ministries/youth');
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm test
```

Expected: All 20 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/lib/navigation.test.ts
git commit -m "test: update navigation tests for /en/ prefix"
```

---

## Task 6: Create the splash page

**Files:**
- Replace: `src/pages/index.astro` (overwrite the old EN homepage with the splash)

- [ ] **Step 1: Write the splash page**

Replace `src/pages/index.astro` entirely with:

```astro
---
/**
 * Splash / Language Gateway
 * 
 * First-time visitors see logo + bilingual name + two equal buttons.
 * Returning visitors with a lang-pref cookie are redirected by Edge Middleware
 * before this page loads (see middleware.ts).
 *
 * This page is outside the i18n system — it's language-neutral.
 */
import '../styles/global.css';
import cjkFontsHref from '../styles/cjk-fonts.css?url';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>First Ithaca Chinese Christian Church | 以撒迦中华基督教会</title>
    <meta name="description" content="A Chinese-heritage, university-adjacent Christian community in Ithaca, NY." />
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="https://ficcc.org/" />
    <link rel="alternate" hreflang="en" href="https://ficcc.org/en/" />
    <link rel="alternate" hreflang="zh" href="https://ficcc.org/zh/" />
    <link rel="alternate" hreflang="x-default" href="https://ficcc.org/" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href={cjkFontsHref} media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href={cjkFontsHref} /></noscript>
  </head>
  <body class="splash-body">
    <main class="splash" id="main-content">
      <div class="splash__content">
        <div class="splash__logo" aria-hidden="true">
          <svg viewBox="0 0 220 216" width="140" height="137" role="img" aria-label="FICCC cross logo">
            <circle cx="110" cy="108" r="92" fill="none" stroke="rgba(245,242,236,0.4)" stroke-width="1.5"/>
            <clipPath id="splash-logo"><circle cx="110" cy="108" r="90"/></clipPath>
            <g clip-path="url(#splash-logo)">
              <path d="M18 135 C38 105 62 92 88 98 C110 103 128 118 150 108 C170 99 188 104 202 112 L202 200 L18 200 Z" fill="#49926F" opacity=".55"/>
              <path d="M18 148 C45 130 65 142 90 136 C115 130 140 148 165 142 C185 137 195 130 202 125 L202 200 L18 200 Z" fill="#CFA487" opacity=".50"/>
              <path d="M18 170 C38 158 58 165 82 160 C108 155 135 168 162 164 C180 161 195 155 202 150 L202 200 L18 200 Z" fill="#E0DAD0" opacity=".40"/>
            </g>
            <line x1="110" y1="34" x2="110" y2="126" stroke="#F5F2EC" stroke-width="7.5" stroke-linecap="round"/>
            <line x1="88" y1="59" x2="132" y2="59" stroke="#F5F2EC" stroke-width="7.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="splash__name">First Ithaca Chinese Christian Church</h1>
        <p class="splash__name-zh"><span lang="zh">以撒迦中华基督教会</span></p>
        <div class="splash__buttons">
          <a href="/en/" class="splash__btn" aria-label="Enter English site" data-lang="en">English</a>
          <a href="/zh/" class="splash__btn" aria-label="进入中文网站" data-lang="zh">中文</a>
        </div>
      </div>
    </main>

    <picture class="splash__bg">
      <source media="(max-width: 768px)" srcset="/images/hero/waterfall-landing-600.webp" />
      <img
        src="/images/hero/waterfall-landing-1600.webp"
        alt=""
        class="splash__bg-img"
        fetchpriority="high"
        loading="eager"
        decoding="async"
      />
    </picture>

    <script>
      // Set lang-pref cookie on button click
      document.querySelectorAll('.splash__btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const lang = (btn as HTMLAnchorElement).dataset.lang;
          document.cookie = 'lang-pref=' + lang + ';path=/;max-age=31536000;SameSite=Lax;Secure';
        });
      });
    </script>
  </body>
</html>

<style>
  .splash-body {
    margin: 0;
    padding: 0;
    background-color: var(--base-900, #33302A);
    overflow: hidden;
  }

  /* Background image — behind everything */
  .splash__bg {
    position: fixed;
    inset: 0;
    z-index: 0;
  }

  .splash__bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  /* Main overlay + content */
  .splash {
    position: fixed;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      to bottom,
      rgba(33, 30, 26, 0.65) 0%,
      rgba(33, 30, 26, 0.40) 45%,
      rgba(33, 30, 26, 0.72) 100%
    );
  }

  .splash__content {
    text-align: center;
    padding: var(--space-8, 2rem) var(--space-6, 1.5rem);
    max-width: 36rem;
  }

  /* Logo */
  .splash__logo {
    margin-bottom: var(--space-7, 1.75rem);
    opacity: 0;
    transform: translateY(12px);
    animation: splash-fade-in 0.6s ease-out forwards;
  }

  .splash__logo svg {
    width: 140px;
    height: auto;
  }

  /* Church names — equal hierarchy */
  .splash__name {
    font-family: var(--font-heading, Georgia, serif);
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    font-weight: 400;
    color: #F5F2EC;
    margin: 0 0 0.375rem;
    letter-spacing: 0.6px;
    opacity: 0;
    transform: translateY(12px);
    animation: splash-fade-in 0.6s ease-out 0.3s forwards;
  }

  .splash__name-zh {
    font-family: var(--font-heading-cjk, 'Noto Serif SC', 'PingFang SC', serif);
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    font-weight: 400;
    color: #F5F2EC;
    margin: 0 0 var(--space-12, 3rem);
    opacity: 0;
    transform: translateY(12px);
    animation: splash-fade-in 0.6s ease-out 0.3s forwards;
  }

  /* Buttons — equal hierarchy, side by side */
  .splash__buttons {
    display: flex;
    gap: var(--space-4, 1rem);
    justify-content: center;
    opacity: 0;
    transform: translateY(12px);
    animation: splash-fade-in 0.6s ease-out 0.6s forwards;
  }

  .splash__btn {
    display: block;
    padding: 0.875rem 3rem;
    border-radius: var(--radius-lg, 0.5rem);
    font-family: var(--font-body, 'Inter', sans-serif);
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    text-decoration: none;
    letter-spacing: 0.4px;
    min-width: 180px;
    background: rgba(245, 242, 236, 0.12);
    color: #F5F2EC;
    border: 1.5px solid rgba(245, 242, 236, 0.3);
    transition: background-color 0.2s ease, transform 0.15s ease;
  }

  .splash__btn:hover {
    background: rgba(245, 242, 236, 0.22);
    transform: translateY(-1px);
  }

  .splash__btn:focus-visible {
    outline: 2px solid var(--color-focus, #A8D4BC);
    outline-offset: 2px;
  }

  /* Animation keyframes */
  @keyframes splash-fade-in {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .splash__logo,
    .splash__name,
    .splash__name-zh,
    .splash__buttons {
      opacity: 1;
      transform: none;
      animation: none;
    }
  }

  /* Mobile: stack buttons vertically */
  @media (max-width: 480px) {
    .splash__buttons {
      flex-direction: column;
      align-items: center;
    }

    .splash__btn {
      width: 100%;
      max-width: 240px;
    }

    .splash__logo svg {
      width: 110px;
    }
  }
</style>
```

- [ ] **Step 2: Build and verify splash page exists at root**

```bash
npm run build 2>&1 | tail -5
test -f dist/client/index.html && echo "Splash at / OK" || echo "FAIL"
grep -q "noindex" dist/client/index.html && echo "noindex OK" || echo "FAIL"
grep -q "waterfall-landing" dist/client/index.html && echo "Image ref OK" || echo "FAIL"
grep -q 'href="/en/"' dist/client/index.html && echo "EN button OK" || echo "FAIL"
grep -q 'href="/zh/"' dist/client/index.html && echo "ZH button OK" || echo "FAIL"
```

Expected: All pass.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add bilingual splash screen at root with equal-hierarchy design"
```

---

## Task 7: Create Vercel Edge Middleware

**Files:**
- Create: `middleware.ts` (project root — Vercel convention)

- [ ] **Step 1: Write the middleware**

Create `middleware.ts` at project root:

```ts
/**
 * Vercel Edge Middleware — redirects returning visitors from splash (/)
 * to their preferred language based on the lang-pref cookie.
 *
 * Only intercepts exact requests to "/". All other routes pass through.
 * ?chooselang query param bypasses the redirect (dev convenience).
 */

import { next } from '@vercel/edge';

export default function middleware(request: Request) {
  const url = new URL(request.url);

  // Only intercept the root path
  if (url.pathname !== '/') {
    return next();
  }

  // ?chooselang bypasses redirect — always show splash
  if (url.searchParams.has('chooselang')) {
    return next();
  }

  // Read lang-pref cookie
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(/(?:^|;\s*)lang-pref=(en|zh)(?:;|$)/);

  if (match) {
    const lang = match[1];
    const destination = lang === 'zh' ? '/zh/' : '/en/';
    return Response.redirect(new URL(destination, request.url), 302);
  }

  // No cookie — show splash
  return next();
}

export const config = {
  matcher: '/',
};
```

- [ ] **Step 2: Install `@vercel/edge` if not already available**

```bash
npm ls @vercel/edge 2>/dev/null || npm install -D @vercel/edge
```

- [ ] **Step 3: Verify TypeScript is happy**

```bash
npx tsc --noEmit middleware.ts 2>&1 || true
```

Note: The middleware runs in Vercel's edge runtime, not in Astro's build. TypeScript errors here may need a `tsconfig` adjustment or a `// @ts-nocheck` if types don't resolve locally. The middleware will work on Vercel regardless.

- [ ] **Step 4: Commit**

```bash
git add middleware.ts package.json package-lock.json 2>/dev/null
git commit -m "feat: add Vercel Edge Middleware for cookie-based splash redirect"
```

---

## Task 8: Update `vercel.json` legacy redirects

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Update all `em.ficcc.org` redirect destinations to use `/en/` prefix**

In `vercel.json`, update these `destination` values:

```json
// em.ficcc.org redirects — update destinations:
"destination": "https://ficcc.org/"        → "https://ficcc.org/en/"
"destination": "https://ficcc.org/about"   → "https://ficcc.org/en/about"
"destination": "https://ficcc.org/about/beliefs" → "https://ficcc.org/en/about/beliefs"
"destination": "https://ficcc.org/sermons" → "https://ficcc.org/en/sermons"
"destination": "https://ficcc.org/visit"   → "https://ficcc.org/en/visit"
"destination": "https://ficcc.org/ministries" → "https://ficcc.org/en/ministries"
"destination": "https://ficcc.org/contact" → "https://ficcc.org/en/contact"

// The catch-all em.ficcc.org redirect:
"destination": "https://ficcc.org/"        → "https://ficcc.org/en/"
```

ZH redirects (`cm.ficcc.org`) remain unchanged — they already point to `/zh/`.

- [ ] **Step 2: Commit**

```bash
git add vercel.json
git commit -m "chore: update legacy em.ficcc.org redirects for /en/ prefix"
```

---

## Task 9: Update Lighthouse CI and E2E tests

**Files:**
- Modify: `lighthouserc.cjs`
- Modify: `e2e/smoke.spec.ts`
- Modify: `e2e/bilingual.spec.ts`

- [ ] **Step 1: Update `lighthouserc.cjs` URL list**

```js
// Before:
url: [
  'http://localhost:4321/',
  'http://localhost:4321/about/',
  'http://localhost:4321/sermons/',
  'http://localhost:4321/contact/',
  'http://localhost:4321/events/',
  'http://localhost:4321/visit/',
  'http://localhost:4321/give/',
  'http://localhost:4321/zh/',
  'http://localhost:4321/styleguide/',
  'http://localhost:4321/404.html',
],

// After:
url: [
  'http://localhost:4321/',
  'http://localhost:4321/en/',
  'http://localhost:4321/en/about/',
  'http://localhost:4321/en/sermons/',
  'http://localhost:4321/en/contact/',
  'http://localhost:4321/en/events/',
  'http://localhost:4321/en/visit/',
  'http://localhost:4321/en/give/',
  'http://localhost:4321/zh/',
  'http://localhost:4321/styleguide/',
  'http://localhost:4321/404.html',
],
```

Also update the EN assertion pattern to match `/en/`:

```js
// Before:
// Excludes /zh/, /styleguide/, and /404.html which have their own thresholds.
{
  matchingUrlPattern: '^(?!.*/zh/)(?!.*/styleguide/)(?!.*/404).*$',

// After — this now covers both / (splash) and /en/* pages:
{
  matchingUrlPattern: '^(?!.*/zh/)(?!.*/styleguide/)(?!.*/404).*$',
```

The regex already works — the splash at `/` and EN pages at `/en/` both match this pattern. No change needed to the pattern itself.

- [ ] **Step 2: Update `e2e/smoke.spec.ts`**

```ts
// Before:
const CRITICAL_PAGES: [string, string][] = [
  ['/', 'Home'],
  ['/about/', 'About'],
  ['/sermons/', 'Sermons'],
  ['/contact/', 'Contact'],
  ['/events/', 'Events'],
  ['/visit/', 'Visit'],
  ['/give/', 'Give'],
  ['/zh/', 'Home (Chinese)'],
  ['/zh/contact/', 'Contact (Chinese)'],
  ['/zh/about/', 'About (Chinese)'],
];

// After:
const CRITICAL_PAGES: [string, string][] = [
  ['/', 'Splash'],
  ['/en/', 'Home (English)'],
  ['/en/about/', 'About'],
  ['/en/sermons/', 'Sermons'],
  ['/en/contact/', 'Contact'],
  ['/en/events/', 'Events'],
  ['/en/visit/', 'Visit'],
  ['/en/give/', 'Give'],
  ['/zh/', 'Home (Chinese)'],
  ['/zh/contact/', 'Contact (Chinese)'],
  ['/zh/about/', 'About (Chinese)'],
];
```

- [ ] **Step 3: Update `e2e/bilingual.spec.ts`**

Update the language toggle tests:

```ts
// Before:
test('EN home has lang toggle pointing to /zh', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const langToggle = page.locator('.lang-toggle');
  await expect(langToggle).toBeVisible();
  const href = await langToggle.getAttribute('href');
  expect(href).toBe('/zh');
});

// After:
test('EN home has lang toggle pointing to /zh', async ({ page }) => {
  await page.goto('/en/', { waitUntil: 'domcontentloaded' });
  const langToggle = page.locator('.lang-toggle');
  await expect(langToggle).toBeVisible();
  const href = await langToggle.getAttribute('href');
  expect(href).toBe('/zh');
});
```

```ts
// Before:
test('ZH home has lang toggle pointing to /', async ({ page }) => {
  await page.goto('/zh/', { waitUntil: 'domcontentloaded' });
  const langToggle = page.locator('.lang-toggle');
  await expect(langToggle).toBeVisible();
  const href = await langToggle.getAttribute('href');
  expect(href).toBe('/');
});

// After:
test('ZH home has lang toggle pointing to /en/', async ({ page }) => {
  await page.goto('/zh/', { waitUntil: 'domcontentloaded' });
  const langToggle = page.locator('.lang-toggle');
  await expect(langToggle).toBeVisible();
  const href = await langToggle.getAttribute('href');
  expect(href).toBe('/en/');
});
```

```ts
// Before:
test('EN /about has lang toggle pointing to /zh/about', async ({ page }) => {
  await page.goto('/about/', { waitUntil: 'domcontentloaded' });

// After:
test('EN /en/about has lang toggle pointing to /zh/about', async ({ page }) => {
  await page.goto('/en/about/', { waitUntil: 'domcontentloaded' });
```

```ts
// Before:
test('ZH /zh/contact/ has lang toggle pointing to /contact', async ({ page }) => {
  await page.goto('/zh/contact/', { waitUntil: 'domcontentloaded' });
  const langToggle = page.locator('.lang-toggle');
  const href = await langToggle.getAttribute('href');
  expect(href).toBe('/contact');
});

// After:
test('ZH /zh/contact/ has lang toggle pointing to /en/contact', async ({ page }) => {
  await page.goto('/zh/contact/', { waitUntil: 'domcontentloaded' });
  const langToggle = page.locator('.lang-toggle');
  const href = await langToggle.getAttribute('href');
  expect(href).toBe('/en/contact');
});
```

Update hreflang tests:

```ts
// Before:
test('EN home page has hreflang tags', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

// After:
test('EN home page has hreflang tags', async ({ page }) => {
  await page.goto('/en/', { waitUntil: 'domcontentloaded' });
```

```ts
// Before:
test('hreflang en points to EN URL, zh points to ZH URL', async ({ page }) => {
  await page.goto('/about/', { waitUntil: 'domcontentloaded' });

// After:
test('hreflang en points to EN URL, zh points to ZH URL', async ({ page }) => {
  await page.goto('/en/about/', { waitUntil: 'domcontentloaded' });
```

Update the hreflang content assertions:

```ts
// Before:
expect(enHref).toContain('/about');
expect(enHref).not.toContain('/zh');

// After:
expect(enHref).toContain('/en/about');
expect(enHref).not.toContain('/zh');
```

- [ ] **Step 4: Run unit tests**

```bash
npm test
```

Expected: All navigation tests pass.

- [ ] **Step 5: Build to prepare for E2E**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add lighthouserc.cjs e2e/smoke.spec.ts e2e/bilingual.spec.ts
git commit -m "test: update LHCI URLs and E2E tests for splash + /en/ prefix"
```

---

## Task 10: Final verification

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 2: Run unit tests**

```bash
npm test
```

Expected: All pass.

- [ ] **Step 3: Verify splash page structure**

```bash
# Splash at root
grep -q "noindex" dist/client/index.html && echo "noindex ✓"
grep -q 'href="/en/"' dist/client/index.html && echo "EN link ✓"
grep -q 'href="/zh/"' dist/client/index.html && echo "ZH link ✓"
grep -q "waterfall-landing" dist/client/index.html && echo "Image ✓"
grep -q "splash-fade-in" dist/client/index.html && echo "Animation ✓"

# EN pages exist under /en/
test -f dist/client/en/index.html && echo "/en/ ✓"
test -f dist/client/en/about/index.html && echo "/en/about ✓"
test -f dist/client/en/contact/index.html && echo "/en/contact ✓"
test -f dist/client/en/sermons/index.html && echo "/en/sermons ✓"

# ZH pages unchanged
test -f dist/client/zh/index.html && echo "/zh/ ✓"
test -f dist/client/zh/about/index.html && echo "/zh/about ✓"

# EN nav links updated
grep -q 'href="/en/about"' dist/client/en/index.html && echo "EN nav ✓"

# Hreflang x-default points to root
grep -q 'hreflang="x-default"' dist/client/en/index.html && echo "x-default ✓"
```

- [ ] **Step 4: Start dev server and visually check splash**

```bash
npx serve dist/client -l 4321
```

Open `http://localhost:4321/` in browser and verify:
- Waterfall background loads
- Logo, church names, and buttons fade in with stagger
- Both buttons are equal size/style
- "English" navigates to `/en/`
- "中文" navigates to `/zh/`
- `/en/` shows the full EN homepage with header/footer
- Language toggle in header works between `/en/` and `/zh/`

- [ ] **Step 5: Run E2E tests**

```bash
npm run test:e2e
```

Review failures — some may need adjustment based on how the static server handles the splash page without middleware.

- [ ] **Step 6: Commit any remaining fixes**

```bash
git add -A
git commit -m "fix: address issues found during final verification"
```

(Only if there are actual fixes needed.)
