import type { Lang } from './navigation';
import { getGrowPageDocument, urlForImage } from './sanity';

export type GrowAudience = 'english' | 'chinese' | 'youth' | 'children';

export interface GrowGroup {
  name: string;
  meetingTime?: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export interface GrowPageContent {
  audience: GrowAudience;
  title: string;
  navLabel: string;
  pageTitle: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  intro: string;
  listingHeading: string;
  groups: GrowGroup[];
  sermonsCalloutHeading?: string;
  sermonsCalloutBody?: string;
  sermonsCtaText?: string;
  sermonsCtaHref?: string;
}

const enGrowPages: Record<GrowAudience, GrowPageContent> = {
  english: {
    audience: 'english',
    title: 'English Ministry | FICCC',
    navLabel: 'English',
    pageTitle: 'English Ministry',
    description: 'English ministry gatherings and groups at First Ithaca Chinese Christian Church.',
    heroTitle: 'English Ministry',
    heroSubtitle: 'Grow in God\'s Word, community, and everyday discipleship.',
    heroImage: '/images/church/epp-2025-diverse-community.webp',
    intro: 'The English ministry gathers people across students, families, working adults, and long-time Ithaca neighbors.',
    listingHeading: 'Meetings & Groups',
    groups: [
      {
        name: 'Sunday Gathering',
        image: '/images/church/bbq-2025-outdoor-worship.webp',
        meetingTime: 'Sundays 9:45 AM',
        description: 'Worship through singing, prayer, Scripture, preaching, and the Lord\'s Supper.',
      },
      {
        name: 'Discipleship Groups',
        image: '/images/church/epp-2025-discipleship-group.webp',
        meetingTime: 'Sundays 11:00 AM',
        description: 'Small groups for deeper Bible study, prayer, and mutual encouragement after worship.',
      },
      {
        name: 'Midweek Bible Study',
        image: '/images/church/midweek-bible-study.webp',
        meetingTime: 'Thursdays 7:00 PM',
        description: 'A weekly evening study open to everyone who wants to dig into Scripture together.',
      },
      {
        name: 'Monthly Prayer Meeting',
        image: '/images/church/bbq-2025-community-singing.webp',
        meetingTime: '1st Wednesday 7:30 PM',
        description: 'A monthly gathering to pray together for our church, community, and world.',
      },
    ],
  },
  chinese: {
    audience: 'chinese',
    title: 'Chinese Ministry | FICCC',
    navLabel: 'Chinese',
    pageTitle: 'Chinese Ministry',
    description: 'Chinese ministry fellowships and groups at First Ithaca Chinese Christian Church.',
    heroTitle: 'Chinese Ministry',
    heroSubtitle: 'A Mandarin-speaking church family for worship, fellowship, and discipleship.',
    heroImage: '/images/church/bbq-2025-community-singing.webp',
    intro: 'The Chinese ministry includes fellowship groups for students, families, young professionals, and older adults.',
    listingHeading: 'Fellowship Groups',
    groups: [
      {
        name: 'Gospel Group',
        image: '/images/church/epp-2025-discipleship-group.webp',
        meetingTime: 'Sundays 11:00 AM',
        description: 'A gospel-centered group for seekers, new believers, and anyone exploring Christian faith.',
      },
      {
        name: 'Family Fellowship',
        image: '/images/church/bbq-2025-intergenerational-table.webp',
        meetingTime: 'Saturdays 7:00 PM',
        description: 'A fellowship for families to grow together through Scripture, prayer, and shared life.',
      },
      {
        name: 'Campus Fellowship',
        image: '/images/church/bbq-2025-campus-fellowship.webp',
        meetingTime: 'Fridays 7:30 PM',
        description: 'A group for undergraduate and graduate students navigating faith and campus life.',
      },
      {
        name: 'Young Professionals',
        image: '/images/church/bbq-2025-young-adults-group.webp',
        meetingTime: 'Fridays 7:30 PM',
        description: 'A fellowship for young adults seeking Christ-centered community in work and life.',
      },
      {
        name: 'Senior Fellowship',
        image: '/images/church/epp-2025-senior-table.webp',
        meetingTime: 'Wednesdays 10:00 AM',
        description: 'A fellowship for older adults to study Scripture, share life, and pray together.',
      },
    ],
  },
  youth: {
    audience: 'youth',
    title: 'Youth Ministry | FICCC',
    navLabel: 'Youth',
    pageTitle: 'Youth Ministry',
    description: 'Youth ministry gatherings for middle and high school students at FICCC.',
    heroTitle: 'Youth Ministry',
    heroSubtitle: 'A place for middle and high school students to grow in faith and friendship.',
    heroImage: '/images/church/bbq-2025-youth.webp',
    intro: 'Youth ministry creates space for students to ask good questions, build friendships, and follow Jesus together.',
    listingHeading: 'Meetings & Groups',
    groups: [
      {
        name: 'Youth Group',
        image: '/images/church/bbq-2025-youth.webp',
        meetingTime: 'Fridays 7:30 PM',
        description: 'Fellowship, teaching, discussion, and fun for middle and high school students.',
      },
      {
        name: 'Youth Sunday Class',
        image: '/images/church/epp-2025-discipleship-group.webp',
        meetingTime: 'Sundays 11:15 AM',
        description: 'Age-appropriate Bible teaching and conversation during the Sunday School hour.',
      },
    ],
  },
  children: {
    audience: 'children',
    title: 'Children\'s Ministry | FICCC',
    navLabel: 'Children',
    pageTitle: 'Children\'s Ministry',
    description: 'Children\'s ministry and Sunday School at First Ithaca Chinese Christian Church.',
    heroTitle: 'Children\'s Ministry',
    heroSubtitle: 'Helping children know God through Scripture, care, and age-appropriate teaching.',
    heroImage: '/images/church/img-1594.webp',
    intro: 'Children\'s ministry supports families by providing safe, welcoming spaces for kids to learn about God.',
    listingHeading: 'Classes & Care',
    groups: [
      {
        name: 'Children\'s Sunday School',
        image: '/images/church/img-1594.webp',
        meetingTime: 'Sundays 11:15 AM',
        description: 'Age-appropriate Bible teaching and activities for kids during the Sunday School hour.',
      },
      {
        name: 'Sunday Care',
        image: '/images/church/ev-weekend-12.jpg',
        meetingTime: 'Sundays during worship and classes',
        description: 'Care options for children while parents participate in worship, groups, or classes.',
      },
    ],
  },
};

const zhGrowPages: Record<GrowAudience, GrowPageContent> = {
  english: {
    ...enGrowPages.english,
    title: '英語事工 | 伊的家華人基督教會',
    navLabel: '英語事工',
    pageTitle: '英語事工',
    description: '伊的家華人基督教會英語事工的聚會與小組。',
    heroTitle: '英語事工',
    heroSubtitle: '在神的話語、群體與日常門訓中一同成長。',
    intro: '英語事工連結學生、家庭、職場人士與長住伊薩卡的鄰舍。',
    listingHeading: '聚會與小組',
    groups: [
      {
        name: '英語崇拜',
        image: '/images/church/bbq-2025-outdoor-worship.webp',
        meetingTime: '週日 9:45 AM',
        description: '透過詩歌、禱告、讀經、講道與主餐一同敬拜。',
      },
      {
        name: '門徒小組',
        image: '/images/church/epp-2025-discipleship-group.webp',
        meetingTime: '週日 11:00 AM',
        description: '崇拜後的小組查經、禱告與彼此扶持。',
      },
      {
        name: '週間查經',
        image: '/images/church/midweek-bible-study.webp',
        meetingTime: '週四 7:00 PM',
        description: '開放給所有人的週間查經，一同更深認識聖經。',
      },
      {
        name: '月禱會',
        image: '/images/church/bbq-2025-community-singing.webp',
        meetingTime: '每月第一個週三 7:30 PM',
        description: '為教會、社區與世界一同禱告的聚會。',
      },
    ],
  },
  chinese: {
    ...enGrowPages.chinese,
    title: '華語事工 | 伊的家華人基督教會',
    navLabel: '華語事工',
    pageTitle: '華語事工',
    description: '伊的家華人基督教會華語事工的團契與小組。',
    heroTitle: '華語事工',
    heroSubtitle: '以華語敬拜、團契與門訓彼此建立。',
    intro: '華語事工包括適合學生、家庭、職青與長者的團契小組。',
    listingHeading: '團契小組',
    groups: [
      {
        name: '福音組',
        image: '/images/church/epp-2025-discipleship-group.webp',
        meetingTime: '週日 11:00 AM',
        description: '以福音為核心的小組，歡迎慕道友與初信者一同認識信仰。',
      },
      {
        name: '家庭組',
        image: '/images/church/bbq-2025-intergenerational-table.webp',
        meetingTime: '週六 7:00 PM',
        description: '以家庭為單位的團契，在信仰與生活中彼此扶持。',
      },
      {
        name: '校園組',
        image: '/images/church/bbq-2025-campus-fellowship.webp',
        meetingTime: '週五 7:30 PM',
        description: '大學生與研究生團契，在校園生活中一起成長。',
      },
      {
        name: '職青組',
        image: '/images/church/bbq-2025-young-adults-group.webp',
        meetingTime: '週五 7:30 PM',
        description: '為職場青年預備的團契，在工作與信仰中尋找方向。',
      },
      {
        name: '長青組',
        image: '/images/church/epp-2025-senior-table.webp',
        meetingTime: '週三 10:00 AM',
        description: '為年長弟兄姊妹預備的團契，一同查經、分享與代禱。',
      },
    ],
  },
  youth: {
    ...enGrowPages.youth,
    title: '青少年事工 | 伊的家華人基督教會',
    navLabel: '青少年',
    pageTitle: '青少年事工',
    description: '伊的家華人基督教會為國中與高中生預備的青少年事工。',
    heroTitle: '青少年事工',
    heroSubtitle: '幫助國中與高中生在信仰與友誼中成長。',
    intro: '青少年事工提供學生提問、建立友誼、並一同跟隨耶穌的空間。',
    listingHeading: '聚會與小組',
    groups: [
      {
        name: '青少年組',
        image: '/images/church/bbq-2025-youth.webp',
        meetingTime: '週五 7:30 PM',
        description: '為國中及高中生預備的團契、教導、討論與活動。',
      },
      {
        name: '青少年主日課程',
        image: '/images/church/epp-2025-discipleship-group.webp',
        meetingTime: '週日 11:15 AM',
        description: '在主日學時段提供適合青少年的聖經教導與討論。',
      },
    ],
  },
  children: {
    ...enGrowPages.children,
    title: '兒童事工 | 伊的家華人基督教會',
    navLabel: '兒童',
    pageTitle: '兒童事工',
    description: '伊的家華人基督教會的兒童主日學與兒童照顧。',
    heroTitle: '兒童事工',
    heroSubtitle: '透過聖經、關懷與適齡教導幫助孩子認識神。',
    intro: '兒童事工幫助家庭，為孩子提供安全、溫暖、適合年齡的學習空間。',
    listingHeading: '課程與照顧',
    groups: [
      {
        name: '兒童主日學',
        image: '/images/church/img-1594.webp',
        meetingTime: '週日 11:15 AM',
        description: '為孩子們預備的聖經教導與活動，幫助他們從小認識神。',
      },
      {
        name: '主日兒童照顧',
        image: '/images/church/ev-weekend-12.jpg',
        meetingTime: '主日崇拜與課程時段',
        description: '在家長參加崇拜、小組或課程時，提供兒童照顧選項。',
      },
    ],
  },
};

export const growAudiences: GrowAudience[] = ['english', 'chinese', 'youth', 'children'];

export function getGrowPage(lang: Lang, audience: GrowAudience): GrowPageContent {
  return lang === 'zh' ? zhGrowPages[audience] : enGrowPages[audience];
}

export async function getResolvedGrowPage(
  lang: Lang,
  audience: GrowAudience,
): Promise<{ content: GrowPageContent; isHidden: boolean }> {
  const fallback = getGrowPage(lang, audience);

  try {
    const page = await getGrowPageDocument(lang, audience);

    if (!page) {
      return { content: fallback, isHidden: false };
    }

    if (page.isVisible === false) {
      return { content: fallback, isHidden: true };
    }

    return {
      isHidden: false,
      content: {
        audience,
        title: page.title || fallback.title,
        navLabel: page.navLabel || fallback.navLabel,
        pageTitle: page.pageTitle || fallback.pageTitle,
        description: page.description || fallback.description,
        heroTitle: page.heroTitle || fallback.heroTitle,
        heroSubtitle: page.heroSubtitle || fallback.heroSubtitle,
        heroImage: page.heroImage ? urlForImage(page.heroImage, { width: 1600 }) : fallback.heroImage,
        intro: page.intro || fallback.intro,
        listingHeading: page.listingHeading || fallback.listingHeading,
        groups: page.groups?.length
          ? page.groups.map((group, index) => ({
              name: group.name,
              meetingTime: group.meetingTime,
              description: group.description,
              image: group.image
                ? urlForImage(group.image, { width: 900 })
                : fallback.groups[index]?.image,
              imageAlt: group.imageAlt || '',
            }))
          : fallback.groups,
        sermonsCalloutHeading: page.sermonsCalloutHeading,
        sermonsCalloutBody: page.sermonsCalloutBody,
        sermonsCtaText: page.sermonsCtaText,
        sermonsCtaHref: page.sermonsCtaHref,
      },
    };
  } catch {
    return { content: fallback, isHidden: false };
  }
}

export function getGrowNavItems(lang: Lang): { label: string; href: string }[] {
  return growAudiences.map((audience) => ({
    label: getGrowPage(lang, audience).navLabel,
    href: `/${lang}/grow/${audience}`,
  }));
}

export async function getResolvedGrowNavItems(lang: Lang): Promise<{ label: string; href: string }[]> {
  try {
    const pages = await Promise.all(
      growAudiences.map(async (audience) => ({
        audience,
        page: await getGrowPageDocument(lang, audience),
      })),
    );

    return pages
      .filter(({ page }) => page?.isVisible !== false)
      .map(({ audience, page }) => ({
        label: page?.navLabel || getGrowPage(lang, audience).navLabel,
        href: `/${lang}/grow/${audience}`,
      }));
  } catch {
    return getGrowNavItems(lang);
  }
}
