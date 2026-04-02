import { describe, it, expect } from 'vitest';
import {
  buildChurchJsonLd,
  buildWebSiteJsonLd,
  buildVideoObjectJsonLd,
  buildEventJsonLd,
  buildOrganizationJsonLd,
} from './structured-data';

describe('buildChurchJsonLd', () => {
  it('returns Church type with required fields', () => {
    const ld = buildChurchJsonLd();
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('Church');
    expect(ld.name).toBeTruthy();
    expect(ld.url).toBeTruthy();
    expect(ld.address).toBeTruthy();
    expect((ld.address as Record<string, unknown>)['@type']).toBe('PostalAddress');
    expect((ld.address as Record<string, unknown>).streetAddress).toBe('429 Mitchell Street');
  });
});

describe('buildWebSiteJsonLd', () => {
  it('returns WebSite type with siteUrl', () => {
    const ld = buildWebSiteJsonLd('https://ficcc.org');
    expect(ld['@type']).toBe('WebSite');
    expect(ld.url).toBe('https://ficcc.org');
    expect(ld.name).toBeTruthy();
  });
});

describe('buildVideoObjectJsonLd', () => {
  it('returns VideoObject with embedUrl when videoId present', () => {
    const ld = buildVideoObjectJsonLd({
      title: 'Test Sermon',
      date: '2026-01-15',
      videoId: 'abc123',
      scripture: 'John 3:16',
      speaker: 'Pastor Lee',
    });
    expect(ld['@type']).toBe('VideoObject');
    expect(ld.embedUrl).toBe('https://www.youtube.com/embed/abc123');
    expect(ld.thumbnailUrl).toContain('abc123');
    expect(ld.uploadDate).toBe('2026-01-15');
    expect(ld.name).toBe('Test Sermon');
  });

  it('uses title as fallback description when no speaker/scripture', () => {
    const ld = buildVideoObjectJsonLd({
      title: 'Simple Sermon',
      videoId: 'xyz',
    });
    expect(ld.description).toBe('Simple Sermon');
  });
});

describe('buildEventJsonLd', () => {
  it('returns Event with startDate', () => {
    const ld = buildEventJsonLd({
      title: 'Friday Fellowship',
      date: '2026-04-05',
      location: '429 Mitchell Street, Ithaca, NY 14850',
    });
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('Event');
    expect(ld.startDate).toBe('2026-04-05');
    expect(ld.name).toBe('Friday Fellowship');
    expect((ld.location as Record<string, unknown>)['@type']).toBe('Place');
  });

  it('omits optional fields when not provided', () => {
    const ld = buildEventJsonLd({ title: 'Minimal Event' });
    expect(ld['@type']).toBe('Event');
    expect(ld.startDate).toBeUndefined();
    expect(ld.location).toBeUndefined();
  });
});

describe('buildOrganizationJsonLd', () => {
  it('returns Organization with foundingDate', () => {
    const ld = buildOrganizationJsonLd();
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('Organization');
    expect(ld.foundingDate).toBe('1968');
    expect(ld.name).toBeTruthy();
    expect(ld.address).toBeTruthy();
  });
});
