---
estimated_steps: 29
estimated_files: 1
skills_used: []
---

# T02: Build /visit page with Hero, schedule, what-to-expect, transportation, and FAQ sections

Create the Plan a Visit page at src/pages/visit.astro with all content sections composed from existing and new components, wired to CMS data with hardcoded fallbacks.

## Steps

1. Create `src/pages/visit.astro`. Import BaseLayout, Hero, Accordion, and getVisitPage/urlForImage/portableTextToHtml from sanity.ts.
2. Fetch visitPage data via getVisitPage('en') wrapped in try-catch (K008 pattern from index.astro). Define hardcoded fallbacks for all sections:
   - Hero: title 'Plan Your Visit', subtitle 'Everything you need to know for your first Sunday with us'
   - Schedule: [{label: 'Sunday Gathering', time: '9:45 AM', description: 'Worship service with singing, prayer, and a message from Scripture'}, {label: 'Sunday School', time: '11:15 AM', description: 'Age-specific classes for children, youth, and adults'}]
   - What to expect: paragraphs about casual dress, welcoming atmosphere, kids welcome, etc.
   - Transportation: address (429 Mitchell Street, Ithaca, NY 14850), parking info, Cornell campus proximity
   - FAQ items: 5-6 common visitor questions (dress code, kids, language, parking, duration, how to connect)
3. Build the page layout in this order: Hero → Schedule section (custom layout with time + description per entry, NOT reusing ServiceTimes since we need the description field) → What to Expect section (rendered via portableTextToHtml or fallback HTML) → Transportation/Directions section (with embedded Google Maps iframe or static address) → FAQ section using Accordion component.
4. All sections should use pure Astro with scoped CSS and only CSS custom properties from global.css (D010). Each section gets a semantic `<section>` with aria-label.
5. Ensure responsive layout: single column on mobile (<768px), comfortable reading width on desktop.
6. Run `npm run build` to verify the page generates successfully.

## Must-Haves

- [ ] /visit page exists and builds successfully
- [ ] Hero section with CMS data or fallback
- [ ] Schedule section showing time + description per entry
- [ ] What to Expect section with CMS portable text or fallback HTML
- [ ] Transportation/directions section with church address
- [ ] FAQ accordion using existing Accordion component with 5+ fallback questions
- [ ] CMS fetch wrapped in try-catch with complete fallback content
- [ ] All scoped CSS using only CSS custom properties from global.css
- [ ] Responsive layout at mobile and desktop breakpoints

## Verification

- `test -f src/pages/visit.astro`
- `grep -q 'Accordion' src/pages/visit.astro`
- `grep -q 'getVisitPage' src/pages/visit.astro`
- `npm run build` succeeds and output includes /visit
- No `client:` directives in visit.astro (grep returns no matches)

## Inputs

- ``src/lib/sanity.ts` — getVisitPage() helper and portableTextToHtml from T01`
- ``src/components/Hero.astro` — reuse for page hero`
- ``src/components/Accordion.astro` — reuse for FAQ section`
- ``src/pages/index.astro` — pattern reference for CMS data fetching with try-catch fallbacks`

## Expected Output

- ``src/pages/visit.astro` — complete Plan a Visit page with all content sections`

## Verification

test -f src/pages/visit.astro && grep -q 'Accordion' src/pages/visit.astro && npm run build 2>&1 | grep -q 'visit'
