/**
 * Adds the English sermon archive channel URL to existing Site Settings without
 * replacing a value an editor may already have set.
 *
 * Usage:
 *   DRY RUN: npm run sanity:seed:youtube
 *   LIVE:    SANITY_API_WRITE_TOKEN=sk-... npm run sanity:seed:youtube
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

const projectId = process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;
const channelUrl = 'https://www.youtube.com/@FICCCenglish';

if (!projectId) {
  console.error('Missing SANITY_PROJECT_ID. Set it in .env or pass it as an environment variable.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2026-03-31', useCdn: false });

async function main() {
  if (!token) {
    console.log(`DRY RUN: would set youtubeChannelUrl on siteSettings-en if missing: ${channelUrl}`);
    return;
  }

  await client.patch('siteSettings-en').setIfMissing({ youtubeChannelUrl: channelUrl }).commit();
  console.log('Seeded YouTube Channel URL on English Site Settings when it was missing.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
