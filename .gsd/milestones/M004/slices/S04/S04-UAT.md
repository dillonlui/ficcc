# S04: Pagefind Search Integration — UAT

**Milestone:** M004
**Written:** 2026-04-02T17:14:19.307Z

# S04: Pagefind Search Integration — UAT

**Milestone:** M004
**Written:** 2026-04-02

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: Search is a build-time integration — the index is generated at build time and the E2E tests exercise the full runtime behavior including modal interaction and result rendering. No live CMS data or server-side state involved.

## Preconditions

- `npm run build` has completed successfully (Pagefind indexes during build)
- Site is served locally (e.g. `npx serve dist/client -l 4321` or Playwright's webServer config)

## Smoke Test

Navigate to homepage, click the magnifying glass icon in the header. A search modal should appear with a text input. Type "sermon" — results should appear within 1 second.

## Test Cases

### 1. Search modal opens from header button

1. Navigate to the homepage (`/`)
2. Locate the magnifying glass button in the header
3. Click it
4. **Expected:** A modal overlay appears with a Pagefind search input focused. The modal has a semi-transparent backdrop.

### 2. Search returns results for English content

1. Open the search modal
2. Type "sermon" into the search input
3. Wait 1 second for results
4. **Expected:** At least one search result appears, showing page titles/excerpts from the Sermons section.

### 3. Search returns results for Chinese content

1. Open the search modal
2. Type "教會" (church) into the search input
3. Wait 1 second for results
4. **Expected:** At least one search result appears from ZH pages.

### 4. Escape key closes the modal

1. Open the search modal
2. Press the Escape key
3. **Expected:** The modal closes and is no longer visible. Focus returns to the page.

### 5. Backdrop click closes the modal

1. Open the search modal
2. Click the dark backdrop area outside the search content
3. **Expected:** The modal closes.

### 6. Close button dismisses the modal

1. Open the search modal
2. Click the × close button in the top-right of the modal
3. **Expected:** The modal closes.

### 7. Search button visible on mobile viewport

1. Resize viewport to 375px width (mobile)
2. Look at the header
3. **Expected:** The magnifying glass search button is visible alongside the hamburger menu button.

## Edge Cases

### Empty query shows no results

1. Open the search modal
2. Leave the input empty or clear it
3. **Expected:** No results section is displayed. The modal shows only the search input.

### Non-matching query

1. Open the search modal
2. Type "xyzzyplugh" (a string that matches nothing)
3. **Expected:** Pagefind shows a "no results" message or empty results area.

### Excluded pages not in results

1. Open the search modal
2. Type "styleguide" or "admin"
3. **Expected:** The styleguide and admin pages do NOT appear in search results (they are excluded via data-pagefind-ignore).

## Failure Signals

- Search button missing from header on any page
- Modal does not appear when search button is clicked
- No results for common terms like "sermon", "church", "about"
- Modal does not close on Escape, backdrop click, or close button
- Pagefind JS errors in browser console
- Build fails or `dist/client/pagefind/pagefind.js` is missing

## Not Proven By This UAT

- Language-scoped search filtering (EN queries showing only EN results) — Pagefind indexes all languages together
- Search result ranking quality or relevance tuning
- Search performance under large content volume (current index is 24 pages)

## Notes for Tester

- Search results depend on build-time content — if pages have only placeholder/fallback text (no Sanity data), results will match that placeholder text
- The search modal z-index (200) should layer above everything including the mobile nav overlay (105)
