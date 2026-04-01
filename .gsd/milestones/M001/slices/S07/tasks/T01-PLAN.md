---
estimated_steps: 42
estimated_files: 2
skills_used: []
---

# T01: Create SEO component and wire into BaseLayout

## Description

Build `src/components/SEO.astro` that renders all meta/OG tags, Twitter card tags, and JSON-LD structured data for the church. Wire it into `BaseLayout.astro` replacing the hand-written `<title>` and `<meta name="description">` tags. Every page using BaseLayout will automatically get full SEO markup.

## Steps

1. Create `src/components/SEO.astro` with typed Props interface:
   - `title` (required string)
   - `description` (optional string, default to site description)
   - `canonicalUrl` (optional string — derived from `Astro.url` if not provided)
   - `ogImage` (optional string, default `/og-default.png`)
   - `ogType` (optional string, default `website`)
   - `lang` (optional string, default `en`)
   - `jsonLd` (optional object — override for custom structured data)
2. In SEO.astro, render:
   - `<title>{title}</title>`
   - `<meta name="description">` 
   - `<link rel="canonical">` using `new URL(Astro.url.pathname, Astro.site).href`
   - OG tags: `og:title`, `og:description`, `og:url` (same as canonical), `og:image` (absolute URL via `new URL(ogImage, Astro.site).href`), `og:type`, `og:locale` (map `en`→`en_US`, `zh`→`zh_CN`)
   - Twitter card: `twitter:card` = `summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
   - JSON-LD: Default to Church schema (`@context: https://schema.org`, `@type: Church`, name, description, url). Use `JSON.stringify()` for the JSON content. Use Astro's `set:html` for the script tag content to avoid HTML escaping.
3. Update `BaseLayout.astro`:
   - Import SEO component
   - Remove the existing `<title>` and `<meta name="description">` tags
   - Add `<SEO title={title} description={description} lang={lang} />` in the `<head>`
   - Pass `Astro.url` and `Astro.site` implicitly (SEO.astro uses its own Astro context)
4. Run `npm run build` and verify the built index.html contains OG tags, canonical URL, and JSON-LD block.

## Must-Haves

- [ ] SEO.astro renders og:title, og:description, og:url, og:image, og:type meta tags
- [ ] SEO.astro renders twitter:card, twitter:title, twitter:description, twitter:image meta tags
- [ ] SEO.astro renders JSON-LD script with @type Church and JSON.stringify (not hand-written JSON)
- [ ] Canonical URL derived from Astro.site + Astro.url.pathname (not hardcoded)
- [ ] OG image URL is absolute (derived from Astro.site)
- [ ] BaseLayout no longer has raw <title> or <meta name="description"> — SEO component handles both
- [ ] `npm run build` succeeds

## Verification

- `npm run build` exits 0
- `grep -q 'og:title' dist/index.html` succeeds
- `grep -q 'og:description' dist/index.html` succeeds  
- `grep -q 'og:url' dist/index.html` succeeds
- `grep -q 'og:image' dist/index.html` succeeds
- `grep -q 'application/ld+json' dist/index.html` succeeds
- `grep -q 'Church' dist/index.html` succeeds (JSON-LD @type)
- `grep -q 'twitter:card' dist/index.html` succeeds
- `grep -q 'canonical' dist/index.html` succeeds

## Inputs

- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`

## Expected Output

- `src/components/SEO.astro`
- `src/layouts/BaseLayout.astro`

## Verification

npm run build && grep -q 'og:title' dist/index.html && grep -q 'application/ld+json' dist/index.html && grep -q 'twitter:card' dist/index.html && grep -q 'canonical' dist/index.html
