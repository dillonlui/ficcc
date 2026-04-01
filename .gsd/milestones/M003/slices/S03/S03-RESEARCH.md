# S03: ZH Sermons, Events & Transactional — Research

**Date:** 2026-03-31

## Summary

S03 creates four ZH pages: Sermons listing + detail (`/zh/sermons/`, `/zh/sermons/[slug]`), Events (`/zh/events`), Give (`/zh/give`), and Contact (`/zh/contact`). This is straightforward clone-and-swap work following the pattern from S01 and S02 — clone EN counterpart, swap Sanity queries to `'zh'`, provide Chinese fallback content, pass `lang='zh'` to BaseLayout, use `/zh/` internal links.

The one twist is the Contact page. The EN version has a complex 4-tab interface (General Contact, Prayer Request, Ride Request, Connect) with four separate form components (~1,450 LOC total), each with hardcoded English labels, Turnstile integration, and client-side submission. The roadmap says "with WeChat" — Chinese ministry contacts are typically done via WeChat, not web forms. The pragmatic approach is a simplified ZH contact page with WeChat QR/ID as the primary contact method, church info in Chinese, and a single general-purpose contact form rather than porting all four tab-specific forms.

## Recommendation

Clone-and-swap for Sermons, Events, and Give (identical structure to EN, just translated). For Contact, build a bespoke ZH page with: (1) WeChat contact section as the primary CTA, (2) church info sidebar in Chinese, (3) a single simplified contact form with Chinese labels (no tabs). This avoids modifying four EN form components and matches Chinese congregation expectations where WeChat is the natural contact method.

## Implementation Landscape

### Key Files

- `src/pages/sermons/index.astro` — EN sermons listing. Clone to `src/pages/zh/sermons/index.astro`, swap `getSermons('en')` → `getSermons('zh')`, translate Hero/empty-state text, change internal links to `/zh/sermons/`.
- `src/pages/sermons/[slug].astro` — EN sermon detail. Clone to `src/pages/zh/sermons/[slug].astro`, swap `getSermons('en')` → `getSermons('zh')`, translate labels (Speaker→講員, Date→日期, Scripture→經文, Series→系列), change back link to `/zh/sermons`.
- `src/pages/events.astro` — EN events page. Clone to `src/pages/zh/events.astro`, swap `getEvents('en')` → `getEvents('zh')`, translate section headings and fallback events, translate empty state text.
- `src/pages/give.astro` — EN give page. Clone to `src/pages/zh/give.astro`, translate all prose (Why We Give section, verse in Chinese, giving methods). PayPal link and church address stay the same. Change `/contact` link to `/zh/contact`.
- `src/pages/contact.astro` — EN contact with 4-tab forms. DO NOT clone directly. Build `src/pages/zh/contact.astro` as a bespoke page with WeChat section + simplified Chinese contact form + church info sidebar.
- `src/components/SermonCard.astro` — Used by sermons listing. Renders title/speaker/date/series/scripture — all passed as props, so it's language-agnostic. No changes needed.
- `src/components/EventCard.astro` — Used by events page. Same — props-driven, language-agnostic. No changes needed.
- `src/lib/sanity.ts` — Has `getSermons(lang)` and `getEvents(lang)` already supporting `'zh'`. No changes needed.
- `src/components/Hero.astro` — Props-driven, no changes needed.

### Build Order

1. **ZH Sermons (listing + detail)** — two files, straightforward clone-and-swap. Proves the sermon query works with `'zh'`. Has a dynamic route (`[slug]`) which is the most mechanically complex piece.
2. **ZH Events** — single file clone-and-swap with Chinese fallback events.
3. **ZH Give** — single file, pure content translation, no CMS dependency.
4. **ZH Contact with WeChat** — bespoke page, most creative work. WeChat section + simplified form + Chinese church info.

### Verification Approach

1. `npm run build` succeeds with no errors
2. Static files exist at `dist/client/zh/sermons/index.html`, `dist/client/zh/events/index.html`, `dist/client/zh/give/index.html`, `dist/client/zh/contact/index.html`
3. Content checks: `lang="zh"` attribute present, Chinese text present (講道/證道 in sermons, 活動 in events, 奉獻 in give, 微信/WeChat in contact)
4. EN pages unchanged — no Chinese content leaked into EN counterparts

## Constraints

- Form components (ContactForm, PrayerRequestForm, RideRequestForm, ConnectForm) have ~1,450 LOC of hardcoded English labels and are tightly coupled to Turnstile integration. Modifying them for i18n is out of scope for this slice.
- `dist/client/` is the output path, not `dist/` (K009 — Vercel adapter).
- CMS fetches must be wrapped in try-catch for build resilience (K008).
- CSS must use design tokens from `global.css` only (K003).
