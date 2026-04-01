# S01: Homepage — UAT

**Milestone:** M002
**Written:** 2026-04-01T13:20:24.289Z

# S01: Homepage — UAT

**Milestone:** M002
**Written:** 2026-03-31

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: Homepage is a static page built at compile time — npm run build verifies all data wiring and component composition. Visual checks confirm layout at key breakpoints.

## Preconditions

- Repository checked out with all S01 changes
- `npm install` completed
- Dev server running (`npm run dev`) OR static build available (`npm run build`)

## Smoke Test

Run `npm run build` — should succeed with 0 errors, producing `/index.html` in dist. Open the built site or dev server at `/` and confirm all six sections render vertically in order.

## Test Cases

### 1. Hero Section Renders

1. Open homepage at `/`
2. Verify a full-width hero banner is visible at top of page
3. **Expected:** Hero shows a title ("Welcome to FICCC" or CMS-provided), subtitle text, and a CTA button. Background image or placeholder is visible.

### 2. Service Times Section

1. Scroll past the hero section
2. Locate the service times banner
3. **Expected:** Warm-toned horizontal banner showing at least one service time entry (e.g. "Sunday Gathering — 9:45 AM"). On mobile (375px), entries stack vertically. On desktop (1280px), entries display in a row.

### 3. Photo Mosaic Section

1. Scroll to the image mosaic area below service times
2. **Expected:** Grid of placeholder images (SVGs) renders in a mosaic layout. At least 4 images visible.

### 4. Pillars Section

1. Scroll to the "Who We Are" / pillars section
2. **Expected:** Three pillar cards visible, each with a title and description. On desktop, displayed in a 3-column grid. On mobile, stacked vertically.

### 5. Featured Content Section

1. Scroll to the featured content area
2. **Expected:** Section shows cards for latest sermon and next event. With no CMS data, hardcoded fallback cards render with placeholder content.

### 6. Next Steps Section

1. Scroll to the next steps area near the bottom
2. **Expected:** Grid of CTA cards (e.g. "Plan a Visit", "Watch Sermons") with links. Each card has a title, body text, and is clickable.

### 7. Full Page Build Verification

1. Run `npm run build`
2. **Expected:** Build completes with 0 errors. Output includes `/index.html`.

### 8. No Client-Side JavaScript in Section Components

1. Open `src/components/ServiceTimes.astro`, `Pillars.astro`, `NextSteps.astro`
2. Search for `client:` directives
3. **Expected:** No `client:` directives found in any of these three files. All rendering is server-side.

## Edge Cases

### Empty CMS State

1. Ensure Sanity has no homePage document published (or use a placeholder project ID)
2. Run `npm run build`
3. **Expected:** Build succeeds. Homepage renders with all sections using hardcoded fallback content — no blank sections or build errors.

### Sanity Unreachable

1. Disconnect network or use an invalid Sanity project ID
2. Run `npm run build`
3. **Expected:** Build succeeds. The try-catch around CMS fetches catches the error and all sections render with fallback content.

## Failure Signals

- `npm run build` fails with errors referencing Sanity queries or missing data
- Any homepage section renders blank (no content and no fallback)
- `client:` directives found in new section components
- Responsive layout breaks — sections overlap or overflow at 375px or 1280px

## Not Proven By This UAT

- Real CMS content rendering (requires published Sanity documents)
- Image optimization / CDN URL generation with real Sanity images
- Chinese language variant of the homepage
- Performance metrics (Lighthouse scores)

## Notes for Tester

- Placeholder images are intentionally simple SVGs — they'll be replaced with real church photography
- The featured content section will show richer data once sermon and event documents exist in Sanity
- All styles use CSS custom properties from global.css — check `/styleguide` for the design token reference
