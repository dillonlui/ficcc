import { defineCliConfig } from 'sanity/cli';

const projectId = process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production';

export default defineCliConfig({
  api: {
    projectId: projectId || 'placeholder',
    dataset,
  },
});
