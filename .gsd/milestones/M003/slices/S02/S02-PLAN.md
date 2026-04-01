# S02: ZH Community & Ministries

**Goal:** ZH Community & Ministries pages at /zh/ministries/ with 7 fellowship groups and ministry programs (Sunday School, Discipleship) in Chinese fallback content, plus a ZH ministry detail page.
**Demo:** After this: ZH Community with all 7 fellowship groups. ZH Ministries with Sunday School and Discipleship.

## Tasks
- [x] **T01: Created ZH ministries listing with 7 fellowship groups and 2 ministry programs, plus ZH detail page with Chinese labels and /zh/ routing** — Clone the EN ministries listing (src/pages/ministries/index.astro) and detail page (src/pages/ministries/[slug].astro) to their ZH equivalents at src/pages/zh/ministries/. The listing page needs Chinese fallback content for 7 fellowship groups (福音組, 家庭組, 長青組, 校園組, 職青組, 兒童主日學, 青少年組) and ministry programs (主日學 Sunday School, 門徒訓練 Discipleship). The detail page needs a /zh/ministries back link and lang='zh' threading.

Follow the S01 ZH page pattern exactly: clone EN counterpart, swap Sanity queries to 'zh', provide Chinese fallback content, pass lang='zh' to BaseLayout, use /zh/ internal links.

Steps:
1. Create src/pages/zh/ministries/index.astro by cloning src/pages/ministries/index.astro. Change getMinistries('en') to getMinistries('zh'). Replace EN fallback groups with 7 Chinese fellowship groups and ministry programs. Update title/description to Chinese. Set Hero title to '社區與事工'. Pass lang='zh' to BaseLayout. Update any internal links to /zh/ paths.
2. Create src/pages/zh/ministries/[slug].astro by cloning src/pages/ministries/[slug].astro. Change getMinistries('en') and getMinistryBySlug(slug, 'en') to 'zh'. Update back link from /ministries to /zh/ministries. Change 'Meeting Time' label to '聚會時間'. Change 'Back to Ministries' to '← 返回事工'. Pass lang='zh' to BaseLayout.
3. Run npm run build and verify both pages exist in dist/client/zh/ministries/ with correct Chinese content and lang attribute.
  - Estimate: 30m
  - Files: src/pages/zh/ministries/index.astro, src/pages/zh/ministries/[slug].astro
  - Verify: npm run build && test -f dist/client/zh/ministries/index.html && grep -q '團契' dist/client/zh/ministries/index.html && grep -q 'lang="zh"' dist/client/zh/ministries/index.html && ! grep -q '團契' dist/client/ministries/index.html
