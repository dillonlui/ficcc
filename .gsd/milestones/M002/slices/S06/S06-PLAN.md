# S06: Events, Give & Contact

**Goal:** Events listing page, Give page, and Contact page with all 4 forms (general contact, prayer request, ride request, newcomer connect) — each posting to a server-side API endpoint with Turnstile verification and Resend email delivery.
**Demo:** After this: Events, Give page, all 4 contact forms

## Tasks
- [x] **T01: Built 4 server-side API endpoints (contact, prayer-request, ride-request, connect) with shared Turnstile verification, Resend email delivery, and structured JSON responses** — Build the 4 server-side API routes that all contact forms POST to. Each endpoint: parses JSON body, validates required fields, verifies Turnstile token against Cloudflare API, sends email via Resend, returns structured JSON response. This is the riskiest piece of the slice since it touches SSR runtime, external APIs, and server-only secrets.

Create a shared helper (`src/lib/form-helpers.ts`) to avoid duplicating Turnstile verification and Resend send logic across 4 endpoints. Each endpoint validates its own fields but shares the verification/send plumbing.

### Steps

1. Create `src/lib/form-helpers.ts` with:
   - `verifyTurnstile(token: string): Promise<boolean>` — POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with `TURNSTILE_SECRET_KEY`
   - `sendEmail(options: { to: string, subject: string, html: string, replyTo?: string }): Promise<boolean>` — use Resend SDK with `RESEND_API_KEY`, sender from `FROM_EMAIL` env var defaulting to `onboarding@resend.dev`
   - `jsonError(status, error, fields?): Response` and `jsonSuccess(message): Response` helpers

2. Create `src/pages/api/contact.ts`:
   - `export const prerender = false`
   - POST handler: validate name (min 2), email (regex), message (min 10), turnstileToken
   - Verify Turnstile, send email with form contents, return JSON response

3. Create `src/pages/api/prayer-request.ts`:
   - Same structure. Fields: name (required), email (optional), request (required, min 10), turnstileToken
   - Email subject: 'New Prayer Request from [name]'

4. Create `src/pages/api/ride-request.ts`:
   - Same structure. Fields: name (required), email (required), phone (optional), pickupLocation (required, min 5), preferredDate (optional), notes (optional), turnstileToken
   - Email subject: 'New Ride Request from [name]'

5. Create `src/pages/api/connect.ts`:
   - Same structure. Fields: name (required), email (required), phone (optional), interests (optional string), message (optional), turnstileToken
   - Email subject: 'New Connection Request from [name]'

### Constraints
- All API files need `export const prerender = false` (K005a)
- Use `import.meta.env.TURNSTILE_SECRET_KEY` and `import.meta.env.RESEND_API_KEY` (no PUBLIC_ prefix)
- Return proper Content-Type: application/json
- Handle missing env vars gracefully — return 500 with descriptive error, don't crash
- Match the error response shape ContactForm.astro expects: `{ error: string, fields?: [{field, message}] }` for errors, `{ success: true, message: string }` for success
  - Estimate: 45m
  - Files: src/lib/form-helpers.ts, src/pages/api/contact.ts, src/pages/api/prayer-request.ts, src/pages/api/ride-request.ts, src/pages/api/connect.ts
  - Verify: grep -q 'prerender = false' src/pages/api/contact.ts src/pages/api/prayer-request.ts src/pages/api/ride-request.ts src/pages/api/connect.ts && test -f src/lib/form-helpers.ts && npm run build
- [ ] **T02: Build Events listing page and Give page** — Create the Events page with EventCard component and the static Give page. These are the two simpler pages with no form wiring.

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
  - Estimate: 40m
  - Files: sanity/schemas/documents/event.ts, src/lib/sanity.ts, src/components/EventCard.astro, src/pages/events.astro, src/pages/give.astro
  - Verify: test -f src/pages/events.astro && test -f src/pages/give.astro && test -f src/components/EventCard.astro && npm run build
- [ ] **T03: Build Contact page with all 4 forms in tabbed sections** — Create PrayerRequestForm and ConnectForm components following the existing ContactForm pattern, then compose the Contact page with all 4 forms organized in tab/section UI. The tab approach solves the multiple-Turnstile-widgets-per-page pitfall — only one form is visible at a time.

### Steps

1. Create `src/components/PrayerRequestForm.astro`:
   - Follow ContactForm.astro pattern exactly (inline script, scoped CSS, Turnstile widget)
   - Fields: name (required, min 2), email (optional), prayer request text (required, min 10)
   - Posts to `/api/prayer-request`
   - Use BEM class prefix `prayer-form__`
   - Turnstile widget with explicit render: add `data-callback` and unique container ID
   - Success message: 'Your prayer request has been received. We will be praying for you.'

2. Create `src/components/ConnectForm.astro`:
   - Follow ContactForm.astro pattern
   - Fields: name (required), email (required), phone (optional), interests (optional text — 'What are you interested in?'), message (optional)
   - Posts to `/api/connect`
   - Use BEM class prefix `connect-form__`
   - Success message: 'Thank you for reaching out! We will be in touch soon.'

3. Create `src/pages/contact.astro`:
   - Use BaseLayout, Hero
   - Tab/section UI with 4 tabs: General Contact, Prayer Request, Ride Request, Connect With Us
   - Each tab shows one form component (ContactForm, PrayerRequestForm, RideRequestForm, ConnectForm)
   - Tab switching via inline script — show/hide sections, load Turnstile per visible form
   - Use `details/summary` or custom tab implementation with `role="tablist"`, `role="tab"`, `role="tabpanel"` for accessibility
   - Church contact info sidebar/section: address, phone, email, Sunday service times
   - Only load Turnstile script once (not per-form) — use explicit render mode: `<script src="...api.js?render=explicit">` and call `turnstile.render()` on tab switch
   - Default to General Contact tab

### Constraints
- Only one Turnstile widget renders at a time — tab switching must reset/render the widget for the active form
- Forms use inline `<script is:inline>` blocks per D010 — no client:* directives
- Each form's inline script must scope to its own class prefix to avoid conflicts when all 4 are in the DOM
- Accessible tab implementation with keyboard navigation (arrow keys between tabs, Enter/Space to activate)
- Pure Astro, scoped CSS, CSS custom properties only
  - Estimate: 50m
  - Files: src/components/PrayerRequestForm.astro, src/components/ConnectForm.astro, src/pages/contact.astro
  - Verify: test -f src/components/PrayerRequestForm.astro && test -f src/components/ConnectForm.astro && test -f src/pages/contact.astro && npm run build
