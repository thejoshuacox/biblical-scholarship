import '../src/content/pages';
import { library } from '../src/content/index';
import { synoptic } from '../src/content/synoptic';
import { pageCatalog } from '../src/pageCatalog';
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
