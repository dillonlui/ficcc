/**
 * Uploads the local fallback images to Sanity and attaches them only where a
 * CMS image field is empty. This makes the current media visible and editable
 * in Studio without replacing an editor's existing upload.
 *
 * Usage:
 *   DRY RUN: SANITY_PROJECT_ID=... npm run sanity:seed:media
 *   LIVE:    SANITY_PROJECT_ID=... SANITY_API_WRITE_TOKEN=sk-... npm run sanity:seed:media
 */

import { createReadStream, existsSync } from 'node:fs';
import { basename, resolve } from 'node:path';
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

const client = createClient({ projectId, dataset, token, apiVersion: '2026-03-31', useCdn: false });
const dryRun = !token;
const publicDir = resolve(process.cwd(), 'public');

type ImageTarget = { field: string; source: string };
type ArrayImageTarget = { array: string; key: string; field: string; source: string };
type DocumentTarget = { id: string; images?: ImageTarget[]; arrayImages?: ArrayImageTarget[] };

const homeSections = [
  'bbq-2025-group-wide.webp',
  'bbq-2025-outdoor-worship.webp',
  'epp-2025-diverse-community.webp',
  'epp-2025-worship-guitar.webp',
];

const targets: DocumentTarget[] = [
  { id: 'splashPage', images: [{ field: 'backgroundImage', source: '/images/hero/waterfall-landing-1600.jpg' }] },
  ...(['en', 'zh'] as const).map((lang) => ({
    id: `homePage-${lang}`,
    images: [
      { field: 'heroImage', source: '/images/hero/ficcc-hero-poster.jpg' },
      { field: 'bannerImage', source: '/images/church/bbq-2025-community-singing.webp' },
    ],
    arrayImages: homeSections.map((filename, index) => ({
      array: 'sections',
      key: lang === 'en' ? ['go-deeper', 'sunday-mornings', 'community', 'sermons'][index] : ['deeper', 'sundays', 'community', 'sermons'][index],
      field: 'image',
      source: `/images/church/${filename}`,
    })),
  })),
  ...(['en', 'zh'] as const).map((lang) => ({
    id: `aboutPage-${lang}`,
    images: [{ field: 'whoWeAreImage', source: '/images/hero/cornell-arts-quad.webp' }],
    arrayImages: [
      { array: 'pastors', key: 'zhida', field: 'photo', source: '/images/church/zhida-zhu.webp' },
    ],
  })),
  ...(['en', 'zh'] as const).map((lang) => ({
    id: `beliefsPage-${lang}`,
    images: [
      { field: 'heroImage', source: '/images/hero/bible.webp' },
      { field: 'scriptureImage', source: '/images/church/2023-retreat-praying.webp' },
    ],
  })),
  ...(['en', 'zh'] as const).map((lang) => ({ id: `visitPage-${lang}`, images: [{ field: 'heroImage', source: '/images/church/bbq-2025-group-wide.webp' }] })),
  ...(['en', 'zh'] as const).map((lang) => ({ id: `givePage-${lang}`, images: [{ field: 'heroImage', source: '/images/textures/adam-vradenburg-_gu7E90QChU-unsplash.jpg' }] })),
  ...(['en', 'zh'] as const).map((lang) => ({ id: `contactPage-${lang}`, images: [{ field: 'heroImage', source: '/images/church/bbq-2025-welcome-conversation.webp' }] })),
  { id: 'resourcesPage-en', images: [{ field: 'heroImage', source: '/images/hero/bible.webp' }] },
  { id: 'resourcesPage-zh', images: [{ field: 'heroImage', source: '/images/hero/bible.webp' }] },
];

const growImages: Record<string, string[]> = {
  english: ['/images/church/epp-2025-diverse-community.webp', '/images/church/bbq-2025-outdoor-worship.webp', '/images/church/epp-2025-discipleship-group.webp', '/images/church/midweek-bible-study.webp', '/images/church/bbq-2025-community-singing.webp'],
  chinese: ['/images/church/bbq-2025-community-singing.webp', '/images/church/epp-2025-discipleship-group.webp', '/images/church/bbq-2025-intergenerational-table.webp', '/images/church/bbq-2025-campus-fellowship.webp', '/images/church/bbq-2025-young-adults-group.webp', '/images/church/epp-2025-senior-table.webp'],
  youth: ['/images/church/bbq-2025-youth.webp', '/images/church/bbq-2025-youth.webp', '/images/church/epp-2025-discipleship-group.webp'],
  children: ['/images/church/img-1594.webp', '/images/church/img-1594.webp', '/images/church/ev-weekend-12.jpg'],
};

for (const lang of ['en', 'zh'] as const) {
  for (const audience of ['english', 'chinese', 'youth', 'children'] as const) {
    const sources = growImages[audience];
    targets.push({
      id: `growPage-${lang}-${audience}`,
      images: [{ field: 'heroImage', source: sources[0] }],
      arrayImages: sources.slice(1).map((source, index) => ({ array: 'groups', key: '', field: 'image', source })),
    });
  }
}

const uploaded = new Map<string, { _type: 'image'; asset: { _type: 'reference'; _ref: string } }>();

async function imageFor(source: string) {
  const path = resolve(publicDir, `.${source}`);
  if (!path.startsWith(`${publicDir}/`) || !existsSync(path)) {
    throw new Error(`Missing local image: ${source}`);
  }

  const cached = uploaded.get(source);
  if (cached) return cached;

  const asset = await client.assets.upload('image', createReadStream(path), { filename: basename(path) });
  const image = { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: asset._id } };
  uploaded.set(source, image);
  return image;
}

async function seedDocument(target: DocumentTarget) {
  const document = await client.getDocument<Record<string, unknown>>(target.id);
  if (!document) throw new Error(`Missing ${target.id}. Run npm run sanity:seed first.`);

  const rootUpdates: Record<string, unknown> = {};
  const arrays = new Map<string, Array<Record<string, unknown>>>();

  for (const image of target.images || []) {
    if (!document[image.field]) rootUpdates[image.field] = await imageFor(image.source);
  }

  for (const image of target.arrayImages || []) {
    const existing = document[image.array];
    if (!Array.isArray(existing)) continue;
    const items = arrays.get(image.array) || existing.map((item) => ({ ...item }));
    const item = image.key
      ? items.find((candidate) => candidate._key === image.key)
      : items[(target.arrayImages || []).filter((candidate) => candidate.array === image.array).indexOf(image)];
    if (item && !item[image.field]) {
      item[image.field] = await imageFor(image.source);
      arrays.set(image.array, items);
    }
  }

  if (!Object.keys(rootUpdates).length && !arrays.size) return false;

  const patch = client.patch(target.id).set(rootUpdates);
  for (const [field, value] of arrays) patch.set({ [field]: value });
  await patch.commit();
  return true;
}

async function main() {
  console.log(`${dryRun ? 'DRY RUN' : 'LIVE'}: ${targets.length} documents for project "${projectId}" dataset "${dataset}"`);
  if (dryRun) {
    for (const target of targets) console.log(target.id);
    return;
  }

  let changed = 0;
  for (const target of targets) if (await seedDocument(target)) changed += 1;
  console.log(`Updated ${changed} documents with missing local fallback images.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
