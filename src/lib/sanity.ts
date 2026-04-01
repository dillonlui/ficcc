import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID || 'placeholder';
const dataset = import.meta.env.SANITY_DATASET || 'production';

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-03-31',
  useCdn: true,
});

export { projectId, dataset };
