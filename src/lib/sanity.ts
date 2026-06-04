import { createClient, type ClientPerspective, type QueryParams } from '@sanity/client';
import { validatePreviewUrl } from '@sanity/preview-url-secret';

const projectId = import.meta.env.SANITY_PROJECT_ID || 'placeholder';
const dataset = import.meta.env.SANITY_DATASET || 'production';

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-03-31',
  useCdn: false, // consistent with astro.config.mjs; avoids stale data on SSR routes
});

export { projectId, dataset };

type SanityPreviewContext = {
  enabled: boolean;
  perspective: ClientPerspective;
};

const previewSecretParam = 'sanity-preview-secret';

function parsePreviewPerspective(value: string | undefined): ClientPerspective {
  if (!value || value === 'drafts' || value === 'published') {
    return (value || 'drafts') as ClientPerspective;
  }

  return value.split(',').filter(Boolean) as ClientPerspective;
}

export async function getSanityPreviewContext(
  request: Request | undefined,
): Promise<SanityPreviewContext> {
  if (!request) {
    return { enabled: false, perspective: 'published' };
  }

  const requestUrl = new URL(request.url);
  if (!requestUrl.searchParams.has(previewSecretParam)) {
    return { enabled: false, perspective: 'published' };
  }

  const token = import.meta.env.SANITY_API_READ_TOKEN;
  if (!token) {
    throw new Error(
      '[sanity/preview] SANITY_API_READ_TOKEN is required for Sanity Presentation preview.',
    );
  }

  const validation = await validatePreviewUrl(client.withConfig({ token }), request.url);
  if (!validation.isValid) {
    return { enabled: false, perspective: 'published' };
  }

  return {
    enabled: true,
    perspective: parsePreviewPerspective(validation.studioPreviewPerspective),
  };
}

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

export interface SanityFile {
  _type: 'file';
  asset: { _ref: string; _type: 'reference' };
}

export interface Sermon {
  _id: string;
  _type: 'sermon';
  isVisible?: boolean;
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
  isVisible?: boolean;
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
  isVisible?: boolean;
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
  isVisible?: boolean;
  heroMediaType?: 'image' | 'video';
  heroImage?: SanityImage;
  heroFallbackImage?: SanityImage;
  heroVideo?: SanityFile;
  heroTitle: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaHref?: string;
  sections?: HomeSection[];
  bannerHeading?: string;
  bannerBody?: PortableTextBlock[];
  bannerImage?: SanityImage;
  bannerImageAlt?: string;
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
  isVisible?: boolean;
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
  isVisible?: boolean;
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
  isVisible?: boolean;
  heroImage?: SanityImage;
  heroTitle: string;
  heroSubtitle?: string;
  resourceCategories?: ResourceCategory[];
  language: 'en' | 'zh';
}

export interface Person {
  _id: string;
  _type: 'person';
  isVisible?: boolean;
  name: string;
  role?: string;
  bio?: PortableTextBlock[];
  photo?: SanityImage;
  language: 'en' | 'zh';
}

export interface SplashPage {
  _id: string;
  _type: 'splashPage';
  isVisible?: boolean;
  backgroundImage?: SanityImage;
  churchNameEn?: string;
  churchNameZh?: string;
}

