import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
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

export default defineConfig({
  name: 'ficcc',
  title: 'FICCC Website',
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
  },
});
