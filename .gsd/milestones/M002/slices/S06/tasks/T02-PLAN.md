---
estimated_steps: 27
estimated_files: 5
skills_used: []
---

# T02: Build Events listing page and Give page

Create the Events page with EventCard component and the static Give page. These are the two simpler pages with no form wiring.

### Steps

1. Add an `image` field to the event Sanity schema (`sanity/schemas/documents/event.ts`) — type `image` with hotspot, optional. Update the Event interface in `src/lib/sanity.ts` to include `image?: SanityImage`.

2. Create `src/components/EventCard.astro`:
   - Props: title, date (string), time (optional), location (optional), image (optional string URL), recurring (optional boolean)
   - Display formatted date, time, location, and optional image
   - Follow Card.astro/MinistryCard.astro pattern — pure Astro, scoped CSS, CSS custom properties only
   - Show a recurring badge if `recurring` is true

3. Create `src/pages/events.astro`:
   - Use BaseLayout, Hero
   - Fetch events via `getEvents('en')` wrapped in try-catch
   - Filter to upcoming events (date >= today) for main section, with past events shown below
   - If no events, show friendly empty state message
   - Responsive grid of EventCard components
   - Include hardcoded fallback events for when CMS is empty

4. Create `src/pages/give.astro`:
   - Use BaseLayout, Hero
   - Static content: why we give, how to give (PayPal link, check, in-person)
   - PayPal.me link or PayPal donate button (use a link — simpler than embed, CSP already allows frame-src paypal.com if needed later)
   - Church mailing address for check donations
   - Scripture verse about generosity
   - All hardcoded content (no CMS dependency)

### Constraints
- Pure Astro components, scoped CSS, CSS custom properties only (D010)
- CMS fetch in try-catch with fallback (K008)
- Update the GROQ query in getEvents to fetch the image field: add `image` to the projection
- No client:* directives

## Inputs

- ``src/lib/sanity.ts` — existing getEvents() helper and Event interface to extend`
- ``sanity/schemas/documents/event.ts` — event schema to add image field`
- ``src/components/MinistryCard.astro` — card pattern reference`
- ``src/layouts/BaseLayout.astro` — page layout`
- ``src/components/Hero.astro` — hero component`

## Expected Output

- ``sanity/schemas/documents/event.ts` — updated with image field`
- ``src/lib/sanity.ts` — Event interface updated with image property, getEvents query updated`
- ``src/components/EventCard.astro` — new event card component`
- ``src/pages/events.astro` — events listing page`
- ``src/pages/give.astro` — giving information page`

## Verification

test -f src/pages/events.astro && test -f src/pages/give.astro && test -f src/components/EventCard.astro && npm run build
