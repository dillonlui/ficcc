# Sanity Schema Redesign — Plan 1: Schemas, Structure & Queries

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Sanity CMS schemas, structure builder, and GROQ queries so all site content is editable by church staff. This plan covers the CMS layer only — page template integration is Plan 2.

**Architecture:** Create/update singleton schemas for every page, reorganize the Studio sidebar by page with EN/ZH pairs, update GROQ queries and TypeScript types, and remove unused schemas. Existing fallback patterns on page templates continue to work since we're only changing what CMS data is *available*, not how pages consume it yet.

**Tech Stack:** Sanity v5, TypeScript, GROQ

**Spec:** `docs/superpowers/specs/2026-04-08-sanity-schema-redesign.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `sanity/schemas/singletons/splashPage.ts` | Create | Splash page singleton (language-neutral) |
| `sanity/schemas/singletons/beliefsPage.ts` | Create | Beliefs & Vision page singleton |
| `sanity/schemas/singletons/givePage.ts` | Create | Give page singleton |
| `sanity/schemas/singletons/contactPage.ts` | Create | Contact page singleton |
| `sanity/schemas/singletons/siteSettings.ts` | Modify | Add `city`, `serviceTimes` |
| `sanity/schemas/singletons/homePage.ts` | Modify | Replace unused fields with `sections`, `banner*` |
| `sanity/schemas/singletons/aboutPage.ts` | Modify | Add `pastors`, `timelineEras`, `snapshots`, remove `churchStats`, `staffOrder`, `beliefs`, `visionHeading`, `visionBody` |
| `sanity/schemas/singletons/visitPage.ts` | Modify | Add `busRoute*`, `rideRequest*` fields |
| `sanity/schemas/singletons/resourcesPage.ts` | No change | Already complete |
| `sanity/schemas/singletons/navigation.ts` | Delete | Nav is code-driven |
| `sanity/schemas/documents/page.ts` | Delete | Unused generic page builder |
| `sanity/schemas/objects/heroBlock.ts` | Delete | Part of unused page builder |
| `sanity/schemas/objects/imageMosaicBlock.ts` | Delete | Part of unused page builder |
| `sanity/schemas/objects/accordionBlock.ts` | Delete | Part of unused page builder |
| `sanity/schemas/objects/cardGridBlock.ts` | Delete | Part of unused page builder |
| `sanity/schemas/objects/youtubeEmbedBlock.ts` | Delete | Part of unused page builder |
| `sanity/schemas/index.ts` | Modify | Update barrel exports, schemaTypes, singletonTypes, singletonDocIds |
| `sanity/structure.ts` | Modify | New sidebar with page-grouped EN/ZH pairs |
| `src/lib/sanity.ts` | Modify | New/updated types and GROQ query helpers |

---

## Task 1: Delete unused schemas

**Files:**
- Delete: `sanity/schemas/singletons/navigation.ts`
- Delete: `sanity/schemas/documents/page.ts`
- Delete: `sanity/schemas/objects/heroBlock.ts`
- Delete: `sanity/schemas/objects/imageMosaicBlock.ts`
- Delete: `sanity/schemas/objects/accordionBlock.ts`
- Delete: `sanity/schemas/objects/cardGridBlock.ts`
- Delete: `sanity/schemas/objects/youtubeEmbedBlock.ts`
- Modify: `sanity/schemas/index.ts`

- [ ] **Step 1: Delete the unused schema files**

```bash
rm sanity/schemas/singletons/navigation.ts
rm sanity/schemas/documents/page.ts
rm sanity/schemas/objects/heroBlock.ts
rm sanity/schemas/objects/imageMosaicBlock.ts
rm sanity/schemas/objects/accordionBlock.ts
rm sanity/schemas/objects/cardGridBlock.ts
rm sanity/schemas/objects/youtubeEmbedBlock.ts
rmdir sanity/schemas/objects
```

- [ ] **Step 2: Update `sanity/schemas/index.ts`**

Remove all imports/exports for deleted schemas. The file should now only contain:

```ts
// Document types
export { person } from './documents/person';
export { sermon } from './documents/sermon';
export { event } from './documents/event';
export { ministry } from './documents/ministry';

