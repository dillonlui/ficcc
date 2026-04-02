# DNS Cutover & Launch Runbook — ficcc.org

This document describes the exact procedure for cutting over ficcc.org, em.ficcc.org, and cm.ficcc.org to the new Vercel-hosted Astro site. It is intended for staff and developers executing the launch.

## Prerequisites

Before starting the cutover, confirm all of the following:

- [ ] Vercel deployment is live and accessible at `ficcc.vercel.app`
- [ ] `npm run build` exits 0 — no build errors
- [ ] `npm test` passes — all unit tests green
- [ ] `npm run test:e2e` passes — all Playwright smoke/bilingual/responsive tests green
- [ ] Environment variables are set in Vercel dashboard:
  - `SANITY_PROJECT_ID` / `PUBLIC_SANITY_PROJECT_ID`
  - `SANITY_DATASET` / `PUBLIC_SANITY_DATASET`
  - `SANITY_API_READ_TOKEN` (for preview mode)
  - `RESEND_API_KEY` (for contact form email delivery)
  - `PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` (spam protection)
  - `PUBLIC_GA_MEASUREMENT_ID` (e.g. `G-XXXXXXXXXX`)
  - `PUBLIC_GOOGLE_SITE_VERIFICATION` (Search Console meta tag)
- [ ] Sanity dataset is populated with production content (homepage, about, sermons, events, ministries, etc.)
- [ ] Vercel deploy hook URL is configured in Sanity webhook settings (triggers rebuild on content publish)

## Vercel Domain Configuration

Add all three domains in the Vercel dashboard:

1. Go to **Project Settings → Domains**
2. Add `ficcc.org` — Vercel will show required DNS records
3. Add `em.ficcc.org` — Vercel will show a CNAME record
4. Add `cm.ficcc.org` — Vercel will show a CNAME record
5. Vercel auto-provisions SSL certificates via Let's Encrypt for all added domains — no manual certificate setup is needed

The redirect rules in `vercel.json` use host-matching (`"has": [{ "type": "host", "value": "em.ficcc.org" }]`) so they only activate once these domains are pointed at Vercel.

## DNS Records

Update the following records at the domain registrar / DNS provider:

### ficcc.org (apex domain)

| Type  | Host | Value                    |
|-------|------|--------------------------|
| A     | @    | `76.76.21.21`            |

> **Note:** Some registrars also support ALIAS or ANAME records for apex domains. If available, set an ALIAS record pointing to `cname.vercel-dns.com` instead of the A record. Vercel's dashboard will show the exact records needed for your setup.

### em.ficcc.org (English ministry — legacy domain)

| Type  | Host | Value                    |
|-------|------|--------------------------|
| CNAME | em   | `cname.vercel-dns.com`   |

### cm.ficcc.org (Chinese ministry — legacy domain)

| Type  | Host | Value                    |
|-------|------|--------------------------|
| CNAME | cm   | `cname.vercel-dns.com`   |

### TTL Recommendation

Set TTL to **300 seconds (5 minutes)** before cutover to allow fast rollback. After confirming everything works, increase to **3600 seconds (1 hour)** or higher.

## Post-Cutover Verification Checklist

Run through this checklist after DNS changes have propagated:

### Site Loading

- [ ] `https://ficcc.org` loads the new Astro site — look for the skip-to-content link or `<main>` landmark
- [ ] `https://ficcc.org/zh/` loads the Chinese homepage with Chinese navigation text
- [ ] `https://ficcc.org/about` loads the About page
- [ ] `https://ficcc.org/sermons` loads the Sermons page
- [ ] `https://ficcc.org/contact` loads the Contact page with the Turnstile-protected form

### em.ficcc.org Redirects (English legacy)

All should return **301 Permanent Redirect**:

