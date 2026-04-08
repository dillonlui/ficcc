# Sanity Schema Redesign — Plan 2: Page Template Integration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up every page template to read CMS data from the new Sanity schemas, with current hardcoded content preserved as fallbacks. After this, staff can edit all content via Sanity Studio.

**Architecture:** Each page already has a try-catch CMS fetch pattern (K008). For pages that don't yet fetch CMS data, add the fetch + fallback pattern. For pages that already fetch, expand what they read. All existing hardcoded content becomes the fallback — the site looks identical until staff populates Sanity.

**Tech Stack:** Astro 5, Sanity GROQ queries, TypeScript

**Spec:** `docs/superpowers/specs/2026-04-08-sanity-schema-redesign.md`
**Depends on:** Plan 1 (schemas, structure, queries) — already implemented.

---

## Pattern

Every page follows this pattern. The implementer should understand this before starting any task:

```astro
---
// 1. Import CMS helpers
import { getSomePageData, urlForImage, portableTextToHtml } from '../../lib/sanity';

// 2. Fetch CMS data in try-catch
let cmsData = null;
try {
  cmsData = await getSomePageData('en');
} catch {}

// 3. Resolve fields: CMS value ?? hardcoded fallback
const title = cmsData?.heroTitle || 'Hardcoded Fallback Title';
const bodyHtml = cmsData?.body?.length
  ? portableTextToHtml(cmsData.body)
  : '<p>Hardcoded fallback content</p>';
const imageUrl = cmsData?.heroImage
  ? urlForImage(cmsData.heroImage, { width: 1600 })
  : '/images/fallback.webp';
---
```

For pages that already have this pattern, just expand the fields being resolved. For pages that don't, add the pattern.

**Key rules:**
- NEVER remove hardcoded content — it becomes the fallback
- NEVER change the HTML structure or CSS — only change where data comes from
- Wrap ALL CMS fetches in try-catch (K008)
- Use `portableTextToHtml()` for Portable Text fields
- Use `urlForImage()` for image fields
- Both EN and ZH versions of each page need updating

---

## Task 1: Splash page + siteSettings for footer

**Files:**
- Modify: `src/pages/index.astro` (splash)
- Modify: `src/components/Footer.astro` (service times from siteSettings)
- Modify: `src/lib/navigation.ts` (service times fallback)

The splash page needs to read `splashPage` data. The footer needs to read `serviceTimes` from `siteSettings` instead of hardcoded values in `navigation.ts`.

- [ ] **Step 1: Update splash page**

In `src/pages/index.astro`, add CMS fetch in the frontmatter:

```ts
import { getSplashPage, urlForImage } from '../lib/sanity';

let splashData: Awaited<ReturnType<typeof getSplashPage>> = null;
try {
  splashData = await getSplashPage();
} catch {}

const churchNameEn = splashData?.churchNameEn || 'First Ithaca Chinese Christian Church';
const churchNameZh = splashData?.churchNameZh || '以撒迦中华基督教会';
```

Then in the HTML, replace the hardcoded church names with `{churchNameEn}` and `{churchNameZh}`.

For the background image, if CMS provides one use it, otherwise keep the current fallback:
```ts
const bgDesktop = splashData?.backgroundImage
  ? urlForImage(splashData.backgroundImage, { width: 1600 })
  : '/images/hero/waterfall-landing-1600.jpg';
const bgMobile = splashData?.backgroundImage
  ? urlForImage(splashData.backgroundImage, { width: 600 })
  : '/images/hero/waterfall-landing-600.jpg';
```

Update the `<picture>` element to use these variables.

- [ ] **Step 2: Update footer to use siteSettings for service times**

In `src/components/Footer.astro`, the footer already receives `lang` as a prop. Import `getSiteSettings` and fetch the service times. The footer currently uses `getServiceTimes()` from `navigation.ts`. Update it to try CMS first, fall back to the code-driven times.

Read the current Footer.astro to understand its structure, then add a CMS fetch:

