---
estimated_steps: 33
estimated_files: 1
skills_used: []
---

# T02: Write DNS cutover launch runbook

## Description

Create docs/launch-runbook.md documenting the exact DNS cutover procedure for ficcc.org, em.ficcc.org, and cm.ficcc.org. This is the final deliverable — a staff/developer reference for executing the launch.

## Steps

1. Create `docs/launch-runbook.md` with the following sections:
2. **Prerequisites** — list what must be true before cutover: Vercel deployment live at ficcc.vercel.app, all tests passing, env vars set (PUBLIC_GA_MEASUREMENT_ID, PUBLIC_GOOGLE_SITE_VERIFICATION), Sanity dataset populated.
3. **Vercel Domain Configuration** — step-by-step for adding ficcc.org, em.ficcc.org, and cm.ficcc.org as custom domains in Vercel dashboard. Note that Vercel auto-provisions SSL via Let's Encrypt.
4. **DNS Records** — exact record types and values:
   - ficcc.org: A record → 76.76.21.21, AAAA → 2606:4700:20::681a:... (or CNAME to cname.vercel-dns.com for subdomain)
   - em.ficcc.org: CNAME → cname.vercel-dns.com
   - cm.ficcc.org: CNAME → cname.vercel-dns.com
5. **Post-Cutover Verification** — checklist:
   - ficcc.org loads new site (check for skip-to-content or main-content landmark)
   - em.ficcc.org/home/about/ redirects to ficcc.org/about (301)
   - cm.ficcc.org/home/about/ redirects to ficcc.org/zh/about (301)
   - SSL valid on all three domains (check padlock)
   - GA4 receiving hits (check Real-Time report in Google Analytics)
   - Search console verified
   - Sitemap accessible at ficcc.org/sitemap-index.xml
6. **Rollback** — how to revert DNS if issues are found.
7. **Timeline** — expected propagation times (DNS: 5min–48hr, SSL: usually immediate with Vercel).

## Must-Haves

- [ ] docs/launch-runbook.md exists and is non-empty
- [ ] Contains sections for prerequisites, domain config, DNS records, post-cutover verification, rollback
- [ ] No TBD or TODO placeholders

## Verification

- `test -f docs/launch-runbook.md` — file exists
- `grep -c '^## ' docs/launch-runbook.md` returns >= 5 (5+ sections)
- `! grep -qi 'TBD\|TODO' docs/launch-runbook.md` — no placeholders

## Inputs

- `vercel.json` — redirect rules to reference in post-cutover verification
- `.env.example` — env vars to list in prerequisites

## Expected Output

- `docs/launch-runbook.md` — complete DNS cutover and launch procedure

## Inputs

- ``vercel.json` — redirect rules to reference in post-cutover verification`
- ``.env.example` — env vars to list in prerequisites`

## Expected Output

- ``docs/launch-runbook.md` — complete DNS cutover and launch procedure`

## Verification

test -f docs/launch-runbook.md && test $(grep -c '^## ' docs/launch-runbook.md) -ge 5 && ! grep -qi 'TBD\|TODO' docs/launch-runbook.md
