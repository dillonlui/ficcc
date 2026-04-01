---
estimated_steps: 25
estimated_files: 3
skills_used: []
---

# T01: Build getAlternateUrl utility with Vitest unit tests

Add `getAlternateUrl(pathname: string, currentLang: Lang): string` to `src/lib/navigation.ts` and set up Vitest with comprehensive unit tests.

## Steps

1. Install vitest as a dev dependency: `npm i -D vitest`
2. Add `"test": "vitest run"` to package.json scripts if not present
3. Add `getAlternateUrl` function to `src/lib/navigation.ts` with:
   - An explicit asymmetric route map: `{ '/visit': '/zh/sundays', '/zh/sundays': '/visit' }`
   - Trailing slash normalization (strip before matching, don't add back)
   - Standard prefix swap logic: EN `/about` → ZH `/zh/about`, ZH `/zh/about` → EN `/about`
   - Fallback: pages with no counterpart (e.g. `/resources`, `/styleguide`, `/admin/*`, `/404`) → other language homepage (`/zh` or `/`)
   - Handle root paths: `/` → `/zh`, `/zh` → `/`
4. Create `src/lib/navigation.test.ts` with test cases:
   - Standard swap: `/about` (en) → `/zh/about`, `/zh/about` (zh) → `/about`
   - Nested paths: `/about/beliefs` (en) → `/zh/about/beliefs`
   - Asymmetric: `/visit` (en) → `/zh/sundays`, `/zh/sundays` (zh) → `/visit`
   - Root: `/` (en) → `/zh`, `/zh` (zh) → `/`
   - Fallback: `/resources` (en) → `/zh`, `/styleguide` (en) → `/zh`
   - Trailing slash: `/about/` (en) → `/zh/about`
   - Dynamic routes: `/sermons/some-slug` (en) → `/zh/sermons/some-slug`
5. Run `npx vitest run` and confirm all tests pass

## Must-Haves

- [ ] `getAlternateUrl` exported from `src/lib/navigation.ts`
- [ ] Asymmetric route map covers `/visit` ↔ `/zh/sundays`
- [ ] Fallback to homepage for pages with no counterpart
- [ ] Trailing slash normalization
- [ ] All unit tests pass

## Inputs

- ``src/lib/navigation.ts` — existing navigation module with Lang type and nav link functions`

## Expected Output

- ``src/lib/navigation.ts` — updated with getAlternateUrl function`
- ``src/lib/navigation.test.ts` — unit tests for route mapping`
- ``package.json` — vitest dev dependency and test script added`

## Verification

npx vitest run --reporter=verbose
