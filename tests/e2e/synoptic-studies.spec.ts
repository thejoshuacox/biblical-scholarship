import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('the featured parables activity lets a reader compare both explanations after reading', async ({
  page,
}) => {
  await page.goto('/explore/synoptic');
  const main = page.getByRole('main');
  await main
    .getByRole('link', { name: 'The mustard seed and the yeast' })
    .click();
  await expect(
    main.getByRole('article', { name: 'Matthew 13:33', exact: true }),
  ).toBeVisible({ timeout: 30000 });
  await expect(
    main.getByText('No parallel assigned in this reading group.', {
      exact: true,
    }),
  ).toHaveCount(1);
  const question = main.getByRole('group', {
    name: /Which Gospels place the yeast/,
  });
  await question.getByRole('radio', { name: 'All three' }).check();
  await expect(question.getByRole('status')).toContainText(
    'The mustard seed appears in all three',
  );
  await question.getByRole('radio', { name: 'Matthew and Luke' }).check();
  await expect(question.getByRole('status')).toContainText('Matthew 13:33');
  const panels = main
    .locator('details')
    .filter({ has: page.locator('summary', { hasText: /hypothesis|Crook/ }) });
  await expect(panels).toHaveCount(3);
  await expect(panels.locator('p:visible')).toHaveCount(0);
  for (const panel of await panels.all()) {
    await panel.locator('summary').press('Enter');
    await expect(panel).toHaveAttribute('open', '');
  }
  await expect(main.getByText(/Luke could keep them together/)).toBeVisible();
  await expect(main.getByText(/If Q paired the seed/)).toBeVisible();
  await expect(
    main.getByRole('link', { name: /^Zeba Antonin Crook,/ }).first(),
  ).toHaveAttribute('href', 'https://doi.org/10.1177/0142064X0002207802');
  await main.getByRole('link', { name: 'Return to the passages' }).click();
  await expect(
    main.getByRole('button', { name: 'Aligned groups' }),
  ).toBeFocused();
  await main.getByRole('button', { name: 'Hide reading notes' }).click();
  await expect(question).toBeHidden();
  await main.getByRole('button', { name: 'Show reading notes' }).click();
  await expect(
    question.getByRole('radio', { name: 'Matthew and Luke' }),
  ).toBeChecked();
  await expect(panels.locator('summary:visible')).toHaveCount(3);
  await expect(main.getByText(/If Q paired the seed/)).toBeVisible();
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
  await main.getByRole('button', { name: 'Whole passages' }).click();
  await expect(
    main.getByRole('article', { name: 'Mark 4:30–32', exact: true }),
  ).toBeVisible();
});

test('the source exercise distinguishes shared writing from the direction of borrowing', async ({
  page,
}) => {
  await page.goto('/compare/healing-a-paralyzed-man');
  const main = page.getByRole('main');
  await main
    .getByRole('link', { name: 'Read next How can you tell who used whom?' })
    .click();
  const matthew = main.getByRole('group', { name: 'Matthew 9:6', exact: true });
  await matthew.getByRole('radio').first().check();
  await expect(matthew.getByRole('status')).toContainText(
    'Jesus is still speaking',
  );
  await matthew
    .getByRole('radio', { name: 'Then He said to the paralytic' })
    .check();
  await expect(matthew.getByRole('status')).toContainText('storyteller');
  for (const ref of ['Mark 2:10–11', 'Luke 5:24']) {
    const group = main.getByRole('group', { name: ref, exact: true });
    await expect(group.getByRole('radio', { checked: true })).toHaveCount(0);
    await group
      .getByRole('radio', { name: 'He said to the paralytic' })
      .check();
  }
  await main
    .locator('summary', { hasText: 'Compare the Greek wording' })
    .press('Enter');
  await expect(main.locator('[lang="grc"]:visible')).toHaveCount(3);
  const herod = main.getByRole('group', { name: /Which writer changes Herod/ });
  await herod.getByRole('radio', { name: 'Matthew' }).check();
  await expect(herod.getByRole('status')).toContainText('tetrarch');
  await expect(
    main.getByRole('link', { name: /Read next The mustard seed/ }),
  ).toHaveAttribute('href', '/compare/mustard-seed-and-yeast');
});

