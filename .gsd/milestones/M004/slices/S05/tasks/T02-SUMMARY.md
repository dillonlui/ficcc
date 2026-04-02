---
id: T02
parent: S05
milestone: M004
provides: []
requires: []
affects: []
key_files: ["docs/staff/README.md", "docs/staff/publishing-a-sermon.md", "docs/staff/creating-an-event.md", "docs/staff/managing-announcement-bar.md"]
key_decisions: ["Documented exact field names and types from Sanity schemas rather than paraphrasing"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "Ran combined verification: all 4 files exist, no TBD/TODO placeholders found, README has 3+ H2 headings. All checks passed."
completed_at: 2026-04-02T17:21:22.799Z
blocker_discovered: false
---

# T02: Created four Markdown staff guides covering Studio access, sermon publishing, event creation, and announcement bar management with field-level accuracy from Sanity schemas

> Created four Markdown staff guides covering Studio access, sermon publishing, event creation, and announcement bar management with field-level accuracy from Sanity schemas

## What Happened
---
id: T02
parent: S05
milestone: M004
key_files:
  - docs/staff/README.md
  - docs/staff/publishing-a-sermon.md
  - docs/staff/creating-an-event.md
  - docs/staff/managing-announcement-bar.md
key_decisions:
  - Documented exact field names and types from Sanity schemas rather than paraphrasing
duration: ""
verification_result: passed
completed_at: 2026-04-02T17:21:22.799Z
blocker_discovered: false
---

# T02: Created four Markdown staff guides covering Studio access, sermon publishing, event creation, and announcement bar management with field-level accuracy from Sanity schemas

**Created four Markdown staff guides covering Studio access, sermon publishing, event creation, and announcement bar management with field-level accuracy from Sanity schemas**

## What Happened

Read sermon.ts, event.ts, and siteSettings.ts schemas to extract exact field definitions. Wrote docs/staff/README.md (overview, login, content model, publish pipeline), publishing-a-sermon.md (field table, YouTube ID extraction, common mistakes), creating-an-event.md (field table, hotspot/rich text tips, common mistakes), and managing-announcement-bar.md (enable/disable/edit workflow, both-language reminder). All guides explain the 2-3 minute publish → rebuild → live delay and cover EN/ZH language variants.

## Verification

Ran combined verification: all 4 files exist, no TBD/TODO placeholders found, README has 3+ H2 headings. All checks passed.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `test -f docs/staff/README.md && test -f docs/staff/publishing-a-sermon.md && test -f docs/staff/creating-an-event.md && test -f docs/staff/managing-announcement-bar.md && ! grep -rq 'TBD\|TODO' docs/staff/ && test $(grep -c '## ' docs/staff/README.md) -ge 3` | 0 | ✅ pass | 500ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `docs/staff/README.md`
- `docs/staff/publishing-a-sermon.md`
- `docs/staff/creating-an-event.md`
- `docs/staff/managing-announcement-bar.md`


## Deviations
None.

## Known Issues
None.
