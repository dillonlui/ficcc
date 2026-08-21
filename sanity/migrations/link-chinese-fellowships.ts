/**
 * Create one detail document for each current Chinese fellowship card and attach
 * only missing references. Existing documents, fields, and staff-selected
 * references are never overwritten.
 *
 * Review: npm run sanity:link:fellowships
 * Apply:  SANITY_API_WRITE_TOKEN=sk-... npm run sanity:link:fellowships -- --apply
 */
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import {
  prepareFellowshipCards,
  buildFellowshipDetailDocument,
  chineseFellowshipTargets,
  type ChineseGrowGroup,
} from './lib/chinese-fellowship-details';

config({ path: '.env.local' });
config({ path: '.env' });

const projectId = process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;
const apply = process.argv.includes('--apply');

if (!projectId) throw new Error('Missing SANITY_PROJECT_ID.');
if (apply && !token) throw new Error('--apply requires SANITY_API_WRITE_TOKEN.');

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-03-31',
  useCdn: false,
  perspective: 'published',
});

type GrowDocument = {
  _id: string;
  _rev: string;
  groups?: ChineseGrowGroup[];
};

const page = await client.fetch<GrowDocument | null>(
  '*[_id == "growPage-zh-chinese"][0]{_id,_rev,groups}',
);
if (!page?.groups) throw new Error('Published growPage-zh-chinese with groups was not found.');

const groupsByKey = new Map(page.groups.map((group) => [group._key, group]));
const missingGroups = chineseFellowshipTargets.filter((target) => !groupsByKey.has(target.groupKey));
if (missingGroups.length) {
  throw new Error(`Expected group keys are missing: ${missingGroups.map((item) => item.groupKey).join(', ')}`);
}

const targetIds = chineseFellowshipTargets.map((target) => target.documentId);
const targetSlugs = chineseFellowshipTargets.map((target) => target.slug);
const existingDocuments = await client.fetch<Array<{ _id: string; _type: string; language?: string; slug?: string }>>(
  '*[_id in $ids || slug.current in $slugs]{_id,_type,language,"slug":slug.current}',
  { ids: targetIds, slugs: targetSlugs },
);
const targetsById = new Map(chineseFellowshipTargets.map((target) => [target.documentId, target]));
const targetsBySlug = new Map(chineseFellowshipTargets.map((target) => [target.slug, target]));
const conflicts = existingDocuments.filter((document) => {
  const idTarget = targetsById.get(document._id);
  if (idTarget) {
    return document._type !== 'ministry'
      || document.language !== 'zh'
      || document.slug !== idTarget.slug;
  }

  const slugTarget = document.slug ? targetsBySlug.get(document.slug) : undefined;
  return Boolean(slugTarget && slugTarget.documentId !== document._id);
});
if (conflicts.length) throw new Error(`Conflicting detail documents exist: ${JSON.stringify(conflicts)}`);

const { groups, changes } = prepareFellowshipCards(page.groups);
const documents = chineseFellowshipTargets
  .filter((target) => changes.some((change) => change.documentId === target.documentId))
  .map((target) => buildFellowshipDetailDocument(groupsByKey.get(target.groupKey)!, target));

console.log(`${apply ? 'APPLY' : 'DRY RUN'}: ${documents.length} detail documents and ${changes.length} missing references.`);
for (const change of changes) {
  console.log(`- ${change.groupName} -> ${change.documentId}${change.descriptionShortened ? ' (install interim card summary)' : ''}`);
}

if (!apply || !changes.length) process.exit(0);

let transaction = client.transaction();
for (const document of documents) transaction = transaction.createIfNotExists(document);
transaction = transaction.patch(page._id, (patch) => patch.ifRevisionId(page._rev).set({ groups }));
await transaction.commit();
console.log('Created missing detail documents and attached missing card references.');
