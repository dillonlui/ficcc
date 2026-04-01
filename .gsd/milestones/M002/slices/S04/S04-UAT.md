# S04: Sermons Library — UAT

**Milestone:** M002
**Written:** 2026-04-01T13:54:00.474Z

# S04: Sermons Library — UAT

**Milestone:** M002
**Written:** 2026-04-01

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: Static site — pages are built at build time. Build success with zero CMS sermons proves empty-state handling. Component structure and filter behavior are verifiable via source inspection and build output.

## Preconditions

- `npm run build` succeeds (confirms pages generate without runtime errors)
- Sanity Studio accessible at /admin for content entry (optional — pages work with zero sermons)

## Smoke Test

Run `npm run build` — should complete with no errors, producing /sermons/index.html in dist/.

## Test Cases

### 1. Sermons listing page renders correctly

1. Run `npm run dev` and navigate to http://localhost:4321/sermons
2. Verify Hero section displays with "Sermons" title
3. Verify filter bar shows "All" button
4. With zero sermons in CMS, verify fallback "No sermons available" message appears
5. **Expected:** Page loads without errors, shows hero and empty-state message

### 2. Series filter works with sermon data

1. In Sanity Studio, create 2+ sermons with different series values (e.g. "Genesis", "Psalms")
2. Rebuild and navigate to /sermons
3. Verify filter bar shows "All" + one pill per distinct series
4. Click a series pill — only sermons matching that series remain visible
5. Click "All" — all sermons reappear
6. **Expected:** Filter toggles visibility correctly, active pill has visual distinction

### 3. Sermon card displays all metadata

1. Create a sermon in Sanity with title, speaker, date, scripture, series, and slug
2. Navigate to /sermons
3. Verify card shows: title as link, series badge, formatted date, speaker name, scripture reference
4. **Expected:** All metadata fields render; card links to /sermons/{slug}

### 4. Sermon detail page renders with metadata

1. Click a sermon card link from the listing
2. Verify URL is /sermons/{slug}
3. Verify page shows: sermon title in Hero, metadata grid (speaker, date, scripture, series), back link to /sermons
4. **Expected:** All metadata present, back link works

### 5. YouTube embed renders conditionally

1. Create a sermon with a videoId field populated
2. Navigate to /sermons/{slug} for that sermon
3. Verify YouTube embed appears with 16:9 aspect ratio
4. Verify iframe src uses youtube-nocookie.com
5. Create a sermon without videoId — verify no embed section renders
6. **Expected:** Embed present only when videoId exists, uses privacy-enhanced domain

## Edge Cases

### Empty CMS state

1. Remove all sermon documents from Sanity (or use placeholder project ID)
2. Run `npm run build`
3. **Expected:** Build succeeds. /sermons shows fallback message. No [slug] pages generated.

### Sermon without optional fields

1. Create a sermon with only title and slug (no speaker, scripture, series, videoId)
2. Navigate to /sermons and then to the detail page
3. **Expected:** Page renders without errors. Missing fields simply don't display.

## Failure Signals

- `npm run build` fails with Sanity fetch errors (try-catch should prevent this)
- Filter buttons don't toggle card visibility (inline script broken)
- Detail page 404s (slug field not in GROQ projection or getStaticPaths misconfigured)
- YouTube embed renders when videoId is missing (conditional logic broken)

## Not Proven By This UAT

- Sermon search/pagination for large libraries
- Series filter overflow behavior on mobile with many series
- CMS content editing workflow (creating/publishing sermons in Sanity Studio)

## Notes for Tester

- The filter is pure inline JS — no framework hydration. Check that it works with JS enabled and gracefully shows all sermons with JS disabled.
- SermonCard uses color-mix() for series badge tinting — verify in browsers that support it (all modern browsers do).
