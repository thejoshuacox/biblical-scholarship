import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('Library puts topics first and links a topic to its resources', async ({
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
  await nav.getByRole('link', { name: 'Library', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Library');
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { level: 2 })).toHaveText([
    'Topics',
    'Resources',
  ]);
  const topics = main.getByRole('region', { name: 'Topics' });
  const torah = topics.getByRole('link', { name: 'The Torah' });
  const synoptic = topics.getByRole('link', { name: 'The Synoptic Gospels' });
  const resources = main.getByRole('region', { name: 'Resources' });
  await expect(
    resources
      .getByRole('link', { name: 'Jesus calms the storm' })
      .locator('img'),
  ).toHaveAttribute('src', '/images/storm-cover.jpg');
  await expect(torah.locator('img')).toHaveAttribute('src', '/favicon.svg');
  await expect(synoptic.locator('img')).toHaveAttribute(
    'src',
    '/images/open-books.jpg',
  );
  await torah.click();
  await expect(main.getByRole('heading', { level: 1 })).toHaveText('The Torah');
  await expect(
    resources.getByRole('link', { name: 'Torah Law Comparisons' }),
  ).toBeVisible();
  await resources.getByRole('link', { name: 'Torah Sources' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Torah Sources',
  );
  await expect(page.getByText('Tool preview', { exact: true })).toBeVisible();
  await expect(main.getByRole('link', { name: 'The Torah' })).toHaveAttribute(
    'href',
    '/explore/torah',
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test('Library topic dropdown supports hover, keyboard dismissal, and touch', async ({
  page,
}, info) => {
  await page.goto('/');
  if (info.project.name === 'mobile')
    await page.getByRole('button', { name: 'Open menu' }).tap();
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const toggle = nav.getByRole('button', { name: 'Topic links' });
  const first = nav.getByRole('link', { name: 'The Synoptic Gospels' });
  const torah = nav.getByRole('link', { name: 'The Torah' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  if (info.project.name === 'mobile') {
    await toggle.tap();
  } else {
    await nav.getByRole('link', { name: 'Library', exact: true }).hover();
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
  await first.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'The Synoptic Gospels',
  );
  await expect(first).toBeHidden();
  await expect(
    page.getByRole('main').getByRole('link', { name: 'Jesus calms the storm' }),
  ).toHaveAttribute('href', '/compare/calming-the-storm');
});
test('Library search finds a listed passage and preserves old directory links', async ({
  page,
}) => {
  await page.goto('/pages?q=Mark+4%3A35');
  await expect(page).toHaveURL(/\/library\?q=/);
  const search = page.getByRole('searchbox', { name: 'Search the Library' });
  const main = page.getByRole('main');
  const results = page.getByRole('search').getByRole('status');
  await expect(search).toHaveValue('Mark 4:35');
  await expect(results).toHaveText('1 result');
  await expect(
    main.getByRole('link', { name: 'Jesus calms the storm' }),
  ).toBeVisible();
  await search.fill('about methods');
  await expect(
    main.getByRole('link', { name: 'About & Methods' }),
  ).toBeVisible();
  await search.fill('unmatched term');
  await expect(results).toHaveText('0 results');
  await page.getByRole('button', { name: 'Clear' }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue('');
  await expect(main.getByRole('region', { name: 'Topics' })).toBeVisible();
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
test('Synoptic overview leads with the definition and offers one featured study', async ({
  page,
}) => {
  await page.goto('/explore/synoptic');
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { level: 2 })).toHaveText([
    'What does “Synoptic” mean?',
    'Resources',
  ]);
  await expect(
    main.getByRole('link', { name: 'Jesus calms the storm' }),
  ).toHaveAttribute('href', '/compare/calming-the-storm');
  await expect(
    main.getByRole('link', { name: 'The Lord’s Prayer', exact: true }),
  ).toHaveCount(0);
  await main
    .getByRole('link', { name: 'What is the Synoptic Problem?' })
    .click();
  await expect(
    main.getByRole('heading', { name: 'The Two-Source hypothesis' }),
  ).toBeVisible();
  await expect(
    main.getByRole('heading', { name: 'The Farrer hypothesis' }),
  ).toBeVisible();
  await main
    .getByRole('link', { name: /John S. Kloppenborg, On Dispensing/ })
    .click();
  await expect(page).toHaveURL(/#source-kloppenborg-relation$/);
  await expect(main.locator('#source-kloppenborg-relation')).toBeVisible();
});

test('comparison collection opens a two-Gospel reading in either layout', async ({
  page,
}, info) => {
  await page.goto('/explore/synoptic');
  const main = page.getByRole('main');
  await main.getByRole('link', { name: 'Side-by-side comparisons' }).click();
  await expect(
    main.getByRole('link', { name: 'Jesus calms the storm' }),
  ).toBeVisible();
  await main.getByRole('link', { name: 'The Lord’s Prayer' }).click();
  await expect(
    main.getByRole('article', { name: 'Luke 11:1', exact: true }),
  ).toBeVisible({
    timeout: 30000,
  });
  await main
    .getByRole('button', { name: 'Whole passages', exact: true })
    .click();
  const matthew = main.getByRole('article', {
    name: 'Matthew 6:7–13',
    exact: true,
  });
  await expect(matthew).toBeVisible();
  await expect(
    main.getByRole('article', { name: 'Luke 11:1–4', exact: true }),
  ).toBeVisible();
  expect(
    await matthew.evaluate(
      (article) =>
        getComputedStyle(article.parentElement!).gridTemplateColumns.split(' ')
          .length,
    ),
  ).toBe(info.project.name === 'mobile' ? 1 : 2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await main
    .getByRole('navigation', { name: 'Breadcrumb' })
    .getByRole('link', { name: 'Side-by-side comparisons' })
    .click();
  await expect(main.getByRole('heading', { level: 1 })).toHaveText(
    'Side-by-side comparisons',
  );
});

for (const route of [
  '/',
  '/library',
  '/about',
  '/explore/torah',
  '/explore/torah-law',
  '/explore/synoptic',
  '/explore/synoptic/comparisons',
  '/explore/synoptic/how-to-compare',
  '/explore/synoptic/synoptic-problem',
  '/explore/synoptic/gospel-guide',
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
