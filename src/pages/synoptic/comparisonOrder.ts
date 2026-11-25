import { synoptic } from '../../content/synoptic';
import {
  synopticComparisonEntries,
  type SynopticComparisonEntry,
} from '../../pageCatalog';

export const comparisonSorts = [
  {
    value: 'gospel',
    label: 'Gospel order (Mark)',
    description:
      'The sequence follows Mark’s narrative. After the temptation, we include the Beatitudes and the Lord’s Prayer in their order in Matthew 5–6.',
  },
  {
    value: 'matthew',
    label: 'Matthew’s order',
    description:
      'Follow the passages from the beginning of Matthew to the end.',
  },
  {
    value: 'luke',
    label: 'Luke’s order',
    description: 'Follow the passages from the beginning of Luke to the end.',
  },
  {
    value: 'unread',
    label: 'Unread first',
    description:
      'Comparisons you haven’t opened appear first. Each group follows Gospel order.',
  },
  {
    value: 'title',
    label: 'Title (A–Z)',
    description: 'Titles are sorted by their first main word.',
  },
  {
    value: 'suggested',
    label: 'Suggested for beginners',
    description:
      'Begin with the storm story and the Lord’s Prayer, two short introductions to comparing the Gospels.',
  },
] as const;
type SortOrder = (typeof comparisonSorts)[number]['value'];
type Gospel = 'MAT' | 'MRK' | 'LUK';

function startIn(entry: SynopticComparisonEntry, book: Gospel) {
  return entry.passages.find((reference) => reference.book === book)?.start;
}

function byPassage(book: Gospel) {
  return (left: SynopticComparisonEntry, right: SynopticComparisonEntry) => {
    const a = startIn(left, book);
    const b = startIn(right, book);
    if (!a || !b) return Number(!a) - Number(!b);
    return a.chapter - b.chapter || a.verse - b.verse;
  };
}

const byMatthew = byPassage('MAT');
const byLuke = byPassage('LUK');
const markReadings = synopticComparisonEntries
  .filter((entry) => startIn(entry, 'MRK'))
  .sort(byPassage('MRK'));
const additionalReadings = synopticComparisonEntries
  .filter((entry) => !startIn(entry, 'MRK'))
  .sort((a, b) => byMatthew(a, b) || byLuke(a, b));

function insertedAfter(anchor: string | null) {
  return additionalReadings.filter(
    ({ id }) => synoptic.readingOrderAfter[id] === anchor,
  );
}

export const gospelReadingOrder = [
  ...insertedAfter(null),
  ...markReadings.flatMap((entry) => [entry, ...insertedAfter(entry.id)]),
];

function mainTitle(entry: SynopticComparisonEntry) {
  return entry.title.replace(/^(?:the|an?)\s+/i, '');
}

export function sortedComparisons(
  order: SortOrder,
  opened: ReadonlySet<string>,
) {
  switch (order) {
    case 'gospel':
      return gospelReadingOrder;
    case 'suggested':
      return synopticComparisonEntries;
    case 'matthew':
      return [...gospelReadingOrder].sort(byMatthew);
    case 'luke':
      return [...gospelReadingOrder].sort(byLuke);
    case 'unread':
      return [...gospelReadingOrder].sort(
        (a, b) => Number(opened.has(a.id)) - Number(opened.has(b.id)),
      );
    case 'title':
      return [...gospelReadingOrder].sort((a, b) =>
        mainTitle(a).localeCompare(mainTitle(b), 'en'),
      );
  }
}
