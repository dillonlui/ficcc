---
estimated_steps: 22
estimated_files: 2
skills_used: []
---

# T03: Build Staff grid page with StaffCard component

Create the `/about/staff` page with a responsive staff grid and a new StaffCard component. Fetches person documents via `getStaff()` with try-catch and hardcoded fallbacks.

## Steps

1. Create `src/components/StaffCard.astro`:
   - Props: name (string), role (string), photoUrl (string, optional)
   - Render a card with photo (1:1 aspect ratio, `object-fit: cover`), name, role
   - Use placeholder SVG or CSS gradient when no photo
   - Pure Astro with scoped CSS using CSS custom properties
   - Responsive: works as grid child
2. Create `src/pages/about/staff.astro`:
   - Import BaseLayout, StaffCard, use `getStaff()` wrapped in try-catch
   - Hardcoded fallback with 3-4 realistic staff entries (Pastor, Associate Pastor, etc.)
   - Use `urlForImage()` for person photos from CMS
   - CSS Grid layout: 1 col on mobile (< 640px), 2 col tablet, 3 col desktop
   - Page heading and optional intro text
   - No client:* directives
3. Verify the page builds and the grid is responsive

## Must-Haves

- [ ] StaffCard component renders photo, name, role with 1:1 aspect ratio photo container
- [ ] /about/staff page renders responsive grid of staff cards
- [ ] Try-catch CMS fetch with realistic hardcoded fallbacks
- [ ] No client:* directives
- [ ] npm run build succeeds

## Inputs

- ``src/lib/sanity.ts` — getStaff(), urlForImage(), Person interface from T01`
- ``src/layouts/BaseLayout.astro` — page layout shell`
- ``src/pages/index.astro` — reference for CMS fetch + fallback pattern`

## Expected Output

- ``src/components/StaffCard.astro` — new staff card component`
- ``src/pages/about/staff.astro` — new staff grid page`

## Verification

test -f src/components/StaffCard.astro && test -f src/pages/about/staff.astro && ! grep -rq 'client:' src/components/StaffCard.astro src/pages/about/staff.astro && npm run build
