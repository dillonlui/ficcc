---
estimated_steps: 34
estimated_files: 5
skills_used: []
---

# T01: Build Header and Footer, wire into BaseLayout

Create the site Header (with responsive nav and mobile hamburger) and Footer components, wire them into BaseLayout so all pages get the site frame, add any needed design tokens to global.css, and add both components to the styleguide page.

## Steps

1. Add needed tokens to `src/styles/global.css`: `--color-focus` (focus ring color, use terracotta or derive), `--max-width` (content max-width, 72rem to match styleguide). Also add a `--color-bg-dark` or similar for footer background if the Gathered Warmth palette needs it.
2. Create `src/components/Header.astro`:
   - Semantic `<header>` with `<nav>` inside
   - Logo area: text wordmark 'FICCC' or 'First Ithaca Chinese Christian Church' using heading font
   - Nav links: Home, About, Ministries, Sermons, Contact (placeholder hrefs)
   - Language toggle button (EN/中文) — static, no routing logic yet
   - Mobile hamburger: use a `<button>` with `aria-expanded` toggling a nav menu via a small inline `<script>`. CSS hides nav on mobile, JS toggles visibility. Don't use CSS-only checkbox hack (fragile for a11y per research).
   - All styles via scoped `<style>` using CSS custom properties only
   - Responsive: full nav on desktop (≥768px), hamburger + sliding/dropdown menu on mobile
3. Create `src/components/Footer.astro`:
   - Semantic `<footer>` element
   - Content: church name (EN + ZH), address, service times, nav links, copyright with dynamic year
   - Multi-column grid layout on desktop, stacked on mobile
   - All styles via scoped `<style>` using CSS custom properties only
4. Wire Header and Footer into `src/layouts/BaseLayout.astro`:
   - Import both components
   - Render `<Header />` before `<slot />` and `<Footer />` after
5. Add Header and Footer showcase sections to `src/pages/styleguide.astro` below existing token sections, with descriptive headings.
6. Run `npm run build` to verify everything compiles.

## Must-Haves

- [ ] Header uses semantic `<header>` + `<nav>` with proper ARIA attributes
- [ ] Mobile hamburger uses `<button>` with `aria-expanded`, not CSS checkbox hack
- [ ] Footer uses semantic `<footer>` element
- [ ] Both components use only CSS custom properties — no hardcoded colors/sizes
- [ ] BaseLayout renders Header before content and Footer after
- [ ] Both components appear on /styleguide with sample content
- [ ] `npm run build` succeeds

## Verification

- `npm run build` succeeds with 0 errors
- `test -f src/components/Header.astro && test -f src/components/Footer.astro` passes
- `grep -q 'Header' src/layouts/BaseLayout.astro && grep -q 'Footer' src/layouts/BaseLayout.astro` confirms wiring
- `grep -q 'aria-expanded' src/components/Header.astro` confirms accessible hamburger

## Inputs

- ``src/styles/global.css` — design tokens to reference and extend`
- ``src/layouts/BaseLayout.astro` — layout to wire Header/Footer into`
- ``src/pages/styleguide.astro` — showcase page to extend`

## Expected Output

- ``src/components/Header.astro` — responsive site header with nav and mobile hamburger`
- ``src/components/Footer.astro` — site footer with church info and nav`
- ``src/layouts/BaseLayout.astro` — updated to import and render Header + Footer`
- ``src/styles/global.css` — extended with --color-focus, --max-width tokens`
- ``src/pages/styleguide.astro` — extended with Header and Footer showcase sections`

## Verification

npm run build && test -f src/components/Header.astro && test -f src/components/Footer.astro && grep -q 'Header' src/layouts/BaseLayout.astro && grep -q 'Footer' src/layouts/BaseLayout.astro
