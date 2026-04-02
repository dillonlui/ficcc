# S05: Staff Documentation & Training

**Goal:** Staff can publish a sermon, create an event, and update the announcement bar without developer help.
**Demo:** After this: Staff can publish a sermon, create an event, and update the announcement bar without developer help.

## Tasks
- [x] **T01: Added announcement bar schema fields, TypeScript interface, and conditional BaseLayout rendering with CMS resilience** — Add announcement bar fields to the siteSettings Sanity schema, update the SiteSettings TypeScript interface, and render the bar conditionally in BaseLayout.astro.

This is the only code change in the slice — schema change + frontend rendering + query path. The announcement bar should render above the Header when enabled, as a full-width banner with text and optional link.

## Steps

1. Add three fields to `sanity/schemas/singletons/siteSettings.ts`: `announcementBarEnabled` (boolean, default false), `announcementBarText` (string), `announcementBarLink` (url, optional). Group them with a fieldset or add after socialLinks.
2. Update the `SiteSettings` interface in `src/lib/sanity.ts` to include the three new optional fields: `announcementBarEnabled?: boolean`, `announcementBarText?: string`, `announcementBarLink?: string`.
3. In `src/layouts/BaseLayout.astro` frontmatter: import `getSiteSettings` from `../lib/sanity`, import the `Lang` type if not already available. Call `getSiteSettings(lang as Lang)` wrapped in try-catch (per K008) — on failure, default to null (bar won't render).
4. In `src/layouts/BaseLayout.astro` template: add announcement bar markup between the skip-to-content link and Header. Conditionally render only when `settings?.announcementBarEnabled && settings?.announcementBarText`. When `announcementBarLink` is provided, render as `<a>`, otherwise as `<div>`. Use CSS custom properties from global.css for styling.
5. Add minimal announcement bar styles to `src/styles/global.css`: full-width banner, appropriate background color (use existing design tokens), centered text, close padding. Keep it simple — this is a utility banner, not a design statement.
6. Verify: `npm run build` passes. Grep confirms announcement bar fields in siteSettings schema, SiteSettings interface, and BaseLayout rendering.

## Must-Haves

- [ ] Three announcement bar fields added to siteSettings schema
- [ ] SiteSettings TypeScript interface updated with optional announcement bar fields
- [ ] BaseLayout fetches siteSettings via getSiteSettings wrapped in try-catch
- [ ] Announcement bar renders conditionally (enabled + text present)
- [ ] Bar renders as <a> when link provided, <div> when no link
- [ ] npm run build passes
  - Estimate: 45m
  - Files: sanity/schemas/singletons/siteSettings.ts, src/lib/sanity.ts, src/layouts/BaseLayout.astro, src/styles/global.css
  - Verify: npm run build && grep -q 'announcementBarEnabled' sanity/schemas/singletons/siteSettings.ts && grep -q 'announcementBarEnabled' src/lib/sanity.ts && grep -q 'announcementBar' src/layouts/BaseLayout.astro && grep -q 'announcement-bar' src/styles/global.css
- [ ] **T02: Write staff documentation guides for sermon, event, and announcement bar workflows** — Create four Markdown documentation files in `docs/staff/` that enable non-technical church staff to manage content via Sanity Studio without developer help.

These guides are written for staff who know nothing about web development. Each guide must explain the publish → rebuild → live pipeline (static site takes ~2-3 min to update after publishing). Guides must mention both EN and ZH language variants where applicable.

## Steps

1. Create `docs/staff/README.md` — overview guide covering:
   - Studio access URL (`/admin`)
   - How to log in
   - Content model overview: what's a document vs singleton, language variants
   - The publish → rebuild → live pipeline (explain that changes aren't instant — Sanity publish triggers a Vercel rebuild, ~2-3 min delay)
   - Links to the three workflow guides

2. Create `docs/staff/publishing-a-sermon.md` — step-by-step guide covering:
   - Navigate to Sermons in Studio sidebar
   - Click + to create new sermon
   - Fill in fields: Title (required), Slug (click Generate), Speaker, Date, Series, Scripture Reference, YouTube Video ID (just the ID, not full URL), Language (en or zh)
   - Click Publish
   - Verify on live site after rebuild (~2-3 min)
   - Common mistakes: forgetting slug, pasting full YouTube URL instead of ID, forgetting language selection

3. Create `docs/staff/creating-an-event.md` — step-by-step guide covering:
   - Navigate to Events in Studio sidebar
   - Click + to create new event
   - Fill in fields: Title (required), Start Date, End Date, Time Description (human-readable, e.g. 'Sundays 10:00 AM'), Location, Description (rich text), Image (with hotspot), Recurring toggle, Language
   - Click Publish
   - Verify on live site after rebuild
   - Common mistakes: date format confusion, forgetting language

4. Create `docs/staff/managing-announcement-bar.md` — step-by-step guide covering:
   - Navigate to Site Settings in Studio sidebar
   - Select the correct language variant (EN or ZH)
   - Find the announcement bar fields section
   - Set Announcement Bar Enabled to true
   - Enter Announcement Bar Text
   - Optionally enter Announcement Bar Link (full URL)
   - Click Publish
   - Verify on live site after rebuild
   - To disable: set Announcement Bar Enabled to false and publish
   - Common mistakes: forgetting to update both EN and ZH variants, leaving enabled with empty text

## Must-Haves

- [ ] `docs/staff/README.md` exists with Studio overview, login, content model, and publish pipeline explanation
- [ ] `docs/staff/publishing-a-sermon.md` exists with complete field-by-field guide
- [ ] `docs/staff/creating-an-event.md` exists with complete field-by-field guide
- [ ] `docs/staff/managing-announcement-bar.md` exists with enable/disable/edit workflow
- [ ] All guides explain the publish → rebuild → live delay
- [ ] All guides mention language variants where applicable
- [ ] No TBD or TODO placeholders in any guide
  - Estimate: 45m
  - Files: docs/staff/README.md, docs/staff/publishing-a-sermon.md, docs/staff/creating-an-event.md, docs/staff/managing-announcement-bar.md
  - Verify: test -f docs/staff/README.md && test -f docs/staff/publishing-a-sermon.md && test -f docs/staff/creating-an-event.md && test -f docs/staff/managing-announcement-bar.md && ! grep -rq 'TBD\|TODO' docs/staff/ && test $(grep -c '## ' docs/staff/README.md) -ge 3
