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
const previewPerspectiveParam = 'sanity-preview-perspective';
export const sanityPreviewSecretCookie = '__sanity_preview_secret';
export const sanityPreviewPerspectiveCookie = '__sanity_preview_perspective';
const previewContexts = new WeakMap<Request, Promise<SanityPreviewContext>>();

type QueryOptions = {
  request?: Request;
};

function getCookie(request: Request, name: string): string | undefined {
  return request.headers
    .get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

/** True after the server-side preview endpoint has authenticated the editor. */
export function hasSanityPreviewCookie(request: Request | undefined): boolean {
  return Boolean(request && getCookie(request, sanityPreviewSecretCookie));
}

function parsePreviewPerspective(value: string | undefined): ClientPerspective {
  if (!value || value === 'drafts' || value === 'published') {
    return (value || 'drafts') as ClientPerspective;
  }

  return value.split(',').filter(Boolean) as ClientPerspective;
}

export async function getSanityPreviewContext(
  request: Request | undefined,
): Promise<SanityPreviewContext> {
  if (!request || !hasSanityPreviewCookie(request)) {
    return { enabled: false, perspective: 'published' };
  }

  const cachedContext = previewContexts.get(request);
  if (cachedContext) return cachedContext;

  const context = resolveSanityPreviewContext(request);
  previewContexts.set(request, context);
  return context;
}

async function resolveSanityPreviewContext(request: Request): Promise<SanityPreviewContext> {

  const secret = getCookie(request, sanityPreviewSecretCookie);
  const perspective = getCookie(request, sanityPreviewPerspectiveCookie);

  const token = import.meta.env.SANITY_API_READ_TOKEN;
  if (!token) {
    throw new Error(
      '[sanity/preview] SANITY_API_READ_TOKEN is required for Sanity Presentation preview.',
    );
  }

  // The secret is never left in the browser URL. Reconstruct the validation URL
  // from the HTTP-only cookie solely for the Sanity server-side verification.
  const validationUrl = new URL('/api/sanity/preview', request.url);
  validationUrl.searchParams.set(previewSecretParam, secret!);
  if (perspective) validationUrl.searchParams.set(previewPerspectiveParam, perspective);

  const validation = await validatePreviewUrl(client.withConfig({ token }), validationUrl.href);
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
  slug?: SanitySlug;
  summary?: string;
  date?: string;
  endDate?: string;
  time?: string;
  location?: string;
  address?: string;
  mapUrl?: string;
  description?: PortableTextBlock[];
  image?: SanityImage;
  imageAlt?: string;
  recurrence?: 'none' | 'weekly' | 'monthly' | 'yearly';
  recurrenceEndDate?: string;
  registrationLabel?: string;
  registrationUrl?: string;
  contactName?: string;
  contactEmail?: string;
  translation?: {
    language?: 'en' | 'zh';
    slug?: string;
  };
  /** Legacy field retained for existing Sanity documents. */
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
  youtubeChannelUrl?: string;
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
  rideRequestHeading?: string;
  rideRequestIntro?: string;
  language: 'en' | 'zh';
}

export interface ResourceItem {
  title: string;
  url?: string;
  file?: SanityFile;
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

export interface SiteBranding {
  _id: string;
  _type: 'siteBranding';
  splashLogo?: SanityFile;
  notFoundLogo?: SanityFile;
  headerLogoEn?: SanityFile;
  headerLogoZh?: SanityFile;
  footerLogo?: SanityFile;
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

export type GrowAudience = 'english' | 'chinese' | 'youth' | 'children';

export interface SanityGrowGroup {
  _key: string;
  name: string;
  meetingTime?: string;
  description: string;
  image?: SanityImage;
  imageAlt?: string;
  detail?: Pick<Ministry, 'isVisible' | 'language' | 'slug'>;
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

async function fetchQuery<T>(
  query: string,
  params: QueryParams = {},
  options: QueryOptions = {},
): Promise<T> {
  if (options.request) {
    return (await loadQuery<T>(query, params, options)).data;
  }

  return client.fetch<T>(query, params, { perspective: 'published' });
}

function singletonId(type: string, language: Language): string {
  return `${type}-${language}`;
}

/**
 * Fetch public visibility for fixed page documents in one small query.
 * Missing documents are treated as visible by consumers so local fallbacks still work.
 */
export async function getPageVisibility(
  language: Language = 'en',
  options: QueryOptions = {},
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

  const pages = await fetchQuery<Array<{ _id: string; isVisible?: boolean }>>(
    `*[_id in $ids]{ _id, isVisible }`,
    { ids },
    options,
  );

  return Object.fromEntries(pages.map((page) => [page._id, page.isVisible !== false]));
}

/**
 * Fetch all sermons for a language, newest first.
 */
export async function getSermons(language: Language = 'en', options: QueryOptions = {}): Promise<Sermon[]> {
  return fetchQuery<Sermon[]>(
    `*[_type == "sermon" && language == $language && isVisible != false]{
      _id, _type, isVisible, title, slug, speaker, date, series, scripture, videoId, language
    } | order(date desc)`,
    { language },
    options,
  );
}

const eventProjection = `
  _id, _type, isVisible, title, slug, summary, date, endDate, time,
  location, address, mapUrl, description, image, imageAlt,
  recurrence, recurrenceEndDate, recurring,
  registrationLabel, registrationUrl, contactName, contactEmail, language,
  translation->{language, "slug": slug.current}
`;

/** Fetch public event documents for a language. Lifecycle filtering happens in src/lib/events.ts. */
export async function getEvents(language: Language = 'en', options: QueryOptions = {}): Promise<Event[]> {
  return fetchQuery<Event[]>(
    `*[_type == "event" && language == $language && isVisible != false]{
      ${eventProjection}
    } | order(date asc)`,
    { language },
    options,
  );
}

/** Fetch one public event landing page by language and slug. */
export async function getEventBySlug(
  language: Language,
  slug: string,
  options: QueryOptions = {},
): Promise<Event | null> {
  return fetchQuery<Event | null>(
    `*[_type == "event" && language == $language && slug.current == $slug && isVisible != false][0]{
      ${eventProjection}
    }`,
    { language, slug },
    options,
  );
}

/**
 * Fetch all ministries for a language.
 */
export async function getMinistries(
  language: Language = 'en',
  options: QueryOptions = {},
): Promise<Ministry[]> {
  return fetchQuery<Ministry[]>(
    `*[_type == "ministry" && language == $language && isVisible != false] | order(name asc)`,
    { language },
    options,
  );
}

/**
 * Fetch one public ministry by its language and slug.
 * Chinese fellowship detail pages reuse this existing editorial document type.
 */
export async function getMinistryBySlug(
  language: Language,
  slug: string,
  options: QueryOptions = {},
): Promise<Ministry | null> {
  return fetchQuery<Ministry | null>(
    `*[_type == "ministry" && language == $language && slug.current == $slug && isVisible != false][0]`,
    { language, slug },
    options,
  );
}

/**
 * Return the published Chinese ministry slugs linked from the Chinese Grow page.
 * The page route uses these during static generation, while its built-in starter
 * content keeps the known fellowships available before the CMS is populated.
 */
export async function getChineseFellowshipSlugs(options: QueryOptions = {}): Promise<string[]> {
  const slugs = await fetchQuery<Array<string | null>>(
    `*[_id == "growPage-zh-chinese"][0].groups[].detail->slug.current`,
    {},
    options,
  );

  return slugs.filter((slug): slug is string => Boolean(slug));
}

/**
 * Fetch the singleton site-settings document for a language.
 * Singleton IDs follow the pattern `{type}-{lang}` per D-decision.
 */
export async function getSiteSettings(
  language: Language = 'en',
  options: QueryOptions = {},
): Promise<SiteSettings | null> {
  return fetchQuery<SiteSettings | null>(
    `*[_id == $id][0]`,
    { id: singletonId('siteSettings', language) },
    options,
  );
}

/**
 * Fetch the singleton home-page document for a language.
 */
export async function getHomePage(
  language: Language = 'en',
  options: QueryOptions = {},
): Promise<HomePage | null> {
  return fetchQuery<HomePage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('homePage', language) },
    options,
  );
}

/**
 * Fetch the singleton about-page document for a language.
 */
export async function getAboutPage(
  language: Language = 'en',
  options: QueryOptions = {},
): Promise<AboutPage | null> {
  return fetchQuery<AboutPage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('aboutPage', language) },
    options,
  );
}