test('the story map traces the same selection through each Gospel in its own order', async ({
  page,
}) => {
  await page.goto('/explore/synoptic/gospel-guide');
  const main = page.getByRole('main');
  await main
    .getByRole('link', { name: /Read next Where does the story/ })
    .click();
  const matthew = main.getByRole('list', { name: 'Matthew story order' });
  const luke = main.getByRole('list', { name: 'Luke story order' });
  await expect(matthew.getByRole('button').last()).toHaveAccessibleName(
    'The hometown synagogue, Matthew 13:53–58',
  );
  await expect(luke.getByRole('button').nth(1)).toHaveAccessibleName(
    'The hometown synagogue, Luke 4:16–30',
  );
  await luke.getByRole('button', { name: /The paralyzed man/ }).press('Enter');
  await expect(
    main.getByRole('button', { name: /The paralyzed man/, pressed: true }),
  ).toHaveCount(3);
  await expect(
    main.getByRole('button', { name: /hometown synagogue/, pressed: true }),
  ).toHaveCount(0);
  await expect(
    main.getByRole('list', { name: 'Read this scene' }).getByRole('link'),
  ).toHaveText(['Matthew 9:1–8', 'Mark 2:1–12', 'Luke 5:17–26']);
  await page.setViewportSize({ width: 320, height: 740 });
  await expect(
    main.getByRole('button', { name: /Jesus is baptized, Mark/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('the primer includes Matthew using Luke and leads to a minor agreement with competing readings', async ({
  page,
}) => {
  await page.goto('/explore/synoptic/synoptic-problem');
  const main = page.getByRole('main');
  await expect(
    main.getByText(/On the proposal called Matthean posteriority/),
  ).toBeVisible();
  await expect(
    main.locator('a[href="#source-macewen-matthean-posteriority"]'),
  ).toBeVisible();
  await main
    .getByRole('link', { name: 'Compare the mocking of Jesus' })
    .click();
  await expect(
    main.getByRole('article', { name: 'Mark 14:65', exact: true }),
  ).toBeVisible({ timeout: 30000 });
  await main
    .locator('summary', { hasText: 'Read the Greek question' })
    .press('Enter');
  await expect(main.locator('[lang="grc"]')).toHaveText(
    'τίς ἐστιν ὁ παίσας σε;',
  );
  await expect(
    main.locator('a[href="#source-farrer-dispensing-with-q"]'),
  ).toBeVisible();
  await main.locator('a[href="#source-streeter-minor-agreements"]').click();
  await expect(page).toHaveURL(/#source-streeter-minor-agreements$/);
});

test('the prayer study distinguishes manuscript readings, composition, and worship', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/compare/lords-prayer');
  const main = page.getByRole('main');
  await main
    .getByRole('link', {
      name: 'Read next The Lord’s Prayer in two copies of Luke',
    })
    .click();
  const copies = main.getByRole('group', { name: 'Choose a copy of Luke' });
  await expect(copies.getByRole('radio', { name: 'Papyrus 75' })).toBeChecked();
  await expect(main.locator('[lang="grc"]')).toHaveText('Πάτερ');
  await copies.getByRole('radio', { name: 'Papyrus 75' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(
    copies.getByRole('radio', { name: 'Codex Alexandrinus' }),
  ).toBeChecked();
  await expect(main.locator('[lang="grc"]')).toHaveText(
    'Πάτερ ἡμῶν ὁ ἐν τοῖς οὐρανοῖς',
  );
  await expect(
    main.getByRole('heading', { name: 'Matthew 6:9' }),
  ).toBeVisible();
  const evidence = main.getByRole('group', { name: /Which evidence/ });
  await evidence
    .getByRole('radio', { name: /Instructions for prayer/ })
    .check();
  await expect(evidence.getByRole('status')).toContainText('Didache');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await copies.getByRole('radio', { name: 'Papyrus 75' }).check();
  await expect(main.locator('[lang="grc"]')).toHaveText('Πάτερ');
});
