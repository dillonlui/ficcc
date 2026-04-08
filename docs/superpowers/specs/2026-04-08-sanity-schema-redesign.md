# Sanity CMS Schema Redesign — Design Spec

## Overview

Redesign the Sanity CMS schema to make all site content editable by non-technical church staff. Currently most content is hardcoded with CMS integration only on a few pages. After this work, staff can edit every page's text, images, service times, pastor info, beliefs, giving methods, and more — without touching code.

## Principles

- **Everything editable** — every piece of visible content should be manageable in Sanity Studio
- **Centralized shared data** — service times, contact info, and church details live in `siteSettings` and are pulled everywhere
- **Bilingual parity** — EN and ZH content managed as paired documents grouped by page
- **Rich text where it helps** — Portable Text for body copy, plain strings for headings/labels
- **Graceful fallbacks** — every CMS field has a hardcoded fallback so the site builds even if Sanity is unreachable (K008)

## Studio Sidebar Organization

Pages are grouped by function, with EN and ZH documents paired together so staff can keep both languages in sync:

```
Sanity Studio Sidebar:
├── 🏠 Splash Page
│   └── Splash Page (single doc, language-neutral)
├── 🏠 Homepage
│   ├── Homepage (EN)
│   └── 首頁 (ZH)
├── 📖 Who We Are
│   ├── Who We Are (EN)
│   └── 關於我們 (ZH)
├── ✝️ Beliefs & Vision
│   ├── Beliefs & Vision (EN)
│   └── 信仰與願景 (ZH)
├── 🙏 Visit / Sundays
│   ├── Plan Your Visit (EN)
│   └── 主日聚會 (ZH)
├── 💰 Give
│   ├── Give (EN)
│   └── 奉獻 (ZH)
├── 📬 Contact
│   ├── Contact (EN)
│   └── 聯絡我們 (ZH)
├── 📚 Resources
│   ├── Resources (EN)
│   └── 資源 (ZH)
├── ⚙️ Site Settings
│   ├── Settings (EN)
│   └── 設定 (ZH)
├── 📄 Sermons (collection, filterable by language)
├── 📅 Events (collection, filterable by language)
└── 🤝 Ministries (collection, filterable by language)
```

## Singleton Schemas

### splashPage (single document, language-neutral)

ID: `splashPage`

| Field | Type | Description |
|-------|------|-------------|
| `backgroundImage` | image (hotspot) | Waterfall/nature background photo |
| `churchNameEn` | string | English church name |
| `churchNameZh` | string | Chinese church name |

### siteSettings (en, zh)

IDs: `siteSettings-en`, `siteSettings-zh`

| Field | Type | Description |
|-------|------|-------------|
| `churchName` | string, required | Church name in this language |
| `address` | string | Street address |
| `city` | string | City, State ZIP |
| `phone` | string | Phone number |
| `email` | string | Contact email |
| `serviceTimes` | array of `{label: string, time: string}` | Service times for this language (e.g., "Sunday Gathering" / "9:45 AM" for EN, "華語崇拜" / "11:15 AM" for ZH) |
| `socialLinks` | array of `{platform: enum, url: url}` | Platforms: facebook, instagram, youtube, wechat |
| `announcementBarEnabled` | boolean (default: false) | Toggle announcement bar |
| `announcementBarText` | string | Announcement text (hidden unless enabled) |
| `announcementBarLink` | url | Optional link for announcement (hidden unless enabled) |
| `language` | string, required | 'en' or 'zh' |

**Used by:** Footer (service times, address, links), contact page (address, phone, email, service times), homepage hero info block (service times, address), BaseLayout (announcement bar)

### homePage (en, zh)

IDs: `homePage-en`, `homePage-zh`

| Field | Type | Description |
|-------|------|-------------|
| `heroImage` | image (hotspot) | Hero background photo |
| `heroTitle` | string, required | Hero heading (e.g., "Welcome Home") |
| `heroSubtitle` | string | Hero subheading |
| `heroCtaText` | string | CTA button text (e.g., "Plan Your Visit") |
| `heroCtaHref` | string | CTA button link |
| `sections` | array of `homeSection` | The split sections (Go Deeper, Sunday Mornings, etc.) |
| `bannerHeading` | string | "Bridging Cultures" banner heading |
| `bannerBody` | Portable Text | Banner description |
| `bannerImage` | image (hotspot) | Banner background photo |
| `bannerCtaText` | string | Banner CTA text |
| `bannerCtaHref` | string | Banner CTA link |
| `language` | string, required | 'en' or 'zh' |

**homeSection object:**

