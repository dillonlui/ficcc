# S06: Events, Give & Contact — UAT

**Milestone:** M002
**Written:** 2026-04-01T14:20:42.428Z

# S06 UAT: Events, Give & Contact

## Preconditions
- Site built and running (`npm run build` succeeds, `npm run preview` or Vercel deploy available)
- Sanity Studio accessible at /admin (for event content)
- TURNSTILE_SECRET_KEY, RESEND_API_KEY, and CONTACT_EMAIL env vars set for form testing (or use Turnstile test keys)

---

## TC-01: Events Page — Upcoming/Past Split
1. Navigate to `/events`
2. Verify Hero section renders with page title
3. Verify upcoming events section shows events with dates ≥ today
4. Verify past events section shows events with dates < today (or "no past events" message)
5. Verify each EventCard shows: title, formatted date, and location (if present)
6. **Expected:** Events are sorted by date, upcoming first

## TC-02: Events Page — Recurring Events
1. If a recurring event exists (in CMS or fallback), verify it appears in the upcoming section regardless of its original date
2. Verify recurring badge is visible on recurring event cards
3. **Expected:** Recurring events always appear in upcoming, not past

## TC-03: Events Page — Empty CMS Fallback
1. If Sanity is unreachable or has no events, verify the page still renders with fallback event data
2. Verify no build errors when CMS is unavailable
3. **Expected:** Page renders gracefully with hardcoded fallback events

## TC-04: Events Page — Event Card with Image
1. Add an event with an image in Sanity CMS
2. Rebuild and navigate to `/events`
3. Verify the EventCard displays the image
4. **Expected:** Image renders within the card layout

## TC-05: Give Page — Static Content
1. Navigate to `/give`
2. Verify Hero section renders
3. Verify three giving methods are displayed: PayPal, check by mail, in-person
4. Verify PayPal section contains a link/button (placeholder URL is acceptable pre-launch)
5. Verify mailing address is displayed for check donations
6. Verify a scripture verse about generosity is shown
7. **Expected:** All three methods visible, page is fully static (no CMS dependency)

## TC-06: Contact Page — Tab Navigation
1. Navigate to `/contact`
2. Verify 4 tabs are visible: General Contact, Prayer Request, Ride Request, Connect With Us
3. Click each tab — verify the corresponding form panel appears and others are hidden
4. Verify only General Contact tab is active by default
5. **Expected:** Tab switching works, only one form visible at a time

## TC-07: Contact Page — Keyboard Tab Navigation
1. Focus the tab bar with Tab key
2. Use Arrow Right/Left to move between tabs
3. Press Enter or Space to activate a tab
4. **Expected:** Full keyboard navigation per WAI-ARIA tabs pattern

## TC-08: Contact Page — General Contact Form
1. Select General Contact tab
2. Verify fields: name, email, message, Turnstile widget
3. Submit with empty fields — verify field-level validation errors appear
4. Submit with name < 2 chars — verify name validation error
5. Submit with invalid email — verify email validation error
6. Submit with message < 10 chars — verify message validation error
7. Fill all fields correctly and submit
8. **Expected:** Success message "Your message has been sent. We'll be in touch soon." (requires working Turnstile + Resend)

## TC-09: Contact Page — Prayer Request Form
1. Select Prayer Request tab
2. Verify fields: name (required), email (optional), prayer request (required), Turnstile widget
3. Submit with empty name — verify validation error
4. Submit with request < 10 chars — verify validation error
5. Fill required fields and submit
6. **Expected:** Success message about prayer request received

## TC-10: Contact Page — Ride Request Form
1. Select Ride Request tab
2. Verify fields: name (required), email (required), phone (optional), pickup location (required), preferred date (optional), notes (optional), Turnstile widget
3. Submit with empty required fields — verify validation errors
4. Submit with pickup location < 5 chars — verify validation error
5. Fill required fields and submit
6. **Expected:** Success message about ride request received

## TC-11: Contact Page — Connect Form
1. Select Connect With Us tab
2. Verify fields: name (required), email (required), phone (optional), interests (optional), message (optional), Turnstile widget
3. Submit with empty required fields — verify validation errors
4. Fill required fields and submit
5. **Expected:** Success message about connection request received

## TC-12: Contact Page — Turnstile Widget Management
1. Navigate to `/contact`
2. Verify Turnstile widget renders on General Contact tab
3. Switch to Prayer Request tab — verify the previous widget is removed and a new one renders
4. Switch through all 4 tabs — verify only one Turnstile widget is present at any time
5. **Expected:** No duplicate widgets, no Turnstile errors in console

## TC-13: Contact Page — Church Info Sidebar
1. Navigate to `/contact`
2. Verify church address, phone number, email, and service times are displayed
3. **Expected:** Contact information visible alongside forms

## TC-14: API Error Handling — Missing Env Vars
1. Deploy without TURNSTILE_SECRET_KEY or RESEND_API_KEY
2. Submit any form
3. **Expected:** API returns 500 with descriptive JSON error, does not crash

## TC-15: Visit Page — Turnstile Still Works
1. Navigate to `/visit`
2. Fill and submit the Ride Request form
3. **Expected:** Turnstile widget renders and form submits correctly (regression check after Turnstile refactor)

## TC-16: Cross-Page Navigation
1. From homepage, navigate to `/events`, `/give`, and `/contact` via site navigation
2. Verify each page loads with consistent header/footer chrome
3. **Expected:** All three pages accessible and styled consistently
