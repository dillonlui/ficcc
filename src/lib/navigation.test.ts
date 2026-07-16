import { describe, it, expect } from 'vitest';
import { getAlternateUrl, hasLanguageCounterpart } from './navigation';

describe('getAlternateUrl', () => {
  describe('standard prefix swap', () => {
    it('EN /en/about → ZH /zh/about', () => {
      expect(getAlternateUrl('/en/about', 'en')).toBe('/zh/about');
    });

    it('ZH /zh/about → EN /en/about', () => {
      expect(getAlternateUrl('/zh/about', 'zh')).toBe('/en/about');
    });

    it('EN /en/contact → ZH /zh/contact', () => {
      expect(getAlternateUrl('/en/contact', 'en')).toBe('/zh/contact');
    });

    it('ZH /zh/sermons → EN /en/sermons', () => {
      expect(getAlternateUrl('/zh/sermons', 'zh')).toBe('/en/sermons');
    });

    it('maps the bilingual privacy notices', () => {
      expect(getAlternateUrl('/en/privacy', 'en')).toBe('/zh/privacy');
      expect(getAlternateUrl('/zh/privacy', 'zh')).toBe('/en/privacy');
    });
  });

  describe('nested paths', () => {
    it('EN /en/about/beliefs → ZH /zh/about/beliefs', () => {
      expect(getAlternateUrl('/en/about/beliefs', 'en')).toBe('/zh/about/beliefs');
    });

    it('ZH /zh/about/staff → EN /en/about/staff', () => {
      expect(getAlternateUrl('/zh/about/staff', 'zh')).toBe('/en/about/staff');
    });
  });

  describe('asymmetric routes', () => {
    it('EN /en/visit → ZH /zh/sundays', () => {
      expect(getAlternateUrl('/en/visit', 'en')).toBe('/zh/sundays');
    });

    it('ZH /zh/sundays → EN /en/visit', () => {
      expect(getAlternateUrl('/zh/sundays', 'zh')).toBe('/en/visit');
    });
  });

  describe('root paths', () => {
    it('EN /en → ZH /zh', () => {
      expect(getAlternateUrl('/en', 'en')).toBe('/zh');
    });

    it('EN /en/ → ZH /zh', () => {
      expect(getAlternateUrl('/en/', 'en')).toBe('/zh');
    });

    it('ZH /zh → EN /en/', () => {
      expect(getAlternateUrl('/zh', 'zh')).toBe('/en/');
    });
  });

  describe('fallback to homepage for pages with no counterpart', () => {
    it('EN /en/resources → ZH /zh', () => {
      expect(getAlternateUrl('/en/resources', 'en')).toBe('/zh');
    });

    it('EN /styleguide → ZH /zh', () => {
      expect(getAlternateUrl('/styleguide', 'en')).toBe('/zh');
    });

    it('EN /admin/anything → ZH /zh', () => {
      expect(getAlternateUrl('/admin/anything', 'en')).toBe('/zh');
    });

    it('EN /404 → ZH /zh', () => {
      expect(getAlternateUrl('/404', 'en')).toBe('/zh');
    });

    it('unpaired event pages fall back to the other-language homepage', () => {
      expect(getAlternateUrl('/en/events/church-picnic', 'en')).toBe('/zh');
      expect(getAlternateUrl('/zh/events/church-picnic', 'zh')).toBe('/en/');
    });

    it('uses an explicitly paired event path when one exists', () => {
      expect(getAlternateUrl('/en/events/church-picnic', 'en', '/zh/events/教會野餐'))
        .toBe('/zh/events/教會野餐');
    });
  });

  describe('trailing slash normalization', () => {
    it('EN /en/about/ → ZH /zh/about', () => {
      expect(getAlternateUrl('/en/about/', 'en')).toBe('/zh/about');
    });

    it('ZH /zh/about/ → EN /en/about', () => {
      expect(getAlternateUrl('/zh/about/', 'zh')).toBe('/en/about');
    });

    it('EN /en/visit/ → ZH /zh/sundays (asymmetric with trailing slash)', () => {
      expect(getAlternateUrl('/en/visit/', 'en')).toBe('/zh/sundays');
    });
  });

  describe('dynamic routes', () => {
    it('EN /en/sermons/some-slug → ZH /zh/sermons/some-slug', () => {
      expect(getAlternateUrl('/en/sermons/some-slug', 'en')).toBe('/zh/sermons/some-slug');
    });

    it('ZH /zh/sermons/some-slug → EN /en/sermons/some-slug', () => {
      expect(getAlternateUrl('/zh/sermons/some-slug', 'zh')).toBe('/en/sermons/some-slug');
    });

    it('EN /en/grow/youth → ZH /zh/grow/youth', () => {
      expect(getAlternateUrl('/en/grow/youth', 'en')).toBe('/zh/grow/youth');
    });

    it('ZH /zh/grow/children → EN /en/grow/children', () => {
      expect(getAlternateUrl('/zh/grow/children', 'zh')).toBe('/en/grow/children');
    });
  });

  describe('genuine language counterparts', () => {
    it('recognizes equivalent bilingual pages', () => {
      expect(hasLanguageCounterpart('/en/about/')).toBe(true);
      expect(hasLanguageCounterpart('/zh/sundays/')).toBe(true);
    });

    it('excludes Chinese-only fellowship detail pages', () => {
      expect(hasLanguageCounterpart('/zh/fellowships/gospel-group/')).toBe(false);
    });

    it('requires event pages to opt into a paired counterpart', () => {
      expect(hasLanguageCounterpart('/en/events/church-picnic')).toBe(false);
      expect(hasLanguageCounterpart('/zh/events/church-picnic')).toBe(false);
    });
  });
});
