const { test, expect } = require('@playwright/test');

test.describe('English page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/');
  });

  test('is English, with Hebrew as x-default', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://noamba.lipu.dev/en/');
    await expect(page.locator('link[hreflang="he"]')).toHaveAttribute('href', 'https://noamba.lipu.dev/');
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', 'https://noamba.lipu.dev/en/');
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', 'https://noamba.lipu.dev/');
    await expect(page.locator('#shareButton')).toContainText('Copy');
  });

  test('keeps the editor right-to-left Hebrew and inserts the letters', async ({ page }) => {
    const editor = page.locator('#textDiv');
    await expect(editor).toHaveAttribute('dir', 'rtl');
    await expect(editor).toHaveCSS('direction', 'rtl');
    await editor.click();
    await page.keyboard.type('לומד');
    await page.locator('.char-button[data-char="׍"]').click();
    await expect(editor).toContainText('לומד׍');
  });

  test('links back to the Hebrew page, which links here', async ({ page }) => {
    await expect(page.locator('.footer-info a[hreflang="he"]')).toHaveAttribute('href', '/');
    await page.goto('/');
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', 'https://noamba.lipu.dev/en/');
    await expect(page.locator('.footer-info a[hreflang="en"]')).toHaveAttribute('href', '/en/');
    await expect(page.locator('#shareButton')).toContainText('העתיקו');
  });
});
