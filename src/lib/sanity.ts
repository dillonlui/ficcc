import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID || 'placeholder';
const dataset = import.meta.env.SANITY_DATASET || 'production';

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-03-31',
  useCdn: false, // consistent with astro.config.mjs; avoids stale data on SSR routes
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

export interface Sermon {
  _id: string;
  _type: 'sermon';
  title: string;
  slug?: SanitySlug;
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
  image?: SanityImage;
  recurring?: boolean;
  language: 'en' | 'zh';
}

export interface Ministry {
  _id: string;
  _type: 'ministry';
  name: string;
  slug?: SanitySlug;
  image?: SanityImage;
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
  city?: string;
  phone?: string;
  email?: string;
  serviceTimes?: ServiceTime[];
  socialLinks?: SocialLink[];
  language: 'en' | 'zh';
  announcementBarEnabled?: boolean;
  announcementBarText?: string;
  announcementBarLink?: string;
}

export interface ServiceTime {
  label: string;
  time: string;
}

export interface HomePage {
  _id: string;
  _type: 'homePage';
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaHref?: string;
  sections?: HomeSection[];
  bannerHeading?: string;
  bannerBody?: PortableTextBlock[];
  bannerImage?: SanityImage;
  bannerCtaText?: string;
  bannerCtaHref?: string;
  language: 'en' | 'zh';
}

export interface BeliefItem {
  _key: string;
  title: string;
  content?: PortableTextBlock[];
}

export interface AboutPage {
  _id: string;
  _type: 'aboutPage';
  whoWeAreHeading?: string;
  whoWeAreBody?: PortableTextBlock[];
  whoWeAreImage?: SanityImage;
  snapshots?: Snapshot[];
  pastors?: Pastor[];
  timelineHeading?: string;
  timelineEras?: TimelineEra[];
  beliefsCalloutHeading?: string;
  beliefsCalloutBody?: string;
  language: 'en' | 'zh';
}