// Singletons
export { siteSettings } from './singletons/siteSettings';
export { homePage } from './singletons/homePage';
export { aboutPage } from './singletons/aboutPage';
export { visitPage } from './singletons/visitPage';
export { resourcesPage } from './singletons/resourcesPage';

import { person } from './documents/person';
import { sermon } from './documents/sermon';
import { event } from './documents/event';
import { ministry } from './documents/ministry';
import { siteSettings } from './singletons/siteSettings';
import { homePage } from './singletons/homePage';
import { aboutPage } from './singletons/aboutPage';
import { visitPage } from './singletons/visitPage';
import { resourcesPage } from './singletons/resourcesPage';

/** All schema types to register with Sanity */
export const schemaTypes = [
  // Documents
  person,
  sermon,
  event,
  ministry,
  // Singletons
  siteSettings,
  homePage,
  aboutPage,
  visitPage,
  resourcesPage,
];

/** Singleton type names — used by structure builder to filter from default list */
export const singletonTypes = new Set([
  'siteSettings',
  'homePage',
  'aboutPage',
  'visitPage',
  'resourcesPage',
]);

/** Singleton document IDs per language */
export const singletonDocIds = [
  { id: 'siteSettings-en', type: 'siteSettings', title: 'Settings (EN)' },
  { id: 'siteSettings-zh', type: 'siteSettings', title: '設定 (ZH)' },
  { id: 'homePage-en', type: 'homePage', title: 'Homepage (EN)' },
  { id: 'homePage-zh', type: 'homePage', title: '首頁 (ZH)' },
  { id: 'aboutPage-en', type: 'aboutPage', title: 'Who We Are (EN)' },
  { id: 'aboutPage-zh', type: 'aboutPage', title: '關於我們 (ZH)' },
  { id: 'visitPage-en', type: 'visitPage', title: 'Plan Your Visit (EN)' },
  { id: 'visitPage-zh', type: 'visitPage', title: '主日聚會 (ZH)' },
  { id: 'resourcesPage-en', type: 'resourcesPage', title: 'Resources (EN)' },
  { id: 'resourcesPage-zh', type: 'resourcesPage', title: '資源 (ZH)' },
];
```

Note: This is a temporary state — we'll add the new singletons in later tasks. The singletonTypes set and singletonDocIds will grow.

- [ ] **Step 3: Remove unused query and types from `src/lib/sanity.ts`**

Remove the `getNavigation` function, `Navigation` interface, `NavChild` interface, `NavItem` interface, `getPageBySlug` function, and `Page` interface. Also remove unused types that were only needed by deleted schemas: `Pillar`, `NextStep`, `MosaicImage`.

Keep all other queries and types — they're still used.

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds. The Sanity Studio may show warnings about missing singleton documents but the site builds fine since pages use fallbacks.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove unused Sanity schemas — navigation, page, object blocks"
```

---

## Task 2: Create new singleton schemas (splashPage, beliefsPage, givePage, contactPage)

**Files:**
- Create: `sanity/schemas/singletons/splashPage.ts`
- Create: `sanity/schemas/singletons/beliefsPage.ts`
- Create: `sanity/schemas/singletons/givePage.ts`
- Create: `sanity/schemas/singletons/contactPage.ts`
- Modify: `sanity/schemas/index.ts`

- [ ] **Step 1: Create `sanity/schemas/singletons/splashPage.ts`**

```ts
import { defineType, defineField } from 'sanity';

export const splashPage = defineType({
  name: 'splashPage',
  title: 'Splash Page',
  type: 'document',
  fields: [
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Full-screen background image (waterfall photo)',
    }),
    defineField({
      name: 'churchNameEn',
      title: 'Church Name (English)',
      type: 'string',
      initialValue: 'First Ithaca Chinese Christian Church',
    }),
    defineField({
      name: 'churchNameZh',
      title: 'Church Name (Chinese)',
      type: 'string',
      initialValue: '以撒迦中华基督教会',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Splash Page' }),
  },
});
```

- [ ] **Step 2: Create `sanity/schemas/singletons/beliefsPage.ts`**

