import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { defineDocuments, defineLocations, presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { FicccStudioIcon } from './sanity/components/FicccStudioIcon';
import { structure } from './sanity/structure';
import { schemaTypes } from './sanity/schemas';

const env = {
  ...(((globalThis as any).process?.env as Record<string, string | undefined>) || {}),
  ...(((import.meta as any).env as Record<string, string | undefined>) || {}),
};

// Studio runs in the browser, so prefer PUBLIC_ values. CLI commands can fall
// back to server-side values from process.env.
const projectId = env.PUBLIC_SANITY_PROJECT_ID || env.SANITY_PROJECT_ID || 'placeholder';
const dataset = env.PUBLIC_SANITY_DATASET || env.SANITY_DATASET || 'production';
const previewOrigin =
  env.PUBLIC_SANITY_PREVIEW_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321');
const previewUrl = {
  initial: previewOrigin,
  previewMode: {
    enable: '/?sanity-preview=1',
    shareAccess: false,
  },
};

const mainDocuments = defineDocuments([
  { route: '/', filter: `_id == "splashPage"` },
  { route: '/en', filter: `_id == "homePage-en"` },
  { route: '/en/about', filter: `_id == "aboutPage-en"` },
  { route: '/en/about/beliefs', filter: `_id == "beliefsPage-en"` },
  { route: '/en/visit', filter: `_id == "visitPage-en"` },
  { route: '/en/give', filter: `_id == "givePage-en"` },
  { route: '/en/contact', filter: `_id == "contactPage-en"` },
  { route: '/en/resources', filter: `_id == "resourcesPage-en"` },
  { route: '/en/grow/english', filter: `_id == "growPage-en-english"` },
  { route: '/en/grow/chinese', filter: `_id == "growPage-en-chinese"` },
  { route: '/en/grow/youth', filter: `_id == "growPage-en-youth"` },
  { route: '/en/grow/children', filter: `_id == "growPage-en-children"` },
  { route: '/zh', filter: `_id == "homePage-zh"` },
  { route: '/zh/about', filter: `_id == "aboutPage-zh"` },
  { route: '/zh/about/beliefs', filter: `_id == "beliefsPage-zh"` },
  { route: '/zh/sundays', filter: `_id == "visitPage-zh"` },
  { route: '/zh/give', filter: `_id == "givePage-zh"` },
  { route: '/zh/contact', filter: `_id == "contactPage-zh"` },
  { route: '/zh/resources', filter: `_id == "resourcesPage-zh"` },
  { route: '/zh/grow/english', filter: `_id == "growPage-zh-english"` },
  { route: '/zh/grow/chinese', filter: `_id == "growPage-zh-chinese"` },
  { route: '/zh/grow/youth', filter: `_id == "growPage-zh-youth"` },
  { route: '/zh/grow/children', filter: `_id == "growPage-zh-children"` },
]);

const languagePrefix = (language?: string) => (language === 'zh' ? '/zh' : '/en');

const documentLocations = {
  splashPage: defineLocations({
    resolve: () => ({
      locations: [{ title: 'Splash Page', href: '/' }],
    }),
  }),
  homePage: defineLocations({
    select: { language: 'language' },
    resolve: (doc) => ({
      locations: [{ title: 'Homepage', href: languagePrefix(doc?.language) }],
    }),
  }),
  aboutPage: defineLocations({
    select: { language: 'language' },
    resolve: (doc) => ({
      locations: [{ title: 'Who We Are', href: `${languagePrefix(doc?.language)}/about` }],
    }),
  }),
  beliefsPage: defineLocations({
    select: { language: 'language' },
    resolve: (doc) => ({
      locations: [{ title: 'Beliefs & Vision', href: `${languagePrefix(doc?.language)}/about/beliefs` }],
    }),
  }),
  visitPage: defineLocations({
    select: { language: 'language' },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.language === 'zh' ? '主日聚會' : 'Visit',
          href: doc?.language === 'zh' ? '/zh/sundays' : '/en/visit',
        },
      ],
    }),
  }),
  givePage: defineLocations({
    select: { language: 'language' },
    resolve: (doc) => ({
      locations: [{ title: 'Give', href: `${languagePrefix(doc?.language)}/give` }],
    }),
  }),
  contactPage: defineLocations({
    select: { language: 'language' },
    resolve: (doc) => ({
      locations: [{ title: 'Contact', href: `${languagePrefix(doc?.language)}/contact` }],
    }),
  }),
  resourcesPage: defineLocations({
    select: { language: 'language' },
    resolve: (doc) => ({
      locations: [{ title: 'Resources', href: `${languagePrefix(doc?.language)}/resources` }],
    }),
  }),
  growPage: defineLocations({
    select: { language: 'language', audience: 'audience' },
    resolve: (doc) => ({
      locations: doc?.audience
        ? [{ title: 'Grow', href: `${languagePrefix(doc?.language)}/grow/${doc.audience}` }]
        : [],
    }),
  }),
  siteSettings: defineLocations({
    message: 'Site settings are used across the website.',
    tone: 'caution',
  }),
};

const languageTemplateTypes = [
  'siteSettings',
  'homePage',
  'aboutPage',
  'visitPage',
  'resourcesPage',
  'beliefsPage',
  'givePage',
  'contactPage',
  'sermon',
  'event',
  'ministry',
  'person',
];

const languageTemplates = languageTemplateTypes.flatMap((schemaType) => [
  {
    id: `${schemaType}-en`,
    title: `${schemaType} (English)`,
    schemaType,
    value: { language: 'en' },
  },
  {
    id: `${schemaType}-zh`,
    title: `${schemaType} (Chinese)`,
    schemaType,
    value: { language: 'zh' },
  },
]);

const growPageTemplates = [
  { language: 'en', audience: 'english' },
  { language: 'en', audience: 'chinese' },
  { language: 'en', audience: 'youth' },
  { language: 'en', audience: 'children' },
  { language: 'zh', audience: 'english' },
  { language: 'zh', audience: 'chinese' },
  { language: 'zh', audience: 'youth' },
  { language: 'zh', audience: 'children' },
].map(({ language, audience }) => ({
  id: `growPage-${language}-${audience}`,
  title: `growPage (${language}, ${audience})`,
  schemaType: 'growPage',
  value: { language, audience },
}));

export default defineConfig({
  name: 'ficcc',
  title: 'FICCC Website',
  icon: FicccStudioIcon,
  basePath: '/admin',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl,
      allowOrigins: [
        'http://localhost:*',
        'https://ficcc.vercel.app',
        'https://ficcc.org',
      ],
      resolve: {
        mainDocuments,
        locations: documentLocations,
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => [...prev, ...languageTemplates, ...growPageTemplates],
  },
});
