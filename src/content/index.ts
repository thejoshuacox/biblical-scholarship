import raw from './library.json';
import { validateLibrary } from './schema';
export const library = validateLibrary(raw);
const stormComparison = library.comparisons.find(
  (comparison) => comparison.id === 'calming-the-storm',
);
if (!stormComparison) throw new Error('Missing calming-the-storm comparison.');
export const storm = stormComparison;
