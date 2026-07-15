import { test, expect } from '@playwright/test';

test.describe('keyboard and screen-reader interaction review', () => {
  test('skip link is first in the tab order and moves focus to main content', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('desktop disclosure navigation exposes its expanded state and submenu', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 768, 'Desktop navigation only');
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });

    const about = page.getByRole('button', { name: 'About' });
    await about.focus();

    await expect(about).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: 'Who We Are' })).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Who We Are' })).toBeFocused();
  });

  test('closed mobile navigation is absent from the accessibility and tab order', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 9999) >= 768, 'Mobile navigation only');
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });

    const nav = page.locator('#nav-menu');
    await expect(nav).toHaveAttribute('aria-hidden', 'true');
    await expect.poll(() => nav.evaluate((element) => (element as HTMLElement).inert)).toBe(true);
    await expect(page.locator('.nav-dropdown-trigger').first()).toHaveAttribute('tabindex', '-1');
  });

  test('mobile navigation opens by keyboard, skips label-only controls, and returns focus on Escape', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 9999) >= 768, 'Mobile navigation only');
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });

    const menuButton = page.locator('.hamburger');
    await expect(menuButton).toHaveAccessibleName('Open navigation menu');
    await menuButton.focus();
    await page.keyboard.press('Enter');

    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(menuButton).toHaveAttribute('aria-label', 'Close navigation menu');
    await expect(page.locator('#nav-menu')).not.toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('#nav-menu a').first()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('background video control works from the keyboard and exposes the next action', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });

    const pauseButton = page.getByRole('button', { name: 'Pause background video' });
    await pauseButton.focus();
    await page.keyboard.press('Space');

    await expect(page.getByRole('button', { name: 'Play background video' })).toBeFocused();
    await expect
      .poll(() => page.locator('.hero-home video').evaluate((video) => (video as HTMLVideoElement).paused))
      .toBe(true);
  });

  test('forms announce their privacy context and privacy pages are bilingual counterparts', async ({ page }) => {
    await page.goto('/en/contact/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.contact-form')).toHaveAttribute('aria-describedby', 'contact-privacy-note');
    await expect(page.locator('#contact-privacy-note')).toContainText('Cloudflare Turnstile');

    await page.getByRole('link', { name: 'Read our privacy notice' }).click();
    await expect(page).toHaveURL(/\/en\/privacy\/?$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Privacy notice' })).toBeVisible();
    await expect(page.locator('.lang-toggle')).toHaveAttribute('href', '/zh/privacy');
  });
});
