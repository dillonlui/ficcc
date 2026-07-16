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
  { label: 'Visit', href: '/en/visit' },
  { label: 'About', href: '/en/about' },
  { label: 'Grow', href: '/en/grow/english' },
  { label: 'Sermons', href: '/en/sermons' },
  { label: 'Give', href: '/en/give' },
  { label: 'Contact', href: '/en/contact' },
];

const navLinksZH: NavLink[] = [
  { label: '首頁', href: '/zh' },
  { label: '來訪', href: '/zh/sundays' },
  { label: '關於我們', href: '/zh/about' },
  { label: '成長', href: '/zh/grow/chinese' },
  { label: '講道', href: '/zh/sermons' },
  { label: '奉獻', href: '/zh/give' },
  { label: '聯絡我們', href: '/zh/contact' },
];

export function getNavLinks(lang: Lang = 'en'): NavLink[] {
  return lang === 'zh' ? navLinksZH : navLinksEN;
}

const footerNavEN: NavLink[] = [
  { label: 'Home', href: '/en/' },
  { label: 'Visit', href: '/en/visit' },
  { label: 'About', href: '/en/about' },
  { label: 'Grow', href: '/en/grow/english' },
  { label: 'Resources', href: '/en/resources' },
  { label: 'Sermons', href: '/en/sermons' },
  { label: 'Give', href: '/en/give' },
  { label: 'Contact', href: '/en/contact' },
  { label: 'Privacy', href: '/en/privacy' },
];

const footerNavZH: NavLink[] = [
  { label: '首頁', href: '/zh' },
  { label: '來訪', href: '/zh/sundays' },
  { label: '關於我們', href: '/zh/about' },
  { label: '成長', href: '/zh/grow/chinese' },
  { label: '講道', href: '/zh/sermons' },
  { label: '奉獻', href: '/zh/give' },
  { label: '聯絡我們', href: '/zh/contact' },
  { label: '隱私聲明', href: '/zh/privacy' },
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

const NO_COUNTERPART = [
  '/en/resources',
  '/en/events',
  '/zh/events',
  '/zh/fellowships',
  '/styleguide',
  '/admin',
  '/404',
];

function normalizePathname(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
}

/**
 * Whether a page has a genuine page-level counterpart in the other language.
 * Navigation can still fall back to the other-language homepage, but hreflang
 * must only be emitted for an equivalent page.
 */
export function hasLanguageCounterpart(pathname: string): boolean {
  const normalized = normalizePathname(pathname);

  return !NO_COUNTERPART.some((p) => normalized === p || normalized.startsWith(p + '/'));
}

export function getAlternateUrl(
  pathname: string,
  currentLang: Lang,
  explicitCounterpart?: string,
): string {
  if (explicitCounterpart) return normalizePathname(explicitCounterpart);

  const normalized = normalizePathname(pathname);

  if (ASYMMETRIC_ROUTES[normalized]) {
    return ASYMMETRIC_ROUTES[normalized];
  }

  if (!hasLanguageCounterpart(normalized)) {
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
