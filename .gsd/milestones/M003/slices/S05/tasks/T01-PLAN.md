---
estimated_steps: 14
estimated_files: 2
skills_used: []
---

# T01: Add cm.ficcc.org → /zh/ redirect map to vercel.json

Add 301 redirects from all cm.ficcc.org paths to the corresponding /zh/ paths in the existing vercel.json. The redirect map comes from SITE-AUDIT.md section 5. Key details:

- 8 redirects covering all cm.ficcc.org pages
- The CJK URL `/home/教會事工/` needs URL-encoded form in the source pattern
- `/home/fellowships/` → `/zh/ministries` (NOT /zh/community which doesn't exist)
- All redirects are permanent (308 or 301)
- vercel.json already has a `headers` array — add `redirects` alongside it
- Vercel cross-domain redirects use `has` condition with `host` header matching

Steps:
1. Read current `vercel.json`
2. Add `redirects` array with entries for each cm.ficcc.org path
3. For cross-domain redirects, use `has: [{ type: 'host', value: 'cm.ficcc.org' }]` on each redirect entry
4. Include both encoded and unencoded forms of the CJK URL
5. Validate the result is parseable JSON
6. Run `npm run build` to confirm no regression

## Inputs

- ``vercel.json` — existing config with headers array`
- ``SITE-AUDIT.md` — redirect map in section 5`

## Expected Output

- ``vercel.json` — updated with redirects array containing cm.ficcc.org → /zh/ 301 redirects`

## Verification

node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))" && node -e "const v=JSON.parse(require('fs').readFileSync('vercel.json','utf8')); if(!v.redirects||v.redirects.length<8) throw new Error('need 8+ redirects')" && npm run build