export interface HomeSection {
  _key: string;
  heading: string;
  body?: PortableTextBlock[];
  image?: SanityImage;
  imageAlt?: string;
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
  isVisible?: boolean;
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
  isVisible?: boolean;
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
  isVisible?: boolean;
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

export type GrowAudience = 'english' | 'chinese' | 'youth' | 'children';

export interface SanityGrowGroup {
  _key: string;
  name: string;
  meetingTime?: string;
  description: string;
  image?: SanityImage;
  imageAlt?: string;
}

export interface GrowPage {
  _id: string;
  _type: 'growPage';
  isVisible?: boolean;
  audience: GrowAudience;
  language: 'en' | 'zh';
  title: string;
  description: string;
  navLabel: string;
  pageTitle: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: SanityImage;
  intro: string;
  listingHeading: string;
  groups?: SanityGrowGroup[];
  sermonsCalloutHeading?: string;
  sermonsCalloutBody?: string;
  sermonsCtaText?: string;
  sermonsCtaHref?: string;
}

export type PageVisibilityMap = Record<string, boolean>;

// ---------------------------------------------------------------------------
// GROQ query helpers
// ---------------------------------------------------------------------------

type Language = 'en' | 'zh';

function singletonId(type: string, language: Language): string {
  return `${type}-${language}`;
}

/**
 * Fetch public visibility for fixed page documents in one small query.
 * Missing documents are treated as visible by consumers so local fallbacks still work.
 */
export async function getPageVisibility(
  language: Language = 'en',
): Promise<PageVisibilityMap> {
  const ids = [
    singletonId('homePage', language),
    singletonId('aboutPage', language),
    singletonId('beliefsPage', language),
    singletonId('visitPage', language),
    singletonId('givePage', language),
    singletonId('contactPage', language),
    singletonId('resourcesPage', language),
  ];

  const pages = await client.fetch<Array<{ _id: string; isVisible?: boolean }>>(
    `*[_id in $ids]{ _id, isVisible }`,
    { ids },
  );

  return Object.fromEntries(pages.map((page) => [page._id, page.isVisible !== false]));
}

/**
 * Fetch all sermons for a language, newest first.
 */
export async function getSermons(language: Language = 'en'): Promise<Sermon[]> {
  return client.fetch<Sermon[]>(
    `*[_type == "sermon" && language == $language && isVisible != false]{
      _id, _type, isVisible, title, slug, speaker, date, series, scripture, videoId, language
    } | order(date desc)`,
    { language },
  );
}

/**
 * Fetch upcoming events for a language, soonest first.
 */
export async function getEvents(language: Language = 'en'): Promise<Event[]> {
  return client.fetch<Event[]>(
    `*[_type == "event" && language == $language && isVisible != false]{
      _id, _type, isVisible, title, date, endDate, time, location, description, image, recurring, language
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
    `*[_type == "ministry" && language == $language && isVisible != false] | order(name asc)`,
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
    `*[_id == $id][0]`,
    { id: singletonId('siteSettings', language) },
  );
}

/**
 * Fetch the singleton home-page document for a language.
 */
export async function getHomePage(
  language: Language = 'en',
): Promise<HomePage | null> {
  return client.fetch<HomePage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('homePage', language) },
  );
}

/**
 * Fetch the singleton about-page document for a language.
 */
export async function getAboutPage(
  language: Language = 'en',
): Promise<AboutPage | null> {
  return client.fetch<AboutPage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('aboutPage', language) },
  );
}

/**
 * Fetch the singleton visit-page document for a language.
 */
export async function getVisitPage(
  language: Language = 'en',
): Promise<VisitPage | null> {
  return client.fetch<VisitPage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('visitPage', language) },
  );
}

/**
 * Fetch the singleton resources-page document for a language.
 */
export async function getResourcesPage(
  language: Language = 'en',
): Promise<ResourcesPage | null> {
  return client.fetch<ResourcesPage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('resourcesPage', language) },
  );
}

/**
 * Fetch person documents for a language, ordered by name.
 */
export async function getStaff(
  language: Language = 'en',
): Promise<Person[]> {
  return client.fetch<Person[]>(
    `*[_type == "person" && language == $language && isVisible != false] | order(name asc)`,
    { language },
  );
}

/**
 * Fetch the splash page document (language-neutral singleton).
 */
export async function getSplashPage(): Promise<SplashPage | null> {
  return client.fetch<SplashPage | null>(
    `*[_id == "splashPage"][0]`,
  );
}

/**
 * Fetch the beliefs page singleton for a language.
 */
export async function getBeliefsPage(
  language: Language = 'en',
): Promise<BeliefsPage | null> {
  return client.fetch<BeliefsPage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('beliefsPage', language) },
  );
}

/**
 * Fetch the give page singleton for a language.
 */
export async function getGivePage(
  language: Language = 'en',
): Promise<GivePage | null> {
  return client.fetch<GivePage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('givePage', language) },
  );
}

/**
 * Fetch the contact page singleton for a language.
 */
export async function getContactPage(
  language: Language = 'en',
): Promise<ContactPage | null> {
  return client.fetch<ContactPage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('contactPage', language) },
  );
}

/**
 * Fetch one ministry-specific Grow page for a language and audience.
 */
export async function getGrowPageDocument(
  language: Language,
  audience: GrowAudience,
): Promise<GrowPage | null> {
  return client.fetch<GrowPage | null>(
    `*[_id == $id][0]`,
    { id: `growPage-${language}-${audience}` },
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

/**
 * Resolve a Sanity file asset reference to a CDN URL.
 *
 * File refs look like `file-<id>-<ext>`, and Sanity serves them from the
 * files CDN path rather than the images CDN path.
 */
export function urlForFile(file: SanityFile | undefined | null): string {
  if (!file?.asset?._ref) return '';

  const withoutPrefix = file.asset._ref.replace(/^file-/, '');
  const lastDash = withoutPrefix.lastIndexOf('-');
  if (lastDash === -1) return '';

  const id = withoutPrefix.slice(0, lastDash);
  const ext = withoutPrefix.slice(lastDash + 1);

  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`;
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
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED !== 'false';

/**
 * Draft-aware query helper for preview/visual-editing contexts.
 *
 * When the request has a valid Sanity Presentation preview secret:
 *   - Uses the Studio-provided preview perspective so editors see draft changes
 *   - Injects `SANITY_API_READ_TOKEN` (server-only) for authenticated draft access
 *   - Enables stega encoding and result source maps for click-to-edit overlays
 *
 * Normal public requests always fall back to published perspective with no token or stega.
 *
 * This is a *parallel* helper — existing getSermons / getHomePage / etc.
 * remain unchanged for static build-time fetching.
 */
export async function loadQuery<T = unknown>(
  query: string,
  params: QueryParams = {},
  options: { request?: Request } = {},
): Promise<{ data: T; perspective: ClientPerspective; sourceMap?: unknown }> {
  const previewContext = await getSanityPreviewContext(options.request);

  if (isVisualEditingEnabled && previewContext.enabled) {
    const token = import.meta.env.SANITY_API_READ_TOKEN;
    if (!token) {
      throw new Error(
        '[sanity/loadQuery] Sanity Presentation preview is active but ' +
          'SANITY_API_READ_TOKEN is not set. Add the token to your environment ' +
          '(server-only, no PUBLIC_ prefix).',
      );
    }

    if (import.meta.env.DEV) {
      console.debug(`[sanity/loadQuery] perspective: ${previewContext.perspective}`);
    }

    const response = await client.fetch<{ result: T; resultSourceMap?: unknown }>(
      query,
      params,
      {
        filterResponse: false,
        perspective: previewContext.perspective,
        stega: true,
        token,
        resultSourceMap: 'withKeyArraySelector',
        useCdn: false,
      },
    );

    return {
      data: response.result,
      perspective: previewContext.perspective,
      sourceMap: response.resultSourceMap,
    };
  }

  const data = await client.fetch<T>(query, params, {
    perspective: 'published',
  });
  return { data, perspective: 'published' };
}
