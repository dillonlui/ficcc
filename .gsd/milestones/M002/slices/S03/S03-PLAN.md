# S03: Sundays / Plan a Visit

**Goal:** Plan a Visit page at /visit with FAQ accordion, transportation/directions, Sunday schedule, what-to-expect content, and ride request form — all CMS-editable via visitPage Sanity singleton with hardcoded fallbacks.
**Demo:** After this: Plan a Visit with FAQ, transportation, schedule, ride request form

## Tasks
- [x] **T01: Added visitPage singleton schema with hero, schedule, whatToExpect, transportation, FAQ, and rideRequest fields, plus VisitPage interface and getVisitPage() GROQ helper** — Create the visitPage singleton schema following the homePage/aboutPage pattern, register it in the schema index, and add the TypeScript interface + getVisitPage() GROQ helper to the data layer.

## Steps

1. Create `sanity/schemas/singletons/visitPage.ts` with fields: heroImage (image with hotspot), heroTitle (string, required), heroSubtitle (string), whatToExpect (array of block — portable text), schedule (array of objects with label/time/description), transportation (array of block — portable text), faqItems (array of objects with question/answer strings), rideRequestEnabled (boolean, default true), language (string, en/zh). Follow the exact defineType/defineField pattern from homePage.ts.
2. In `sanity/schemas/index.ts`: add export for visitPage, import it, add to schemaTypes array, add 'visitPage' to singletonTypes Set, add visitPage-en and visitPage-zh to singletonDocIds array.
3. In `src/lib/sanity.ts`: add VisitPage interface matching the schema fields, add ScheduleItem and FaqItem sub-interfaces. Add getVisitPage(language) async helper following the getHomePage pattern.
4. Run `npm run build` to verify no type errors or build failures.

## Must-Haves

- [ ] visitPage schema has all fields: heroImage, heroTitle, heroSubtitle, whatToExpect (portable text), schedule (array of {label, time, description}), transportation (portable text), faqItems (array of {question, answer}), rideRequestEnabled (boolean), language
- [ ] Schema registered in schemaTypes, singletonTypes, and singletonDocIds (EN + ZH)
- [ ] VisitPage interface and getVisitPage() helper in sanity.ts
- [ ] npm run build passes

## Verification

- `test -f sanity/schemas/singletons/visitPage.ts`
- `grep -q 'visitPage' sanity/schemas/index.ts`
- `grep -q 'getVisitPage' src/lib/sanity.ts`
- `grep -q 'VisitPage' src/lib/sanity.ts`
- `npm run build` exits 0
  - Estimate: 25m
  - Files: sanity/schemas/singletons/visitPage.ts, sanity/schemas/index.ts, src/lib/sanity.ts
  - Verify: test -f sanity/schemas/singletons/visitPage.ts && grep -q 'visitPage' sanity/schemas/index.ts && grep -q 'getVisitPage' src/lib/sanity.ts && npm run build
- [ ] **T02: Build /visit page with Hero, schedule, what-to-expect, transportation, and FAQ sections** — Create the Plan a Visit page at src/pages/visit.astro with all content sections composed from existing and new components, wired to CMS data with hardcoded fallbacks.

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
  - Estimate: 45m
  - Files: src/pages/visit.astro
  - Verify: test -f src/pages/visit.astro && grep -q 'Accordion' src/pages/visit.astro && npm run build 2>&1 | grep -q 'visit'
- [ ] **T03: Build RideRequestForm component and integrate into visit page** — Create the ride request form component adapted from the ContactForm pattern, with client-side validation and Turnstile spam protection, then integrate it into the visit page.

## Steps

1. Create `src/components/RideRequestForm.astro` following the ContactForm pattern:
   - Fields: name (text, required, min 2 chars), email (email, required), phone (tel, optional), pickup location (text, required, min 5 chars — e.g. campus dorm or address), preferred date (date input, optional), notes (textarea, optional)
   - Include Cloudflare Turnstile widget (same pattern as ContactForm)
   - Client-side validation via `<script is:inline>` — validate required fields before submission
   - Submit handler POSTs to `/api/ride-request` as JSON. Handle success (show success banner, reset form) and error (show error banner) states. Since no API endpoint exists yet, the fetch will 404 — the error banner should show a graceful message. This is consistent with ContactForm posting to `/api/contact` which also has no endpoint yet.
   - Use same CSS patterns as ContactForm: BEM naming, scoped styles, CSS custom properties only
   - Button text: 'Request a Ride' / 'Sending…' when loading
2. Add the RideRequestForm to `src/pages/visit.astro` as the final section before the page closes, inside a styled section wrapper with heading 'Need a Ride?'. Conditionally render based on visitPage?.rideRequestEnabled !== false (default to showing it).
3. Run `npm run build` to verify everything compiles.
4. Verify no `client:*` directives on RideRequestForm (the Turnstile script loads via `<script is:inline src=...>` which is fine).

## Must-Haves

- [ ] RideRequestForm component exists with name, email, phone, pickup location, date, notes fields
- [ ] Client-side validation for required fields (name, email, pickup location)
- [ ] Turnstile widget integration matching ContactForm pattern
- [ ] Submit handler with loading state, success banner, error banner
- [ ] Form integrated into visit page in a 'Need a Ride?' section
- [ ] All scoped CSS using BEM naming and CSS custom properties
- [ ] npm run build passes

## Verification

- `test -f src/components/RideRequestForm.astro`
- `grep -q 'RideRequestForm' src/pages/visit.astro`
- `grep -q 'turnstile' src/components/RideRequestForm.astro` (case-insensitive)
- `npm run build` exits 0
- `! grep -q 'client:' src/components/RideRequestForm.astro` (no client directives)
  - Estimate: 35m
  - Files: src/components/RideRequestForm.astro, src/pages/visit.astro
  - Verify: test -f src/components/RideRequestForm.astro && grep -q 'RideRequestForm' src/pages/visit.astro && npm run build
