# S02: SEO & Analytics — UAT

**Milestone:** M004
**Written:** 2026-04-02T16:52:49.978Z

# S02: SEO & Analytics — UAT

**Milestone:** M004
**Written:** 2026-03-31

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: All deliverables are build-time artifacts (HTML meta tags, JSON-LD, sitemap XML, conditional scripts). No runtime server behavior to test.

## Preconditions

- Repository cloned with dependencies installed (`npm install`)
- No env vars required for baseline checks (GA4/verification are tested both with and without)

## Smoke Test

Run `npm run build` — should succeed. Open `dist/client/index.html` and confirm it contains both `og:image` meta tag and `application/ld+json` script block.

## Test Cases

### 1. Default OG Image Exists

1. Check `public/og-default.png` exists
2. Verify dimensions are 1200×630
3. **Expected:** File exists at correct dimensions

### 2. OG Meta Tags in Built HTML

1. Run `npm run build`
2. Open `dist/client/index.html`
3. Search for `og:image` meta tag
4. **Expected:** `<meta property="og:image"` present with `/og-default.png` path

### 3. Homepage JSON-LD Contains Church + WebSite

1. Run `npm run build`
2. Open `dist/client/index.html`
3. Find `<script type="application/ld+json">` block
4. Parse the JSON
5. **Expected:** Contains `@graph` array with `@type: "Church"` (name, address with Ithaca NY) and `@type: "WebSite"` entries

### 4. About Page JSON-LD Contains Organization

1. Open `dist/client/about/index.html`
2. Find JSON-LD block
3. **Expected:** Contains `@type: "Organization"` with `foundingDate: "1968"`

### 5. Events Page JSON-LD Contains ItemList

1. Open `dist/client/events/index.html`
2. Find JSON-LD block
3. **Expected:** Contains `@type: "ItemList"` with nested Event items

### 6. Sitemap Includes Hreflang Entries

1. Open `dist/client/sitemap-0.xml`
2. Search for `xhtml:link`
3. **Expected:** Alternate hreflang links present for en/zh locale pairs

### 7. GA4 Script Absent Without Env Var

1. Run `npm run build` (without PUBLIC_GA_MEASUREMENT_ID set)
2. Search `dist/client/index.html` for `googletagmanager`
3. **Expected:** No GA4 script present

### 8. GA4 Script Present With Env Var

1. Run `PUBLIC_GA_MEASUREMENT_ID=G-TEST123 npm run build`
2. Search `dist/client/index.html` for `googletagmanager`
3. **Expected:** GA4 script block present with G-TEST123 measurement ID. `window.sendAnalyticsEvent` function defined.

### 9. Google Site Verification Absent Without Env Var

1. Run `npm run build` (without PUBLIC_GOOGLE_SITE_VERIFICATION set)
2. Search for `google-site-verification` in built HTML
3. **Expected:** No verification meta tag present

### 10. Structured Data Unit Tests Pass

1. Run `npm test`
2. **Expected:** All 7 structured data tests pass (Church, WebSite, VideoObject with/without videoId, Event, Organization, Church required fields)

## Edge Cases

### Sermon Page Without VideoId

1. Review `src/pages/sermons/[slug].astro` source
2. Confirm VideoObject JSON-LD only emits when `sermon.videoId` exists
3. **Expected:** No VideoObject in JSON-LD when videoId is missing (verified by unit test `buildVideoObjectJsonLd - returns minimal object when optional fields missing`)

### Build Without Sanity Connection

1. Run `npm run build` with placeholder Sanity credentials
2. **Expected:** Build succeeds using fallback content. JSON-LD still emitted from hardcoded structured data builders (they don't depend on CMS data).

## Failure Signals

- `npm run build` fails
- `npm test` has failures in structured-data.test.ts
- `og:image` missing from built HTML head
- `application/ld+json` blocks missing from page HTML
- `xhtml:link` absent from sitemap XML
- GA4 script present when env var is unset (privacy leak)

## Not Proven By This UAT

- GA4 actually receiving events in Google Analytics dashboard (requires live measurement ID)
- Google Search Console verification completing (requires domain ownership)
- OG preview rendering correctly on social platforms (requires deployed URL + social platform fetch)
- Sermon detail page JSON-LD in built output (requires live CMS with sermon data)

## Notes for Tester

- The default OG image is a plain navy placeholder — visually uninteresting but structurally correct. Replace before launch.
- Structured data can be validated at https://validator.schema.org/ by pasting the built HTML.
- The sendAnalyticsEvent helper is available on window but not called anywhere yet — downstream work (sermon player, language toggle, contact form) should wire it up.
