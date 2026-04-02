# S06: DNS Cutover & Launch — UAT

**Milestone:** M004
**Written:** 2026-04-02T17:32:10.091Z

# S06: DNS Cutover & Launch — UAT

**Milestone:** M004
**Written:** 2026-03-31

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: This slice produces configuration (vercel.json redirects, CSP headers) and documentation (runbook). Actual DNS cutover is a manual operational step. Artifact verification confirms correctness of the configuration and completeness of the documentation.

## Preconditions

- Repository checked out with latest changes
- Node.js installed, `npm install` completed
- No running dev server required for these checks

## Smoke Test

Run `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))"` — confirms vercel.json is valid JSON with all redirect and CSP changes intact.

## Test Cases

### 1. em.ficcc.org redirect rules are present and correct

1. Run `grep -c 'em.ficcc.org' vercel.json`
2. **Expected:** Returns exactly `8`
3. Run `node -e "const v=JSON.parse(require('fs').readFileSync('vercel.json','utf8')); const em=v.redirects.filter(r=>r.has&&r.has.some(h=>h.value==='em.ficcc.org')); console.log(em.length, em.map(r=>r.source+' -> '+r.destination).join('\n'))"`
4. **Expected:** 8 rules mapping: `/` → `https://ficcc.org/`, `/home/about/` → `https://ficcc.org/about`, `/home/faith/` → `https://ficcc.org/about/beliefs`, `/home/sermons/` → `https://ficcc.org/sermons`, `/home/worship/` → `https://ficcc.org/visit`, `/home/fellowships/` → `https://ficcc.org/ministries`, `/home/contact/` → `https://ficcc.org/contact`, `/:path*` → `https://ficcc.org/`
5. Verify catch-all (`/:path*`) is the last em.ficcc.org rule (not before specific paths)

### 2. CSP allows GA4 domains

1. Run `grep 'Content-Security-Policy' vercel.json`
2. **Expected:** `script-src` includes `https://www.googletagmanager.com`
3. **Expected:** `connect-src` includes `https://*.google-analytics.com` and `https://*.googletagmanager.com`

### 3. Unit tests pass with new Vitest config

1. Run `npm test`
2. **Expected:** 27 tests pass across 2 test files (navigation.test.ts, structured-data.test.ts). No Playwright e2e specs loaded.

### 4. Build succeeds

1. Run `npm run build`
2. **Expected:** Exits 0, 24+ pages prerendered, Pagefind indexes 24 pages

### 5. Launch runbook is complete

1. Run `test -f docs/launch-runbook.md`
2. **Expected:** File exists
3. Run `grep -c '^## ' docs/launch-runbook.md`
4. **Expected:** Returns >= 5 (sections for Prerequisites, Vercel Domain Configuration, DNS Records, Post-Cutover Verification, Rollback, Timeline)
5. Run `grep -qi 'TBD\|TODO' docs/launch-runbook.md`
6. **Expected:** No matches (exit code 1)

### 6. Existing cm.ficcc.org redirects still intact

1. Run `grep -c 'cm.ficcc.org' vercel.json`
2. **Expected:** Returns >= 10 (existing Chinese ministry redirects unaffected)

## Edge Cases

### em.ficcc.org catch-all ordering

1. In vercel.json, find the em.ficcc.org redirect rules
2. Verify the `/:path*` catch-all is positioned AFTER all specific path rules
3. **Expected:** Specific paths (e.g. `/home/about/`) appear before `/:path*` in the redirects array

### CSP doesn't break existing policies

1. Run `node -e "const v=JSON.parse(require('fs').readFileSync('vercel.json','utf8')); const csp=v.headers.find(h=>h.headers.some(hh=>hh.key==='Content-Security-Policy')); console.log(csp.headers.find(h=>h.key==='Content-Security-Policy').value)"`
2. **Expected:** CSP still includes all prior directives (self, cloudflare challenges, youtube-nocookie, sanity CDN, vercel-analytics) alongside new GA4 domains

## Failure Signals

- `npm test` fails or reports fewer than 27 tests (Vitest config regression)
- `npm run build` fails (redirect syntax error in vercel.json)
- grep for em.ficcc.org returns != 8 (missing or duplicate rules)
- grep for googletagmanager returns nothing (CSP not updated)
- Runbook contains TBD/TODO placeholders

## Not Proven By This UAT

- Actual DNS propagation and domain resolution (requires live infrastructure change)
- SSL certificate provisioning on ficcc.org (Vercel auto-provisions, but only after domain is added)
- GA4 receiving real production traffic (requires live site with measurement ID)
- em.ficcc.org and cm.ficcc.org redirects working end-to-end (requires Vercel domain configuration)

## Notes for Tester

The DNS cutover itself is documented in docs/launch-runbook.md but is a manual operational step — follow the runbook when ready to go live. The post-cutover verification checklist in the runbook covers all the live checks that this UAT cannot perform.
