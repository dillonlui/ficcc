// Sanity Studio configuration
// Full setup happens in M001/S04 when schema types are defined
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

export default defineConfig({
  name: 'ficcc',
  title: 'FICCC — First Ithaca Chinese Christian Church',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'placeholder',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool()],
  schema: {
    types: [],
  },
});
