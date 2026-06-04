# Managing Public Visibility

Most public page documents and public list items include a **Publicly Visible** switch.

## When to Turn Visibility Off

Use this when a page or item should be temporarily hidden without deleting its content, such as:

- a ministry page that is not ready yet
- an event that should no longer appear publicly
- a sermon that needs review before it appears in the list
- a page section that staff wants to preserve for later

## What Happens

- Page documents with **Publicly Visible** turned off stop rendering public content after the next rebuild.
- Hidden page documents are removed from the site navigation where that page appears in the coded navigation.
- Sermons, events, ministries, and people with **Publicly Visible** turned off are removed from public lists.
- The content remains editable in Sanity.

## Important Notes

- Visibility changes are not instant. Publish the document and wait 2-3 minutes for Vercel to rebuild.
- If Sanity is unavailable during a build, the site uses built-in fallback content rather than failing the build.
- Do not use this switch for private or sensitive information. Do not put confidential content in Sanity fields intended for the public website.
