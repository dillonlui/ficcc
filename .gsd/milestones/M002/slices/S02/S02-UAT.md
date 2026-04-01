# S02: About / Beliefs / Staff — UAT

**Milestone:** M002
**Written:** 2026-04-01T13:32:21.449Z

# S02: About / Beliefs / Staff — UAT

**Milestone:** M002
**Written:** 2026-03-31

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: Static site — all pages are pre-rendered at build time. Build success confirms pages generate correctly. Visual/content verification is manual.

## Preconditions

- `npm run build` succeeds (confirmed during slice verification)
- Built output exists in `dist/` directory

## Smoke Test

Open `dist/about/index.html` in a browser — the Who We Are page should render with a heading, narrative text, and church identity content.

## Test Cases

### 1. About (Who We Are) page renders correctly

1. Open `/about` in browser
2. Verify page has a heading ("Who We Are" or similar)
3. Verify narrative body text is present describing FICCC's identity/mission
4. Verify responsive layout — text and optional image side by side on desktop, stacked on mobile
5. **Expected:** Complete identity page with church narrative, no blank sections, no broken layout

### 2. Beliefs page renders accordion with doctrinal statements

1. Open `/about/beliefs`
2. Verify intro text appears above the accordion
3. Verify 8 belief items are listed in the accordion (Scripture, God, Jesus Christ, Holy Spirit, Salvation, The Church, Christian Living, Future Things — or similar)
4. Click each accordion item — rich HTML content should expand (paragraphs, possibly bold/italic text)
5. **Expected:** All 8 beliefs expand/collapse individually with formatted content

### 3. Staff page renders responsive grid

1. Open `/about/staff`
2. Verify page heading and optional intro text
3. Verify 4 staff cards are displayed (Pastor, Associate Pastor, etc.)
4. Each card shows: 1:1 photo area (SVG placeholder if no photo), name, role
5. Resize browser: 1 column on mobile (<640px), 2 columns on tablet, 3 columns on desktop
6. **Expected:** Responsive grid with all staff cards visible and properly laid out

### 4. Accordion HTML rendering is non-breaking

1. Open `/about/beliefs`
2. Expand a belief item
3. Verify content renders as formatted HTML (not raw HTML tags visible as text)
4. Open any other page that uses the Accordion component (if any)
5. **Expected:** Accordion renders both plain text and HTML content correctly

### 5. No client-side JavaScript on About pages

1. Open browser DevTools on `/about`, `/about/beliefs`, `/about/staff`
2. Check that no page-specific JS bundles load (only global site JS if any)
3. **Expected:** Pages are pure static HTML+CSS with no hydration islands

## Edge Cases

### CMS unavailable during build

1. Build the site with Sanity API unreachable (e.g., invalid project ID)
2. **Expected:** Build still succeeds — all three pages render with hardcoded fallback content

### Staff page with no photos

1. Verify staff cards display SVG person silhouette placeholder when no photo URL is provided
2. **Expected:** Placeholder fills the 1:1 aspect ratio container cleanly — no broken image icons

## Failure Signals

- Build fails with errors in about/beliefs/staff pages
- Pages render with blank content sections
- Raw HTML tags visible as text in beliefs accordion (set:html not working)
- Staff grid doesn't respond to viewport changes
- client:* directives found in any about section page

## Not Proven By This UAT

- CMS content editing flow (requires Sanity Studio with real data)
- Staff ordering via CMS staffOrder field (requires populated CMS)
- portableTextToHtml rendering of all Portable Text mark types (only block/normal with strong/em/link tested)
- Chinese language variants of the about pages (M003 scope)

## Notes for Tester

- All pages use hardcoded fallback content since no CMS data is populated yet — this is expected
- The staff photos will all show SVG placeholders — this is the designed fallback behavior
- Beliefs content is realistic evangelical doctrinal statements used as placeholder text