| Old URL                            | Redirects To                    |
|------------------------------------|---------------------------------|
| `em.ficcc.org/`                    | `https://ficcc.org/`            |
| `em.ficcc.org/home/about/`         | `https://ficcc.org/about`       |
| `em.ficcc.org/home/faith/`         | `https://ficcc.org/about/beliefs` |
| `em.ficcc.org/home/sermons/`       | `https://ficcc.org/sermons`     |
| `em.ficcc.org/home/worship/`       | `https://ficcc.org/visit`       |
| `em.ficcc.org/home/fellowships/`   | `https://ficcc.org/ministries`  |
| `em.ficcc.org/home/contact/`       | `https://ficcc.org/contact`     |
| `em.ficcc.org/anything-else`       | `https://ficcc.org/`            |

### cm.ficcc.org Redirects (Chinese legacy)

All should return **301 Permanent Redirect**:

| Old URL                            | Redirects To                        |
|------------------------------------|-------------------------------------|
| `cm.ficcc.org/`                    | `https://ficcc.org/zh/`             |
| `cm.ficcc.org/home/about/`         | `https://ficcc.org/zh/about`        |
| `cm.ficcc.org/home/faith/`         | `https://ficcc.org/zh/about/beliefs`|
| `cm.ficcc.org/home/sermons/`       | `https://ficcc.org/zh/sermons`      |
| `cm.ficcc.org/home/worship/`       | `https://ficcc.org/zh/sundays`      |
| `cm.ficcc.org/home/fellowships/`   | `https://ficcc.org/zh/ministries`   |
| `cm.ficcc.org/home/contact/`       | `https://ficcc.org/zh/contact`      |
| `cm.ficcc.org/anything-else`       | `https://ficcc.org/zh/`             |

### SSL

- [ ] `https://ficcc.org` — padlock icon, certificate valid, issued by Let's Encrypt
- [ ] `https://em.ficcc.org` — padlock icon, certificate valid
- [ ] `https://cm.ficcc.org` — padlock icon, certificate valid

### Analytics & SEO

- [ ] Open Google Analytics → **Real-Time** report → navigate ficcc.org → confirm a hit appears
- [ ] `https://ficcc.org/sitemap-index.xml` returns a valid sitemap index
- [ ] Google Search Console shows `ficcc.org` as verified (via `PUBLIC_GOOGLE_SITE_VERIFICATION` meta tag)

### Quick cURL Checks

```bash
# Verify ficcc.org serves new site
curl -sI https://ficcc.org | head -5

# Verify em.ficcc.org redirect
curl -sI https://em.ficcc.org/home/about/ | grep -i 'location'
# Expected: location: https://ficcc.org/about

# Verify cm.ficcc.org redirect
curl -sI https://cm.ficcc.org/home/about/ | grep -i 'location'
# Expected: location: https://ficcc.org/zh/about

# Verify SSL
curl -vI https://ficcc.org 2>&1 | grep 'SSL certificate verify ok'
```

## Rollback

If critical issues are found after cutover:

1. **Revert DNS records** — point ficcc.org, em.ficcc.org, and cm.ficcc.org back to the previous hosting provider's IP/CNAME
2. **Wait for propagation** — with TTL at 300s, most clients will pick up the change within 5–10 minutes
3. **Remove domains from Vercel** (optional) — go to Project Settings → Domains and remove the three domains to prevent stale certificate renewals
4. **Investigate** — review Vercel deployment logs, function logs, and build output to identify the issue
5. **Re-deploy** — fix the issue, push to the production branch, confirm the build succeeds, then repeat the cutover procedure

> **Important:** Keep the old hosting active for at least 48 hours after cutover. Some DNS resolvers with aggressive caching may not pick up the new records immediately.

## Timeline

| Phase                        | Expected Duration        |
|------------------------------|--------------------------|
| Vercel domain setup          | 5–10 minutes             |
| DNS record updates           | 5–10 minutes             |
| DNS propagation              | 5 minutes – 48 hours     |
| SSL certificate provisioning | Usually immediate (< 5 min) with Vercel; up to 1 hour in rare cases |
| Post-cutover verification    | 15–30 minutes            |

Most users will see the new site within minutes of the DNS change. Full global propagation can take up to 48 hours in edge cases.
