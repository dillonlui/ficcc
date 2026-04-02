---
estimated_steps: 16
estimated_files: 4
skills_used: []
---

# T01: Add announcement bar schema, TypeScript interface, and BaseLayout rendering

Add announcement bar fields to the siteSettings Sanity schema, update the SiteSettings TypeScript interface, and render the bar conditionally in BaseLayout.astro.

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

## Inputs

- ``sanity/schemas/singletons/siteSettings.ts` — existing siteSettings schema to extend`
- ``src/lib/sanity.ts` — SiteSettings interface (line ~98) and getSiteSettings helper (line ~329)`
- ``src/layouts/BaseLayout.astro` — page shell where announcement bar will be rendered`
- ``src/styles/global.css` — design tokens and global styles`

## Expected Output

- ``sanity/schemas/singletons/siteSettings.ts` — updated with announcementBarEnabled, announcementBarText, announcementBarLink fields`
- ``src/lib/sanity.ts` — SiteSettings interface updated with optional announcement bar fields`
- ``src/layouts/BaseLayout.astro` — getSiteSettings import, try-catch fetch, conditional announcement bar rendering`
- ``src/styles/global.css` — announcement-bar CSS styles`

## Verification

npm run build && grep -q 'announcementBarEnabled' sanity/schemas/singletons/siteSettings.ts && grep -q 'announcementBarEnabled' src/lib/sanity.ts && grep -q 'announcementBar' src/layouts/BaseLayout.astro && grep -q 'announcement-bar' src/styles/global.css