```ts
import { defineType, defineField } from 'sanity';

export const beliefsPage = defineType({
  name: 'beliefsPage',
  title: 'Beliefs & Vision',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'beliefsHeading',
      title: 'Beliefs Section Heading',
      type: 'string',
      initialValue: 'What We Believe',
    }),
    defineField({
      name: 'beliefsIntro',
      title: 'Beliefs Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'beliefs',
      title: 'Beliefs',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'beliefItem',
          title: 'Belief',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] }),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
    defineField({
      name: 'scriptureQuote',
      title: 'Scripture Quote',
      type: 'text',
      rows: 3,
      description: 'Quote text for the scripture banner between sections',
    }),
    defineField({
      name: 'scriptureCitation',
      title: 'Scripture Citation',
      type: 'string',
      description: 'e.g. "2 Timothy 3:16-17"',
    }),
    defineField({
      name: 'scriptureImage',
      title: 'Scripture Banner Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'visionHeading',
      title: 'Vision Section Heading',
      type: 'string',
      initialValue: 'Our Vision',
    }),
    defineField({
      name: 'visionIntro',
      title: 'Vision Intro',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'visionItems',
      title: 'Vision Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'visionItem',
          title: 'Vision Item',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] }),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
    defineField({
      name: 'calloutHeading',
      title: 'Callout Heading',
      type: 'string',
      initialValue: 'See our faith in action',
    }),
    defineField({
      name: 'calloutBody',
      title: 'Callout Body',
      type: 'string',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: ['en', 'zh'] },
      initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: 'language' },
    prepare: ({ language }) => ({
      title: 'Beliefs & Vision',
      subtitle: language?.toUpperCase(),
    }),
  },
});
```

- [ ] **Step 3: Create `sanity/schemas/singletons/givePage.ts`**

```ts
import { defineType, defineField } from 'sanity';

export const givePage = defineType({
  name: 'givePage',
  title: 'Give',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'whyWeGiveHeading',
      title: 'Why We Give Heading',
      type: 'string',
      initialValue: 'Why We Give',
    }),
    defineField({
      name: 'whyWeGiveBody',
      title: 'Why We Give Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'scriptureQuote',
      title: 'Scripture Quote',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'scriptureCitation',
      title: 'Scripture Citation',
      type: 'string',
    }),
    defineField({
      name: 'givingMethods',
      title: 'Giving Methods',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'givingMethod',
          title: 'Giving Method',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: { list: ['globe', 'envelope', 'people'] },
            }),
            defineField({ name: 'link', title: 'Link URL', type: 'url', validation: (rule) => rule.uri({ allowRelative: false, scheme: ['http', 'https'] }) }),
            defineField({ name: 'linkText', title: 'Link Button Text', type: 'string' }),
            defineField({ name: 'note', title: 'Note', type: 'string', description: 'e.g. "Sundays at 11:15 AM"' }),
            defineField({ name: 'address', title: 'Mailing Address', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'title', subtitle: 'icon' } },
        },
      ],
    }),
    defineField({
      name: 'questionsHeading',
      title: 'Questions Heading',
      type: 'string',
      initialValue: 'Questions?',
    }),
    defineField({
      name: 'questionsBody',
      title: 'Questions Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: ['en', 'zh'] },
      initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: 'language' },
    prepare: ({ language }) => ({
      title: 'Give',
      subtitle: language?.toUpperCase(),
    }),
  },
});
```

- [ ] **Step 4: Create `sanity/schemas/singletons/contactPage.ts`**

```ts
import { defineType, defineField } from 'sanity';

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'formEnabled',
      title: 'Contact Form Enabled',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle the contact form on/off',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: ['en', 'zh'] },
      initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: 'language' },
    prepare: ({ language }) => ({
      title: 'Contact',
      subtitle: language?.toUpperCase(),
    }),
  },
});
```

Contact info (address, phone, email, service times) is pulled from `siteSettings`, not duplicated here.

- [ ] **Step 5: Update `sanity/schemas/index.ts`**

Add the 4 new singletons to imports, exports, schemaTypes, singletonTypes, and singletonDocIds:

Add to imports/exports:
```ts
export { splashPage } from './singletons/splashPage';
export { beliefsPage } from './singletons/beliefsPage';
export { givePage } from './singletons/givePage';
export { contactPage } from './singletons/contactPage';
```

