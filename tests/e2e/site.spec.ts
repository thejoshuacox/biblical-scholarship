import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('homepage, navigation and mobile menu', async ({ page }, info) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Read closely.',
  );
  if (info.project.name === 'mobile')
    await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Torah sources' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Torah Sources',
  );
  await expect(page.getByText('MODULE PREVIEW', { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test('comparison loads real passages, switches layout and hides notes', async ({
  page,
}) => {
  await page.goto('/compare/calming-the-storm');
  await expect(
    page.getByRole('article', { name: 'Matthew 8:23', exact: true }),
  ).toBeVisible({ timeout: 30000 });
  await expect(
    page.getByText('After they had dismissed the crowd,', { exact: false }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Whole passages', exact: true })
    .click();
  await expect(
    page.getByRole('article', { name: 'Mark 4:35–41', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Hide reading notes' }).click();
  await expect(
    page.getByRole('heading', { name: 'Notice first. Then interpret.' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Show reading notes' }).click();
  await expect(
    page.getByRole('heading', { name: 'Notice first. Then interpret.' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
test('API failure shows explicit error and retry recovers', async ({
  page,
}) => {
  await page.route('https://bible.helloao.org/api/**', (route) =>
    route.fulfill({ status: 503, body: 'Unavailable' }),
  );
  await page.goto('/compare/calming-the-storm');
  await expect(page.getByRole('alert')).toContainText(
    'No other translation has been substituted',
  );
  await page.unroute('https://bible.helloao.org/api/**');
  await page.getByRole('button', { name: 'Retry loading passages' }).click();
  await expect(
    page.getByRole('article', { name: 'Mark 4:35–36', exact: true }),
  ).toBeVisible({ timeout: 30000 });
});
for (const route of [
  '/',
  '/about',
  '/explore/torah-law',
  '/explore/synoptic',
  '/explore/torah-sources',
  '/missing',
]) {
  test('route accessibility: ' + route, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
test('keyboard skip link and 320px reflow', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.setViewportSize({ width: 320, height: 720 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.goto('/compare/calming-the-storm', {
    waitUntil: 'domcontentloaded',
  });
  await expect(
    page.getByRole('article', { name: 'Matthew 8:23', exact: true }),
  ).toBeVisible({ timeout: 30000 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
