# S03: ZH Sermons, Events & Transactional — UAT

**Milestone:** M003
**Written:** 2026-04-01T17:07:13.970Z

# S03: ZH Sermons, Events & Transactional — UAT

**Milestone:** M003
**Written:** 2026-04-01

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: All pages are statically generated — build output verification confirms correct content, Chinese text, and lang attributes. No runtime behavior to test.

## Preconditions

- `npm run build` completes successfully
- Build output exists in `dist/client/`

## Smoke Test

Run `npm run build && test -f dist/client/zh/sermons/index.html && test -f dist/client/zh/events/index.html && test -f dist/client/zh/give/index.html && test -f dist/client/zh/contact/index.html` — all four ZH transactional pages must exist.

## Test Cases

### 1. ZH Sermons Listing Page

1. Open `dist/client/zh/sermons/index.html`
2. Verify `<html lang="zh">` attribute present
3. Verify page contains 證道 (sermons heading)
4. Verify series filter bar renders (dynamic from CMS, may be empty)
5. Verify internal links point to `/zh/sermons/` paths, not `/sermons/`
6. **Expected:** Fully Chinese sermons listing with correct lang attribute and /zh/ routing

### 2. ZH Sermons Detail Page

1. Check if any `dist/client/zh/sermons/*/index.html` files exist
2. If ZH sermon content exists in Sanity, verify detail page has Chinese labels: 講員, 日期, 經文, 系列
3. Verify date is formatted in zh-CN locale
4. Verify back link points to `/zh/sermons`
5. **Expected:** Detail pages generate when ZH sermon content exists; empty state is acceptable when no content

### 3. ZH Events Page

1. Open `dist/client/zh/events/index.html`
2. Verify `<html lang="zh">` attribute
3. Verify Chinese section headings: 即將舉行的活動, 過往活動
4. Verify fallback events render in Chinese: 主日崇拜, 主日學, 週五團契
5. **Expected:** Events page with Chinese UI text and fallback event content

### 4. ZH Give Page

1. Open `dist/client/zh/give/index.html`
2. Verify `<html lang="zh">` attribute
3. Verify 奉獻 heading present
4. Verify Chinese Bible verse reference (哥林多後書 9:7)
5. Verify three giving methods in Chinese: 網上奉獻, 支票奉獻, 現場奉獻
6. Verify link to `/zh/contact` (not `/contact`)
7. **Expected:** Give page with fully translated Chinese prose and correct cross-links

### 5. ZH Contact Page — WeChat Section

1. Open `dist/client/zh/contact/index.html`
2. Verify `<html lang="zh">` attribute
3. Verify 聯繫我們 hero heading
4. Verify WeChat/微信 section is present and prominent
5. Verify WeChat icon uses brand green (#07c160)
6. Verify QR code placeholder area exists
7. **Expected:** WeChat section is the primary contact method, visually prominent

### 6. ZH Contact Page — Form and Sidebar

1. In `dist/client/zh/contact/index.html`, verify simplified contact form
2. Verify Chinese form labels: 姓名, 電郵, 訊息
3. Verify submit button text: 發送
4. Verify church info sidebar with Chinese labels: 教會地址, 主日崇拜, 電子郵件, 電話
5. **Expected:** Simplified 3-field form (not 4-tab like EN) with Chinese labels and church info

## Edge Cases

### No ZH Sermon Content in Sanity

1. Build with no ZH sermon documents in Sanity
2. **Expected:** Sermons listing shows Chinese empty state text, no detail pages generated, build succeeds

### No ZH Event Content in Sanity

1. Build with no ZH event documents in Sanity
2. **Expected:** Events page shows Chinese fallback events (主日崇拜, 主日學, 週五團契), build succeeds

## Failure Signals

- Build fails with missing file errors for any `/zh/` transactional page
- Any page outputs `lang="en"` instead of `lang="zh"`
- English text appears where Chinese should be (e.g. "Sermons" instead of "證道")
- Links point to EN paths (e.g. `/sermons/` instead of `/zh/sermons/`)
- Contact page missing WeChat section

## Not Proven By This UAT

- ZH contact form actually submits (no backend wired)
- WeChat QR code scans correctly (placeholder only)
- Sermon detail pages render with real ZH content (no ZH sermons in Sanity yet)
- Visual design quality (artifact-driven UAT checks content, not layout)
- Mobile responsive behavior of ZH pages

## Notes for Tester

- ZH contact page is intentionally different from EN — 1 form instead of 4 tabs, WeChat section instead of Turnstile-protected forms
- WeChat QR is a placeholder box — real QR code image needs to be provided by church staff
- Sermon detail pages only generate if ZH sermon documents exist in Sanity