```ts
import { getSiteSettings } from '../lib/sanity';

let siteSettings = null;
try {
  siteSettings = await getSiteSettings(lang);
} catch {}

// Use CMS service times if available, otherwise fall back to navigation.ts
const serviceTimes = siteSettings?.serviceTimes?.length
  ? { heading: lang === 'zh' ? '聚會時間' : 'Service Times', items: siteSettings.serviceTimes.map(st => ({ label: `${st.label}: ${st.time}` })) }
  : getServiceTimes(lang);

// Use CMS contact info if available
const address = siteSettings?.address || '429 Mitchell Street';
const city = siteSettings?.city || 'Ithaca, NY 14850';
```

Update the footer HTML to use these variables instead of the hardcoded address.

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -5
npm test
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/components/Footer.astro
git commit -m "feat: wire splash page and footer to Sanity CMS"
```

---

## Task 2: Homepage (EN + ZH)

**Files:**
- Modify: `src/pages/en/index.astro`
- Modify: `src/pages/zh/index.astro`

Both homepages already fetch `getHomePage`. Expand them to also read `getSiteSettings` for service times in the hero info block, and use `homePage.sections` for split section content if available.

- [ ] **Step 1: Update EN homepage**

Read `src/pages/en/index.astro`. The page already fetches `getHomePage('en')` and uses `heroImage`, `heroTitle`, `heroSubtitle`. 

Add `getSiteSettings` import and fetch. Use `siteSettings.serviceTimes` for the hero info block times, with the current hardcoded times as fallback. Use `siteSettings.address` and `siteSettings.city` for the address in the hero info block.

Also add CMS-driven section content: if `homePage.sections` exists, use it; otherwise keep the hardcoded sections. Same for `homePage.bannerHeading`, `bannerBody`, etc.

For sections, since the HTML structure is complex (images, split layouts, reveal animations), keep the hardcoded HTML but make the text content resolve from CMS:

```ts
// Service times from siteSettings
const enServiceTimes = siteSettings?.serviceTimes || [
  { label: 'Sunday Gathering', time: '9:45 AM' },
  { label: 'Discipleship Groups', time: '11:00 AM' },
];

// Address from siteSettings
const churchAddress = siteSettings?.address || '429 Mitchell Street';
const churchCity = siteSettings?.city || 'Ithaca, NY 14850';
```

Then replace hardcoded "Sunday Gathering", "9:45 AM", etc. in the hero info block with `{enServiceTimes[0].label}`, `{enServiceTimes[0].time}`, etc.

Do the same for the address section.

- [ ] **Step 2: Update ZH homepage**

Same pattern. Fetch `getSiteSettings('zh')` and use Chinese service times. The ZH hero info block currently shows "華語崇拜 11:15 AM" and "門徒小組 11:00 AM" — these become fallbacks.

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/en/index.astro src/pages/zh/index.astro
git commit -m "feat: wire homepage hero info to siteSettings CMS"
```

---

## Task 3: About page (EN + ZH)

**Files:**
- Modify: `src/pages/en/about/index.astro`
- Modify: `src/pages/zh/about/index.astro`

Both already fetch `getAboutPage` and use `whoWeAreHeading`, `whoWeAreBody`, `whoWeAreImage`. Expand to also read `snapshots`, `pastors`, `timelineHeading`, `timelineEras`, and `beliefsCalloutHeading`/`Body` from CMS.

- [ ] **Step 1: Update EN about page**

Read the file. After the existing CMS data resolution, add resolution for the new fields:

