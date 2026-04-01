---
estimated_steps: 28
estimated_files: 7
skills_used: []
---

# T02: Audit em.ficcc.org content migration and fill any gaps

Systematically verify that every 'Must Migrate' and 'Should Migrate' item from SITE-AUDIT.md Section 4 has a corresponding Sanity schema field and hardcoded fallback in an Astro page. Document findings. Fix any gaps found.

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

## Inputs

- `SITE-AUDIT.md`
- `src/pages/resources.astro`
- `sanity/schemas/singletons/aboutPage.ts`
- `sanity/schemas/singletons/visitPage.ts`
- `sanity/schemas/singletons/homePage.ts`
- `src/lib/sanity.ts`

## Expected Output

- `src/pages/resources.astro`
- `src/pages/about/index.astro`

## Verification

npm run build && echo 'T02 PASS: build succeeds after audit fixes'
