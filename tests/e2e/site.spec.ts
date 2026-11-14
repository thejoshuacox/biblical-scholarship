import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('Pages link opens the directory, with custom thumbnails and logo fallbacks', async ({
  page,
}, info) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Understanding the Bible in context',
  );
  await page.screenshot({
    path: 'test-results/home-' + info.project.name + '.png',
    fullPage: true,
  });
  if (info.project.name === 'mobile')
    await page.getByRole('button', { name: 'Open menu' }).click();
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await nav.getByRole('link', { name: 'Pages', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pages');
  const directory = page.getByRole('main');
  const about = directory.getByRole('link', { name: 'About & Methods' });
  const torah = directory.getByRole('link', { name: 'Torah Sources' });
  await expect(about.locator('img')).toHaveAttribute(
    'src',
    '/images/open-books.jpg',
  );
  await expect(torah.locator('img')).toHaveAttribute('src', '/favicon.svg');
  await about.scrollIntoViewIfNeeded();
  await expect(about.locator('img')).toHaveJSProperty('complete', true);
  await expect
    .poll(() =>
      about
        .locator('img')
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  await torah.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Torah Sources',
  );
  await expect(page.getByText('Tool preview', { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test('Pages dropdown supports hover, keyboard dismissal, and touch', async ({
  page,
}, info) => {
  await page.goto('/');
  if (info.project.name === 'mobile')
    await page.getByRole('button', { name: 'Open menu' }).tap();
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const toggle = nav.getByRole('button', { name: 'Page links' });
  const first = nav.getByRole('link', { name: 'Jesus calms the storm' });
  const torah = nav.getByRole('link', { name: 'Torah Law Comparisons' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  if (info.project.name === 'mobile') {
    await toggle.tap();
  } else {
    await nav.getByRole('link', { name: 'Pages', exact: true }).hover();
    await torah.hover();
    await expect(torah).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(torah).toBeHidden();

    await toggle.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(first).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(first).toBeHidden();
    await page.keyboard.press('Space');
  }

  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await torah.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Torah Law Comparisons',
  );
  await expect(torah).toBeHidden();
});
test('theme follows the device until the reader chooses a mode', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const root = page.locator('html');
  await expect(root).toHaveCSS('color-scheme', 'dark');

  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(root).toHaveCSS('color-scheme', 'light');
  await page.reload();
  await expect(root).toHaveCSS('color-scheme', 'light');

  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(root).toHaveCSS('color-scheme', 'dark');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
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
    page.getByRole('heading', { name: 'Reading notes' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Show reading notes' }).click();
  await expect(
    page.getByRole('heading', { name: 'Reading notes' }),
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
  '/pages',
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
