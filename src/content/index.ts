import raw from './library.json';
import { validateLibrary } from './schema';

export const library = validateLibrary(raw);

export function comparisonById(id: string) {
  const comparison = library.comparisons.find((entry) => entry.id === id);
  if (!comparison) throw new Error('Missing comparison: ' + id);
  return comparison;
}

export const storm = comparisonById('calming-the-storm');
export const lordsPrayer = comparisonById('lords-prayer');
