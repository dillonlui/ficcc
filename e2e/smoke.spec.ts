import { test, expect, type Page } from '@playwright/test';

/**
 * Critical pages to smoke-test across all viewports.
 * Each entry: [url, description].
 */
const CRITICAL_PAGES: [string, string][] = [
  ['/', 'Splash'],
  ['/en/', 'Home (English)'],
  ['/en/about/', 'About'],
  ['/en/sermons/', 'Sermons'],
  ['/en/contact/', 'Contact'],
  ['/en/visit/', 'Visit'],
  ['/en/give/', 'Give'],
  ['/zh/', 'Home (Chinese)'],
  ['/zh/contact/', 'Contact (Chinese)'],
  ['/zh/about/', 'About (Chinese)'],
];

for (const [url, label] of CRITICAL_PAGES) {
  test(`${label} (${url}) loads without errors`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Page returns 200
    expect(response?.status(), `${url} should return 200`).toBe(200);

    // Has an <h1> or <main> landmark
    const hasH1 = await page.locator('h1').count();
    const hasMain = await page.locator('main').count();
    expect(hasH1 + hasMain, `${url} should have <h1> or <main>`).toBeGreaterThan(0);

    // No JS console errors
    expect(consoleErrors, `${url} should have no console errors`).toEqual([]);
  });
}
