---
estimated_steps: 43
estimated_files: 4
skills_used: []
---

# T03: Build Accordion, ContactForm, and AudioPlayer components, run final verification

Create the three interactive/media components — Accordion (details/summary), ContactForm (HTML form with styled inputs), AudioPlayer (styled native audio wrapper) — add all three to the styleguide page, and run final build + Lighthouse CI verification for the complete slice.

## Steps

1. Create `src/components/Accordion.astro`:
   - Props: `items` (array of `{ title: string, content: string }`)
   - Use native `<details>` / `<summary>` elements — zero JS, accessible by default
   - Style `summary::marker` or use `list-style: none` + custom chevron icon for cross-browser consistency
   - Spacing between items using tokens, border-bottom separators
   - Summary text in body font at `--text-lg`, content in body font at `--text-base`
2. Create `src/components/ContactForm.astro`:
   - HTML `<form>` with fields: name (text, required), email (email, required), message (textarea, required)
   - Submit button styled with terracotta background, bg/white text
   - Styled inputs: border using `--color-stone`, focus ring using `--color-focus` or `--color-terracotta`, border-radius `--radius-sm`
   - HTML validation attributes: `required`, `type="email"`, `minlength`
   - No `action` attribute — form submission is S05's job. Add a comment noting this.
   - Labels associated with inputs via `for`/`id` attributes
3. Create `src/components/AudioPlayer.astro`:
   - Props: `src` (string), `title` (string), `speaker` (string, optional)
   - Styled wrapper `<div>` with title and speaker metadata displayed above native `<audio controls>`
   - Don't try to fully restyle native audio controls — just wrap them in a styled container
   - Title in heading font, speaker in body font at `--text-sm`
   - Border, padding, border-radius using tokens
4. Add all three components to `src/pages/styleguide.astro` with sample data:
   - Accordion with 3-4 FAQ items
   - ContactForm as-is (no action needed)
   - AudioPlayer with a placeholder src (empty string or `#` — the element renders without a valid source)
5. Run `npm run build` to verify all pages compile.
6. Run Lighthouse CI: `npx @lhci/cli autorun` to verify a11y ≥ 0.95 and perf within thresholds.

## Must-Haves

- [ ] Accordion uses native `<details>`/`<summary>` — no JS
- [ ] ContactForm has proper `<label>` + `for`/`id` associations for all fields
- [ ] ContactForm uses HTML validation attributes (required, type=email)
- [ ] AudioPlayer uses native `<audio controls>` element
- [ ] All styles use only CSS custom properties
- [ ] All three render on /styleguide with sample data
- [ ] `npm run build` succeeds
- [ ] Lighthouse CI passes (a11y ≥ 0.95)

## Verification

- `npm run build` succeeds with 0 errors
- `test -f src/components/Accordion.astro && test -f src/components/ContactForm.astro && test -f src/components/AudioPlayer.astro` passes
- `npx @lhci/cli autorun` passes all assertions
- `grep -q 'details' src/components/Accordion.astro` confirms native element usage
- `grep -q '<label' src/components/ContactForm.astro` confirms proper label associations
- `grep -q '<audio' src/components/AudioPlayer.astro` confirms native audio element

## Inputs

- ``src/styles/global.css` — design tokens`
- ``src/pages/styleguide.astro` — showcase page to extend with final component sections`
- ``src/components/Header.astro` — already on styleguide from T01`
- ``src/components/Footer.astro` — already on styleguide from T01`
- ``src/components/Hero.astro` — already on styleguide from T02`
- ``src/components/Card.astro` — already on styleguide from T02`
- ``src/components/ImageMosaic.astro` — already on styleguide from T02`

## Expected Output

- ``src/components/Accordion.astro` — accessible accordion using details/summary`
- ``src/components/ContactForm.astro` — styled HTML form with validation attributes`
- ``src/components/AudioPlayer.astro` — styled wrapper around native audio element`
- ``src/pages/styleguide.astro` — complete with all 8 component showcase sections`

## Verification

npm run build && test -f src/components/Accordion.astro && test -f src/components/ContactForm.astro && test -f src/components/AudioPlayer.astro && npx @lhci/cli autorun
