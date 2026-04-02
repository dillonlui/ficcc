# S05: Staff Documentation & Training — UAT

**Milestone:** M004
**Written:** 2026-04-02T17:22:43.161Z

# S05: Staff Documentation & Training — UAT

**Milestone:** M004
**Written:** 2026-03-31

## UAT Type

- UAT mode: mixed (artifact-driven for docs, live-runtime for announcement bar)
- Why this mode is sufficient: Code changes verified via build; docs verified via file checks. Full live verification requires deployed Sanity content.

## Preconditions

- Site builds successfully (`npm run build` exits 0)
- Sanity Studio accessible at /admin on deployed site
- Staff user has Sanity Studio login credentials

## Smoke Test

Open `/admin` in browser, navigate to Site Settings → EN variant. Confirm announcement bar fields (Enabled, Text, Link) are visible. Enable the bar, enter text, publish. After ~2-3 min rebuild, confirm the bar appears on the live site homepage.

## Test Cases

### 1. Publish a sermon via Studio

1. Open `/admin` and navigate to Sermons in sidebar
2. Click + to create a new sermon
3. Fill in: Title = "Test Sermon", click Generate for Slug, Speaker = "Pastor Test", Date = today, Language = en
4. Enter a YouTube Video ID (e.g. `dQw4w9WgXcQ`)
5. Click Publish
6. Wait 2-3 minutes for rebuild
7. **Expected:** Sermon appears on /sermons page with correct title, speaker, and embedded video

### 2. Create an event via Studio

1. Open `/admin` and navigate to Events in sidebar
2. Click + to create a new event
3. Fill in: Title = "Test Event", Start Date = tomorrow, Time Description = "10:00 AM", Location = "Fellowship Hall", Language = en
4. Add a description using the rich text editor
5. Click Publish
6. Wait 2-3 minutes for rebuild
7. **Expected:** Event appears on /events page with correct details

### 3. Enable announcement bar

1. Open `/admin` and navigate to Site Settings
2. Select the EN language variant
3. Set Announcement Bar Enabled = true
4. Enter Announcement Bar Text = "Welcome to our new website!"
5. Enter Announcement Bar Link = "https://ficcc.org/about"
6. Click Publish
7. Wait 2-3 minutes for rebuild
8. **Expected:** A banner appears above the header on all EN pages with the text "Welcome to our new website!" as a clickable link to /about

### 4. Disable announcement bar

1. In Site Settings EN variant, set Announcement Bar Enabled = false
2. Click Publish
3. Wait 2-3 minutes for rebuild
4. **Expected:** The banner no longer appears on any page

### 5. Announcement bar without link

1. Enable the bar with text but leave Announcement Bar Link empty
2. Publish and wait for rebuild
3. **Expected:** Banner appears as plain text (not clickable), no broken link

### 6. Documentation completeness check

1. Open `docs/staff/README.md` — confirm it explains Studio access, login, content model, and publish pipeline
2. Open `docs/staff/publishing-a-sermon.md` — confirm field-by-field instructions including YouTube ID format
3. Open `docs/staff/creating-an-event.md` — confirm field-by-field instructions including image hotspot
4. Open `docs/staff/managing-announcement-bar.md` — confirm enable/disable workflow and both-language reminder
5. **Expected:** All guides are complete, no TBD/TODO placeholders, all mention the 2-3 min rebuild delay

## Edge Cases

### Announcement bar enabled with empty text

1. In Site Settings, set Enabled = true but leave Text empty
2. Publish and rebuild
3. **Expected:** No banner renders (code requires both enabled AND text present)

### Both language variants need separate bar config

1. Enable bar on EN variant with English text
2. Check ZH variant — bar should be independently configured
3. Enable bar on ZH variant with Chinese text
4. **Expected:** Each language shows its own bar text; changing one does not affect the other

## Failure Signals

- Announcement bar renders when disabled or with empty text
- Build fails after enabling announcement bar fields
- Staff guides reference fields that don't exist in the Studio
- YouTube video ID field accepts full URLs without guidance on extracting the ID

## Not Proven By This UAT

- Visual design quality of the announcement bar (needs design review)
- Announcement bar accessibility with screen readers beyond role="banner"
- Staff actually completing the workflows without confusion (needs real user testing)

## Notes for Tester

- The announcement bar won't be visible on local dev unless you create siteSettings documents in Sanity with the bar enabled. The build handles missing settings gracefully (bar just doesn't render).
- Staff guides are in docs/staff/ — these are Markdown files, not rendered on the site. Share them directly with staff or host on an internal wiki.
