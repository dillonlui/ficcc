---
estimated_steps: 26
estimated_files: 2
skills_used: []
---

# T03: Build RideRequestForm component and integrate into visit page

Create the ride request form component adapted from the ContactForm pattern, with client-side validation and Turnstile spam protection, then integrate it into the visit page.

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

## Inputs

- ``src/components/ContactForm.astro` — pattern reference for form structure, validation, Turnstile, and CSS`
- ``src/pages/visit.astro` — integration target from T02`

## Expected Output

- ``src/components/RideRequestForm.astro` — new ride request form component`
- ``src/pages/visit.astro` — updated with RideRequestForm integration`

## Verification

test -f src/components/RideRequestForm.astro && grep -q 'RideRequestForm' src/pages/visit.astro && npm run build
