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
  { label: 'Home', href: '/en/' },
  { label: 'About', href: '/en/about' },
  { label: 'Ministries', href: '/en/ministries' },
  { label: 'Sermons', href: '/en/sermons' },
  { label: 'Contact', href: '/en/contact' },
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
  { label: 'Home', href: '/en/' },
  { label: 'About', href: '/en/about' },
  { label: 'Ministries', href: '/en/ministries' },
  { label: 'Sermons', href: '/en/sermons' },
  { label: 'Contact', href: '/en/contact' },
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
        { label: '英語崇拜：上午 9:45' },
        { label: '門徒小組：上午 11:00' },
        { label: '華語崇拜：上午 11:15' },
      ],
    };
  }
  return {
    heading: 'Service Times',
    items: [
      { label: 'English Worship: 9:45 AM' },
      { label: 'Discipleship Groups: 11:00 AM' },
      { label: 'Chinese Worship: 11:15 AM' },
    ],
  };
}

/**
 * Asymmetric route map: pages where EN and ZH paths differ beyond the /zh prefix.
 * Key = source path, Value = counterpart path.
 */
const ASYMMETRIC_ROUTES: Record<string, string> = {
  '/en/visit': '/zh/sundays',
  '/zh/sundays': '/en/visit',
};

const NO_COUNTERPART = ['/en/resources', '/styleguide', '/admin', '/404'];

export function getAlternateUrl(pathname: string, currentLang: Lang): string {
  const normalized = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  if (ASYMMETRIC_ROUTES[normalized]) {
    return ASYMMETRIC_ROUTES[normalized];
  }

  if (NO_COUNTERPART.some((p) => normalized === p || normalized.startsWith(p + '/'))) {
    return currentLang === 'en' ? '/zh' : '/en/';
  }

  if (currentLang === 'en') {
    if (normalized === '/en') {
      return '/zh';
    }
    return normalized.replace(/^\/en/, '/zh');
  }

  if (normalized === '/zh') {
    return '/en/';
  }
  return normalized.replace(/^\/zh/, '/en');
}

/** Church name by language for copyright, logos, etc. */
export function getChurchName(lang: Lang = 'en'): string {
  return lang === 'zh'
    ? '伊的家華人基督教會'
    : 'First Ithaca Chinese Christian Church';
}
