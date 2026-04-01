---
estimated_steps: 17
estimated_files: 3
skills_used: []
---

# T01: Create visitPage Sanity singleton schema and GROQ helper

Create the visitPage singleton schema following the homePage/aboutPage pattern, register it in the schema index, and add the TypeScript interface + getVisitPage() GROQ helper to the data layer.

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

## Inputs

- ``sanity/schemas/singletons/homePage.ts` — pattern reference for singleton schema definition`
- ``sanity/schemas/index.ts` — registration target for new schema`
- ``src/lib/sanity.ts` — add VisitPage interface and getVisitPage() helper following existing pattern`

## Expected Output

- ``sanity/schemas/singletons/visitPage.ts` — new visitPage singleton schema`
- ``sanity/schemas/index.ts` — updated with visitPage registration`
- ``src/lib/sanity.ts` — updated with VisitPage interface and getVisitPage() helper`

## Verification

test -f sanity/schemas/singletons/visitPage.ts && grep -q 'visitPage' sanity/schemas/index.ts && grep -q 'getVisitPage' src/lib/sanity.ts && npm run build
