# S03: Base Components — UAT

**Milestone:** M001
**Written:** 2026-04-01T01:12:13.379Z

# S03: Base Components — UAT

**Milestone:** M001
**Written:** 2026-03-31

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: All components are static Astro components rendered at build time. No runtime behavior to test — visual inspection of /styleguide confirms rendering, and Lighthouse CI confirms a11y.

## Preconditions

- `npm run build` succeeds (confirms all components compile)
- Dev server running via `npm run dev` for visual inspection

## Smoke Test

Open `http://localhost:4321/styleguide` — page loads with Header at top, Footer at bottom, and showcase sections for all 8 components between them.

## Test Cases

### 1. Header renders with full navigation

1. Open `http://localhost:4321/styleguide`
2. Observe the sticky header at page top
3. Verify navigation links visible: Home, About, Ministries, Sermons, Contact
4. Verify language toggle button (EN/中文) is visible
5. **Expected:** All nav links render in a horizontal row on desktop. Language toggle button is visible with readable text.

### 2. Mobile hamburger menu

1. Resize browser to < 768px width
2. Observe hamburger button appears, nav links are hidden
3. Click hamburger button
4. **Expected:** Nav menu slides out / becomes visible. Button shows aria-expanded="true". Click again to close — menu hides, aria-expanded="false".

### 3. Footer renders with church information

1. Scroll to bottom of any page
2. Verify three sections: church identity (EN + ZH name), service times, and nav links
3. Verify copyright year is current (2026)
4. **Expected:** Footer has dark background (--color-bg-dark), three-column layout on desktop, stacked on mobile.

### 4. Hero component renders with overlay and CTA

1. On /styleguide, scroll to Hero section
2. Verify hero has gradient background, dark overlay, title text, subtitle, and CTA button
3. **Expected:** Text is readable over the overlay. CTA renders as a styled button/link.

### 5. Card component handles variants

1. On /styleguide, scroll to Cards section
2. Verify 3 cards render: one with image + link, one with image only, one text-only
3. **Expected:** Cards with href are clickable (wrapped in `<a>`). Cards without href are static divs. Images maintain 3:2 aspect ratio.

### 6. ImageMosaic responsive grid

1. On /styleguide, scroll to ImageMosaic section
2. Verify 6 image cells render in a grid with varied spans
3. Resize browser: 3 columns on desktop, 2 on tablet, 1 on mobile
4. **Expected:** Images fill their cells with object-fit: cover. No layout shifts.

### 7. Accordion expands and collapses

1. On /styleguide, scroll to Accordion section
2. Click a summary row
3. **Expected:** Content expands below the summary. No JavaScript required — native details/summary behavior. Click again to collapse.

### 8. ContactForm with validation

1. On /styleguide, scroll to ContactForm section
2. Verify fields: Name, Email, Message with associated labels
3. Click Submit without filling fields
4. **Expected:** Browser-native validation messages appear (required fields). Email field rejects non-email input. No form submission occurs (no action attribute).

### 9. AudioPlayer renders controls

1. On /styleguide, scroll to AudioPlayer section
2. Verify title and speaker text display above native audio controls
3. **Expected:** Native browser audio controls render. No audio plays (placeholder src).

## Edge Cases

### Header/Footer on homepage

1. Open `http://localhost:4321/`
2. **Expected:** Header and Footer render on the homepage via BaseLayout, framing the page content.

### Styleguide with all sections

1. Open `http://localhost:4321/styleguide`
2. Scroll through entire page
3. **Expected:** All 8 component showcase sections render without errors. Page scrolls smoothly. No broken layouts.

## Failure Signals

- Any component section missing from /styleguide
- `npm run build` fails
- Lighthouse a11y score drops below 0.95
- Missing labels on form fields
- Hamburger menu not toggling on mobile
- Hardcoded colors or sizes visible (not using CSS custom properties)

## Not Proven By This UAT

- Form submission (deferred to S05)
- Real audio playback (no real audio source)
- Language toggle routing (static button only)
- CMS-driven content in any component (deferred to S04/S06)
- Cross-browser testing beyond Lighthouse's Chromium

## Notes for Tester

- The Hero background uses a CSS gradient, not a real image — this is intentional for the styleguide demo.
- ImageMosaic uses inline SVG placeholders, not real photos.
- ContactForm intentionally has no action — submitting shows validation but doesn't send data.
- AudioPlayer has an empty/placeholder src — the controls render but nothing plays.
