import { test, expect } from '@playwright/test';

/**
 * Bilingual tests — verify Chinese content loads correctly, language toggle
 * links work, and hreflang tags are present for SEO.
 *
 * Runs across all 4 viewport projects. Language toggle and hreflang are
 * structural, so they matter at every viewport.
 */

test.describe('Bilingual — Chinese pages', () => {
  test('/zh/ loads with Chinese content', async ({ page }) => {
    await page.goto('/zh/', { waitUntil: 'domcontentloaded' });

    // Page should contain Chinese characters in the body
    const bodyText = await page.locator('body').innerText();
    // Check for known Chinese text from navigation and church name
    expect(bodyText).toContain('首頁');
  });

  test('/zh/about/ loads with Chinese heading', async ({ page }) => {
    await page.goto('/zh/about/', { waitUntil: 'domcontentloaded' });

    const h1Text = await page.locator('h1').first().innerText();
    // The about page in Chinese should have a Chinese heading
    expect(h1Text).toMatch(/[\u4e00-\u9fff]/); // contains CJK characters
  });

  test('/zh/contact/ has WeChat section', async ({ page }) => {
    await page.goto('/zh/contact/', { waitUntil: 'domcontentloaded' });

    // WeChat section is unique to the Chinese contact page
    const wechatSection = page.locator('.wechat-section');
    await expect(wechatSection).toBeVisible();

    // Should contain the WeChat title
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('微信');
  });
});

test.describe('Bilingual — language toggle', () => {
  test('EN home has lang toggle pointing to /zh', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const langToggle = page.locator('.lang-toggle');
    await expect(langToggle).toBeVisible();

    const href = await langToggle.getAttribute('href');
    expect(href).toBe('/zh');
  });

  test('ZH home has lang toggle pointing to /', async ({ page }) => {
    await page.goto('/zh/', { waitUntil: 'domcontentloaded' });

    const langToggle = page.locator('.lang-toggle');
    await expect(langToggle).toBeVisible();

    const href = await langToggle.getAttribute('href');
    expect(href).toBe('/');
  });

  test('EN /about has lang toggle pointing to /zh/about', async ({ page }) => {
    await page.goto('/about/', { waitUntil: 'domcontentloaded' });

    const langToggle = page.locator('.lang-toggle');
    const href = await langToggle.getAttribute('href');
    expect(href).toBe('/zh/about');
  });

  test('ZH /zh/contact/ has lang toggle pointing to /contact', async ({ page }) => {
    await page.goto('/zh/contact/', { waitUntil: 'domcontentloaded' });

    const langToggle = page.locator('.lang-toggle');
    const href = await langToggle.getAttribute('href');
    expect(href).toBe('/contact');
  });
});

test.describe('Bilingual — hreflang tags', () => {
  test('EN home page has hreflang tags', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const enTag = page.locator('link[hreflang="en"]');
    const zhTag = page.locator('link[hreflang="zh"]');
    const defaultTag = page.locator('link[hreflang="x-default"]');

    await expect(enTag).toHaveCount(1);
    await expect(zhTag).toHaveCount(1);
    await expect(defaultTag).toHaveCount(1);
  });

  test('ZH home page has hreflang tags', async ({ page }) => {
    await page.goto('/zh/', { waitUntil: 'domcontentloaded' });

    const enTag = page.locator('link[hreflang="en"]');
    const zhTag = page.locator('link[hreflang="zh"]');

    await expect(enTag).toHaveCount(1);
    await expect(zhTag).toHaveCount(1);
  });

  test('hreflang en points to EN URL, zh points to ZH URL', async ({ page }) => {
    await page.goto('/about/', { waitUntil: 'domcontentloaded' });

    const enHref = await page.locator('link[hreflang="en"]').getAttribute('href');
    const zhHref = await page.locator('link[hreflang="zh"]').getAttribute('href');

    // EN hreflang should contain the EN canonical
    expect(enHref).toContain('/about');
    expect(enHref).not.toContain('/zh');

    // ZH hreflang should point to the ZH version
    expect(zhHref).toContain('/zh');
  });
});
