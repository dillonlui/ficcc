# S04: Language Toggle & Bilingual Wiring — UAT

**Milestone:** M003
**Written:** 2026-04-01T17:16:45.271Z

# S04: Language Toggle & Bilingual Wiring — UAT

**Milestone:** M003
**Written:** 2026-03-31

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: Language toggle behavior is fully testable via built HTML output — toggle hrefs, hreflang tags, and cookie script are all static artifacts. Unit tests cover the URL computation logic.

## Preconditions

- `npm run build` succeeds (produces `dist/client/`)
- `npx vitest run` passes 20/20 tests

## Smoke Test

Open `dist/client/about/index.html` and confirm it contains a link to `/zh/about` (the language toggle) and `hreflang="zh"` (SEO tag).

## Test Cases

### 1. Standard EN→ZH toggle

1. Open `dist/client/about/index.html`
2. Find the `.lang-toggle` link in the header
3. **Expected:** `href="/zh/about"`

### 2. Standard ZH→EN toggle

1. Open `dist/client/zh/about/index.html`
2. Find the `.lang-toggle` link in the header
3. **Expected:** `href="/about"`

### 3. Asymmetric route: Visit→Sundays

1. Open `dist/client/visit/index.html`
2. Find the `.lang-toggle` link
3. **Expected:** `href="/zh/sundays"` (not `/zh/visit`)

### 4. Asymmetric route: Sundays→Visit

1. Open `dist/client/zh/sundays/index.html`
2. Find the `.lang-toggle` link
3. **Expected:** `href="/visit"` (not `/sundays`)

### 5. Hreflang tags on EN page

1. Open `dist/client/about/index.html`
2. Check `<head>` for `<link rel="alternate">` tags
3. **Expected:** Three tags present:
   - `hreflang="en"` pointing to the canonical EN URL
   - `hreflang="zh"` pointing to the ZH alternate
   - `hreflang="x-default"` pointing to the EN URL

### 6. Hreflang tags on ZH page

1. Open `dist/client/zh/about/index.html`
2. Check `<head>` for `<link rel="alternate">` tags
3. **Expected:** Three tags with `hreflang="en"`, `hreflang="zh"`, and `hreflang="x-default"`

### 7. Cookie script present

1. Open `dist/client/about/index.html`
2. Search for `lang-pref` in the HTML
3. **Expected:** Inline script that sets `lang-pref` cookie on `.lang-toggle` click with `path=/`, `max-age=31536000`, `SameSite=Lax`

### 8. Homepage toggle

1. Open `dist/client/index.html` — toggle should point to `/zh`
2. Open `dist/client/zh/index.html` — toggle should point to `/`

## Edge Cases

### EN-only page fallback (styleguide)

1. Open `dist/client/styleguide/index.html`
2. Find the `.lang-toggle` link
3. **Expected:** `href="/zh"` (falls back to ZH homepage since styleguide has no ZH counterpart)

### Nested path toggle

1. Open `dist/client/about/beliefs/index.html`
2. Find the `.lang-toggle` link
3. **Expected:** `href="/zh/about/beliefs"`

## Failure Signals

- Toggle link pointing to wrong URL (e.g. `/zh/visit` instead of `/zh/sundays`)
- Missing hreflang tags in `<head>`
- Missing `lang-pref` cookie script
- Build failure due to import errors in navigation.ts
- Vitest test failures

## Not Proven By This UAT

- Runtime cookie behavior (requires browser execution, not artifact inspection)
- Server-side language redirect based on cookie (not implemented — static site)
- SEO crawler behavior with hreflang tags (requires live crawl)

## Notes for Tester

- All checks can be done via grep on `dist/client/` files — no dev server needed
- The cookie script sets the *target* language, not the current language. This is intentional.
- Asymmetric routes are the trickiest part — `/visit` and `/zh/sundays` are the same page in different languages but have different URL structures
