import { HelloAoProvider } from '../src/bible/helloao';
import { storm } from '../src/content';
import { formatReference } from '../src/content/schema';
const provider = new HelloAoProvider();
for (const column of storm.columns) {
  const passage = await provider.getPassage(column.reference);
  console.log(
    formatReference(column.reference),
    passage.translation.id,
    passage.verses.length,
    'verses; verified live',
  );
}
const cross = await provider.getPassage({
  book: 'MRK',
  bookName: 'Mark',
  start: { chapter: 4, verse: 41 },
  end: { chapter: 5, verse: 2 },
});
if (cross.verses.length !== 3) throw new Error('Cross-chapter check failed');
console.log('Mark 4:41–5:2: verified live cross-chapter range');
