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

export interface ServiceTime {
  label: string;
  time: string;
}

export interface Pillar {
  title: string;
  description?: string;
}

export interface NextStep {
  title: string;
  body?: string;
  href?: string;
  image?: SanityImage;
}

export interface MosaicImage extends SanityImage {
  alt?: string;
}

export interface HomePage {
  _id: string;
  _type: 'homePage';
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaHref?: string;
  serviceTimes?: ServiceTime[];
  mosaicImages?: MosaicImage[];
  pillars?: Pillar[];
  nextSteps?: NextStep[];
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

/**
 * Fetch the singleton home-page document for a language.
 */
export async function getHomePage(
  language: Language = 'en',
): Promise<HomePage | null> {
  return client.fetch<HomePage | null>(
    `*[_type == "homePage" && language == $language][0]`,
    { language },
  );
}

// ---------------------------------------------------------------------------
// Image helpers
// ---------------------------------------------------------------------------

/**
 * Resolve a Sanity image asset reference to a CDN URL.
 *
 * Asset refs look like `image-<id>-<WxH>-<ext>`. We strip the `image-`
 * prefix and replace the last `-` (before the extension) with `.` to get
 * the filename portion used in the CDN path.
 *
 * Example ref: `image-abc123-800x600-jpg`
 * Result:      `https://cdn.sanity.io/images/{projectId}/{dataset}/abc123-800x600.jpg`
 */
export function urlForImage(
  image: SanityImage | undefined | null,
  options?: { width?: number; format?: string },
): string {
  if (!image?.asset?._ref) return '';

  const ref = image.asset._ref;
  // Strip leading "image-" and split on the last "-" to get id and extension
  const withoutPrefix = ref.replace(/^image-/, '');
  const lastDash = withoutPrefix.lastIndexOf('-');
  if (lastDash === -1) return '';

  const idAndDimensions = withoutPrefix.slice(0, lastDash);
  const ext = withoutPrefix.slice(lastDash + 1);
  const filename = `${idAndDimensions}.${ext}`;

  let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${filename}`;

  const params = new URLSearchParams();
  if (options?.width) params.set('w', String(options.width));
  if (options?.format) params.set('fm', options.format);
  const qs = params.toString();
  if (qs) url += `?${qs}`;

  return url;
}

// ---------------------------------------------------------------------------
// Visual Editing — draft-aware query helper for server-rendered preview
// ---------------------------------------------------------------------------

const isVisualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true';

/**
 * Draft-aware query helper for preview/visual-editing contexts.
 *
 * When `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` is `'true'`:
 *   - Uses `perspective: 'previewDrafts'` so editors see unpublished changes
 *   - Injects `SANITY_API_READ_TOKEN` (server-only) for authenticated draft access
 *   - Enables stega encoding and result source maps for click-to-edit overlays
 *
 * When disabled, falls back to published perspective with no token or stega.
 *
 * This is a *parallel* helper — existing getPageBySlug / getSermons / etc.
 * remain unchanged for static build-time fetching.
 */
export async function loadQuery<T = unknown>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<{ data: T }> {
  if (isVisualEditingEnabled) {
    const token = import.meta.env.SANITY_API_READ_TOKEN;
    if (!token) {
      throw new Error(
        '[sanity/loadQuery] PUBLIC_SANITY_VISUAL_EDITING_ENABLED is true but ' +
          'SANITY_API_READ_TOKEN is not set. Add the token to your environment ' +
          '(server-only, no PUBLIC_ prefix).',
      );
    }

    if (import.meta.env.DEV) {
      console.debug('[sanity/loadQuery] perspective: previewDrafts (visual editing enabled)');
    }

    const data = await client.fetch<T>(query, params, {
      perspective: 'previewDrafts',
      stega: true,
      token,
      resultSourceMap: true,
    });
    return { data };
  }

  const data = await client.fetch<T>(query, params, {
    perspective: 'published',
  });
  return { data };
}