```ts
// Snapshots
const snapshots = aboutPage?.snapshots?.length
  ? aboutPage.snapshots
  : [
      { accent: '40+ years in Ithaca', body: 'Worshiping, studying Scripture, and sharing life together at Cornell and throughout Ithaca.' },
      { accent: 'A church family of ~100', body: 'Students, scholars, and longtime Ithaca residents walking with Christ together.' },
      { accent: 'Countless alumni', body: 'Now serving in churches and communities across the US, Canada, and Asia - carrying what they learned here into the rest of their lives.' },
    ];

// Pastors
const pastors = aboutPage?.pastors?.length
  ? aboutPage.pastors.map(p => ({
      name: p.name,
      role: p.role || '',
      bio: p.bio?.length ? portableTextToHtml(p.bio) : '',
      photoUrl: p.photo ? urlForImage(p.photo, { width: 400 }) : null,
    }))
  : [
      {
        name: 'Min. Zhida Zhu (朱志達)',
        role: 'Pastor of English Ministry',
        bio: 'Zhida grew up in an immigrant church in Houston, Texas...',  // keep full existing bio
        photoUrl: '/images/church/zhida-zhu.webp',
      },
      {
        name: 'Min. Simon Ye (葉劍峰)',
        role: 'Pastor of Chinese Ministry',
        bio: 'Pastor Simon leads the Chinese-speaking congregation...',
        photoUrl: null,
      },
    ];

// Timeline
const timelineHeading = aboutPage?.timelineHeading || 'Our Story';
const timelineEras = aboutPage?.timelineEras?.length
  ? aboutPage.timelineEras
  : [ /* keep existing hardcoded eras array */ ];

// Beliefs callout
const beliefsCalloutHeading = aboutPage?.beliefsCalloutHeading || 'What do we believe?';
const beliefsCalloutBody = aboutPage?.beliefsCalloutBody || 'The Bible shapes everything we do. See what we hold to and where we\'re headed.';
```

Then update the HTML to use these variables instead of hardcoded values. The snapshots, pastors, and timeline can be rendered with `.map()` over the resolved arrays.

- [ ] **Step 2: Update ZH about page**

Same pattern with Chinese fallback content.

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/en/about/index.astro src/pages/zh/about/index.astro
git commit -m "feat: wire about page snapshots, pastors, timeline to CMS"
```

---

## Task 4: Beliefs page (EN + ZH)

**Files:**
- Modify: `src/pages/en/about/beliefs.astro`
- Modify: `src/pages/zh/about/beliefs.astro`

These pages are currently 100% hardcoded. Add `getBeliefsPage` fetch with the entire current content as fallback.

- [ ] **Step 1: Update EN beliefs page**

Read the file. Add CMS fetch at top of frontmatter:

```ts
import { getBeliefsPage, urlForImage, portableTextToHtml } from '../../../lib/sanity';

let beliefsPage: Awaited<ReturnType<typeof getBeliefsPage>> = null;
try {
  beliefsPage = await getBeliefsPage('en');
} catch {}
```

Then resolve each field with CMS ?? fallback:
- `heroImage`, `heroTitle`, `heroSubtitle`
- `beliefsHeading`, `beliefsIntro`
- `beliefs` array (map Portable Text to HTML for accordion)
- `scriptureQuote`, `scriptureCitation`, `scriptureImage`
- `visionHeading`, `visionIntro`, `visionItems`
- `calloutHeading`, `calloutBody`

Keep the existing hardcoded arrays as fallbacks.

- [ ] **Step 2: Update ZH beliefs page**

Same pattern with Chinese fallbacks.

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/en/about/beliefs.astro src/pages/zh/about/beliefs.astro
git commit -m "feat: wire beliefs & vision page to CMS"
```

---

## Task 5: Visit page (EN + ZH)

**Files:**
- Modify: `src/pages/en/visit.astro`
- Modify: `src/pages/zh/sundays.astro`

Already have good CMS integration. Just add resolution for the new fields: `busRoute*`, `rideRequestHeading`, `rideRequestIntro`.

- [ ] **Step 1: Update EN visit page**

Read file. Add resolution for new fields after existing CMS resolution:

```ts
const rideRequestHeading = visitPage?.rideRequestHeading || 'Need a Ride?';
const rideRequestIntro = visitPage?.rideRequestIntro || "Don't have a car? No problem. We'd love to pick you up! Fill out the form below and someone from our team will reach out to arrange a ride.";
```

