---
id: T02
parent: S04
milestone: M001
provides: []
requires: []
affects: []
key_files: ["sanity/schemas/index.ts", "sanity/schemas/documents/page.ts", "sanity/schemas/documents/sermon.ts", "sanity/schemas/documents/event.ts", "sanity/schemas/documents/ministry.ts", "sanity/schemas/documents/person.ts", "sanity/schemas/singletons/siteSettings.ts", "sanity/schemas/singletons/navigation.ts", "sanity/schemas/objects/heroBlock.ts", "sanity/schemas/objects/imageMosaicBlock.ts", "sanity/schemas/objects/accordionBlock.ts", "sanity/schemas/objects/cardGridBlock.ts", "sanity/schemas/objects/youtubeEmbedBlock.ts", "sanity.config.ts", "sanity/structure.ts"]
key_decisions: ["Singleton IDs follow pattern {type}-{lang} for per-language singleton docs", "Page body field accepts standard Portable Text blocks plus all 5 custom block types as an array", "Structure builder groups singletons under Settings & Navigation, filters them from default document list"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build exits 0 (3 pages built). 13 schema files found under sanity/schemas/. grep confirms schemas import in sanity.config.ts. All slice-level checks pass."
completed_at: 2026-04-01T01:33:17.430Z
blocker_discovered: false
---

# T02: Defined all 12 Sanity schema types (5 documents, 2 singletons, 5 block types) with language fields, barrel export, and singleton-aware structure builder

> Defined all 12 Sanity schema types (5 documents, 2 singletons, 5 block types) with language fields, barrel export, and singleton-aware structure builder

## What Happened
---
id: T02
parent: S04
milestone: M001
key_files:
  - sanity/schemas/index.ts
  - sanity/schemas/documents/page.ts
  - sanity/schemas/documents/sermon.ts
  - sanity/schemas/documents/event.ts
  - sanity/schemas/documents/ministry.ts
  - sanity/schemas/documents/person.ts
  - sanity/schemas/singletons/siteSettings.ts
  - sanity/schemas/singletons/navigation.ts
  - sanity/schemas/objects/heroBlock.ts
  - sanity/schemas/objects/imageMosaicBlock.ts
  - sanity/schemas/objects/accordionBlock.ts
  - sanity/schemas/objects/cardGridBlock.ts
  - sanity/schemas/objects/youtubeEmbedBlock.ts
  - sanity.config.ts
  - sanity/structure.ts
key_decisions:
  - Singleton IDs follow pattern {type}-{lang} for per-language singleton docs
  - Page body field accepts standard Portable Text blocks plus all 5 custom block types as an array
  - Structure builder groups singletons under Settings & Navigation, filters them from default document list
duration: ""
verification_result: passed
completed_at: 2026-04-01T01:33:17.431Z
blocker_discovered: false
---

# T02: Defined all 12 Sanity schema types (5 documents, 2 singletons, 5 block types) with language fields, barrel export, and singleton-aware structure builder

**Defined all 12 Sanity schema types (5 documents, 2 singletons, 5 block types) with language fields, barrel export, and singleton-aware structure builder**

## What Happened

Created 13 schema files under sanity/schemas/ organized into objects/, documents/, and singletons/ directories. Each document type and singleton includes a language field with 'en' | 'zh' options per D003. Page body accepts standard Portable Text plus all 5 custom block types. Sermon stores videoId (string) per D005. Ministry references person for leader. Singletons use IDs like siteSettings-en/zh. Barrel export provides schemaTypes array, singletonTypes set, and singletonDocIds. Updated sanity.config.ts to import schemaTypes. Updated sanity/structure.ts with full structure builder showing singletons as single-doc editors under Settings & Navigation group.

## Verification

npm run build exits 0 (3 pages built). 13 schema files found under sanity/schemas/. grep confirms schemas import in sanity.config.ts. All slice-level checks pass.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 7300ms |
| 2 | `find sanity/schemas -name '*.ts' | wc -l` | 0 | ✅ pass | 50ms |
| 3 | `grep -q 'schemas' sanity.config.ts` | 0 | ✅ pass | 10ms |
| 4 | `grep -q 'sanity' astro.config.mjs` | 0 | ✅ pass | 10ms |
| 5 | `test -f sanity.config.ts` | 0 | ✅ pass | 10ms |
| 6 | `test -f sanity/structure.ts` | 0 | ✅ pass | 10ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sanity/schemas/index.ts`
- `sanity/schemas/documents/page.ts`
- `sanity/schemas/documents/sermon.ts`
- `sanity/schemas/documents/event.ts`
- `sanity/schemas/documents/ministry.ts`
- `sanity/schemas/documents/person.ts`
- `sanity/schemas/singletons/siteSettings.ts`
- `sanity/schemas/singletons/navigation.ts`
- `sanity/schemas/objects/heroBlock.ts`
- `sanity/schemas/objects/imageMosaicBlock.ts`
- `sanity/schemas/objects/accordionBlock.ts`
- `sanity/schemas/objects/cardGridBlock.ts`
- `sanity/schemas/objects/youtubeEmbedBlock.ts`
- `sanity.config.ts`
- `sanity/structure.ts`


## Deviations
None.

## Known Issues
None.