Add to `schemaTypes` array:
```ts
splashPage,
beliefsPage,
givePage,
contactPage,
```

Add to `singletonTypes` set:
```ts
'splashPage',
'beliefsPage',
'givePage',
'contactPage',
```

Add to `singletonDocIds` array:
```ts
{ id: 'splashPage', type: 'splashPage', title: 'Splash Page' },
{ id: 'beliefsPage-en', type: 'beliefsPage', title: 'Beliefs & Vision (EN)' },
{ id: 'beliefsPage-zh', type: 'beliefsPage', title: '信仰與願景 (ZH)' },
{ id: 'givePage-en', type: 'givePage', title: 'Give (EN)' },
{ id: 'givePage-zh', type: 'givePage', title: '奉獻 (ZH)' },
{ id: 'contactPage-en', type: 'contactPage', title: 'Contact (EN)' },
{ id: 'contactPage-zh', type: 'contactPage', title: '聯絡我們 (ZH)' },
```

- [ ] **Step 6: Build and verify**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Sanity schemas for splash, beliefs, give, and contact pages"
```

---

## Task 3: Update existing singleton schemas (siteSettings, homePage, aboutPage, visitPage)

**Files:**
- Modify: `sanity/schemas/singletons/siteSettings.ts`
- Modify: `sanity/schemas/singletons/homePage.ts`
- Modify: `sanity/schemas/singletons/aboutPage.ts`
- Modify: `sanity/schemas/singletons/visitPage.ts`

- [ ] **Step 1: Update `siteSettings.ts`**

Add `city` and `serviceTimes` fields. The `serviceTimes` field is the centralized source of truth for all service time displays.

Add after the existing `email` field:

```ts
defineField({
  name: 'city',
  title: 'City, State ZIP',
  type: 'string',
  description: 'e.g. "Ithaca, NY 14850"',
}),
defineField({
  name: 'serviceTimes',
  title: 'Service Times',
  type: 'array',
  description: 'Centralized service times — pulled by footer, homepage, contact page, and visit page',
  of: [
    {
      type: 'object',
      name: 'serviceTime',
      title: 'Service Time',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
        defineField({ name: 'time', title: 'Time', type: 'string', validation: (rule) => rule.required() }),
      ],
      preview: { select: { title: 'label', subtitle: 'time' } },
    },
  ],
}),
```

- [ ] **Step 2: Update `homePage.ts`**

Replace the unused `serviceTimes`, `mosaicImages`, `pillars`, `nextSteps` fields with `sections` and `banner*` fields.

The full fields array should be:

```ts
fields: [
  // Hero
  defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
  defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string', validation: (rule) => rule.required() }),
  defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'string' }),
  defineField({ name: 'heroCtaText', title: 'Hero CTA Text', type: 'string' }),
  defineField({ name: 'heroCtaHref', title: 'Hero CTA Link', type: 'string' }),

  // Content Sections (Go Deeper, Sunday Mornings, Find Community, Watch Sermons)
  defineField({
    name: 'sections',
    title: 'Content Sections',
    type: 'array',
    of: [
      {
        type: 'object',
        name: 'homeSection',
        title: 'Section',
        fields: [
          defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] }),
          defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
          defineField({ name: 'ctaText', title: 'CTA Text', type: 'string' }),
          defineField({ name: 'ctaHref', title: 'CTA Link', type: 'string' }),
          defineField({
            name: 'layout',
            title: 'Layout',
            type: 'string',
            options: { list: ['default', 'reversed'] },
            initialValue: 'default',
          }),
          defineField({ name: 'tinted', title: 'Tinted Background', type: 'boolean', initialValue: false }),
        ],
        preview: { select: { title: 'heading', subtitle: 'layout' } },
      },
    ],
  }),

  // Bridging Cultures Banner
  defineField({ name: 'bannerHeading', title: 'Banner Heading', type: 'string' }),
  defineField({ name: 'bannerBody', title: 'Banner Body', type: 'array', of: [{ type: 'block' }] }),
  defineField({ name: 'bannerImage', title: 'Banner Image', type: 'image', options: { hotspot: true } }),
  defineField({ name: 'bannerCtaText', title: 'Banner CTA Text', type: 'string' }),
  defineField({ name: 'bannerCtaHref', title: 'Banner CTA Link', type: 'string' }),

  // Language
  defineField({
    name: 'language',
    title: 'Language',
    type: 'string',
    options: { list: ['en', 'zh'] },
    initialValue: 'en',
    validation: (rule) => rule.required(),
  }),
],
```

- [ ] **Step 3: Update `aboutPage.ts`**

Replace `churchStats`, `staffOrder`, `beliefs`, `visionHeading`, `visionBody` with `snapshots`, `pastors`, `timelineHeading`, `timelineEras`, `beliefsCallout*`.

The full fields array should be:

```ts
fields: [
  // Hero / Who We Are
  defineField({ name: 'whoWeAreHeading', title: 'Heading', type: 'string', initialValue: 'Who We Are' }),
  defineField({ name: 'whoWeAreBody', title: 'Body', type: 'array', of: [{ type: 'block' }] }),
  defineField({ name: 'whoWeAreImage', title: 'Image', type: 'image', options: { hotspot: true } }),

  // Snapshots
  defineField({
    name: 'snapshots',
    title: 'Snapshots',
    description: 'Stats like "40+ years in Ithaca"',
    type: 'array',
    of: [
      {
        type: 'object',
        name: 'snapshot',
        title: 'Snapshot',
        fields: [
          defineField({ name: 'accent', title: 'Accent Text', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'body', title: 'Body', type: 'string' }),
        ],
        preview: { select: { title: 'accent', subtitle: 'body' } },
      },
    ],
  }),

  // Pastors
  defineField({
    name: 'pastors',
    title: 'Pastors',
    type: 'array',
    of: [
      {
        type: 'object',
        name: 'pastor',
        title: 'Pastor',
        fields: [
          defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'role', title: 'Role', type: 'string' }),
          defineField({ name: 'bio', title: 'Bio', type: 'array', of: [{ type: 'block' }] }),
          defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
        ],
        preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
      },
    ],
  }),

  // Timeline
  defineField({ name: 'timelineHeading', title: 'Timeline Heading', type: 'string', initialValue: 'Our Story' }),
  defineField({
    name: 'timelineEras',
    title: 'Timeline Eras',
    type: 'array',
    of: [
      {
        type: 'object',
        name: 'timelineEra',
        title: 'Era',
        fields: [
          defineField({ name: 'title', title: 'Era Title', type: 'string', validation: (rule) => rule.required() }),
          defineField({
            name: 'entries',
            title: 'Entries',
            type: 'array',
            of: [
              {
                type: 'object',
                name: 'timelineEntry',
                title: 'Entry',
                fields: [
                  defineField({ name: 'year', title: 'Year', type: 'string', validation: (rule) => rule.required() }),
                  defineField({ name: 'description', title: 'Description', type: 'string', validation: (rule) => rule.required() }),
                ],
                preview: { select: { title: 'year', subtitle: 'description' } },
              },
            ],
          }),
        ],
        preview: { select: { title: 'title' } },
      },
    ],
  }),

  // Beliefs Callout
  defineField({ name: 'beliefsCalloutHeading', title: 'Beliefs Callout Heading', type: 'string', initialValue: 'What do we believe?' }),
  defineField({ name: 'beliefsCalloutBody', title: 'Beliefs Callout Body', type: 'string' }),

  // Language
  defineField({
    name: 'language',
    title: 'Language',
    type: 'string',
    options: { list: ['en', 'zh'] },
    initialValue: 'en',
    validation: (rule) => rule.required(),
  }),
],
```

- [ ] **Step 4: Update `visitPage.ts`**

Add `busRoute*` and `rideRequest*` fields after the existing `rideRequestEnabled` field:

```ts
defineField({
  name: 'busRouteHeading',
  title: 'Bus Route Heading',
  type: 'string',
  description: 'Heading for the bus route section (primarily used on Chinese version)',
}),
defineField({
  name: 'busRouteIntro',
  title: 'Bus Route Intro',
  type: 'text',
  rows: 2,
}),
defineField({
  name: 'busRoute',
  title: 'Bus Route Stops',
  type: 'array',
  of: [
    {
      type: 'object',
      name: 'busStop',
      title: 'Bus Stop',
      fields: [
        defineField({ name: 'stop', title: 'Stop Name', type: 'string', validation: (rule) => rule.required() }),
        defineField({ name: 'time', title: 'Time', type: 'string', validation: (rule) => rule.required() }),
      ],
      preview: { select: { title: 'stop', subtitle: 'time' } },
    },
  ],
}),
defineField({
  name: 'rideRequestHeading',
  title: 'Ride Request Heading',
  type: 'string',
  initialValue: 'Need a Ride?',
}),
defineField({
  name: 'rideRequestIntro',
  title: 'Ride Request Intro',
  type: 'text',
  rows: 2,
}),
```

- [ ] **Step 5: Build and verify**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: update siteSettings, homePage, aboutPage, visitPage schemas for full CMS control"
```