| Field | Type | Description |
|-------|------|-------------|
| `heading` | string, required | Section heading |
| `body` | Portable Text | Section body copy |
| `image` | image (hotspot) | Section photo |
| `ctaText` | string | CTA link text |
| `ctaHref` | string | CTA link URL |
| `layout` | string enum: 'default', 'reversed' | Whether image is left or right |
| `tinted` | boolean (default: false) | Whether section has tinted background |

### aboutPage (en, zh)

IDs: `aboutPage-en`, `aboutPage-zh`

| Field | Type | Description |
|-------|------|-------------|
| `heroHeading` | string, required | "Who We Are" |
| `heroBody` | Portable Text | About body text |
| `heroImage` | image (hotspot) | Side image (Cornell campus, etc.) |
| `snapshots` | array of `{accent: string, body: string}` | Stats like "40+ years in Ithaca" |
| `pastors` | array of `pastor` objects | Pastor cards |
| `timelineHeading` | string | "Our Story" |
| `timelineEras` | array of `timelineEra` | Timeline eras with entries |
| `beliefsCalloutHeading` | string | "What do we believe?" |
| `beliefsCalloutBody` | string | Callout description |
| `language` | string, required | 'en' or 'zh' |

**pastor object:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string, required | Pastor name |
| `role` | string | Role title |
| `bio` | Portable Text | Bio text |
| `photo` | image (hotspot) | Headshot (optional — falls back to placeholder icon) |

**timelineEra object:**

| Field | Type | Description |
|-------|------|-------------|
| `title` | string, required | Era name, e.g., "Beginnings (1968-1988)" |
| `entries` | array of `{year: string, description: string}` | Individual timeline events |

### beliefsPage (en, zh) — NEW

IDs: `beliefsPage-en`, `beliefsPage-zh`

| Field | Type | Description |
|-------|------|-------------|
| `heroImage` | image (hotspot) | Hero banner image |
| `heroTitle` | string, required | "Beliefs & Vision" |
| `heroSubtitle` | string | Subtitle below hero |
| `beliefsHeading` | string | "What We Believe" |
| `beliefsIntro` | string | Intro paragraph above accordion |
| `beliefs` | array of `{title: string, content: Portable Text}` | Belief items for accordion |
| `scriptureQuote` | string | Quote text for the scripture banner |
| `scriptureCitation` | string | Citation (e.g., "2 Timothy 3:16-17") |
| `scriptureImage` | image (hotspot) | Background image for scripture banner |
| `visionHeading` | string | "Our Vision" |
| `visionIntro` | Portable Text | Vision intro paragraph |
| `visionItems` | array of `{title: string, content: Portable Text}` | Vision accordion items |
| `calloutHeading` | string | "See our faith in action" |
| `calloutBody` | string | Callout description |
| `language` | string, required | 'en' or 'zh' |

### visitPage (en, zh) — exists, extended

IDs: `visitPage-en`, `visitPage-zh`

Existing fields kept. New fields added:

| Field | Type | Description |
|-------|------|-------------|
| `busRoute` | array of `{stop: string, time: string}` | Sunday bus pickup route (primarily for ZH, can be empty for EN) |
| `busRouteHeading` | string | "Sunday Bus Route" heading |
| `busRouteIntro` | string | Intro text for bus route section |
| `rideRequestHeading` | string | "Need a Ride?" |
| `rideRequestIntro` | string | Intro paragraph above ride form |
| `language` | string, required | 'en' or 'zh' |

All existing visitPage fields remain: heroImage, heroTitle, heroSubtitle, schedule, whatToExpect, transportation, faqItems, rideRequestEnabled.

### givePage (en, zh) — NEW

IDs: `givePage-en`, `givePage-zh`

| Field | Type | Description |
|-------|------|-------------|
| `heroImage` | image (hotspot) | Hero banner image |
| `heroTitle` | string, required | "Give" |
| `heroSubtitle` | string | Subtitle |
| `whyWeGiveHeading` | string | Section heading |
| `whyWeGiveBody` | Portable Text | Why we give prose |
| `scriptureQuote` | string | Blockquote verse text |
| `scriptureCitation` | string | Verse reference |
| `givingMethods` | array of `givingMethod` | Ways to give cards |
| `questionsHeading` | string | "Questions?" |
| `questionsBody` | string | Questions section body |
| `language` | string, required | 'en' or 'zh' |

**givingMethod object:**

| Field | Type | Description |
|-------|------|-------------|
| `title` | string, required | Method name (e.g., "Online via PayPal") |
| `description` | string | Method description |
| `icon` | string enum: 'globe', 'envelope', 'people' | Icon type |
| `link` | url | Optional external link (PayPal URL) |
| `linkText` | string | Link button text |
| `note` | string | Additional note (e.g., "Sundays at 9:45 AM") |
| `address` | string | Mailing address (for check method) |

