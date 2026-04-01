# S07: Resources & Content Migration

**Goal:** Resources page live at /resources with categorized links, downloadable PDFs, and campus ministry list. All em.ficcc.org content from SITE-AUDIT.md accounted for in Sanity schemas and Astro page fallbacks.
**Demo:** After this: Resources page live. All em.ficcc.org content in Sanity.

## Tasks
- [x] **T01: Built /resources page with resourcesPage Sanity schema, GROQ helper, and full hardcoded fallback content migrated from em.ficcc.org** — Create the resourcesPage Sanity singleton schema, register it in the schema index (EN/ZH), add getResourcesPage() GROQ helper and ResourcesPage interface to sanity.ts, place PDF assets in public/, and build the /resources Astro page with Hero, categorized resource sections (spiritual growth articles, campus ministries list, downloadable PDFs), using try-catch CMS fetch with comprehensive hardcoded fallback content from the legacy em.ficcc.org site.

Follow the exact patterns from visitPage.ts (schema), sanity.ts (GROQ helper + interface), and visit.astro (CMS fetch with fallback). The resource categories are: (1) Spiritual Growth — articles on baptism, membership, keeping faith in college, building community; (2) Bible Readathon — reading plan PDF; (3) Newcomer Recommendations — PDF download; (4) Cornell Campus Ministries — list of 7 organizations with links.

PDFs go in public/ as static assets with absolute paths (/newcomer-recommendations.pdf, /readathon4.pdf). Since the actual PDFs are not available locally, create placeholder files and link to them — the paths and structure are what matter.

Steps:
1. Create `sanity/schemas/singletons/resourcesPage.ts` with fields: heroTitle, heroSubtitle, heroImage, resourceCategories (array of objects with title, description, resources array of {title, url, description, type})
2. Register in `sanity/schemas/index.ts`: add to imports, schemaTypes array, singletonTypes Set, and singletonDocIds (EN + ZH entries)
3. Add ResourcesPage interface and getResourcesPage() helper to `src/lib/sanity.ts`
4. Create placeholder PDFs in `public/` (or empty .txt files as placeholders)
5. Build `src/pages/resources.astro` with Hero, CMS fetch + try-catch, and hardcoded fallback content organized into categorized sections with styled resource cards/links
  - Estimate: 45m
  - Files: sanity/schemas/singletons/resourcesPage.ts, sanity/schemas/index.ts, src/lib/sanity.ts, src/pages/resources.astro, public/newcomer-recommendations.pdf, public/readathon4.pdf
  - Verify: npm run build 2>&1 | grep -q 'resources' && grep -q 'resourcesPage' sanity/schemas/index.ts && grep -q 'getResourcesPage' src/lib/sanity.ts && ! grep -q 'client:' src/pages/resources.astro && echo 'T01 PASS' || echo 'T01 FAIL'
- [ ] **T02: Audit em.ficcc.org content migration and fill any gaps** — Systematically verify that every 'Must Migrate' and 'Should Migrate' item from SITE-AUDIT.md Section 4 has a corresponding Sanity schema field and hardcoded fallback in an Astro page. Document findings. Fix any gaps found.

Must Migrate checklist (verify each):
- Service times (EN and ZH, summer/holiday) → visitPage schema + visit.astro fallback
- Address + map → multiple pages (visit, contact)
- Pastor bios and contact info → aboutPage schema + staff page
- Transportation/bus routes → visitPage schema + visit.astro
- Beliefs/Statement of Faith → aboutPage schema + beliefs page
- Vision Statement → aboutPage schema + about page
- FAQ content → homePage or visitPage
- All 7 photos from em.ficcc.org → public/images/
- Fellowship group names → ministry schemas + community page
- Contact info (emails, phone) → contact page
- Giving link (PayPal) → give page

Should Migrate checklist:
- Church history timeline → aboutPage or separate content
- Spiritual Resources page copy → resourcesPage (built in T01)
- Campus ministries list → resourcesPage (built in T01)
- Bible Readathon + PDF → resourcesPage (built in T01)
- Newcomer recommendations PDF → resourcesPage (built in T01)
- Church stats → about page
- CM ministry descriptions → community/ministries pages

Steps:
1. Read SITE-AUDIT.md Section 4 line by line
2. For each item, grep/read the corresponding schema and page file to confirm coverage
3. Document any gaps found
4. Fix gaps by adding missing fallback content or schema fields
5. Run `npm run build` to confirm nothing broke
6. Write a brief migration audit summary as a comment at the end (or create a short audit document)
  - Estimate: 30m
  - Files: SITE-AUDIT.md, src/pages/resources.astro, src/pages/about/index.astro, src/pages/visit.astro, src/pages/give.astro, src/pages/contact.astro, src/pages/ministries/index.astro
  - Verify: npm run build && echo 'T02 PASS: build succeeds after audit fixes'
