import { test, expect, type Page } from '@playwright/test';

async function provideTurnstileToken(page: Page, formSelector: string) {
  await page.locator(formSelector).evaluate((form) => {
    const token = document.createElement('input');
    token.type = 'hidden';
    token.name = 'cf-turnstile-response';
    token.value = 'test-token';
    form.append(token);
  });
}

test.describe('active forms', () => {
  test('English contact validates fields and moves focus to the first error', async ({ page }) => {
    await page.goto('/en/contact/', { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page.locator('#contact-name-error')).toHaveText('Name is required (min 2 characters)');
    await expect(page.locator('#contact-email-error')).toHaveText('A valid email address is required');
    await expect(page.locator('#contact-message-error')).toHaveText('Message is required (min 10 characters)');
    await expect(page.locator('#contact-name')).toBeFocused();
    await expect(page.locator('#contact-name')).toHaveAttribute('aria-invalid', 'true');
  });

  test('Chinese contact confirms successful delivery in Chinese', async ({ page }) => {
    await page.goto('/zh/contact/', { waitUntil: 'domcontentloaded' });
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'ignored because the Chinese UI is localized' }),
      });
    });

    await page.locator('#zh-contact-name').fill('測試使用者');
    await page.locator('#zh-contact-email').fill('test@example.com');
    await page.locator('#zh-contact-message').fill('這是一則用於驗證表單流程的測試訊息。');
    await provideTurnstileToken(page, '.zh-contact-form');
    await page.getByRole('button', { name: '發送' }).click();

    await expect(page.getByRole('status')).toHaveText('感謝您的訊息！我們會盡快回覆您。');
    await expect(page.locator('#zh-contact-name')).toHaveValue('');
  });

  test('English ride request confirms successful delivery', async ({ page }) => {
    await page.goto('/en/visit/', { waitUntil: 'domcontentloaded' });
    await page.route('**/api/ride-request', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Your ride request has been submitted! We’ll be in touch soon.' }),
      });
    });

    await page.locator('#ride-name').fill('Test Visitor');
    await page.locator('#ride-email').fill('test@example.com');
    await page.locator('#ride-pickup').fill('Test campus address');
    await provideTurnstileToken(page, '.ride-form');
    await page.getByRole('button', { name: 'Request a Ride' }).click();

    await expect(page.getByRole('status')).toHaveText('Your ride request has been submitted! We’ll be in touch soon.');
    await expect(page.locator('#ride-name')).toHaveValue('');
  });

  test('Chinese ride request reports an unavailable service and keeps its localized action', async ({ page }) => {
    await page.goto('/zh/sundays/', { waitUntil: 'domcontentloaded' });
    await page.route('**/api/ride-request', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'This form is temporarily unavailable. Please try again later.' }),
      });
    });

    await page.locator('#ride-name').fill('測試使用者');
    await page.locator('#ride-email').fill('test@example.com');
    await page.locator('#ride-pickup').fill('測試接送地點');
    await provideTurnstileToken(page, '.ride-form');
    await page.getByRole('button', { name: '申請接送' }).click();

    await expect(page.getByRole('alert')).toHaveText('表單目前暫時無法使用，請稍後再試。');
    await expect(page.getByRole('button', { name: '申請接送' })).toBeEnabled();
  });
});
