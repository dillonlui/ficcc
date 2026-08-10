/**
 * Upload the current public SVG logos and use them to seed the Site Branding
 * singleton. Existing editorial choices are never overwritten.
 *
 * Usage:
 *   DRY RUN: SANITY_PROJECT_ID=... npx tsx sanity/migrations/seed-site-branding.ts
 *   LIVE:    SANITY_PROJECT_ID=... SANITY_API_WRITE_TOKEN=... npx tsx sanity/migrations/seed-site-branding.ts
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

const projectId = process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error('Missing SANITY_PROJECT_ID. Set it in .env or pass it as an environment variable.');
  process.exit(1);
}

const assets = [
  ['splashLogo', 'icon-light.svg'],
  ['headerLogoEn', 'logo-en-light.svg'],
  ['headerLogoZh', 'logo-zh-light.svg'],
  ['footerLogo', 'logo-bilingual-dark.svg'],
] as const;
const dryRun = !token;
const client = createClient({ projectId, dataset, token, apiVersion: '2026-03-31', useCdn: false });

const existing = await client.fetch<Record<string, unknown> | null>('*[_id == "siteBranding"][0]');
const missing = assets.filter(([field]) => !existing?.[field]);

if (!missing.length) {
  console.log('Site Branding is already populated; no changes made.');
  process.exit(0);
}

if (dryRun) {
  console.log(`DRY RUN: would create Site Branding and upload ${missing.map(([, filename]) => filename).join(', ')}.`);
  process.exit(0);
}

const fields: Record<string, unknown> = {};
for (const [field, filename] of missing) {
  const content = await readFile(resolve(process.cwd(), 'public/logo', filename));
  const asset = await client.assets.upload('file', content, { filename, contentType: 'image/svg+xml' });
  fields[field] = { _type: 'file', asset: { _type: 'reference', _ref: asset._id } };
}

await client.createIfNotExists({ _id: 'siteBranding', _type: 'siteBranding' });
await client.patch('siteBranding').setIfMissing(fields).commit();
console.log(`Seeded ${Object.keys(fields).length} current logo asset(s) in Site Branding.`);
