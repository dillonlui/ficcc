import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID || 'placeholder';
const dataset = import.meta.env.SANITY_DATASET || 'production';

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-03-31',
  useCdn: true,
});

export { projectId, dataset };

// ---------------------------------------------------------------------------
// Shared types — lightweight interfaces matching schema shapes.
// Full Sanity-generated types can replace these later.
// ---------------------------------------------------------------------------

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface PortableTextBlock {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

export interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
}

export interface Page {
  _id: string;
  _type: 'page';
  title: string;
  slug: SanitySlug;
  body: PortableTextBlock[];
  language: 'en' | 'zh';
}

export interface Sermon {
  _id: string;
  _type: 'sermon';
  title: string;
  speaker?: string;
  date?: string;
  series?: string;
  scripture?: string;
  videoId?: string;
  language: 'en' | 'zh';
}

export interface Event {
  _id: string;
  _type: 'event';
  title: string;
  date?: string;
  endDate?: string;
  time?: string;
  location?: string;
  description?: PortableTextBlock[];
  recurring?: boolean;
  language: 'en' | 'zh';
}

export interface Ministry {
  _id: string;
  _type: 'ministry';
  name: string;
  description?: PortableTextBlock[];
  leader?: { _ref: string };
  meetingTime?: string;
  language: 'en' | 'zh';
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  churchName: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: SocialLink[];
  language: 'en' | 'zh';
}

export interface NavChild {
  label: string;
  href?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

export interface Navigation {
  _id: string;
  _type: 'navigation';
  navItems: NavItem[];
  language: 'en' | 'zh';
}

// ---------------------------------------------------------------------------
// GROQ query helpers
// ---------------------------------------------------------------------------

type Language = 'en' | 'zh';

/**
 * Fetch a page by its slug and language.
 */
export async function getPageBySlug(
  slug: string,
  language: Language = 'en',
): Promise<Page | null> {
  return client.fetch<Page | null>(
    `*[_type == "page" && slug.current == $slug && language == $language][0]`,
    { slug, language },
  );
}

/**
 * Fetch all sermons for a language, newest first.
 */
export async function getSermons(language: Language = 'en'): Promise<Sermon[]> {
  return client.fetch<Sermon[]>(
    `*[_type == "sermon" && language == $language] | order(date desc)`,
    { language },
  );
}

/**
 * Fetch upcoming events for a language, soonest first.
 */
export async function getEvents(language: Language = 'en'): Promise<Event[]> {
  return client.fetch<Event[]>(
    `*[_type == "event" && language == $language] | order(date asc)`,
    { language },
  );
}

/**
 * Fetch all ministries for a language.
 */
export async function getMinistries(
  language: Language = 'en',
): Promise<Ministry[]> {
  return client.fetch<Ministry[]>(
    `*[_type == "ministry" && language == $language] | order(name asc)`,
    { language },
  );
}

/**
 * Fetch the singleton site-settings document for a language.
 * Singleton IDs follow the pattern `{type}-{lang}` per D-decision.
 */
export async function getSiteSettings(
  language: Language = 'en',
): Promise<SiteSettings | null> {
  return client.fetch<SiteSettings | null>(
    `*[_type == "siteSettings" && language == $language][0]`,
    { language },
  );
}

/**
 * Fetch the singleton navigation document for a language.
 */
export async function getNavigation(
  language: Language = 'en',
): Promise<Navigation | null> {
  return client.fetch<Navigation | null>(
    `*[_type == "navigation" && language == $language][0]`,
    { language },
  );
}
