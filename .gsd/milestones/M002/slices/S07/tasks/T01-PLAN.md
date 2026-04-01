---
estimated_steps: 9
estimated_files: 6
skills_used: []
---

# T01: Build Resources page with Sanity singleton and hardcoded fallback content

Create the resourcesPage Sanity singleton schema, register it in the schema index (EN/ZH), add getResourcesPage() GROQ helper and ResourcesPage interface to sanity.ts, place PDF assets in public/, and build the /resources Astro page with Hero, categorized resource sections (spiritual growth articles, campus ministries list, downloadable PDFs), using try-catch CMS fetch with comprehensive hardcoded fallback content from the legacy em.ficcc.org site.

Follow the exact patterns from visitPage.ts (schema), sanity.ts (GROQ helper + interface), and visit.astro (CMS fetch with fallback). The resource categories are: (1) Spiritual Growth — articles on baptism, membership, keeping faith in college, building community; (2) Bible Readathon — reading plan PDF; (3) Newcomer Recommendations — PDF download; (4) Cornell Campus Ministries — list of 7 organizations with links.

PDFs go in public/ as static assets with absolute paths (/newcomer-recommendations.pdf, /readathon4.pdf). Since the actual PDFs are not available locally, create placeholder files and link to them — the paths and structure are what matter.

Steps:
1. Create `sanity/schemas/singletons/resourcesPage.ts` with fields: heroTitle, heroSubtitle, heroImage, resourceCategories (array of objects with title, description, resources array of {title, url, description, type})
2. Register in `sanity/schemas/index.ts`: add to imports, schemaTypes array, singletonTypes Set, and singletonDocIds (EN + ZH entries)
3. Add ResourcesPage interface and getResourcesPage() helper to `src/lib/sanity.ts`
4. Create placeholder PDFs in `public/` (or empty .txt files as placeholders)
5. Build `src/pages/resources.astro` with Hero, CMS fetch + try-catch, and hardcoded fallback content organized into categorized sections with styled resource cards/links

## Inputs

- `sanity/schemas/singletons/visitPage.ts`
- `sanity/schemas/index.ts`
- `src/lib/sanity.ts`
- `src/pages/visit.astro`
- `SITE-AUDIT.md`

## Expected Output

- `sanity/schemas/singletons/resourcesPage.ts`
- `sanity/schemas/index.ts`
- `src/lib/sanity.ts`
- `src/pages/resources.astro`
- `public/newcomer-recommendations.pdf`
- `public/readathon4.pdf`

## Verification

npm run build 2>&1 | grep -q 'resources' && grep -q 'resourcesPage' sanity/schemas/index.ts && grep -q 'getResourcesPage' src/lib/sanity.ts && ! grep -q 'client:' src/pages/resources.astro && echo 'T01 PASS' || echo 'T01 FAIL'
