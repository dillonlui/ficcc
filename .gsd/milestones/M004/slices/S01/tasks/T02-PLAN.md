---
estimated_steps: 16
estimated_files: 7
skills_used: []
---

# T02: Add skip-to-content link, main landmark IDs, and audit image alt text

Accessibility gaps: no skip-to-content link, no `id` on `<main>` for skip targets, and two `<img>` elements with empty `alt` that need contextual audit.

## Steps

1. **Add skip-to-content link in BaseLayout:** Add a visually-hidden skip link as the first child of `<body>` in `src/layouts/BaseLayout.astro`: `<a href="#main-content" class="skip-to-content">Skip to main content</a>`. Add scoped styles that visually hide it until focused (position off-screen, show on `:focus-visible` with high z-index and visible styling).

2. **Add `id="main-content"` to all `<main>` elements:** Search all pages in `src/pages/` for `<main` tags and add `id="main-content"` to each. There are ~15 pages with `<main>` elements. This is the skip-link target.

3. **Audit Card and EventCard alt text:** `src/components/Card.astro` and `src/components/EventCard.astro` both use `alt=""`. These cards have titles displayed as text content, so the images are decorative — `alt=""` is correct per WCAG. However, add a comment explaining the intentional decision: `<!-- Decorative: card title provides text alternative -->`. Also check if any `<img>` elements across the site are missing `alt` entirely.

4. **Verify:** Run `npm run build`. Confirm skip-to-content link exists. Confirm all `<main>` elements have `id="main-content"`.

## Must-Haves

- [ ] Skip-to-content link as first focusable element on every page
- [ ] Skip link targets `#main-content` and is visually hidden until focused
- [ ] All `<main>` elements have `id="main-content"`
- [ ] Card/EventCard alt text audited and documented
- [ ] `npm run build` succeeds

## Verification

- `npm run build` exits 0
- `grep -q 'skip-to-content' src/layouts/BaseLayout.astro` confirms skip link
- `grep -c 'id="main-content"' src/pages/*.astro src/pages/**/*.astro` shows all pages have it

## Inputs

- `src/layouts/BaseLayout.astro`
- `src/components/Card.astro`
- `src/components/EventCard.astro`

## Expected Output

- `src/layouts/BaseLayout.astro`
- `src/components/Card.astro`
- `src/components/EventCard.astro`
- `src/pages/index.astro`
- `src/pages/contact.astro`
- `src/pages/sermons/index.astro`
- `src/pages/sermons/[slug].astro`
- `src/pages/about/index.astro`
- `src/pages/about/beliefs.astro`
- `src/pages/about/staff.astro`
- `src/pages/events.astro`
- `src/pages/give.astro`
- `src/pages/visit.astro`
- `src/pages/ministries/index.astro`
- `src/pages/ministries/[slug].astro`
- `src/pages/404.astro`
- `src/pages/styleguide.astro`
- `src/pages/resources.astro`
- `src/pages/zh/index.astro`
- `src/pages/zh/contact.astro`
- `src/pages/zh/events.astro`
- `src/pages/zh/give.astro`
- `src/pages/zh/sundays.astro`
- `src/pages/zh/about/index.astro`
- `src/pages/zh/about/beliefs.astro`
- `src/pages/zh/about/staff.astro`
- `src/pages/zh/sermons/index.astro`
- `src/pages/zh/sermons/[slug].astro`
- `src/pages/zh/ministries/index.astro`
- `src/pages/zh/ministries/[slug].astro`

## Verification

npm run build && grep -q 'skip-to-content' src/layouts/BaseLayout.astro && grep -rq 'id="main-content"' src/pages/
