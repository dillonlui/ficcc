# S03: ZH Sermons, Events & Transactional

**Goal:** Create ZH Sermons (listing + detail), Events, Give, and Contact pages at /zh/ paths, completing all Chinese ministry transactional pages.
**Demo:** After this: ZH Sermons, Events, Give, and Contact pages with WeChat

## Tasks
- [x] **T01: Created Chinese sermons listing and detail pages at /zh/sermons/ with translated UI text, zh-CN date formatting, and CMS-driven series filters** — Clone EN sermons listing (src/pages/sermons/index.astro) to src/pages/zh/sermons/index.astro and EN sermon detail (src/pages/sermons/[slug].astro) to src/pages/zh/sermons/[slug].astro. Swap getSermons('en') to getSermons('zh'), translate all user-facing text to Chinese, change internal links to /zh/sermons/ paths, pass lang='zh' to BaseLayout.

The listing page needs: Chinese title/description meta, Hero with Chinese text (證道/講道), series filter bar (labels stay dynamic from CMS), sermon grid with /zh/sermons/[slug] links, Chinese empty state text.

The detail page needs: getStaticPaths calling getSermons('zh'), Chinese meta labels (講員 for Speaker, 日期 for Date, 經文 for Scripture, 系列 for Series), date formatted with zh-CN locale, back link pointing to /zh/sermons with Chinese text, lang='zh' to BaseLayout.
  - Estimate: 30m
  - Files: src/pages/zh/sermons/index.astro, src/pages/zh/sermons/[slug].astro
  - Verify: npm run build && test -f dist/client/zh/sermons/index.html && grep -q 'lang="zh"' dist/client/zh/sermons/index.html && grep -q '講' dist/client/zh/sermons/index.html
- [x] **T02: Created Chinese events and give pages at /zh/events/ and /zh/give/ with fully translated UI text, CMS-driven content, and Chinese fallback events** — Clone EN events (src/pages/events.astro) to src/pages/zh/events.astro and EN give (src/pages/give.astro) to src/pages/zh/give.astro. Both are single-file clone-and-swap.

ZH Events: Swap getEvents('en') to getEvents('zh'). Translate Hero text, section headings (即將舉行的活動, 過往活動), empty state text, fallback events to Chinese (主日崇拜, 主日學, 週五團契 with Chinese descriptions). Pass lang='zh' to BaseLayout.

ZH Give: Translate all prose to Chinese — Why We Give section (奉獻 heading, Chinese explanation of giving), verse in Chinese (哥林多後書 9:7), giving methods with Chinese labels (網上奉獻/PayPal, 支票奉獻, 現場奉獻). Change /contact link to /zh/contact. PayPal link and church address stay the same. Pass lang='zh' to BaseLayout.
  - Estimate: 30m
  - Files: src/pages/zh/events.astro, src/pages/zh/give.astro
  - Verify: npm run build && test -f dist/client/zh/events/index.html && test -f dist/client/zh/give/index.html && grep -q '活動' dist/client/zh/events/index.html && grep -q '奉獻' dist/client/zh/give/index.html
- [x] **T03: Created bespoke Chinese contact page at /zh/contact/ with prominent WeChat section, simplified 3-field form, and Chinese church info sidebar** — Build src/pages/zh/contact.astro as a bespoke page — NOT a direct clone of the EN contact page (which has 4 tab forms totaling 1,450 LOC). The ZH contact page should have:

1. **Hero** with Chinese text (聯繫我們)
2. **WeChat section** as the primary contact method — prominent section with WeChat icon/branding, a placeholder for QR code image (use /images/wechat-qr-placeholder.svg or a styled placeholder box), and the text explaining to add the church WeChat for Chinese ministry communication
3. **Simplified contact form** — a single general-purpose form with Chinese labels (姓名 Name, 電郵 Email, 訊息 Message) and a submit button (發送). No Turnstile integration needed for now, no tabs. Use a simple HTML form with action='#' (placeholder) and client-side form submission pattern consistent with the EN forms
4. **Church info sidebar** in Chinese — same layout as EN sidebar but with Chinese labels (教會地址, 主日崇拜, 電子郵件, 電話)

Use the same grid layout pattern as EN contact (form area + sidebar). All CSS must use design tokens from global.css (K003). Pass lang='zh' to BaseLayout.
  - Estimate: 40m
  - Files: src/pages/zh/contact.astro
  - Verify: npm run build && test -f dist/client/zh/contact/index.html && grep -q '微信\|WeChat' dist/client/zh/contact/index.html && grep -q 'lang="zh"' dist/client/zh/contact/index.html && grep -q '聯繫' dist/client/zh/contact/index.html