/**
 * Fetch the singleton visit-page document for a language.
 */
export async function getVisitPage(
  language: Language = 'en',
  options: QueryOptions = {},
): Promise<VisitPage | null> {
  return fetchQuery<VisitPage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('visitPage', language) },
    options,
  );
}

/**
 * Fetch the singleton resources-page document for a language.
 */
export async function getResourcesPage(
  language: Language = 'en',
  options: QueryOptions = {},
): Promise<ResourcesPage | null> {
  return fetchQuery<ResourcesPage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('resourcesPage', language) },
    options,
  );
}

/**
 * Fetch person documents for a language, ordered by name.
 */
export async function getStaff(
  language: Language = 'en',
  options: QueryOptions = {},
): Promise<Person[]> {
  return fetchQuery<Person[]>(
    `*[_type == "person" && language == $language && isVisible != false] | order(name asc)`,
    { language },
    options,
  );
}

/**
 * Fetch the splash page document (language-neutral singleton).
 */
export async function getSplashPage(options: QueryOptions = {}): Promise<SplashPage | null> {
  return fetchQuery<SplashPage | null>(
    `*[_id == "splashPage"][0]`,
    {},
    options,
  );
}

/** Fetch the shared, language-neutral branding singleton. */
export async function getSiteBranding(options: QueryOptions = {}): Promise<SiteBranding | null> {
  return fetchQuery<SiteBranding | null>(
    `*[_id == "siteBranding"][0]`,
    {},
    options,
  );
}

