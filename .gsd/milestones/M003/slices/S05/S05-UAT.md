# S05: CM Content Migration — UAT

**Milestone:** M003
**Written:** 2026-04-01T17:27:24.825Z

# S05: CM Content Migration — UAT

**Milestone:** M003
**Written:** 2026-03-31

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: Redirects are configuration (vercel.json) verified by JSON parsing and build. Migration script is verified by dry-run execution. Live redirect testing requires DNS configuration not available in dev.

## Preconditions

- vercel.json exists and is valid JSON
- sanity/migrations/cm-content.ts exists
- Node.js and npx tsx available
- npm run build succeeds

## Smoke Test

Run `node -e "const v=JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log(v.redirects.length + ' redirects')"` — should print "10 redirects".

## Test Cases

### 1. Redirect map completeness

1. Parse vercel.json and extract all redirect entries
2. Verify each entry has `has: [{ type: 'host', value: 'cm.ficcc.org' }]`
3. Verify all 8 cm.ficcc.org paths are covered: `/`, `/home/about-us/`, `/home/sunday-service/`, `/home/fellowships/`, `/home/教會事工/`, `/home/%E6%95%99%E6%9C%83%E4%BA%8B%E5%B7%A5/`, `/home/sermon-archive/`, `/home/connect-with-us/`
4. Verify a catch-all `/:path*` rule exists as the final entry
5. **Expected:** All 10 redirects present with correct source → destination mapping. All are permanent (301).

### 2. Redirect destination correctness

1. Verify `/` → `/zh`
2. Verify `/home/about-us/` → `/zh/about`
3. Verify `/home/sunday-service/` → `/zh/sundays`
4. Verify `/home/fellowships/` → `/zh/ministries`
5. Verify `/home/sermon-archive/` → `/zh/sermons`
6. Verify `/home/connect-with-us/` → `/zh/contact`
7. Verify `/home/教會事工/` and URL-encoded form both → `/zh/ministries`
8. Verify catch-all `/:path*` → `/zh`
9. **Expected:** Each source maps to its correct /zh/ equivalent.

### 3. Migration script dry-run

1. Run `SANITY_PROJECT_ID=test123 npx tsx sanity/migrations/cm-content.ts`
2. Verify output includes all 4 document IDs: homePage-zh, aboutPage-zh, siteSettings-zh, visitPage-zh
3. Verify output ends with "4 documents would be created/replaced"
4. **Expected:** Script executes without errors, logs all 4 documents in dry-run mode.

### 4. Migration script document structure

1. Run dry-run and inspect homePage-zh output
2. Verify it has heroTitle (歡迎回家), serviceTimes array, pillars array, nextSteps array
3. Inspect aboutPage-zh: verify whoWeAreBody (Portable Text), beliefs array (11 items), churchStats
4. Inspect siteSettings-zh: verify churchName (以撒迦中國播道會), socialLinks with WeChat
5. Inspect visitPage-zh: verify schedule array, whatToExpect (Portable Text), transportation (Portable Text)
6. **Expected:** All documents match their schema field names and contain actual Chinese Ministry content.

### 5. Build regression

1. Run `npm run build`
2. **Expected:** Build completes successfully with exit code 0. No new warnings related to vercel.json or migration script.

## Edge Cases

### CJK URL encoding in redirects

1. Check that both `/home/教會事工/` (raw) and `/home/%E6%95%99%E6%9C%83%E4%BA%8B%E5%B7%A5/` (encoded) have redirect entries
2. **Expected:** Both forms present — browsers may send either encoding depending on implementation.

### Migration script without token

1. Run `SANITY_PROJECT_ID=test123 npx tsx sanity/migrations/cm-content.ts` (no SANITY_API_WRITE_TOKEN)
2. **Expected:** Script runs in dry-run mode, does not error, does not attempt API calls.

## Failure Signals

- vercel.json fails JSON parsing
- Fewer than 8 redirects in vercel.json
- Migration script throws on dry-run execution
- npm run build fails after redirect changes

## Not Proven By This UAT

- Live cross-domain redirect behavior (requires cm.ficcc.org DNS pointing to Vercel)
- Actual Sanity document creation (requires SANITY_API_WRITE_TOKEN)
- Visual verification that migrated content renders correctly on ZH pages

## Notes for Tester

The redirects only activate when cm.ficcc.org DNS points to Vercel. Until then, they are inert configuration. The migration script should be run with a real write token against production Sanity before launch — the dry-run mode verified here confirms document structure but not API connectivity.