### contactPage (en, zh) — NEW

IDs: `contactPage-en`, `contactPage-zh`

| Field | Type | Description |
|-------|------|-------------|
| `heroImage` | image (hotspot) | Hero banner image |
| `heroTitle` | string, required | "Contact Us" |
| `heroSubtitle` | string | Subtitle |
| `formEnabled` | boolean (default: true) | Toggle contact form |
| `language` | string, required | 'en' or 'zh' |

Contact info (address, phone, email, service times) pulled from `siteSettings`.

### resourcesPage (en, zh) — exists, no changes

Already has: heroImage, heroTitle, heroSubtitle, resourceCategories (array of categories with nested resources).

## Document Collections (unchanged)

### sermon
- title, slug, speaker, date, series, scripture, videoId, language
- No schema changes needed

### event
- title, date, endDate, time, location, description (Portable Text), image, recurring, language
- No schema changes needed

### ministry
- name, slug, image, description (Portable Text), leader (string), meetingTime, language
- No schema changes needed

## Centralized Data Flow

### Service Times
`siteSettings-en` and `siteSettings-zh` each have a `serviceTimes` array. These are pulled by:
- Footer (via `getSiteSettings`)
- Homepage hero info block
- Contact page
- Any page that shows service times

Staff edits service times once per language in Site Settings.

### Contact Info
`siteSettings-en` and `siteSettings-zh` have `address`, `city`, `phone`, `email`. These are pulled by:
- Footer
- Contact page
- Homepage hero info block (address)
- Give page "By Check" method could reference this

Staff edits contact info once per language in Site Settings.

## Migration Strategy

1. **Create new schema files** for `splashPage`, `beliefsPage`, `givePage`, `contactPage`
2. **Update existing schemas** for `siteSettings` (add `city`, ensure `serviceTimes` is correct), `visitPage` (add bus route fields), `aboutPage` (add pastors, timeline, snapshots), `homePage` (add sections, banner fields)
3. **Remove unused schemas/fields** — clean up `navigation` singleton (nav is code-driven now), remove `page` generic type (unused), remove object types that aren't used (heroBlock, imageMosaicBlock, etc.)
4. **Update structure.ts** to implement the new sidebar organization
5. **Update GROQ queries** in `src/lib/sanity.ts` to fetch new fields
6. **Update page templates** to read from CMS with existing content as fallbacks
7. **Seed Sanity with current content** — create initial documents with the hardcoded content so staff has a starting point

## Schemas to Remove

- `navigation` singleton — nav links are code-driven from `src/lib/navigation.ts`
- `page` document type — generic page builder, unused
- `heroBlock`, `imageMosaicBlock`, `accordionBlock`, `cardGridBlock`, `youtubeEmbedBlock` object types — part of the unused page builder

## Files Changed

### New schemas
- `sanity/schemas/singletons/splashPage.ts`
- `sanity/schemas/singletons/beliefsPage.ts`
- `sanity/schemas/singletons/givePage.ts`
- `sanity/schemas/singletons/contactPage.ts`

### Modified schemas
- `sanity/schemas/singletons/siteSettings.ts` — add `city`, verify `serviceTimes`
- `sanity/schemas/singletons/homePage.ts` — add `sections`, `banner*` fields
- `sanity/schemas/singletons/aboutPage.ts` — add `pastors`, `timelineEras`, `snapshots`, `beliefsCallout*`
- `sanity/schemas/singletons/visitPage.ts` — add `busRoute*`, `rideRequest*` fields

### Removed schemas
- `sanity/schemas/singletons/navigation.ts`
- `sanity/schemas/documents/page.ts`
- `sanity/schemas/objects/heroBlock.ts`
- `sanity/schemas/objects/imageMosaicBlock.ts`
- `sanity/schemas/objects/accordionBlock.ts`
- `sanity/schemas/objects/cardGridBlock.ts`
- `sanity/schemas/objects/youtubeEmbedBlock.ts`

### Modified site files
- `sanity/schemas/index.ts` — update barrel exports
- `sanity/structure.ts` — new sidebar organization
- `src/lib/sanity.ts` — new/updated GROQ queries and TypeScript types
- All page `.astro` files — read CMS data, use existing hardcoded content as fallbacks

### Unchanged
- `sanity/schemas/documents/sermon.ts`
- `sanity/schemas/documents/event.ts`
- `sanity/schemas/documents/ministry.ts`
- `sanity/schemas/documents/person.ts` — keep for potential future use, but pastors are now inline in aboutPage
