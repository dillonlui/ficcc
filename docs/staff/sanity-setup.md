# Sanity Setup Checklist

Use this checklist when connecting the website to a real Sanity project.

## Required Environment Variables

Set these in Vercel for Production and Preview:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET`
- `PUBLIC_SANITY_STUDIO_URL` — usually `/admin`
- `PUBLIC_SANITY_PREVIEW_URL` — production should be `https://ficcc.org` (the public site origin, never the Studio URL)
- `SANITY_API_READ_TOKEN` — required for Presentation preview; keep this server-only (never use a `PUBLIC_` prefix)

Local `.env` should use the same names. The `PUBLIC_` values are required because the embedded Studio runs in the browser.

## Bootstrap Documents

After the Sanity project and write token are ready, seed the fixed page documents:

```bash
SANITY_PROJECT_ID=yourProjectId SANITY_API_WRITE_TOKEN=sk... npm run sanity:seed
```

The seed creates the page documents the Studio sidebar expects, including `siteSettings-en`, `homePage-en`, `homePage-zh`, and all eight Grow page documents.

This is a one-time/manual bootstrap command, not a deployment step. Keep `SANITY_API_WRITE_TOKEN` out of Vercel and GitHub Actions, and never add `npm run sanity:seed` or another migration to the production build command. A normal `npm run build` is read-only with respect to Sanity.

## CORS

In Sanity project settings, add these origins:

- `http://localhost:4321`
- `https://ficcc.org`
- Vercel preview domain pattern, if used for preview editing

Allow credentials for Studio/authenticated editing origins.

## Presentation Preview and Visual Editing

The Presentation tool opens the splash page (`/?chooselang`) by default, not a Studio URL. The query prevents a saved visitor language preference from redirecting the Presentation iframe, so the Splash Page stays paired with its CMS document. It does not alter or delete the editor’s normal `lang-pref` cookie.

Presentation then opens `/api/sanity/preview`, not a public preview query string. That endpoint validates Sanity’s short-lived preview secret, stores it in HTTP-only cookies for four hours, and redirects the editor to the selected site route.

- Keep Presentation’s **Share preview access** setting off. The Studio configuration already requests `shareAccess: false`.
- Do not add `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`; Visual Editing appears only after a valid Presentation preview has authenticated the browser.
- Use **Exit preview** in Presentation (or open `/api/sanity/preview/disable`) when you finish. This clears the preview cookies.
- Verify one English route, one Chinese route, a Grow route, and a sermon route after each Studio deployment. Draft content must never appear in an incognito/public browser.

## Vercel Webhook

Create a Vercel deploy hook and add it as a Sanity webhook for published document changes. This verifies the production publish/deploy path and refreshes any deployment-level caches.

Use the deploy-hook URL as the webhook destination, select create/update/delete events, and keep the URL secret. Do not set this value as a public environment variable.

## Verify

- `/admin` loads the Studio and prompts for Sanity login.
- Presentation opens the selected document location and shows its unpublished draft; clicking an editable region returns to the correct Studio field.
- The same URL in an incognito browser shows published content and no Visual Editing overlay.
- Publish a non-sensitive test edit, confirm the Sanity webhook returns a 2xx response, then confirm the matching Vercel deployment becomes Ready and the live route updates.
- Public pages still build with fallback content if Sanity is temporarily unavailable.
