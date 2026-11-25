import '../src/content/pages';
import { library } from '../src/content/index';
import { synoptic } from '../src/content/synoptic';
import { pageCatalog, synopticComparisonEntries } from '../src/pageCatalog';
import { gospelReadingOrder } from '../src/pages/synoptic/comparisonOrder';
const orderedIds = new Set(gospelReadingOrder.map(({ id }) => id));
for (const { id } of synopticComparisonEntries) {
  if (!orderedIds.has(id))
    throw new Error(
      'Missing or invalid Gospel reading order placement for ' + id,
    );
}
for (const id of Object.keys(synoptic.readingOrderAfter)) {
  const entry = synopticComparisonEntries.find((reading) => reading.id === id);
  if (!entry || entry.passages.some(({ book }) => book === 'MRK'))
    throw new Error('Unexpected editorial Gospel order placement for ' + id);
}
const paths = new Set<string>(pageCatalog.map(({ path }) => path));
const links = synoptic.guides.flatMap((guide) => [
  ...guide.sections.flatMap((section) => section.links),
  ...(guide.readNext ? [guide.readNext] : []),
]);
for (const comparison of library.comparisons) {
  if (comparison.readNext) links.push(comparison.readNext);
}
for (const { path } of links) {
  if (!paths.has(path))
    throw new Error('Unknown Synoptic reading link: ' + path);
}

console.log(
  'Validated content:',
  library.modules.length,
  'modules,',
  library.comparisons.length,
  'comparisons,',
  synoptic.guides.length,
  'Synoptic guides,',
  library.sources.length,
  'sources.',
);
