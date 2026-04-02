---
estimated_steps: 42
estimated_files: 4
skills_used: []
---

# T02: Write staff documentation guides for sermon, event, and announcement bar workflows

Create four Markdown documentation files in `docs/staff/` that enable non-technical church staff to manage content via Sanity Studio without developer help.

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

## Inputs

- ``sanity/schemas/documents/sermon.ts` — sermon field definitions for guide accuracy`
- ``sanity/schemas/documents/event.ts` — event field definitions for guide accuracy`
- ``sanity/schemas/singletons/siteSettings.ts` — siteSettings fields including announcement bar (from T01)`
- ``src/layouts/BaseLayout.astro` — confirms announcement bar rendering behavior (from T01)`

## Expected Output

- ``docs/staff/README.md` — Studio overview guide`
- ``docs/staff/publishing-a-sermon.md` — sermon publishing workflow guide`
- ``docs/staff/creating-an-event.md` — event creation workflow guide`
- ``docs/staff/managing-announcement-bar.md` — announcement bar management guide`

## Verification

test -f docs/staff/README.md && test -f docs/staff/publishing-a-sermon.md && test -f docs/staff/creating-an-event.md && test -f docs/staff/managing-announcement-bar.md && ! grep -rq 'TBD\|TODO' docs/staff/ && test $(grep -c '## ' docs/staff/README.md) -ge 3
