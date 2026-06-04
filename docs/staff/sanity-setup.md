# Sanity Setup Checklist

Use this checklist when connecting the website to a real Sanity project.

## Required Environment Variables

Set these in Vercel for Production and Preview:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET`
- `PUBLIC_SANITY_STUDIO_URL` — usually `/admin`
- `PUBLIC_SANITY_PREVIEW_URL` — production should be `https://ficcc.org`
- `SANITY_API_READ_TOKEN` — only needed when visual editing / draft preview is enabled

Local `.env` should use the same names. The `PUBLIC_` values are required because the embedded Studio runs in the browser.

## Bootstrap Documents

After the Sanity project and write token are ready, seed the fixed page documents:

```bash
SANITY_PROJECT_ID=yourProjectId SANITY_API_WRITE_TOKEN=sk... npm run sanity:seed
```

The seed creates the page documents the Studio sidebar expects, including `siteSettings-en`, `homePage-en`, `homePage-zh`, and all eight Grow page documents.

## CORS

In Sanity project settings, add these origins:

- `http://localhost:4321`
- `https://ficcc.org`
- Vercel preview domain pattern, if used for preview editing

Allow credentials for Studio/authenticated editing origins.

## Vercel Webhook

Create a Vercel deploy hook and add it as a Sanity webhook for published document changes. This lets Sanity publishes trigger static rebuilds.

## Verify

- `/admin` loads the Studio and prompts for Sanity login.
- Publishing a test content change triggers a Vercel rebuild.
- Public pages still build with fallback content if Sanity is temporarily unavailable.
