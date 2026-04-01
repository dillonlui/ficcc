import { describe, it, expect } from 'vitest';
import { getAlternateUrl } from './navigation';

describe('getAlternateUrl', () => {
  describe('standard prefix swap', () => {
    it('EN /about → ZH /zh/about', () => {
      expect(getAlternateUrl('/about', 'en')).toBe('/zh/about');
    });

    it('ZH /zh/about → EN /about', () => {
      expect(getAlternateUrl('/zh/about', 'zh')).toBe('/about');
    });

    it('EN /contact → ZH /zh/contact', () => {
      expect(getAlternateUrl('/contact', 'en')).toBe('/zh/contact');
    });

    it('ZH /zh/sermons → EN /sermons', () => {
      expect(getAlternateUrl('/zh/sermons', 'zh')).toBe('/sermons');
    });
  });

  describe('nested paths', () => {
    it('EN /about/beliefs → ZH /zh/about/beliefs', () => {
      expect(getAlternateUrl('/about/beliefs', 'en')).toBe('/zh/about/beliefs');
    });

    it('ZH /zh/about/staff → EN /about/staff', () => {
      expect(getAlternateUrl('/zh/about/staff', 'zh')).toBe('/about/staff');
    });
  });

  describe('asymmetric routes', () => {
    it('EN /visit → ZH /zh/sundays', () => {
      expect(getAlternateUrl('/visit', 'en')).toBe('/zh/sundays');
    });

    it('ZH /zh/sundays → EN /visit', () => {
      expect(getAlternateUrl('/zh/sundays', 'zh')).toBe('/visit');
    });
  });

  describe('root paths', () => {
    it('EN / → ZH /zh', () => {
      expect(getAlternateUrl('/', 'en')).toBe('/zh');
    });

    it('ZH /zh → EN /', () => {
      expect(getAlternateUrl('/zh', 'zh')).toBe('/');
    });
  });

  describe('fallback to homepage for pages with no counterpart', () => {
    it('EN /resources → ZH /zh', () => {
      expect(getAlternateUrl('/resources', 'en')).toBe('/zh');
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
  });

  describe('trailing slash normalization', () => {
    it('EN /about/ → ZH /zh/about (strip trailing slash)', () => {
      expect(getAlternateUrl('/about/', 'en')).toBe('/zh/about');
    });

    it('ZH /zh/about/ → EN /about (strip trailing slash)', () => {
      expect(getAlternateUrl('/zh/about/', 'zh')).toBe('/about');
    });

    it('EN /visit/ → ZH /zh/sundays (asymmetric with trailing slash)', () => {
      expect(getAlternateUrl('/visit/', 'en')).toBe('/zh/sundays');
    });
  });

  describe('dynamic routes', () => {
    it('EN /sermons/some-slug → ZH /zh/sermons/some-slug', () => {
      expect(getAlternateUrl('/sermons/some-slug', 'en')).toBe('/zh/sermons/some-slug');
    });

    it('ZH /zh/sermons/some-slug → EN /sermons/some-slug', () => {
      expect(getAlternateUrl('/zh/sermons/some-slug', 'zh')).toBe('/sermons/some-slug');
    });

    it('EN /ministries/youth → ZH /zh/ministries/youth', () => {
      expect(getAlternateUrl('/ministries/youth', 'en')).toBe('/zh/ministries/youth');
    });
  });
});
