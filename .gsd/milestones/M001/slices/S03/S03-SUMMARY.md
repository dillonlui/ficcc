---
id: S03
parent: M001
milestone: M001
provides:
  - Header component (responsive nav, mobile hamburger, language toggle)
  - Footer component (church info, service times, nav, dynamic copyright)
  - Hero component (full-width background image with overlay and CTA)
  - Card component (versatile content card with optional image/link)
  - ImageMosaic component (responsive CSS Grid image gallery)
  - Accordion component (native details/summary FAQ)
  - ContactForm component (validated HTML form, no submission handler)
  - AudioPlayer component (native audio controls in styled wrapper)
  - BaseLayout with Header/Footer site chrome on all pages
  - /styleguide page showcasing all 8 components
requires:
  - slice: S02
    provides: Design tokens (CSS custom properties) in global.css — colors, typography scale, spacing, radii
affects:
  - S04
  - S05
  - S06
key_files:
  - src/components/Header.astro
  - src/components/Footer.astro
  - src/components/Hero.astro
  - src/components/Card.astro
  - src/components/ImageMosaic.astro
  - src/components/Accordion.astro
  - src/components/ContactForm.astro
  - src/components/AudioPlayer.astro
  - src/layouts/BaseLayout.astro
  - src/styles/global.css
  - src/pages/styleguide.astro
key_decisions:
  - D010: Pure Astro components with scoped CSS, no JS framework — native HTML for interactivity
  - Mobile nav uses JS-toggled slide-out drawer with aria-expanded
  - Hero uses CSS background-image prop so gradients and URLs both work
  - Card renders as <a> when href provided, <div> otherwise
  - ImageMosaic uses modulo-based class assignment for varied grid spans
  - Footer headings changed from h3 to h2 for proper heading order
  - Lang toggle uses --color-ink for WCAG AA contrast
patterns_established:
  - All components use only CSS custom properties from global.css — no hardcoded values
  - Interactive behavior via native HTML elements (details/summary, audio controls) with inline scripts only where unavoidable (hamburger)
  - Components accept props for content, render semantic HTML, and are showcased on /styleguide with sample data
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M001/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S03/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T01:12:13.378Z
blocker_discovered: false
---

# S03: Base Components

**Built all 8 shared UI components (Header, Footer, Hero, Card, ImageMosaic, Accordion, ContactForm, AudioPlayer) as pure Astro components using design tokens, wired Header/Footer into BaseLayout, and showcased everything on /styleguide with Lighthouse CI passing a11y ≥ 0.95.**

## What Happened

Three tasks built the full component library in dependency order.

T01 created the site frame — Header with responsive nav, mobile hamburger (JS-toggled with aria-expanded), language toggle, and sticky positioning; Footer with three-column grid (church identity EN+ZH, service times, nav links) and dynamic copyright year. Both wired into BaseLayout so all pages get the site chrome. Added --color-focus, --max-width, and --color-bg-dark tokens to global.css.

T02 built the visual content components — Hero (full-width with CSS background-image prop, dark overlay, heading/subtitle/CTA), Card (optional image with aspect-ratio 3/2, renders as link or div based on href prop), and ImageMosaic (CSS Grid with modulo-based cell spanning, responsive 3/2/1-column breakpoints). All showcased on /styleguide with gradient backgrounds and SVG placeholders.

T03 completed the interactive/media components — Accordion (native details/summary, zero JS), ContactForm (HTML form with label/for associations, HTML validation, no action attribute — deferred to S05), and AudioPlayer (native audio controls in styled wrapper). T03 also fixed three a11y issues in Header and Footer that surfaced during Lighthouse CI: color contrast on language toggle, heading order in footer (h3→h2), and label-content-name-mismatch on the toggle button. After fixes, Lighthouse CI passes on both pages with a11y ≥ 0.95.

## Verification

All verification checks pass across the three tasks: npm run build succeeds (2 pages, 384ms, 0 errors). All 8 component files exist. BaseLayout imports Header and Footer. Header contains aria-expanded for accessible hamburger. Accordion uses native details element. ContactForm has proper label elements. AudioPlayer uses native audio element. Lighthouse CI (npx @lhci/cli autorun) passes all assertions including a11y ≥ 0.95 on both homepage and styleguide.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

T03 fixed three a11y issues in Header.astro and Footer.astro (color contrast on lang-toggle, heading order h3→h2 in footer, label-content-name-mismatch on lang-toggle) that were introduced in T01 but only surfaced during T03's Lighthouse CI run.

## Known Limitations

ContactForm has no action attribute — form submission is deferred to S05. AudioPlayer renders with placeholder src — no real audio content until Sanity integration. Language toggle is static (visual only) — routing logic deferred to bilingual content work.

## Follow-ups

None.

## Files Created/Modified

- `src/components/Header.astro` — Responsive header with nav, mobile hamburger (aria-expanded), language toggle, sticky positioning
- `src/components/Footer.astro` — Three-column footer with church identity EN+ZH, service times, nav links, dynamic copyright
- `src/components/Hero.astro` — Full-width hero with CSS background-image, dark overlay, heading/subtitle/CTA
- `src/components/Card.astro` — Content card with optional image (aspect-ratio 3/2) and optional link wrapping
- `src/components/ImageMosaic.astro` — CSS Grid image gallery with modulo-based spanning, responsive breakpoints
- `src/components/Accordion.astro` — FAQ accordion using native details/summary, zero JS
- `src/components/ContactForm.astro` — HTML form with label associations, HTML validation, no submission handler
- `src/components/AudioPlayer.astro` — Native audio controls in styled wrapper with title/speaker metadata
- `src/layouts/BaseLayout.astro` — Added Header and Footer imports wrapping the slot
- `src/styles/global.css` — Added --color-focus, --max-width, --color-bg-dark tokens
- `src/pages/styleguide.astro` — Added showcase sections for all 8 components with sample data
