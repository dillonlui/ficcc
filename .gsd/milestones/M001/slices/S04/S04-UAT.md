# S04: Sanity Schema & Studio — UAT

**Milestone:** M001
**Written:** 2026-04-01T01:38:08.882Z

# S04: Sanity Schema & Studio — UAT

**Milestone:** M001
**Written:** 2026-03-31

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: Sanity Studio is a client-side React app that loads against a remote Sanity dataset — schema correctness is verified by successful build compilation. Live Studio interaction requires valid Sanity credentials and a browser session, which is beyond static CI. The build validates all schema definitions are syntactically correct and the Studio bundle compiles.

## Preconditions

- `npm install` completed
- `.env` contains valid `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` values
- `npm run build` exits 0

## Smoke Test

Run `npm run build` — should exit 0 and produce 3 pages including `/admin/index.html`. Open `dist/admin/index.html` to confirm it contains a React mount point for Sanity Studio.

## Test Cases

### 1. All 13 schema files exist with correct structure

1. Run `find sanity/schemas -name '*.ts' -not -name 'index.ts' | sort`
2. **Expected:** 12 files listed:
   - `sanity/schemas/documents/event.ts`
   - `sanity/schemas/documents/ministry.ts`
   - `sanity/schemas/documents/page.ts`
   - `sanity/schemas/documents/person.ts`
   - `sanity/schemas/documents/sermon.ts`
   - `sanity/schemas/objects/accordionBlock.ts`
   - `sanity/schemas/objects/cardGridBlock.ts`
   - `sanity/schemas/objects/heroBlock.ts`
   - `sanity/schemas/objects/imageMosaicBlock.ts`
   - `sanity/schemas/objects/youtubeEmbedBlock.ts`
   - `sanity/schemas/singletons/navigation.ts`
   - `sanity/schemas/singletons/siteSettings.ts`
3. Run `test -f sanity/schemas/index.ts`
4. **Expected:** Exit 0 — barrel export exists

### 2. Every document type has a language field

1. Run `grep -l "name: 'language'" sanity/schemas/documents/*.ts sanity/schemas/singletons/*.ts`
2. **Expected:** All 7 files (5 documents + 2 singletons) listed

### 3. Barrel export registers all schema types

1. Run `grep -c 'export' sanity/schemas/index.ts`
2. **Expected:** At least 3 exports (schemaTypes array, singletonTypes, singletonDocIds)
3. Run `grep 'schemaTypes' sanity.config.ts`
4. **Expected:** sanity.config.ts imports and uses schemaTypes from barrel export

### 4. GROQ query helpers are typed and exported

1. Run `grep -c 'export.*function\|export.*const.*=' src/lib/sanity.ts`
2. **Expected:** At least 7 (client + 6 query functions)
3. Run `grep 'getPageBySlug\|getSermons\|getEvents\|getMinistries\|getSiteSettings\|getNavigation' src/lib/sanity.ts`
4. **Expected:** All 6 function names present

### 5. Old studio/ directory removed

1. Run `test -d studio && echo "FAIL: studio/ still exists" || echo "PASS"`
2. **Expected:** "PASS"

### 6. Studio page builds and is accessible

1. Run `npm run build`
2. **Expected:** Exit 0, output includes `/admin/index.html`
3. Run `grep -q 'Studio\|sanity\|react' dist/admin/index.html`
4. **Expected:** Exit 0 — admin page references Studio/React

### 7. Lighthouse CI passes with no regressions

1. Run `npm run build && npx lhci autorun`
2. **Expected:** All assertions pass. /admin is not in the tested URL set so it doesn't affect scores.

## Edge Cases

### Schema barrel export completeness

1. Run `node -e "const fs = require('fs'); const idx = fs.readFileSync('sanity/schemas/index.ts','utf8'); const types = (idx.match(/import/g)||[]).length; console.log(types + ' imports')"`
2. **Expected:** 12 imports (matching the 12 non-index schema files)

### Singleton ID pattern

1. Run `grep -r "siteSettings-\|navigation-" sanity/`
2. **Expected:** References to `siteSettings-en`, `siteSettings-zh`, `navigation-en`, `navigation-zh` in structure.ts or schemas

## Failure Signals

- `npm run build` fails — schema syntax error or missing import
- Missing schema files under `sanity/schemas/`
- `src/lib/sanity.ts` missing query helper exports
- `studio/` directory still exists
- Lighthouse CI assertion failures indicating performance regression

## Not Proven By This UAT

- Live Sanity Studio functionality (requires valid project credentials and browser session)
- Content creation and querying against real Sanity dataset
- Preview mode integration (deferred to S06)
- CSP headers for Studio in production (verified as not needed — scripts are self-hosted)

## Notes for Tester

- The Studio at /admin loads as a client-side React app. Without valid Sanity credentials in env vars, it will show a connection error — this is expected. The UAT focuses on build-time validation of schemas and query helpers.
- The pane2 chunk (~5MB) is large but only loads on /admin. Production content pages are unaffected.
- Lighthouse CI tests only / and /styleguide, not /admin.
