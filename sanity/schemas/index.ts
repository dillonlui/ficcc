// Document types
export { person } from './documents/person';
export { sermon } from './documents/sermon';
export { event } from './documents/event';
export { ministry } from './documents/ministry';

// Singletons
export { siteSettings } from './singletons/siteSettings';
export { homePage } from './singletons/homePage';
export { aboutPage } from './singletons/aboutPage';
export { visitPage } from './singletons/visitPage';
export { resourcesPage } from './singletons/resourcesPage';

import { person } from './documents/person';
import { sermon } from './documents/sermon';
import { event } from './documents/event';
import { ministry } from './documents/ministry';
import { siteSettings } from './singletons/siteSettings';
import { homePage } from './singletons/homePage';
import { aboutPage } from './singletons/aboutPage';
import { visitPage } from './singletons/visitPage';
import { resourcesPage } from './singletons/resourcesPage';

/** All schema types to register with Sanity */
export const schemaTypes = [
  // Documents
  person,
  sermon,
  event,
  ministry,
  // Singletons
  siteSettings,
  homePage,
  aboutPage,
  visitPage,
  resourcesPage,
];

/** Singleton type names — used by structure builder to filter from default list */
export const singletonTypes = new Set([
  'siteSettings',
  'homePage',
  'aboutPage',
  'visitPage',
  'resourcesPage',
]);

/** Singleton document IDs per language */
export const singletonDocIds = [
  { id: 'siteSettings-en', type: 'siteSettings', title: 'Settings (EN)' },
  { id: 'siteSettings-zh', type: 'siteSettings', title: '設定 (ZH)' },
  { id: 'homePage-en', type: 'homePage', title: 'Homepage (EN)' },
  { id: 'homePage-zh', type: 'homePage', title: '首頁 (ZH)' },
  { id: 'aboutPage-en', type: 'aboutPage', title: 'Who We Are (EN)' },
  { id: 'aboutPage-zh', type: 'aboutPage', title: '關於我們 (ZH)' },
  { id: 'visitPage-en', type: 'visitPage', title: 'Plan Your Visit (EN)' },
  { id: 'visitPage-zh', type: 'visitPage', title: '主日聚會 (ZH)' },
  { id: 'resourcesPage-en', type: 'resourcesPage', title: 'Resources (EN)' },
  { id: 'resourcesPage-zh', type: 'resourcesPage', title: '資源 (ZH)' },
];
