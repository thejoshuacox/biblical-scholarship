import raw from './library.json';
import { validateLibrary } from './schema';
export const library = validateLibrary(raw);
export const storm = library.comparisons[0];