---

## Task 4: Rebuild structure builder (Studio sidebar)

**Files:**
- Modify: `sanity/structure.ts`

- [ ] **Step 1: Rewrite `sanity/structure.ts`**

Replace the entire file with the new page-grouped sidebar:

```ts
import type { StructureResolver } from 'sanity/structure';
import { singletonTypes, singletonDocIds } from './schemas';

/**
 * Custom desk structure for FICCC Sanity Studio.
 * Pages grouped by function with EN/ZH pairs side by side.
 * Collections (sermons, events, ministries) shown as filterable lists.
 */

/** Helper: create a singleton document editor list item */
function singletonItem(S: any, id: string, title: string, type: string) {
  return S.listItem()
    .title(title)
    .id(id)
    .child(
      S.document()
        .schemaType(type)
        .documentId(id)
        .title(title),
    );
}

/** Helper: create a page group with EN/ZH pair */
function pageGroup(S: any, title: string, icon: string, pairs: { id: string; title: string; type: string }[]) {
  return S.listItem()
    .title(title)
    .icon(() => icon)
    .child(
      S.list()
        .title(title)
        .items(
          pairs.map((p) => singletonItem(S, p.id, p.title, p.type)),
        ),
    );
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Splash (language-neutral, single doc)
      singletonItem(S, 'splashPage', '🏠 Splash Page', 'splashPage'),

      S.divider(),

      // Page singletons grouped by page with EN/ZH pairs
      pageGroup(S, '🏠 Homepage', '🏠', [
        { id: 'homePage-en', title: 'Homepage (EN)', type: 'homePage' },
        { id: 'homePage-zh', title: '首頁 (ZH)', type: 'homePage' },
      ]),

      pageGroup(S, '📖 Who We Are', '📖', [
        { id: 'aboutPage-en', title: 'Who We Are (EN)', type: 'aboutPage' },
        { id: 'aboutPage-zh', title: '關於我們 (ZH)', type: 'aboutPage' },
      ]),

      pageGroup(S, '✝️ Beliefs & Vision', '✝️', [
        { id: 'beliefsPage-en', title: 'Beliefs & Vision (EN)', type: 'beliefsPage' },
        { id: 'beliefsPage-zh', title: '信仰與願景 (ZH)', type: 'beliefsPage' },
      ]),

      pageGroup(S, '🙏 Visit / Sundays', '🙏', [
        { id: 'visitPage-en', title: 'Plan Your Visit (EN)', type: 'visitPage' },
        { id: 'visitPage-zh', title: '主日聚會 (ZH)', type: 'visitPage' },
      ]),

      pageGroup(S, '💰 Give', '💰', [
        { id: 'givePage-en', title: 'Give (EN)', type: 'givePage' },
        { id: 'givePage-zh', title: '奉獻 (ZH)', type: 'givePage' },
      ]),

      pageGroup(S, '📬 Contact', '📬', [
        { id: 'contactPage-en', title: 'Contact (EN)', type: 'contactPage' },
        { id: 'contactPage-zh', title: '聯絡我們 (ZH)', type: 'contactPage' },
      ]),

      pageGroup(S, '📚 Resources', '📚', [
        { id: 'resourcesPage-en', title: 'Resources (EN)', type: 'resourcesPage' },
        { id: 'resourcesPage-zh', title: '資源 (ZH)', type: 'resourcesPage' },
      ]),

      S.divider(),

      // Site Settings
      pageGroup(S, '⚙️ Site Settings', '⚙️', [
        { id: 'siteSettings-en', title: 'Settings (EN)', type: 'siteSettings' },
        { id: 'siteSettings-zh', title: '設定 (ZH)', type: 'siteSettings' },
      ]),

      S.divider(),

      // Document collections (filterable lists)
      S.documentTypeListItem('sermon').title('📄 Sermons'),
      S.documentTypeListItem('event').title('📅 Events'),
      S.documentTypeListItem('ministry').title('🤝 Ministries'),
      S.documentTypeListItem('person').title('👤 People'),
    ]);
```

