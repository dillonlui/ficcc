# Managing Public Visibility

Most public page documents and public list items include a **Publicly Visible** switch.

## When to Turn Visibility Off

Use this when a page or item should be temporarily hidden without deleting its content, such as:

- a ministry page that is not ready yet
- an event that should no longer appear publicly
- a sermon that needs review before it appears in the list
- a page section that staff wants to preserve for later

## What Happens

- Page documents with **Publicly Visible** turned off return a real 404 response on their public route.
- Hidden page documents are removed from the site navigation where that page appears in the coded navigation.
- Sermons, events, ministries, and people with **Publicly Visible** turned off are removed from public lists.
- The content remains editable in Sanity.

## Important Notes

- Visibility changes are normally visible within moments on server-rendered routes. Publish, then check the exact route in a private/incognito window.
- A publishing webhook may still trigger a Vercel deployment, but the deployment is not normally required for the SSR route to read the new value.
- If Sanity is unavailable during a build, the site uses built-in fallback content rather than failing the build.
- Do not use this switch for private or sensitive information. Do not put confidential content in Sanity fields intended for the public website.
