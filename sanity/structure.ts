import type { StructureResolver } from 'sanity/structure';

/**
 * Custom desk structure for FICCC Sanity Studio.
 * Editors choose a language first, then work through that ministry's pages.
 * Document IDs stay stable so seeding and public-site queries remain unchanged.
 */

type Lang = 'en' | 'zh';

type SingletonPage = {
  id: string;
  title: string;
  type: string;
  language?: Lang;
};

type GrowPage = SingletonPage & {
  audience: 'english' | 'chinese' | 'youth' | 'children';
};

const englishPages: SingletonPage[] = [
  { id: 'homePage-en', title: 'Homepage', type: 'homePage', language: 'en' },
  { id: 'aboutPage-en', title: 'Who We Are', type: 'aboutPage', language: 'en' },
  { id: 'beliefsPage-en', title: 'Beliefs & Vision', type: 'beliefsPage', language: 'en' },
  { id: 'visitPage-en', title: 'Visit', type: 'visitPage', language: 'en' },
  { id: 'givePage-en', title: 'Give', type: 'givePage', language: 'en' },
  { id: 'contactPage-en', title: 'Contact', type: 'contactPage', language: 'en' },
  { id: 'resourcesPage-en', title: 'Resources', type: 'resourcesPage', language: 'en' },
];

const chinesePages: SingletonPage[] = [
  { id: 'homePage-zh', title: '首頁', type: 'homePage', language: 'zh' },
  { id: 'aboutPage-zh', title: '關於我們', type: 'aboutPage', language: 'zh' },
  { id: 'beliefsPage-zh', title: '信仰與願景', type: 'beliefsPage', language: 'zh' },
  { id: 'visitPage-zh', title: '主日聚會', type: 'visitPage', language: 'zh' },
  { id: 'givePage-zh', title: '奉獻', type: 'givePage', language: 'zh' },
  { id: 'contactPage-zh', title: '聯絡我們', type: 'contactPage', language: 'zh' },
  { id: 'resourcesPage-zh', title: '資源', type: 'resourcesPage', language: 'zh' },
];

const englishGrowPages: GrowPage[] = [
  { id: 'growPage-en-english', title: 'English Ministry', type: 'growPage', language: 'en', audience: 'english' },
  { id: 'growPage-en-chinese', title: 'Chinese Ministry', type: 'growPage', language: 'en', audience: 'chinese' },
  { id: 'growPage-en-youth', title: 'Youth', type: 'growPage', language: 'en', audience: 'youth' },
  { id: 'growPage-en-children', title: 'Children', type: 'growPage', language: 'en', audience: 'children' },
];

const chineseGrowPages: GrowPage[] = [
  { id: 'growPage-zh-english', title: '英語事工', type: 'growPage', language: 'zh', audience: 'english' },
  { id: 'growPage-zh-chinese', title: '華語事工', type: 'growPage', language: 'zh', audience: 'chinese' },
  { id: 'growPage-zh-youth', title: '青少年', type: 'growPage', language: 'zh', audience: 'youth' },
  { id: 'growPage-zh-children', title: '兒童', type: 'growPage', language: 'zh', audience: 'children' },
];

function singletonItem(S: any, page: SingletonPage) {
  let document = S.document()
    .schemaType(page.type)
    .documentId(page.id)
    .title(page.title);

  if (page.language) {
    document = document.initialValueTemplate(`${page.type}-${page.language}`);
  }

  return S.listItem()
    .title(page.title)
    .id(page.id)
    .child(document);
}

function growItem(S: any, page: GrowPage) {
  const document = S.document()
    .schemaType(page.type)
    .documentId(page.id)
    .title(page.title)
    .initialValueTemplate(`growPage-${page.language}-${page.audience}`);

  return S.listItem()
    .title(page.title)
    .id(page.id)
    .child(document);
}

function growSection(S: any, id: string, title: string, pages: GrowPage[]) {
  return S.listItem()
    .title(title)
    .id(id)
    .child(
      S.list()
        .id(`${id}-list`)
        .title(title)
        .items(pages.map((page) => growItem(S, page))),
    );
}

function collectionList(S: any, type: string, title: string, language: Lang) {
  return S.listItem()
    .title(title)
    .id(`${language}-${type}`)
    .schemaType(type)
    .child(
      S.documentList()
        .id(`${language}-${type}-list`)
        .title(title)
        .schemaType(type)
        .apiVersion('2026-03-31')
        .filter('_type == $type && language == $language')
        .params({ type, language })
        .initialValueTemplates([
          S.initialValueTemplateItem(`${type}-${language}`),
        ]),
    );
}

function languageSection(
  S: any,
  id: string,
  title: string,
  pages: SingletonPage[],
  growPages: GrowPage[],
  language: Lang,
) {
  return S.listItem()
    .title(title)
    .id(id)
    .child(
      S.list()
        .id(`${id}-list`)
        .title(title)
        .items([
          ...pages.map((page) => singletonItem(S, page)),
          growSection(S, `${language}-grow`, language === 'zh' ? '成長 / 事工' : 'Grow', growPages),
          S.divider(),
          collectionList(S, 'sermon', language === 'zh' ? '講道' : 'Sermons', language),
          collectionList(S, 'event', language === 'zh' ? '活動' : 'Events', language),
          collectionList(S, 'ministry', language === 'zh' ? '事工' : 'Ministries', language),
          collectionList(S, 'person', language === 'zh' ? '人員' : 'People', language),
        ]),
    );
}

export const structure: StructureResolver = (S) =>
  S.list()
    .id('content')
    .title('Content')
    .items([
      singletonItem(S, { id: 'splashPage', title: 'Splash Page', type: 'splashPage' }),

      S.divider(),

      languageSection(S, 'english', 'English', englishPages, englishGrowPages, 'en'),
      languageSection(S, 'chinese', 'Chinese', chinesePages, chineseGrowPages, 'zh'),

      S.divider(),

      S.listItem()
        .title('Site Settings')
        .id('site-settings')
        .child(
          S.list()
            .id('site-settings-list')
            .title('Site Settings')
            .items([
              singletonItem(S, {
                id: 'siteSettings-en',
                title: 'English Settings',
                type: 'siteSettings',
                language: 'en',
              }),
              singletonItem(S, {
                id: 'siteSettings-zh',
                title: 'Chinese Settings',
                type: 'siteSettings',
                language: 'zh',
              }),
            ]),
        ),
    ]);
