import '../src/content/pages';
import { library } from '../src/content/index';
console.log(
  'Validated content:',
  library.modules.length,
  'modules,',
  library.comparisons.length,
  'comparison,',
  library.sources.length,
  'sources.',
);
