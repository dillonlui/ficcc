/**
 * Shared navigation configuration for Header and Footer.
 * Returns language-appropriate labels and hrefs.
 */

export type Lang = 'en' | 'zh';

export interface NavLink {
  label: string;
  href: string;
}

const navLinksEN: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Sermons', href: '/sermons' },
  { label: 'Contact', href: '/contact' },
];

const navLinksZH: NavLink[] = [
  { label: '首頁', href: '/zh' },
  { label: '關於我們', href: '/zh/about' },
  { label: '團契', href: '/zh/ministries' },
  { label: '講道', href: '/zh/sermons' },
  { label: '聯絡我們', href: '/zh/contact' },
];

export function getNavLinks(lang: Lang = 'en'): NavLink[] {
  return lang === 'zh' ? navLinksZH : navLinksEN;
}

const footerNavEN: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Sermons', href: '/sermons' },
  { label: 'Contact', href: '/contact' },
];

const footerNavZH: NavLink[] = [
  { label: '首頁', href: '/zh' },
  { label: '關於我們', href: '/zh/about' },
  { label: '團契', href: '/zh/ministries' },
  { label: '講道', href: '/zh/sermons' },
  { label: '聯絡我們', href: '/zh/contact' },
];

export function getFooterNav(lang: Lang = 'en'): NavLink[] {
  return lang === 'zh' ? footerNavZH : footerNavEN;
}

/** Service times content by language. */
export interface ServiceTime {
  label: string;
}

export function getServiceTimes(lang: Lang = 'en'): { heading: string; items: ServiceTime[] } {
  if (lang === 'zh') {
    return {
      heading: '聚會時間',
      items: [
        { label: '主日崇拜：上午 10:00' },
        { label: '主日學：上午 11:30' },
        { label: '週五團契：晚上 7:30' },
      ],
    };
  }
  return {
    heading: 'Service Times',
    items: [
      { label: 'Sunday Worship: 10:00 AM' },
      { label: 'Sunday School: 11:30 AM' },
      { label: 'Friday Fellowship: 7:30 PM' },
    ],
  };
}

/** Church name by language for copyright, logos, etc. */
export function getChurchName(lang: Lang = 'en'): string {
  return lang === 'zh'
    ? '伊的家華人基督教會'
    : 'First Ithaca Chinese Christian Church';
}
