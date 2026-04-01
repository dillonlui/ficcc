---
estimated_steps: 26
estimated_files: 3
skills_used: []
---

# T02: Build About (Who We Are) and Beliefs pages with Accordion HTML support

Create the `/about` and `/about/beliefs` pages. Modify the Accordion component to accept HTML content via `set:html`. Both pages fetch from the `aboutPage` singleton via `getAboutPage()` with try-catch and hardcoded fallbacks.

## Steps

1. Modify `src/components/Accordion.astro`:
   - Change the content rendering from `<p>{item.content}</p>` to `<div class="accordion__content-inner"><Fragment set:html={item.content} /></div>`
   - This is non-breaking: plain text strings render identically, HTML strings render as HTML
   - Update the `.accordion__content p` styles to `.accordion__content` styles that work for both plain text and rich HTML
2. Create `src/pages/about/index.astro` — Who We Are page:
   - Import BaseLayout, use `getAboutPage()` wrapped in try-catch
   - Hardcoded fallback with real FICCC content (church history/mission narrative)
   - Render heading, body text (via `portableTextToHtml` or fallback), optional image
   - Use `urlForImage()` for any CMS images
   - Pure Astro with scoped CSS, responsive layout
3. Create `src/pages/about/beliefs.astro` — Beliefs page:
   - Import BaseLayout, Accordion, use `getAboutPage()` wrapped in try-catch
   - Hardcoded fallback beliefs array with real doctrinal statements (e.g., Scripture, God, Salvation, Church — use common evangelical statement of faith content)
   - Convert each belief's Portable Text content to HTML via `portableTextToHtml()`, or use fallback HTML strings
   - Pass items to Accordion component
   - Page intro text above the accordion
4. Verify both pages build and render

## Must-Haves

- [ ] Accordion accepts HTML content without breaking existing usage
- [ ] /about page renders Who We Are narrative with heading, body, optional image
- [ ] /about/beliefs page renders beliefs accordion with rich-text content
- [ ] Both pages use try-catch CMS fetch with realistic hardcoded fallbacks
- [ ] No client:* directives
- [ ] npm run build succeeds

## Inputs

- ``src/components/Accordion.astro` — existing accordion to modify for HTML support`
- ``src/lib/sanity.ts` — getAboutPage(), portableTextToHtml(), urlForImage() from T01`
- ``src/layouts/BaseLayout.astro` — page layout shell`
- ``src/pages/index.astro` — reference for CMS fetch + fallback pattern`

## Expected Output

- ``src/components/Accordion.astro` — modified to support HTML content via set:html`
- ``src/pages/about/index.astro` — new Who We Are page`
- ``src/pages/about/beliefs.astro` — new Beliefs page with accordion`

## Verification

test -f src/pages/about/index.astro && test -f src/pages/about/beliefs.astro && grep -q 'set:html' src/components/Accordion.astro && ! grep -rq 'client:' src/pages/about/index.astro src/pages/about/beliefs.astro && npm run build