- [ ] **Step 2: Build and verify**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add sanity/structure.ts
git commit -m "feat: reorganize Sanity Studio sidebar — page groups with EN/ZH pairs"
```

---

## Task 5: Update GROQ queries and TypeScript types

**Files:**
- Modify: `src/lib/sanity.ts`

- [ ] **Step 1: Add new TypeScript interfaces**

Add these new interfaces after the existing ones in `src/lib/sanity.ts`:

```ts
export interface SplashPage {
  _id: string;
  _type: 'splashPage';
  backgroundImage?: SanityImage;
  churchNameEn?: string;
  churchNameZh?: string;
}

export interface HomeSection {
  _key: string;
  heading: string;
  body?: PortableTextBlock[];
  image?: SanityImage;
  ctaText?: string;
  ctaHref?: string;
  layout?: 'default' | 'reversed';
  tinted?: boolean;
}

export interface Pastor {
  _key: string;
  name: string;
  role?: string;
  bio?: PortableTextBlock[];
  photo?: SanityImage;
}

export interface Snapshot {
  _key: string;
  accent: string;
  body?: string;
}

export interface TimelineEntry {
  _key: string;
  year: string;
  description: string;
}

export interface TimelineEra {
  _key: string;
  title: string;
  entries?: TimelineEntry[];
}

