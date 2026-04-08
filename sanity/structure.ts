import type { StructureResolver } from 'sanity/structure';
import { singletonTypes } from './schemas';

/**
 * Custom desk structure for FICCC Sanity Studio.
 * Pages grouped by function with EN/ZH pairs side by side.
 * Collections (sermons, events, ministries) shown as filterable lists.
 */

/** Helper: create a singleton document editor list item */
function singletonItem(S: any, id: string, title: string, type: string) {
  return S.listItem()
    .title(title)
    .id(id)
    .child(
      S.document()
        .schemaType(type)
        .documentId(id)
        .title(title),
    );
}

/** Helper: create a page group with EN/ZH pair */
function pageGroup(S: any, title: string, pairs: { id: string; title: string; type: string }[]) {
  return S.listItem()
    .title(title)
    .child(
      S.list()
        .title(title)
        .items(
          pairs.map((p) => singletonItem(S, p.id, p.title, p.type)),
        ),
    );
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Splash (language-neutral, single doc)
      singletonItem(S, 'splashPage', 'Splash Page', 'splashPage'),

      S.divider(),

      // Page singletons grouped by page with EN/ZH pairs
      pageGroup(S, 'Homepage', [
        { id: 'homePage-en', title: 'Homepage (EN)', type: 'homePage' },
        { id: 'homePage-zh', title: '首頁 (ZH)', type: 'homePage' },
      ]),

      pageGroup(S, 'Who We Are', [
        { id: 'aboutPage-en', title: 'Who We Are (EN)', type: 'aboutPage' },
        { id: 'aboutPage-zh', title: '關於我們 (ZH)', type: 'aboutPage' },
      ]),

      pageGroup(S, 'Beliefs & Vision', [
        { id: 'beliefsPage-en', title: 'Beliefs & Vision (EN)', type: 'beliefsPage' },
        { id: 'beliefsPage-zh', title: '信仰與願景 (ZH)', type: 'beliefsPage' },
      ]),

      pageGroup(S, 'Visit / Sundays', [
        { id: 'visitPage-en', title: 'Plan Your Visit (EN)', type: 'visitPage' },
        { id: 'visitPage-zh', title: '主日聚會 (ZH)', type: 'visitPage' },
      ]),

      pageGroup(S, 'Give', [
        { id: 'givePage-en', title: 'Give (EN)', type: 'givePage' },
        { id: 'givePage-zh', title: '奉獻 (ZH)', type: 'givePage' },
      ]),

      pageGroup(S, 'Contact', [
        { id: 'contactPage-en', title: 'Contact (EN)', type: 'contactPage' },
        { id: 'contactPage-zh', title: '聯絡我們 (ZH)', type: 'contactPage' },
      ]),

      pageGroup(S, 'Resources', [
        { id: 'resourcesPage-en', title: 'Resources (EN)', type: 'resourcesPage' },
        { id: 'resourcesPage-zh', title: '資源 (ZH)', type: 'resourcesPage' },
      ]),

      S.divider(),

      // Site Settings
      pageGroup(S, 'Site Settings', [
        { id: 'siteSettings-en', title: 'Settings (EN)', type: 'siteSettings' },
        { id: 'siteSettings-zh', title: '設定 (ZH)', type: 'siteSettings' },
      ]),

      S.divider(),

      // Document collections (filterable lists)
      S.documentTypeListItem('sermon').title('Sermons'),
      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('ministry').title('Ministries'),
      S.documentTypeListItem('person').title('People'),
    ]);
