const { test, expect } = require('@playwright/test');

// The editor (#textDiv) is sized from its width: at least width/4 tall, at most
// width*4/3. Text is typed key by key, as a person would: the height limit is
// enforced on keydown and input, which a single bulk insert would skip.
const SEL = '#textDiv';
const MOBILE = { width: 375, height: 667 };

const rect = (page) => page.locator(SEL).evaluate((el) => {
  const r = el.getBoundingClientRect();
  return { width: r.width, height: r.height };
});

async function expectHeightWithinBounds(page) {
  await page.locator(SEL).evaluate((el) => { el.textContent = ''; });
  await page.waitForTimeout(300);
  await expect(page.locator(SEL)).toBeVisible();
  const r = await rect(page);
  expect(r.width).toBeGreaterThan(0);
  expect(r.height).toBeGreaterThanOrEqual(r.width / 4 - 2);
  expect(r.height).toBeLessThanOrEqual((4 / 3) * r.width + 2);
}

async function typeInEditor(page, text) {
  await page.locator(SEL).click();
  await page.keyboard.type(text);
}

test.describe('Textarea sizing and behavior (width-based)', () => {
  // Typing thousands of characters one key at a time takes a while.
  test.describe.configure({ timeout: 120_000 });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('initial height clamps between width/4 and width*4/3', async ({ page }) => {
    await expectHeightWithinBounds(page);
  });

  test('respects width/4..width*4/3 on mobile too', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');
    await expectHeightWithinBounds(page);
  });

  test('grows with text but never exceeds width*4/3', async ({ page }) => {
    await typeInEditor(page, 'x '.repeat(4000));
    const r = await rect(page);
    expect(r.height).toBeGreaterThan(0);
    expect(r.height).toBeLessThanOrEqual((4 / 3) * r.width + 20);
  });

  test('prevents typing when beyond width*4/3 height', async ({ page }) => {
    await typeInEditor(page, 'y '.repeat(6000));
    const before = await page.locator(SEL).textContent();
    await page.keyboard.type('more more more');
    const after = await page.locator(SEL).textContent();
    expect(after.length).toBeLessThanOrEqual(before.length + 5);
  });

  test('never shows a vertical scrollbar', async ({ page }) => {
    await typeInEditor(page, 'z '.repeat(4000));
    await expect(page.locator(SEL)).toHaveCSS('overflow-y', 'hidden');
  });

  test('shows Copy button on both desktop and mobile', async ({ page }) => {
    await expect(page.locator('#shareButton')).toContainText('העתיקו');
    await page.setViewportSize(MOBILE);
    await page.goto('/');
    await expect(page.locator('#shareButton')).toContainText('העתיקו');
  });
});