/**
 * Fetch the beliefs page singleton for a language.
 */
export async function getBeliefsPage(
  language: Language = 'en',
  options: QueryOptions = {},
): Promise<BeliefsPage | null> {
  return fetchQuery<BeliefsPage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('beliefsPage', language) },
    options,
  );
}

/**
 * Fetch the give page singleton for a language.
 */
export async function getGivePage(
  language: Language = 'en',
  options: QueryOptions = {},
): Promise<GivePage | null> {
  return fetchQuery<GivePage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('givePage', language) },
    options,
  );
}

/**
 * Fetch the contact page singleton for a language.
 */
export async function getContactPage(
  language: Language = 'en',
  options: QueryOptions = {},
): Promise<ContactPage | null> {
  return fetchQuery<ContactPage | null>(
    `*[_id == $id][0]`,
    { id: singletonId('contactPage', language) },
    options,
  );
}

/**
 * Fetch one ministry-specific Grow page for a language and audience.
 */
export async function getGrowPageDocument(
  language: Language,
  audience: GrowAudience,
  options: QueryOptions = {},
): Promise<GrowPage | null> {
  return fetchQuery<GrowPage | null>(
    `*[_id == $id][0]{
      ...,
      groups[]{
        ...,
        detail->{ slug, language, isVisible }
      }
    }`,
    { id: `growPage-${language}-${audience}` },
    options,
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

/** Convert common Portable Text paragraphs, headings, lists, emphasis, and links to safe HTML. */
export function portableTextToHtml(blocks: PortableTextBlock[] | undefined | null): string {
  if (!blocks?.length) return '';

  const html: string[] = [];
  let openList: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (openList) html.push(`</${openList}>`);
    openList = null;
  };

  for (const block of blocks.filter((candidate) => candidate._type === 'block')) {
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
                // Allow normal site, web, email, and telephone links while blocking script URIs.
                const safeHref = /^(https?:\/\/|mailto:|tel:)/i.test(def.href) || def.href.startsWith('/')
                  ? def.href
                  : '#';
                text = `<a href="${escapeHtml(safeHref)}">${text}</a>`;
              }
            }
          }
          return text;
        })
        .join('');

    const listItem = block.listItem as string | undefined;
    if (listItem === 'bullet' || listItem === 'number') {
      const list = listItem === 'number' ? 'ol' : 'ul';
      if (openList !== list) {
        closeList();
        openList = list;
        html.push(`<${list}>`);
      }
      html.push(`<li>${inner}</li>`);
      continue;
    }

    closeList();
    const style = block.style as string | undefined;
    const tag = style === 'h2' || style === 'h3' || style === 'h4' || style === 'blockquote'
      ? style
      : 'p';
    html.push(`<${tag}>${inner}</${tag}>`);
  }

  closeList();
  return html.join('\n');
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
 * CMS query helpers call this when a request is available. Build-time callers
 * keep the published-only path, so missing Sanity configuration still falls
 * back safely during local development and builds.
 */
export async function loadQuery<T = unknown>(
  query: string,
  params: QueryParams = {},
  options: { request?: Request } = {},
): Promise<{ data: T; perspective: ClientPerspective; sourceMap?: unknown }> {
  const previewContext = await getSanityPreviewContext(options.request);

  if (previewContext.enabled) {
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
