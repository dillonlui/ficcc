import { test, expect, type Page } from '@playwright/test';

function collectConsoleErrors(page: Page): string[] {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;

    const text = msg.text();
    // Vercel Analytics is served by Vercel in production, but `npx serve dist/client`
    // used by local e2e returns 404 for this script.
    if (text.includes('/_vercel/insights/script.js')) return;

    consoleErrors.push(text);
  });
  return consoleErrors;
}

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
    const consoleErrors = collectConsoleErrors(page);

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

test.describe('Splash language gateway', () => {
  test('shows the splash when no language preference is set', async ({ page, context }) => {
    await context.clearCookies();

    const response = await page.goto('/?chooselang', { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBe(200);
    await expect(page.getByRole('link', { name: 'Enter English site' })).toBeVisible();
    await expect(page.getByRole('link', { name: '进入中文网站' })).toBeVisible();
  });

  test('English splash choice sets lang-pref and enters /en/', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/?chooselang', { waitUntil: 'domcontentloaded' });

    await page.getByRole('link', { name: 'Enter English site' }).click();
    await expect(page).toHaveURL(/\/en\/$/);

    const cookies = await context.cookies();
    expect(cookies.find((cookie) => cookie.name === 'lang-pref')?.value).toBe('en');
  });

  test('Chinese splash choice sets lang-pref and enters /zh/', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/?chooselang', { waitUntil: 'domcontentloaded' });

    await page.getByRole('link', { name: '进入中文网站' }).click();
    await expect(page).toHaveURL(/\/zh\/$/);

    const cookies = await context.cookies();
    expect(cookies.find((cookie) => cookie.name === 'lang-pref')?.value).toBe('zh');
  });
});
