/**
 * One-time cleanup: remove legacy Sunday shuttle bus route fields from
 * Chinese Visit Page (visitPage-zh). Those fields are no longer in the schema.
 *
 * Usage:
 *   DRY RUN: npx tsx sanity/migrations/clear-zh-bus-route.ts
 *   LIVE:    SANITY_API_WRITE_TOKEN=sk-... npx tsx sanity/migrations/clear-zh-bus-route.ts
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

const projectId = process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;
const documentId = 'visitPage-zh';

if (!projectId) {
  console.error('Missing SANITY_PROJECT_ID. Set it in .env or pass it as an environment variable.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2026-03-31', useCdn: false });

async function main() {
  if (!token) {
    console.log(
      `DRY RUN: would unset busRoute, busRouteHeading, and busRouteIntro on ${documentId}`,
    );
    return;
  }

  await client
    .patch(documentId)
    .unset(['busRoute', 'busRouteHeading', 'busRouteIntro'])
    .commit();

  console.log(`Cleared legacy bus route fields on ${documentId}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
