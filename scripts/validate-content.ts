import '../src/content/pages';
import { library } from '../src/content/index';
import { synoptic } from '../src/content/synoptic';
import { pageCatalog } from '../src/pageCatalog';
const paths = new Set<string>(pageCatalog.map(({ path }) => path));
for (const guide of synoptic.guides) {
  const links = guide.sections.flatMap(({ links }) => links);
  if (guide.readNext) links.push(guide.readNext);
  for (const { path } of links) {
    if (!paths.has(path))
      throw new Error('Unknown Synoptic guide route: ' + path);
  }
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
