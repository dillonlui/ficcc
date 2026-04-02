---
estimated_steps: 18
estimated_files: 13
skills_used: []
---

# T01: Install astro-pagefind, configure indexing, and scope content

Install `astro-pagefind` and configure the Astro build to produce Pagefind indexes. Add `data-pagefind-body` to all `<main id="main-content">` elements so only page content is indexed (not header/footer/nav). Add `data-pagefind-ignore="all"` to admin, styleguide, and 404 pages. Verify build produces pagefind index files in `dist/client/pagefind/`.

## Steps

1. Install `astro-pagefind` as a dependency: `npm install astro-pagefind`
2. Add `pagefind()` integration to `astro.config.mjs` integrations array (import from `astro-pagefind`)
3. Add `data-pagefind-body` attribute to all `<main id="main-content">` elements across all pages. Use a sed command or manual edit — there are ~27 pages under `src/pages/`. Every `<main id="main-content">` becomes `<main id="main-content" data-pagefind-body>`.
4. Add `data-pagefind-ignore="all"` to the top-level element in `src/pages/admin/index.astro`, `src/pages/styleguide.astro`, and `src/pages/404.astro` to exclude them from search indexing.
5. Run `npm run build` and verify `dist/client/pagefind/` directory exists with `pagefind.js` and index fragment files.

## Must-Haves

- [ ] `astro-pagefind` installed and configured in astro.config.mjs
- [ ] All `<main id="main-content">` elements have `data-pagefind-body`
- [ ] Admin, styleguide, and 404 pages have `data-pagefind-ignore="all"`
- [ ] Build succeeds and `dist/client/pagefind/pagefind.js` exists

## Verification

- `npm run build` exits 0
- `test -f dist/client/pagefind/pagefind.js` exits 0
- `ls dist/client/pagefind/fragment/` shows index fragment files
- `grep -r 'data-pagefind-body' src/pages/ --include='*.astro' | wc -l` shows count matching number of pages with `<main>`
- `grep -r 'data-pagefind-ignore' src/pages/admin/index.astro src/pages/styleguide.astro src/pages/404.astro | wc -l` equals 3

## Inputs

- ``astro.config.mjs` — current integrations array to add pagefind to`
- ``src/layouts/BaseLayout.astro` — reference for page structure (slot, lang attribute)`
- ``src/pages/index.astro` — representative page showing `<main id="main-content">` pattern`
- ``src/pages/admin/index.astro` — page to exclude from search`
- ``src/pages/styleguide.astro` — page to exclude from search`
- ``src/pages/404.astro` — page to exclude from search`

## Expected Output

- ``package.json` — astro-pagefind dependency added`
- ``astro.config.mjs` — pagefind integration configured`
- ``src/pages/**/*.astro` — all pages with `<main>` have data-pagefind-body attribute`
- ``src/pages/admin/index.astro` — data-pagefind-ignore added`
- ``src/pages/styleguide.astro` — data-pagefind-ignore added`
- ``src/pages/404.astro` — data-pagefind-ignore added`
- ``dist/client/pagefind/pagefind.js` — build output confirming index generation`

## Verification

npm run build && test -f dist/client/pagefind/pagefind.js && ls dist/client/pagefind/fragment/ | head -5
