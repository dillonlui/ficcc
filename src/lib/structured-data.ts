/**
 * JSON-LD structured data builders for schema.org types.
 *
 * Each function returns a plain object with `@context` and `@type` ready
 * to be serialized via JSON.stringify in the SEO component.
 */

// ---------------------------------------------------------------------------
// Church (homepage, general)
// ---------------------------------------------------------------------------

export function buildChurchJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: 'First Ithaca Chinese Christian Church',
    description:
      'A Chinese-heritage, university-adjacent Christian community in Ithaca, NY.',
    url: 'https://ficcc.org/en/',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '429 Mitchell Street',
      addressLocality: 'Ithaca',
      addressRegion: 'NY',
      postalCode: '14850',
      addressCountry: 'US',
    },
  };
}

// ---------------------------------------------------------------------------
// WebSite (homepage)
// ---------------------------------------------------------------------------

export function buildWebSiteJsonLd(siteUrl: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'First Ithaca Chinese Christian Church',
    url: siteUrl,
  };
}

// ---------------------------------------------------------------------------
// VideoObject (sermon detail)
// ---------------------------------------------------------------------------

export interface VideoObjectInput {
  title: string;
  date?: string;
  videoId: string;
  scripture?: string;
  speaker?: string;
}

export function buildVideoObjectJsonLd(
  sermon: VideoObjectInput,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: sermon.title,
    description: [sermon.speaker, sermon.scripture]
      .filter(Boolean)
      .join(' — ') || sermon.title,
    uploadDate: sermon.date ?? undefined,
    thumbnailUrl: `https://img.youtube.com/vi/${sermon.videoId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${sermon.videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${sermon.videoId}`,
  };
}

// ---------------------------------------------------------------------------
// Event (events page)
// ---------------------------------------------------------------------------

export interface EventInput {
  title: string;
  date?: string;
  location?: string;
  description?: string;
}

export function buildEventJsonLd(event: EventInput): Record<string, unknown> {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
  };

  if (event.date) {
    ld.startDate = event.date;
  }

  if (event.location) {
    ld.location = {
      '@type': 'Place',
      name: event.location,
      address: event.location,
    };
  }

  if (event.description) {
    ld.description = event.description;
  }

  return ld;
}

// ---------------------------------------------------------------------------
// Organization (about page)
// ---------------------------------------------------------------------------

export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'First Ithaca Chinese Christian Church',
    url: 'https://ficcc.org/en/',
    foundingDate: '1968',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '429 Mitchell Street',
      addressLocality: 'Ithaca',
      addressRegion: 'NY',
      postalCode: '14850',
      addressCountry: 'US',
    },
  };
}
