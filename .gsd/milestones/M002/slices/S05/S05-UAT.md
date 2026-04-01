# S05: Community & Ministries — UAT

**Milestone:** M002
**Written:** 2026-04-01T14:02:08.815Z

# S05: Community & Ministries — UAT

**Milestone:** M002
**Written:** 2026-04-01

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: Static site — all pages are pre-built at build time. Build success confirms route generation and template rendering. No runtime behavior to test.

## Preconditions

- `npm run build` succeeds
- At least one ministry document exists in Sanity with a slug, or tester accepts empty-state rendering

## Smoke Test

Navigate to `/ministries` — page loads with Hero section showing "Community & Ministries" heading.

## Test Cases

### 1. Hub Page Renders

1. Open `/ministries` in browser
2. Verify Hero section displays with title
3. Verify page uses site Header and Footer (BaseLayout)
4. **Expected:** Full page chrome with ministry hub content area

### 2. Ministry Cards Display When Content Exists

1. Add a ministry in Sanity with name, slug, image, and meetingTime
2. Rebuild the site (`npm run build`)
3. Open `/ministries`
4. **Expected:** Card appears with ministry name, image, and meeting time. Card links to `/ministries/{slug}`.

### 3. Responsive Card Grid

1. Open `/ministries` with seeded ministry content
2. Resize browser: desktop (>900px), tablet (600-900px), mobile (<600px)
3. **Expected:** Grid displays 3 columns → 2 columns → 1 column

### 4. Detail Page Renders

1. Open `/ministries/{slug}` for an existing ministry
2. **Expected:** Hero with ministry name, back link to /ministries, leader section (photo, name, role) if leader assigned, meeting time, and description rendered as HTML

### 5. Detail Page Leader Section

1. Create a ministry with a linked leader (person document with name, role, photo)
2. Rebuild and navigate to that ministry's detail page
3. **Expected:** Leader photo, name, and role display. If no leader assigned, leader section is absent (not broken).

### 6. Portable Text Description

1. Add rich text (bold, italic, links) to a ministry's description in Sanity
2. Rebuild and navigate to detail page
3. **Expected:** Description renders as formatted HTML, not raw markup

## Edge Cases

### Empty State — No Ministries

1. Ensure no ministry documents exist in Sanity (or none have slugs)
2. Build and open `/ministries`
3. **Expected:** Page renders without errors. May show empty grid or fallback message.

### Invalid Slug

1. Navigate to `/ministries/nonexistent-slug`
2. **Expected:** Redirects to `/ministries` hub (not a broken page or 500 error)

### Ministry Without Image

1. Create a ministry with slug but no image
2. Rebuild and open `/ministries`
3. **Expected:** Card renders without image (no broken img tag or layout collapse)

## Failure Signals

- Build fails with template errors in ministries pages
- `/ministries` returns 404
- Cards render without links (missing slug)
- Detail page shows raw portable text instead of formatted HTML
- Client-side JavaScript errors on any ministries page

## Not Proven By This UAT

- Actual Sanity content migration (content not seeded yet)
- Visual design polish and spacing (requires design review)
- Chinese language variant of ministry pages (future milestone)

## Notes for Tester

- Without Sanity content, pages render in empty/fallback state — this is expected
- Pre-existing type errors in sanity.config.ts and sanity/structure.ts are unrelated to this slice
- MinistryCard reuses the shared Card.astro component, so Card styling changes will propagate
