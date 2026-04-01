// Object / block types
export { heroBlock } from './objects/heroBlock';
export { imageMosaicBlock } from './objects/imageMosaicBlock';
export { accordionBlock } from './objects/accordionBlock';
export { cardGridBlock } from './objects/cardGridBlock';
export { youtubeEmbedBlock } from './objects/youtubeEmbedBlock';

// Document types
export { person } from './documents/person';
export { sermon } from './documents/sermon';
export { event } from './documents/event';
export { ministry } from './documents/ministry';
export { page } from './documents/page';

// Singletons
export { siteSettings } from './singletons/siteSettings';
export { navigation } from './singletons/navigation';

import { heroBlock } from './objects/heroBlock';
import { imageMosaicBlock } from './objects/imageMosaicBlock';
import { accordionBlock } from './objects/accordionBlock';
import { cardGridBlock } from './objects/cardGridBlock';
import { youtubeEmbedBlock } from './objects/youtubeEmbedBlock';
import { person } from './documents/person';
import { sermon } from './documents/sermon';
import { event } from './documents/event';
import { ministry } from './documents/ministry';
import { page } from './documents/page';
import { siteSettings } from './singletons/siteSettings';
import { navigation } from './singletons/navigation';

/** All schema types to register with Sanity */
export const schemaTypes = [
  // Objects
  heroBlock,
  imageMosaicBlock,
  accordionBlock,
  cardGridBlock,
  youtubeEmbedBlock,
  // Documents
  person,
  sermon,
  event,
  ministry,
  page,
  // Singletons
  siteSettings,
  navigation,
];

/** Singleton type names — used by structure builder to filter from default list */
export const singletonTypes = new Set(['siteSettings', 'navigation']);

/** Singleton document IDs per language */
export const singletonDocIds = [
  { id: 'siteSettings-en', type: 'siteSettings', title: 'Site Settings (EN)' },
  { id: 'siteSettings-zh', type: 'siteSettings', title: 'Site Settings (ZH)' },
  { id: 'navigation-en', type: 'navigation', title: 'Navigation (EN)' },
  { id: 'navigation-zh', type: 'navigation', title: 'Navigation (ZH)' },
];
