# S04: Pagefind Search Integration — Research

**Date:** 2026-03-31

## Summary

Pagefind is a fully static search library that indexes HTML output post-build and serves search from static files — no server required. The site already meets Pagefind's key prerequisites: `<html lang="en|zh">` is set on every page, `<main id="main-content">` wraps content on all 28 pages, and the static build outputs to `dist/client/`. Pagefind v1.4.0 is already available via npx.

Two integration paths exist: (1) `astro-pagefind` — an Astro integration that auto-runs indexing after build and provides an `<Search>` component, or (2) manual CLI — run `npx pagefind --site dist/client` as a postbuild step and wire up Pagefind's built-in UI manually. The `astro-pagefind` integration is cleaner (auto-runs, provides a typed Astro component) and is well-maintained (8.7 trust score). Recommended approach.

Pagefind's multilingual support is zero-config — it detects `lang` attributes on `<html>` and builds separate indexes per language. When Pagefind UI loads on a `/zh/` page, it automatically searches only ZH-indexed content. This means both EN and ZH search work out of the box with no custom logic.

## Recommendation

Use `astro-pagefind` integration. It handles the build-time indexing automatically and provides a drop-in `<Search>` component. Add `data-pagefind-body` to `<main>` elements to scope indexing to page content (excluding header, footer, nav). Exclude `/admin` and `/styleguide` with `data-pagefind-ignore`. Place the search UI in the Header component as a search icon/button that opens a modal or inline search panel. Style with CSS custom properties to match the site's design tokens.

## Implementation Landscape

### Key Files

- `astro.config.mjs` — Add `astro-pagefind` to integrations array. Minimal config needed.
- `src/layouts/BaseLayout.astro` — Add `data-pagefind-body` to the `<slot />` wrapper (or pass through to pages). This scopes indexing to main content only, excluding header/footer/nav.
- `src/components/Header.astro` — Add search trigger button (magnifying glass icon) to the header nav. On click, opens Pagefind's search UI.
- `src/components/Search.astro` — New component wrapping `astro-pagefind`'s `<Search>` with site-specific CSS variable overrides (using `--color-*` tokens from global.css). Could be a modal overlay or an inline dropdown.
- `src/pages/admin/index.astro` — Add `data-pagefind-ignore="all"` to prevent Studio page from being indexed.
- `src/pages/styleguide.astro` — Add `data-pagefind-ignore="all"` to exclude dev-only page.
- `src/pages/404.astro` — Add `data-pagefind-ignore="all"`.

### Build Order

1. **Install + index (T01):** Add `astro-pagefind` dependency, configure in `astro.config.mjs`, add `data-pagefind-body` to BaseLayout's main content area, add `data-pagefind-ignore` to admin/styleguide/404. Run build. Verify `dist/client/pagefind/` directory is created with index files for both `en` and `zh`.
2. **Search UI (T02):** Create Search component with Pagefind UI styled to match site design tokens. Add search trigger to Header. Wire up modal/overlay behavior. Verify: type a query, see results from sermons, pages, and ZH content when on a ZH page.
3. **Polish + verification (T03):** Keyboard accessibility (Escape to close, focus trap in modal), mobile responsive behavior, exclude admin/styleguide from results verification, cross-language search test.

### Verification Approach

- `npm run build` succeeds and `dist/client/pagefind/` exists with `pagefind.js`, index files
- `ls dist/client/pagefind/` shows both language indexes (look for `wasm.unknown.pagefind` and fragment files)
- Serve locally with `npx serve dist/client -l 4321`, navigate to site, use search — results appear for EN queries on EN pages and ZH queries on ZH pages
- Search for "sermon" on EN page returns sermon pages
- Search on `/zh/` page returns only ZH content
- Admin, styleguide, and 404 pages don't appear in search results
- Keyboard: Tab to search trigger, Enter to open, type query, Escape to close

## Constraints

- Site uses `output: 'static'` with Vercel adapter — build output is in `dist/client/` not `dist/` (K009). The `astro-pagefind` integration should handle this automatically since it hooks into Astro's build pipeline, but verify the pagefind output lands in the right place.
- The Header is an Astro component with no client-side framework — search UI interaction (open/close modal) needs vanilla JS, similar to the existing hamburger menu pattern.
- CJK font loading is async (K001) — search UI should not depend on CJK fonts being loaded to function.

## Common Pitfalls

- **Indexing the wrong content** — Without `data-pagefind-body`, Pagefind indexes everything including nav, footer, cookie banners. This pollutes results with repeated boilerplate text. Scope to `<main>` content.
- **`dist/client/` path mismatch** — If `astro-pagefind` writes to `dist/` but the site serves from `dist/client/`, the pagefind bundle won't be found at runtime. Test this during T01.
- **Modal z-index conflicts** — Header is `z-index: 100`, mobile nav overlay is `z-index: 105`. Search modal needs to layer above both. Use `z-index: 200` or similar.
