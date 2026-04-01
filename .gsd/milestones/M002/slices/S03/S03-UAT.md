# S03: Sundays / Plan a Visit — UAT

**Milestone:** M002
**Written:** 2026-04-01T13:45:18.224Z

# S03: Sundays / Plan a Visit — UAT

**Milestone:** M002
**Written:** 2026-03-31

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: Static page with hardcoded fallbacks — all content renders at build time without a running CMS

## Preconditions

- `npm run build` succeeds (confirms page generates)
- `npm run preview` running on localhost:4321

## Smoke Test

Navigate to http://localhost:4321/visit — page loads with hero, schedule, what-to-expect, directions, FAQ accordion, and ride request form all visible.

## Test Cases

### 1. Hero Section Renders

1. Navigate to /visit
2. **Expected:** Hero displays with title "Plan Your Visit" and subtitle "Everything you need to know for your first Sunday with us"

### 2. Schedule Section Shows Service Times

1. Scroll to the schedule section
2. **Expected:** Two schedule cards visible — "Sunday Gathering" at "9:45 AM" with worship description, and "Sunday School" at "11:15 AM" with classes description

### 3. What to Expect Section

1. Scroll to What to Expect section
2. **Expected:** Content paragraphs about casual dress, welcoming atmosphere, and kids welcome are visible

### 4. Getting Here / Transportation Section

1. Scroll to Getting Here section
2. **Expected:** Church address "429 Mitchell Street, Ithaca, NY 14850" is displayed
3. **Expected:** Google Maps iframe is embedded and shows the church location
4. **Expected:** Parking information is visible

### 5. FAQ Accordion with 6 Questions

1. Scroll to FAQ section
2. **Expected:** 6 FAQ items visible as collapsed accordion entries
3. Click on "What should I wear?"
4. **Expected:** Answer expands with content about casual dress
5. Click on "Is there anything for my kids?"
6. **Expected:** Answer expands with content about children's programs
7. Click on "What should I wear?" again
8. **Expected:** Answer collapses

### 6. Ride Request Form Fields

1. Scroll to "Need a Ride?" section
2. **Expected:** Form visible with fields: Name, Email, Phone, Pickup Location, Preferred Date, Notes
3. **Expected:** Turnstile widget container is present
4. **Expected:** Submit button reads "Request a Ride"

### 7. Ride Request Form Validation

1. Click "Request a Ride" without filling any fields
2. **Expected:** Validation errors shown for Name, Email, and Pickup Location (required fields)
3. Fill Name with "A" (1 char) and click submit
4. **Expected:** Name validation error about minimum 2 characters
5. Fill Name with "Test User", Email with "invalid", Pickup Location with "abc"
6. **Expected:** Email validation error for invalid format, pickup location error for minimum 5 characters

### 8. Ride Request Form Submission

1. Fill valid data: Name "Test User", Email "test@example.com", Pickup Location "Balch Hall, Cornell University"
2. Click "Request a Ride"
3. **Expected:** Button text changes to "Sending…" during submission
4. **Expected:** Error banner appears (since /api/ride-request endpoint doesn't exist yet) with a user-friendly message

### 9. No Client Directives

1. View page source
2. **Expected:** No `client:` framework hydration directives — all interactivity is via inline scripts

### 10. Responsive Layout

1. Resize browser to mobile width (~375px)
2. **Expected:** All sections stack vertically in single column, schedule cards stack, Getting Here map goes full width
3. Resize to desktop width (~1200px)
4. **Expected:** Getting Here section shows two-column layout (text + map side by side)

## Edge Cases

### CMS Unavailable

1. Build with invalid/missing Sanity credentials
2. **Expected:** Build succeeds — all sections render with hardcoded fallback content

### Ride Request Disabled

1. In Sanity, set visitPage rideRequestEnabled to false
2. **Expected:** "Need a Ride?" section does not render on the page
