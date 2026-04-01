---
estimated_steps: 3
estimated_files: 2
skills_used: []
---

# T02: Create ZH Events and Give pages

Clone EN events (src/pages/events.astro) to src/pages/zh/events.astro and EN give (src/pages/give.astro) to src/pages/zh/give.astro. Both are single-file clone-and-swap.

ZH Events: Swap getEvents('en') to getEvents('zh'). Translate Hero text, section headings (即將舉行的活動, 過往活動), empty state text, fallback events to Chinese (主日崇拜, 主日學, 週五團契 with Chinese descriptions). Pass lang='zh' to BaseLayout.

ZH Give: Translate all prose to Chinese — Why We Give section (奉獻 heading, Chinese explanation of giving), verse in Chinese (哥林多後書 9:7), giving methods with Chinese labels (網上奉獻/PayPal, 支票奉獻, 現場奉獻). Change /contact link to /zh/contact. PayPal link and church address stay the same. Pass lang='zh' to BaseLayout.

## Inputs

- `src/pages/events.astro`
- `src/pages/give.astro`
- `src/lib/sanity.ts`
- `src/components/EventCard.astro`
- `src/components/Hero.astro`
- `src/layouts/BaseLayout.astro`

## Expected Output

- `src/pages/zh/events.astro`
- `src/pages/zh/give.astro`

## Verification

npm run build && test -f dist/client/zh/events/index.html && test -f dist/client/zh/give/index.html && grep -q '活動' dist/client/zh/events/index.html && grep -q '奉獻' dist/client/zh/give/index.html
