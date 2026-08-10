/**
 * Split the initially shared logo into contrast-appropriate splash and 404
 * marks. Safe to rerun after the replacement.
 *
 * Usage:
 *   DRY RUN: SANITY_PROJECT_ID=... npx tsx sanity/migrations/replace-splash-logo.ts
 *   LIVE:    SANITY_PROJECT_ID=... SANITY_API_WRITE_TOKEN=... npx tsx sanity/migrations/replace-splash-logo.ts
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
const splashFilename = 'icon-splash-light.svg';
const notFoundFilename = 'icon-light.svg';

if (!projectId) {
  console.error('Missing SANITY_PROJECT_ID. Set it in .env or pass it as an environment variable.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2026-03-31', useCdn: false });
const current = await client.fetch<{ splashFilename?: string; notFoundFilename?: string } | null>(
  `*[_id == "siteBranding"][0]{
    "splashFilename": splashLogo.asset->originalFilename,
    "notFoundFilename": notFoundLogo.asset->originalFilename
  }`,
);
const needsSplashLogo = current?.splashFilename !== splashFilename;
const needsNotFoundLogo = current?.notFoundFilename !== notFoundFilename;

if (!needsSplashLogo && !needsNotFoundLogo) {
  console.log('Site Branding already uses the correct separate splash and 404 marks; no changes made.');
  process.exit(0);
}

if (!token) {
  console.log(`DRY RUN: would update ${[
    needsSplashLogo && 'splash logo',
    needsNotFoundLogo && '404 logo',
  ].filter(Boolean).join(' and ')}.`);
  process.exit(0);
}

const fields: Record<string, unknown> = {};
for (const [field, filename] of [
  needsSplashLogo && ['splashLogo', splashFilename],
  needsNotFoundLogo && ['notFoundLogo', notFoundFilename],
].filter(Boolean) as Array<[string, string]>) {
  const content = await readFile(resolve(process.cwd(), 'public/logo', filename));
  const asset = await client.assets.upload('file', content, { filename, contentType: 'image/svg+xml' });
  fields[field] = { _type: 'file', asset: { _type: 'reference', _ref: asset._id } };
}
await client.createIfNotExists({ _id: 'siteBranding', _type: 'siteBranding' });
await client.patch('siteBranding').set(fields).commit();

console.log('Updated Site Branding with separate splash and 404 logo marks.');
