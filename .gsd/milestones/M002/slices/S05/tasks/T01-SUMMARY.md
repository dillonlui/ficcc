---
id: T01
parent: S05
milestone: M002
provides: []
requires: []
affects: []
key_files: ["sanity/schemas/documents/ministry.ts", "src/lib/sanity.ts"]
key_decisions: ["MinistryDetail uses Omit<Ministry, 'leader'> to replace raw ref with resolved object type"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npx tsc --noEmit shows no errors in modified files. grep confirms getMinistryBySlug exists in sanity.ts and slug field exists in ministry schema."
completed_at: 2026-04-01T13:58:39.202Z
blocker_discovered: false
---

# T01: Added slug and image fields to ministry schema, MinistryDetail interface, and getMinistryBySlug() GROQ helper with leader dereference

> Added slug and image fields to ministry schema, MinistryDetail interface, and getMinistryBySlug() GROQ helper with leader dereference

## What Happened
---
id: T01
parent: S05
milestone: M002
key_files:
  - sanity/schemas/documents/ministry.ts
  - src/lib/sanity.ts
key_decisions:
  - MinistryDetail uses Omit<Ministry, 'leader'> to replace raw ref with resolved object type
duration: ""
verification_result: passed
completed_at: 2026-04-01T13:58:39.202Z
blocker_discovered: false
---

# T01: Added slug and image fields to ministry schema, MinistryDetail interface, and getMinistryBySlug() GROQ helper with leader dereference

**Added slug and image fields to ministry schema, MinistryDetail interface, and getMinistryBySlug() GROQ helper with leader dereference**

## What Happened

Extended the Sanity ministry schema with slug (required, sourced from name) and image (hotspot enabled) fields. Updated the Ministry interface in the data layer with slug and image properties. Created MinistryDetail interface using Omit to replace the raw leader reference with a resolved object type. Added getMinistryBySlug() that fetches by slug with GROQ leader->{name, role, photo} projection.

## Verification

npx tsc --noEmit shows no errors in modified files. grep confirms getMinistryBySlug exists in sanity.ts and slug field exists in ministry schema.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit (filtered to modified files)` | 0 | ✅ pass | 2900ms |
| 2 | `grep -q 'getMinistryBySlug' src/lib/sanity.ts` | 0 | ✅ pass | 50ms |
| 3 | `grep -q 'slug' sanity/schemas/documents/ministry.ts` | 0 | ✅ pass | 50ms |


## Deviations

None.

## Known Issues

Pre-existing type errors in sanity.config.ts and sanity/structure.ts are unrelated.

## Files Created/Modified

- `sanity/schemas/documents/ministry.ts`
- `src/lib/sanity.ts`


## Deviations
None.

## Known Issues
Pre-existing type errors in sanity.config.ts and sanity/structure.ts are unrelated.
