import { expect, test } from '@playwright/test';

const chooserName = 'Choose your next comparison';
const collectionLinkName = 'View all side-by-side comparisons';

test('the chooser suggests two readings and links to the full collection', async ({
  page,
}) => {
  await page.goto('/compare/calming-the-storm#next-comparisons');
  const main = page.getByRole('main');
  const chooser = main.getByRole('navigation', { name: chooserName });
  const cards = chooser.getByRole('list').getByRole('link');
  const collectionLink = chooser.getByRole('link', {
    name: collectionLinkName,
  });

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
  await expect(chooser.getByRole('link')).toHaveCount(3);
  await expect(collectionLink).toHaveAttribute(
    'href',
    '/explore/synoptic/comparisons',
  );
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
  await cards.last().focus();
  await page.keyboard.press('Tab');
  await expect(collectionLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/explore\/synoptic\/comparisons$/);
  await expect(main.getByRole('heading', { level: 1 })).toHaveText(
    'Side-by-side comparisons',
  );
  const comparisonCount = await main.locator('a[href^="/compare/"]').count();
  await expect(
    main.getByRole('link', { name: 'Jesus calms the storm' }),
  ).toHaveAccessibleDescription('');
  await main.getByRole('link', { name: 'The Lord’s Prayer' }).click();
  await expect(cards.first()).toHaveAccessibleName('The Beatitudes');
  for (let visited = 3; visited < comparisonCount; visited++) {
    const next = cards.first();
    await expect(next).not.toHaveAccessibleDescription(/Previously opened/);
    const title = await next.locator('[id^="next-title-"]').innerText();
    await next.click();
    await expect(main.getByRole('heading', { level: 1 })).toHaveText(title);
  }
  await expect(chooser).toContainText('You’ve opened every comparison');
  await expect(collectionLink).toBeVisible();
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
  await expect(
    chooser.getByRole('link', { name: 'The Beatitudes' }),
  ).toHaveCount(0);
  await chooser.getByRole('link', { name: collectionLinkName }).click();
  await expect(
    page.getByRole('main').getByRole('link', { name: 'The Beatitudes' }),
  ).toHaveAccessibleDescription('');
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
  await chooser.getByRole('link', { name: collectionLinkName }).click();
  const main = page.getByRole('main');
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
