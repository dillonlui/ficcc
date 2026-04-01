import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { structure } from './sanity/structure';
import { schemaTypes } from './sanity/schemas';

// Use PUBLIC_ prefixed env vars so they're available in client-side bundles.
// In Astro, import.meta.env.PUBLIC_* are inlined at build time.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'placeholder';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'ficcc',
  title: 'FICCC Website',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: import.meta.env.PUBLIC_SANITY_PREVIEW_URL || 'http://localhost:4321',
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
