import { test, expect } from '@playwright/test';

/**
 * Responsive layout tests — viewport-aware assertions that check the
 * hamburger, desktop nav, overflow, and content containment at each breakpoint.
 *
 * These run across all 4 viewport projects (mobile/tablet/desktop/wide) from
 * playwright.config.ts. Assertions branch on the current viewport width.
 */

const PAGES_TO_CHECK = ['/', '/about/', '/sermons/'];

test.describe('Responsive layout', () => {
  for (const url of PAGES_TO_CHECK) {
    test(`${url} — no horizontal overflow`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow, `${url} should have no horizontal overflow`).toBe(false);
    });
  }

  test.describe('Mobile (≤767px)', () => {
    test.skip(({ page }) => {
      const vp = page.viewportSize();
      return !vp || vp.width > 767;
    }, 'Only runs on mobile viewport');

    test('hamburger button is visible', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const hamburger = page.locator('.hamburger');
      await expect(hamburger).toBeVisible();
    });

    test('nav panel starts closed (off-screen)', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      // The nav panel starts off-screen via translateX(100%) — not .is-open
      const nav = page.locator('#nav-menu');
      await expect(nav).not.toHaveClass(/is-open/);
      // Hamburger starts collapsed
      const hamburger = page.locator('.hamburger');
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    });

    test('hamburger toggles mobile nav', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const hamburger = page.locator('.hamburger');
      const nav = page.locator('#nav-menu');

      // Open
      await hamburger.click();
      await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
      await expect(nav).toHaveClass(/is-open/);

      // Close
      await hamburger.click();
      await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
      await expect(nav).not.toHaveClass(/is-open/);
    });
  });

  test.describe('Tablet (768px)', () => {
    test.skip(({ page }) => {
      const vp = page.viewportSize();
      return !vp || vp.width !== 768;
    }, 'Only runs on tablet viewport');

    test('layout adapts at 768px breakpoint', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      // At exactly 768px, the breakpoint is max-width:767px so desktop nav shows
      const hamburger = page.locator('.hamburger');
      await expect(hamburger).not.toBeVisible();

      const navLinks = page.locator('.nav-link').first();
      await expect(navLinks).toBeVisible();
    });
  });

  test.describe('Desktop (≥1280px)', () => {
    test.skip(({ page }) => {
      const vp = page.viewportSize();
      return !vp || vp.width < 1280;
    }, 'Only runs on desktop+ viewports');

    test('desktop nav links visible, hamburger hidden', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      const hamburger = page.locator('.hamburger');
      await expect(hamburger).not.toBeVisible();

      const navLinks = page.locator('.nav-link').first();
      await expect(navLinks).toBeVisible();
    });
  });

  test.describe('Wide (1920px)', () => {
    test.skip(({ page }) => {
      const vp = page.viewportSize();
      return !vp || vp.width !== 1920;
    }, 'Only runs on wide viewport');

    test('page content is contained within max-width', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      // --max-width is 72rem = 1152px at default 16px font-size
      // The header-inner and main content areas should not exceed this
      const headerWidth = await page.evaluate(() => {
        const el = document.querySelector('.header-inner');
        return el ? el.getBoundingClientRect().width : 0;
      });
      // header-inner has max-width: var(--max-width) ≈ 1152px
      expect(headerWidth).toBeLessThanOrEqual(1200); // small tolerance for padding
    });

    test('no horizontal overflow on wide viewport', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow).toBe(false);
    });
  });
});
