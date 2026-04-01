---
estimated_steps: 30
estimated_files: 3
skills_used: []
---

# T03: Build Contact page with all 4 forms in tabbed sections

Create PrayerRequestForm and ConnectForm components following the existing ContactForm pattern, then compose the Contact page with all 4 forms organized in tab/section UI. The tab approach solves the multiple-Turnstile-widgets-per-page pitfall — only one form is visible at a time.

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

## Inputs

- ``src/components/ContactForm.astro` — pattern to follow for new forms`
- ``src/components/RideRequestForm.astro` — pattern reference and component to reuse`
- ``src/pages/api/contact.ts` — API endpoint from T01`
- ``src/pages/api/prayer-request.ts` — API endpoint from T01`
- ``src/pages/api/ride-request.ts` — API endpoint from T01`
- ``src/pages/api/connect.ts` — API endpoint from T01`
- ``src/layouts/BaseLayout.astro` — page layout`
- ``src/components/Hero.astro` — hero component`

## Expected Output

- ``src/components/PrayerRequestForm.astro` — prayer request form component`
- ``src/components/ConnectForm.astro` — newcomer connect form component`
- ``src/pages/contact.astro` — contact page with 4 tabbed forms`

## Verification

test -f src/components/PrayerRequestForm.astro && test -f src/components/ConnectForm.astro && test -f src/pages/contact.astro && npm run build
