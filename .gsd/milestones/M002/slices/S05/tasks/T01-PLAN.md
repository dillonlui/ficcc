---
estimated_steps: 7
estimated_files: 2
skills_used: []
---

# T01: Extend ministry schema and data layer with slug, image, and detail query

Add slug and image fields to the Sanity ministry schema, update the TypeScript Ministry interface in sanity.ts to include slug and image (plus a resolved leader type for the detail query), and add a getMinistryBySlug() GROQ helper that dereferences the leader reference to inline name/role/photo.

Steps:
1. Add `slug` field (type: 'slug', options: { source: 'name' }, validation: required) and `image` field (type: 'image', options: { hotspot: true }) to `sanity/schemas/documents/ministry.ts`. Add slug to the preview select.
2. Update the `Ministry` interface in `src/lib/sanity.ts`: add `slug?: { current: string }` and `image?: SanityImage`. Add a `MinistryDetail` interface that extends Ministry with `leader` resolved as `{ name: string; role?: string; photo?: SanityImage } | null` instead of a raw ref.
3. Update the existing `getMinistries()` query to also return slug and image fields (they're already captured by `*[_type == 'ministry']` but the interface needs them).
4. Add `getMinistryBySlug(slug: string, language?: Language)` that fetches a single ministry by slug with GROQ projection `leader->{name, role, photo}` to resolve the person reference.
5. Verify: `npx tsc --noEmit` passes with no type errors on the updated interfaces.

## Inputs

- ``sanity/schemas/documents/ministry.ts` — existing ministry schema to extend`
- ``src/lib/sanity.ts` — existing data layer with Ministry interface and getMinistries()`

## Expected Output

- ``sanity/schemas/documents/ministry.ts` — ministry schema with slug and image fields added`
- ``src/lib/sanity.ts` — updated Ministry interface, new MinistryDetail interface, new getMinistryBySlug() helper`

## Verification

npx tsc --noEmit && grep -q 'getMinistryBySlug' src/lib/sanity.ts && grep -q 'slug' sanity/schemas/documents/ministry.ts
