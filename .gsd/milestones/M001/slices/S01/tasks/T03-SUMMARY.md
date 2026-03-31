---
id: T03
parent: S01
milestone: M001
provides: []
requires: []
affects: []
key_files: ["vercel.json"]
key_decisions: ["CSP allows: YouTube (nocookie), Sanity CDN, Cloudflare Turnstile, PayPal, Google Fonts, Vercel Analytics", "Font assets get 1-year immutable cache headers"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "ficcc.vercel.app returns HTTP 200. All 5 security headers present: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Auto-deploy triggered by git push."
completed_at: 2026-03-31T22:58:02.646Z
blocker_discovered: false
---

# T03: Vercel project linked with auto-deploy and security headers verified on ficcc.vercel.app

> Vercel project linked with auto-deploy and security headers verified on ficcc.vercel.app

## What Happened
---
id: T03
parent: S01
milestone: M001
key_files:
  - vercel.json
key_decisions:
  - CSP allows: YouTube (nocookie), Sanity CDN, Cloudflare Turnstile, PayPal, Google Fonts, Vercel Analytics
  - Font assets get 1-year immutable cache headers
duration: ""
verification_result: passed
completed_at: 2026-03-31T22:58:02.646Z
blocker_discovered: false
---

# T03: Vercel project linked with auto-deploy and security headers verified on ficcc.vercel.app

**Vercel project linked with auto-deploy and security headers verified on ficcc.vercel.app**

## What Happened

Linked Vercel project which auto-detected Astro framework and connected to GitHub repo. Created vercel.json with comprehensive security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). CSP is tailored to allow all known external services (YouTube embeds, Sanity CDN, Turnstile, PayPal, Google Fonts). Push to main triggered auto-deploy. Production URL ficcc.vercel.app returns 200 with all headers verified via curl.

## Verification

ficcc.vercel.app returns HTTP 200. All 5 security headers present: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Auto-deploy triggered by git push.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `curl -s -o /dev/null -w '%{http_code}' https://ficcc.vercel.app` | 0 | ✅ pass — HTTP 200 | 500ms |
| 2 | `curl -sI https://ficcc.vercel.app | grep security headers` | 0 | ✅ pass — all 5 headers present | 500ms |
| 3 | `vercel ls (auto-deploy check)` | 0 | ✅ pass — deployment Ready, 24s build | 130ms |


## Deviations

Vercel auto-connected to GitHub on link — no manual webhook setup needed. Production URL is ficcc.vercel.app (auto-assigned).

## Known Issues

Deployment protection (401) on preview URLs — expected for Hobby plan. Production URL (ficcc.vercel.app) works fine.

## Files Created/Modified

- `vercel.json`


## Deviations
Vercel auto-connected to GitHub on link — no manual webhook setup needed. Production URL is ficcc.vercel.app (auto-assigned).

## Known Issues
Deployment protection (401) on preview URLs — expected for Hobby plan. Production URL (ficcc.vercel.app) works fine.
