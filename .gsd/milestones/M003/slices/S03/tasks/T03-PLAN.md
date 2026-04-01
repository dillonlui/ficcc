---
estimated_steps: 6
estimated_files: 1
skills_used: []
---

# T03: Create bespoke ZH Contact page with WeChat

Build src/pages/zh/contact.astro as a bespoke page — NOT a direct clone of the EN contact page (which has 4 tab forms totaling 1,450 LOC). The ZH contact page should have:

1. **Hero** with Chinese text (聯繫我們)
2. **WeChat section** as the primary contact method — prominent section with WeChat icon/branding, a placeholder for QR code image (use /images/wechat-qr-placeholder.svg or a styled placeholder box), and the text explaining to add the church WeChat for Chinese ministry communication
3. **Simplified contact form** — a single general-purpose form with Chinese labels (姓名 Name, 電郵 Email, 訊息 Message) and a submit button (發送). No Turnstile integration needed for now, no tabs. Use a simple HTML form with action='#' (placeholder) and client-side form submission pattern consistent with the EN forms
4. **Church info sidebar** in Chinese — same layout as EN sidebar but with Chinese labels (教會地址, 主日崇拜, 電子郵件, 電話)

Use the same grid layout pattern as EN contact (form area + sidebar). All CSS must use design tokens from global.css (K003). Pass lang='zh' to BaseLayout.

## Inputs

- `src/pages/contact.astro`
- `src/components/Hero.astro`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`

## Expected Output

- `src/pages/zh/contact.astro`

## Verification

npm run build && test -f dist/client/zh/contact/index.html && grep -q '微信\|WeChat' dist/client/zh/contact/index.html && grep -q 'lang="zh"' dist/client/zh/contact/index.html && grep -q '聯繫' dist/client/zh/contact/index.html