Update the HTML to use these variables.

- [ ] **Step 2: Update ZH sundays page**

Same, plus resolve `busRoute*` fields:

```ts
const busRouteHeading = visitPage?.busRouteHeading || '主日接送巴士路線';
const busRouteIntro = visitPage?.busRouteIntro || '每週日早上，教會提供免費接送巴士服務。以下為七站路線及預計到達時間：';
const busRoute = visitPage?.busRoute?.length
  ? visitPage.busRoute
  : [ /* keep existing hardcoded bus route array */ ];
const rideRequestHeading = visitPage?.rideRequestHeading || '需要接送嗎？';
const rideRequestIntro = visitPage?.rideRequestIntro || '沒有車？沒問題，我們很樂意接送您！請填寫以下表格，我們的同工會與您聯繫安排接送。';
```

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/en/visit.astro src/pages/zh/sundays.astro
git commit -m "feat: wire visit page ride request and bus route to CMS"
```

---

## Task 6: Give page (EN + ZH)

**Files:**
- Modify: `src/pages/en/give.astro`
- Modify: `src/pages/zh/give.astro`

Currently 100% hardcoded. Add `getGivePage` fetch.

- [ ] **Step 1: Update EN give page**

Read file. Add CMS fetch and resolve all fields:
- `heroImage`, `heroTitle`, `heroSubtitle`
- `whyWeGiveHeading`, `whyWeGiveBody`
- `scriptureQuote`, `scriptureCitation`
- `givingMethods` array
- `questionsHeading`, `questionsBody`

Keep all existing hardcoded content as fallbacks.

- [ ] **Step 2: Update ZH give page**

Same pattern with Chinese fallbacks.

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/en/give.astro src/pages/zh/give.astro
git commit -m "feat: wire give page to CMS"
```

---

## Task 7: Contact page (EN + ZH)

**Files:**
- Modify: `src/pages/en/contact.astro`
- Modify: `src/pages/zh/contact.astro`

Currently 100% hardcoded. Add `getContactPage` and `getSiteSettings` fetches. Contact info comes from siteSettings (centralized).

- [ ] **Step 1: Update EN contact page**

Read file. Add CMS fetches:

```ts
import { getContactPage, getSiteSettings, urlForImage } from '../../lib/sanity';

let contactPage = null;
let siteSettings = null;
try {
  [contactPage, siteSettings] = await Promise.all([
    getContactPage('en'),
    getSiteSettings('en'),
  ]);
} catch {}

const heroTitle = contactPage?.heroTitle || 'Contact Us';
// ... resolve other fields

// Contact info from siteSettings
const address = siteSettings?.address || '429 Mitchell Street';
const city = siteSettings?.city || 'Ithaca, NY 14850';
const phone = siteSettings?.phone || '(607) 273-1223';
const email = siteSettings?.email || 'info@ficcc.org';
const serviceTimes = siteSettings?.serviceTimes || [
  { label: 'English Worship', time: '9:45 AM' },
  { label: 'Discipleship Groups', time: '11:00 AM' },
  { label: 'Chinese Worship', time: '11:15 AM' },
];
```

Update HTML to use these variables.

- [ ] **Step 2: Update ZH contact page**

Same pattern with Chinese fallbacks.

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/en/contact.astro src/pages/zh/contact.astro
git commit -m "feat: wire contact page to CMS with centralized siteSettings"
```

---

## Task 8: Final verification

- [ ] **Step 1: Full build**

```bash
npm run build
```

- [ ] **Step 2: Run all tests**

```bash
npm test
```

- [ ] **Step 3: Verify site renders correctly**

Start the server and spot-check pages:
```bash
npx serve dist/client -l 4321
```

Check that each page looks the same as before — all fallbacks should render since Sanity is not configured.

- [ ] **Step 4: Commit any fixes**

Only if issues found.