export interface BeliefsPage {
  _id: string;
  _type: 'beliefsPage';
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  beliefsHeading?: string;
  beliefsIntro?: string;
  beliefs?: BeliefItem[];
  scriptureQuote?: string;
  scriptureCitation?: string;
  scriptureImage?: SanityImage;
  visionHeading?: string;
  visionIntro?: PortableTextBlock[];
  visionItems?: BeliefItem[];
  calloutHeading?: string;
  calloutBody?: string;
  language: 'en' | 'zh';
}

export interface GivingMethod {
  _key: string;
  title: string;
  description?: string;
  icon?: 'globe' | 'envelope' | 'people';
  link?: string;
  linkText?: string;
  note?: string;
  address?: string;
}

export interface GivePage {
  _id: string;
  _type: 'givePage';
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  whyWeGiveHeading?: string;
  whyWeGiveBody?: PortableTextBlock[];
  scriptureQuote?: string;
  scriptureCitation?: string;
  givingMethods?: GivingMethod[];
  questionsHeading?: string;
  questionsBody?: string;
  language: 'en' | 'zh';
}

export interface ContactPage {
  _id: string;
  _type: 'contactPage';
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  formEnabled?: boolean;
  language: 'en' | 'zh';
}

export interface BusStop {
  _key: string;
  stop: string;
  time: string;
}
```

- [ ] **Step 2: Update existing interfaces**

Update `SiteSettings` to include new fields:
```ts
export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  churchName: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  serviceTimes?: ServiceTime[];
  socialLinks?: SocialLink[];
  language: 'en' | 'zh';
  announcementBarEnabled?: boolean;
  announcementBarText?: string;
  announcementBarLink?: string;
}
```

Update `HomePage` to replace unused fields:
```ts
export interface HomePage {
  _id: string;
  _type: 'homePage';
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaHref?: string;
  sections?: HomeSection[];
  bannerHeading?: string;
  bannerBody?: PortableTextBlock[];
  bannerImage?: SanityImage;
  bannerCtaText?: string;
  bannerCtaHref?: string;
  language: 'en' | 'zh';
}
```

Update `AboutPage` to replace unused fields:
```ts
export interface AboutPage {
  _id: string;
  _type: 'aboutPage';
  whoWeAreHeading?: string;
  whoWeAreBody?: PortableTextBlock[];
  whoWeAreImage?: SanityImage;
  snapshots?: Snapshot[];
  pastors?: Pastor[];
  timelineHeading?: string;
  timelineEras?: TimelineEra[];
  beliefsCalloutHeading?: string;
  beliefsCalloutBody?: string;
  language: 'en' | 'zh';
}
```

Update `VisitPage` to include new fields:
```ts
export interface VisitPage {
  _id: string;
  _type: 'visitPage';
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  whatToExpect?: PortableTextBlock[];
  schedule?: ScheduleItem[];
  transportation?: PortableTextBlock[];
  faqItems?: FaqItem[];
  rideRequestEnabled?: boolean;
  busRouteHeading?: string;
  busRouteIntro?: string;
  busRoute?: BusStop[];
  rideRequestHeading?: string;
  rideRequestIntro?: string;
  language: 'en' | 'zh';
}
```

- [ ] **Step 3: Add new GROQ query helpers**

```ts
/**
 * Fetch the splash page document (language-neutral singleton).
 */
