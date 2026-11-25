import { expect, test } from '@playwright/test';

const collection = '/explore/synoptic/comparisons';
const gospelOrder = [
  'baptism-of-jesus',
  'temptation-of-jesus',
  'beatitudes',
  'lords-prayer',
  'healing-a-paralyzed-man',
  'mustard-seed-and-yeast',
  'calming-the-storm',
  'death-of-john-the-baptist',
  'mocking-of-jesus',
  'women-at-the-empty-tomb',
];

test('the collection sorts all passages and remembers the selected view on return', async ({
  page,
}) => {
  await page.goto(collection);
  const main = page.getByRole('main');
  const sort = main.getByRole('combobox', { name: 'Sort comparisons' });
  const links = main.locator('a[href^="/compare/"]');
  const ids = () =>
    links.evaluateAll((items) =>
      items.map((item) => item.getAttribute('href')!.split('/').pop()),
    );
  await expect(links).toHaveCount(gospelOrder.length);
  expect(await ids()).toEqual(gospelOrder);

  await sort.selectOption('matthew');
  expect(await ids()).toEqual([
    'baptism-of-jesus',
    'temptation-of-jesus',
    'beatitudes',
    'lords-prayer',
    'calming-the-storm',
    'healing-a-paralyzed-man',
    'mustard-seed-and-yeast',
    'death-of-john-the-baptist',
    'mocking-of-jesus',
    'women-at-the-empty-tomb',
  ]);
  await sort.selectOption('luke');
  expect(await ids()).toEqual([
    'baptism-of-jesus',
    'temptation-of-jesus',
    'healing-a-paralyzed-man',
    'beatitudes',
    'calming-the-storm',
    'death-of-john-the-baptist',
    'lords-prayer',
    'mustard-seed-and-yeast',
    'mocking-of-jesus',
    'women-at-the-empty-tomb',
  ]);
  await sort.selectOption('title');
  expect(await ids()).toEqual([
    'baptism-of-jesus',
    'beatitudes',
    'death-of-john-the-baptist',
    'calming-the-storm',
    'healing-a-paralyzed-man',
    'temptation-of-jesus',
    'lords-prayer',
    'mocking-of-jesus',
    'mustard-seed-and-yeast',
    'women-at-the-empty-tomb',
  ]);
  await page.reload();
  await expect(sort).toHaveValue('title');
  await sort.selectOption('suggested');
  await expect(links.first()).toHaveAccessibleName('Jesus calms the storm');
  await sort.selectOption('unread');
  await links.first().click();
  await expect(main.getByRole('heading', { level: 1 })).toHaveText(
    'The baptism of Jesus',
  );
  await page.goBack();
  await expect(sort).toHaveValue('unread');
  await expect(links.last()).toHaveAccessibleName('The baptism of Jesus');
  expect(await ids()).toEqual([...gospelOrder.slice(1), gospelOrder[0]]);
  await sort.selectOption('gospel');
  await expect(page).toHaveURL(new RegExp(collection + '$'));
  expect(await ids()).toEqual(gospelOrder);
});

test('the top next link follows a single Gospel sequence through the final passage', async ({
  page,
}) => {
  await page.goto('/compare/' + gospelOrder[0]);
  const main = page.getByRole('main');
  const sequence = main.getByRole('navigation', {
    name: 'Gospel reading order',
  });
  await expect(sequence).toBeVisible({ timeout: 15000 });
  await page.route('https://bible.helloao.org/api/**', (route) =>
    route.abort(),
  );
  for (const [index, id] of gospelOrder.entries()) {
    await expect(page).toHaveURL(new RegExp('/compare/' + id + '$'));
    await expect(sequence).toContainText(
      'Comparison ' + (index + 1) + ' of ' + gospelOrder.length,
    );
    const next = sequence.getByRole('link');
    const expected = gospelOrder[index + 1];
    await expect(next).toHaveAttribute(
      'href',
      expected ? '/compare/' + expected : collection,
    );
    if (expected)
      await expect(next).toHaveAccessibleName(/^Next in Gospel order/);
    else
      await expect(next).toHaveAccessibleName(
        /End of Gospel order.*Browse all comparisons/,
      );
    if (index % 2 === 0) {
      await next.focus();
      await next.press('Enter');
    } else {
      await next.click();
    }
  }
  await expect(main.getByRole('heading', { level: 1 })).toHaveText(
    'Side-by-side comparisons',
  );
});

test('study deep links focus their section and scholarly citations open a separate tab', async ({
  page,
  context,
}) => {
  await page.goto('/explore/synoptic#hands-on-studies');
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { name: 'Hands-on studies' }),
  ).toBeFocused();
  const tools = main.getByRole('region', { name: 'Hands-on studies' });
  await tools
    .getByRole('link', { name: 'The Lord’s Prayer in two copies of Luke' })
    .click();
  const citation = main.getByRole('link', {
    name: /^Holger Strutwolf, Original Text/,
  });
  const details = main.getByRole('link', {
    name: /^Source details for Holger Strutwolf/,
  });
  await expect(citation).toHaveAttribute('target', '_blank');
  await expect(citation).toHaveAttribute('rel', /noopener/);
  const url = (await citation.getAttribute('href'))!;
  await context.route(url, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<title>Scholarly source</title>',
    }),
  );
  const opened = context.waitForEvent('page');
  await citation.click();
  const paper = await opened;
  await expect(paper).toHaveURL(url);
  expect(await paper.evaluate(() => window.opener === null)).toBe(true);
  await expect(page).toHaveURL(/\/lords-prayer-manuscripts$/);
  await paper.close();
  await details.click();
  await expect(page).toHaveURL(/#source-strutwolf-original-text$/);
  const bibliography = main
    .locator('#source-strutwolf-original-text')
    .getByRole('link');
  await expect(bibliography).toHaveAttribute('href', url);
  await expect(bibliography).toHaveAttribute('target', '_blank');
  const reading = main.getByRole('link', {
    name: 'Read Matthew’s prayer (BSB)',
  });
  await expect(reading).toHaveAttribute('target', '_blank');
  expect(context.pages()).toHaveLength(1);
});