export interface ScheduleItem {
  label: string;
  time: string;
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface VisitPage {
  _id: string;
  _type: 'visitPage';
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  whatToExpect?: PortableTextBlock[];
  schedule?: ScheduleItem[];
  transportation?: PortableTextBlock[];
  faqItems?: FaqItem[];
  rideRequestEnabled?: boolean;
  busRouteHeading?: string;
  busRouteIntro?: string;
  busRoute?: BusStop[];
  rideRequestHeading?: string;
  rideRequestIntro?: string;
  language: 'en' | 'zh';
}

export interface ResourceItem {
  title: string;
  url?: string;
  description?: string;
  type?: 'article' | 'pdf' | 'link';
}

export interface ResourceCategory {
  title: string;
  description?: string;
  resources?: ResourceItem[];
}

export interface ResourcesPage {
  _id: string;
  _type: 'resourcesPage';
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  resourceCategories?: ResourceCategory[];
  language: 'en' | 'zh';
}

export interface Person {
  _id: string;
  _type: 'person';
  name: string;
  role?: string;
  bio?: PortableTextBlock[];
  photo?: SanityImage;
  language: 'en' | 'zh';
}

export interface SplashPage {
  _id: string;
  _type: 'splashPage';
  backgroundImage?: SanityImage;
  churchNameEn?: string;
  churchNameZh?: string;
}

export interface HomeSection {
  _key: string;
  heading: string;
  body?: PortableTextBlock[];
  image?: SanityImage;
  ctaText?: string;
  ctaHref?: string;
  layout?: 'default' | 'reversed';
  tinted?: boolean;
}

export interface Pastor {
  _key: string;
  name: string;
  role?: string;
  bio?: PortableTextBlock[];
  photo?: SanityImage;
}

export interface Snapshot {
  _key: string;
  accent: string;
  body?: string;
}

export interface TimelineEntry {
  _key: string;
  year: string;
  description: string;
}

export interface TimelineEra {
  _key: string;
  title: string;
  entries?: TimelineEntry[];
}

export interface BeliefsPage {
  _id: string;
  _type: 'beliefsPage';
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  beliefsHeading?: string;
  beliefsIntro?: string;
  beliefs?: BeliefItem[];
  scriptureQuote?: string;
  scriptureCitation?: string;
  scriptureImage?: SanityImage;
  visionHeading?: string;
  visionIntro?: PortableTextBlock[];
  visionItems?: BeliefItem[];
  calloutHeading?: string;
  calloutBody?: string;
  language: 'en' | 'zh';
}

export interface GivingMethod {
  _key: string;
  title: string;
  description?: string;
  icon?: 'globe' | 'envelope' | 'people';
  link?: string;
  linkText?: string;
  note?: string;
  address?: string;
}

export interface GivePage {
  _id: string;
  _type: 'givePage';
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  whyWeGiveHeading?: string;
  whyWeGiveBody?: PortableTextBlock[];
  scriptureQuote?: string;
  scriptureCitation?: string;
  givingMethods?: GivingMethod[];
  questionsHeading?: string;
  questionsBody?: string;
  language: 'en' | 'zh';
}

export interface ContactPage {
  _id: string;
  _type: 'contactPage';
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  formEnabled?: boolean;
  language: 'en' | 'zh';
}

export interface BusStop {
  _key: string;
  stop: string;
  time: string;
}

// ---------------------------------------------------------------------------
// GROQ query helpers
// ---------------------------------------------------------------------------

type Language = 'en' | 'zh';

/**
 * Fetch all sermons for a language, newest first.
 */
export async function getSermons(language: Language = 'en'): Promise<Sermon[]> {
  return client.fetch<Sermon[]>(
    `*[_type == "sermon" && language == $language]{
      _id, _type, title, slug, speaker, date, series, scripture, videoId, language
    } | order(date desc)`,
    { language },
  );
}

/**
 * Fetch upcoming events for a language, soonest first.
 */
export async function getEvents(language: Language = 'en'): Promise<Event[]> {
  return client.fetch<Event[]>(
    `*[_type == "event" && language == $language]{
      _id, _type, title, date, endDate, time, location, description, image, recurring, language
    } | order(date asc)`,
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

/**
 * Fetch the singleton about-page document for a language.
 */
export async function getAboutPage(
  language: Language = 'en',
): Promise<AboutPage | null> {
  return client.fetch<AboutPage | null>(
    `*[_type == "aboutPage" && language == $language][0]`,
    { language },
  );
}

/**
 * Fetch the singleton visit-page document for a language.
 */
export async function getVisitPage(
  language: Language = 'en',
): Promise<VisitPage | null> {
  return client.fetch<VisitPage | null>(
    `*[_type == "visitPage" && language == $language][0]`,
    { language },
  );
}

/**
 * Fetch the singleton resources-page document for a language.
 */
export async function getResourcesPage(
  language: Language = 'en',
): Promise<ResourcesPage | null> {
  return client.fetch<ResourcesPage | null>(
    `*[_type == "resourcesPage" && language == $language][0]`,
    { language },
  );
}

/**
 * Fetch person documents for a language, ordered by name.
 */
export async function getStaff(
  language: Language = 'en',
): Promise<Person[]> {
  return client.fetch<Person[]>(
    `*[_type == "person" && language == $language] | order(name asc)`,
    { language },
  );
}

/**
 * Fetch the splash page document (language-neutral singleton).
 */
export async function getSplashPage(): Promise<SplashPage | null> {
  return client.fetch<SplashPage | null>(
    `*[_type == "splashPage"][0]`,
  );
}

/**
 * Fetch the beliefs page singleton for a language.
 */
export async function getBeliefsPage(
  language: Language = 'en',
): Promise<BeliefsPage | null> {
  return client.fetch<BeliefsPage | null>(
    `*[_type == "beliefsPage" && language == $language][0]`,
    { language },
  );
}

/**
 * Fetch the give page singleton for a language.
 */
export async function getGivePage(
  language: Language = 'en',
): Promise<GivePage | null> {
  return client.fetch<GivePage | null>(
    `*[_type == "givePage" && language == $language][0]`,
    { language },
  );
}

/**
 * Fetch the contact page singleton for a language.
 */
export async function getContactPage(
  language: Language = 'en',
): Promise<ContactPage | null> {
  return client.fetch<ContactPage | null>(
    `*[_type == "contactPage" && language == $language][0]`,
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
  params.set('fm', options?.format ?? 'webp');
  const qs = params.toString();
  if (qs) url += `?${qs}`;

  return url;
}

// ---------------------------------------------------------------------------
// Portable Text → HTML (lightweight server-side renderer)
// ---------------------------------------------------------------------------

/**
 * Convert an array of Portable Text blocks to an HTML string.
 *
 * Handles `block` type with `normal` style (paragraphs), `strong`/`em` marks,
 * and `link` annotations. Other block types are silently skipped.
 */
export function portableTextToHtml(blocks: PortableTextBlock[] | undefined | null): string {
  if (!blocks?.length) return '';

  return blocks
    .filter((b) => b._type === 'block')
    .map((block) => {
      const children = (block.children as Array<{
        _type: string;
        text: string;
        marks?: string[];
      }>) || [];

      const markDefs = (block.markDefs as Array<{
        _key: string;
        _type: string;
        href?: string;
      }>) || [];

      const inner = children
        .map((child) => {
          let text = escapeHtml(child.text || '');
          if (!child.marks?.length) return text;

          for (const mark of child.marks) {
            if (mark === 'strong') {
              text = `<strong>${text}</strong>`;
            } else if (mark === 'em') {
              text = `<em>${text}</em>`;
            } else {
              // Check markDefs for link annotations
              const def = markDefs.find((d) => d._key === mark);
              if (def?._type === 'link' && def.href) {
                // Block javascript: URIs to prevent XSS from CMS content
                const safeHref = /^https?:\/\//i.test(def.href) || def.href.startsWith('/')
                  ? def.href
                  : '#';
                text = `<a href="${escapeHtml(safeHref)}">${text}</a>`;
              }
            }
          }
          return text;
        })
        .join('');

      return `<p>${inner}</p>`;
    })
    .join('\n');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
 * This is a *parallel* helper — existing getSermons / getHomePage / etc.
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
