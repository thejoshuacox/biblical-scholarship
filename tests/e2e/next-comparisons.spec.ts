import { expect, test } from '@playwright/test';

const chooserName = 'Choose your next comparison';

test('readers can choose any other comparison, with unopened and related passages first', async ({
  page,
}) => {
  await page.goto('/explore/synoptic/comparisons');
  const main = page.getByRole('main');
  const collectionLinks = main.locator('a[href^="/compare/"]');
  await expect(collectionLinks.first()).toBeVisible();
  const comparisonCount = await collectionLinks.count();

  await page.goto('/compare/calming-the-storm#next-comparisons');
  const chooser = main.getByRole('navigation', { name: chooserName });
  const cards = chooser.getByRole('link');

  await expect(
    chooser.getByRole('heading', { name: chooserName }),
  ).toBeInViewport();
  await expect(main.getByRole('heading', { level: 2 }).last()).toHaveText(
    chooserName,
  );
  await expect(
    main.getByRole('link', { name: 'How to read a Gospel comparison' }),
  ).toHaveAttribute('href', '/explore/synoptic/how-to-compare');
  await expect(cards).toHaveCount(2);
  await expect(cards.first()).toHaveAccessibleName(
    'Jesus heals a paralyzed man',
  );
  await expect(cards.nth(1)).toHaveAccessibleName('The baptism of Jesus');

  await cards.first().focus();
  await page.keyboard.press('Enter');
  await expect(main.getByRole('heading', { level: 1 })).toHaveText(
    'Jesus heals a paralyzed man',
  );
  await page.reload();
  await expect(cards.first()).toHaveAccessibleName('The baptism of Jesus');
  await chooser.locator('summary').focus();
  await page.keyboard.press('Space');
  await expect(cards).toHaveCount(comparisonCount - 1);
  await expect(
    chooser.getByRole('link', { name: 'Jesus heals a paralyzed man' }),
  ).toHaveCount(0);
  await expect(cards.last()).toHaveAccessibleName('Jesus calms the storm');
  await expect(cards.last()).toHaveAccessibleDescription(/Previously opened/);

  await chooser.getByRole('link', { name: 'The Lord’s Prayer' }).click();
  await expect(cards.first()).toHaveAccessibleName('The Beatitudes');
  for (let visited = 3; visited < comparisonCount; visited++) {
    const next = cards.first();
    await expect(next).not.toHaveAccessibleDescription(/Previously opened/);
    const title = await next.locator('[id^="next-title-"]').innerText();
    await next.click();
    await expect(main.getByRole('heading', { level: 1 })).toHaveText(title);
  }
  await expect(chooser).toContainText('You’ve opened every comparison');
  await chooser.locator('summary').click();
  for (const card of await cards.all()) {
    await expect(card).toHaveAccessibleDescription(/Previously opened/);
  }
});

test('a comparison opened in another tab is recognized by the chooser', async ({
  page,
  context,
}) => {
  await page.goto('/compare/lords-prayer');
  const chooser = page.getByRole('navigation', { name: chooserName });
  await expect(chooser.getByRole('link').first()).toHaveAccessibleName(
    'The Beatitudes',
  );
  const otherTab = await context.newPage();
  await otherTab.goto('/compare/beatitudes');
  await expect(chooser.getByRole('link').first()).toHaveAccessibleName(
    'The baptism of Jesus',
  );
  await chooser.locator('summary').click();
  await expect(
    chooser.getByRole('link', { name: 'The Beatitudes' }),
  ).toHaveAccessibleDescription(/Previously opened/);
});

test('comparison choices work for the visit when browser storage is blocked', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage is blocked', 'SecurityError');
      },
    });
  });
  await page.goto('/compare/lords-prayer');
  const chooser = page.getByRole('navigation', { name: chooserName });
  await chooser.getByRole('link', { name: 'The Beatitudes' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'The Beatitudes',
  );
  await chooser.locator('summary').click();
  await expect(
    chooser.getByRole('link', { name: 'The Lord’s Prayer' }),
  ).toHaveAccessibleDescription(/Previously opened/);
  const main = page.getByRole('main');
  await main
    .getByRole('navigation', { name: 'Breadcrumb' })
    .getByRole('link', { name: 'Side-by-side comparisons' })
    .click();
  await expect(main.getByRole('heading', { level: 1 })).toHaveText(
    'Side-by-side comparisons',
  );
  const collectionSize = await main.locator('a[href^="/compare/"]').count();
  await expect(main.getByText('Unread', { exact: true })).toHaveCount(
    collectionSize - 2,
  );
  await expect(
    main.getByRole('link', { name: 'The Lord’s Prayer' }),
  ).toHaveAccessibleDescription('');
  await expect(
    main.getByRole('link', { name: 'Jesus calms the storm' }),
  ).toHaveAccessibleDescription('Unread');
});

test('the collection labels unread comparisons until they are opened in this browser', async ({
  page,
  context,
}) => {
  await page.goto('/explore/synoptic/comparisons');
  const main = page.getByRole('main');
  const links = main.locator('a[href^="/compare/"]');
  const tags = main.getByText('Unread', { exact: true });
  const john = main.getByRole('link', {
    name: 'The death of John the Baptist',
    exact: true,
  });
  const tomb = main.getByRole('link', {
    name: 'The women at the empty tomb',
    exact: true,
  });

  await expect(john).toHaveAccessibleDescription('Unread');
  const catalogOrder = await links.allTextContents();
  await expect(tags).toHaveCount(catalogOrder.length);
  await john.click();
  await expect(
    main.getByRole('article', { name: 'Luke 9:7–9', exact: true }),
  ).toBeVisible({ timeout: 30000 });
  await expect(
    main.getByText('No parallel assigned in this reading group.', {
      exact: true,
    }),
  ).toHaveCount(3);
  await page.goBack();
  await expect(john).toHaveAccessibleDescription('');
  await expect(tags).toHaveCount(catalogOrder.length - 1);

  await page.reload();
  await expect(john).toHaveAccessibleDescription('');
  await expect(tomb).toHaveAccessibleDescription('Unread');
  const otherTab = await context.newPage();
  await otherTab.goto('/compare/women-at-the-empty-tomb');
  await expect(tomb).toHaveAccessibleDescription('');
  await expect(tags).toHaveCount(catalogOrder.length - 2);
  await expect(links).toHaveText(catalogOrder);
});