export async function getSplashPage(): Promise<SplashPage | null> {
  return client.fetch<SplashPage | null>(
    `*[_type == "splashPage"][0]`,
  );
}

/**
 * Fetch the beliefs page singleton for a language.
 */
export async function getBeliefsPage(
  language: Language = 'en',
): Promise<BeliefsPage | null> {
  return client.fetch<BeliefsPage | null>(
    `*[_type == "beliefsPage" && language == $language][0]`,
    { language },
  );
}

/**
 * Fetch the give page singleton for a language.
 */
export async function getGivePage(
  language: Language = 'en',
): Promise<GivePage | null> {
  return client.fetch<GivePage | null>(
    `*[_type == "givePage" && language == $language][0]`,
    { language },
  );
}

/**
 * Fetch the contact page singleton for a language.
 */
export async function getContactPage(
  language: Language = 'en',
): Promise<ContactPage | null> {
  return client.fetch<ContactPage | null>(
    `*[_type == "contactPage" && language == $language][0]`,
    { language },
  );
}
```

- [ ] **Step 4: Remove unused types**

Remove these interfaces that are no longer needed:
- `Page` (was for deleted `page` document type)
- `Navigation`, `NavItem`, `NavChild` (was for deleted `navigation` singleton)
- `Pillar`, `NextStep`, `MosaicImage` (was for unused homePage fields)

Remove these functions:
- `getPageBySlug` (was for deleted `page` type)
- `getNavigation` (was for deleted `navigation` type)

- [ ] **Step 5: Build and run tests**

```bash
npm run build 2>&1 | tail -5
npm test
```

Expected: Build succeeds, all tests pass. Page templates still use their fallback content since they haven't been updated to use the new queries yet (that's Plan 2).

- [ ] **Step 6: Commit**

```bash
git add src/lib/sanity.ts
git commit -m "feat: update GROQ queries and types for new schema — splash, beliefs, give, contact"
```

---

## Task 6: Final verification

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 2: Run unit tests**

```bash
npm test
```

Expected: All pass.

- [ ] **Step 3: Verify schema file inventory**

```bash
ls sanity/schemas/singletons/
# Expected: aboutPage.ts beliefsPage.ts contactPage.ts givePage.ts homePage.ts resourcesPage.ts siteSettings.ts splashPage.ts visitPage.ts

ls sanity/schemas/documents/
# Expected: event.ts ministry.ts person.ts sermon.ts

ls sanity/schemas/objects/ 2>/dev/null
# Expected: directory not found (deleted)
```

- [ ] **Step 4: Verify singletonDocIds count**

```bash
grep -c "id:" sanity/schemas/index.ts
```

Expected: 17 entries (1 splash + 8 page pairs × 2 languages + 2 siteSettings)

- [ ] **Step 5: Commit any fixes**

Only if issues were found during verification.
