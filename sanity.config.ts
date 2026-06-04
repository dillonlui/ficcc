import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
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
const previewUrl = env.PUBLIC_SANITY_PREVIEW_URL || 'http://localhost:4321';

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
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => [...prev, ...languageTemplates, ...growPageTemplates],
  },
});
