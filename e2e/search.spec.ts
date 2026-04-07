import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test('opens search modal, queries, shows results, and closes on Escape', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });

    // Search trigger button should be visible
    const trigger = page.locator('#search-trigger');
    await expect(trigger).toBeVisible();

    // Click search button to open modal
    await trigger.click();

    const modal = page.locator('#search-modal');
    await expect(modal).toHaveAttribute('aria-hidden', 'false');

    // Type a search query — Pagefind input appears inside the widget
    const searchInput = modal.locator('input[type="text"]');
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill('sermon');

    // Wait for results to appear (Pagefind renders them asynchronously)
    const results = modal.locator('.pagefind-ui__result');
    await expect(results.first()).toBeVisible({ timeout: 10000 });

    // Close modal with Escape
    await page.keyboard.press('Escape');
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
  });

  test('closes search modal on backdrop click', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });

    await page.locator('#search-trigger').click();
    const modal = page.locator('#search-modal');
    await expect(modal).toHaveAttribute('aria-hidden', 'false');

    // Click the backdrop (top-left corner, outside the panel)
    await page.locator('.search-backdrop').click({ position: { x: 10, y: 10 } });
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
  });

  test('close button dismisses modal', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });

    await page.locator('#search-trigger').click();
    const modal = page.locator('#search-modal');
    await expect(modal).toHaveAttribute('aria-hidden', 'false');

    await modal.locator('.search-close').click();
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
  });
});
