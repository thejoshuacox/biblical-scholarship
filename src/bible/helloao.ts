import { z } from 'zod';
import { referenceSchema, type PassageReference } from '../content/schema';
import type { BibleProvider, Inline, Passage, Verse } from './types';
const inline = z.union([
  z.string(),
  z.object({
    text: z.string(),
    poem: z.number().optional(),
    wordsOfJesus: z.boolean().optional(),
  }),
  z.object({ lineBreak: z.literal(true) }),
  z.object({ heading: z.string() }),
  z.object({ noteId: z.number() }),
]);
const chapterSchema = z.object({
  translation: z.object({ id: z.string(), name: z.string() }),
  book: z.object({ id: z.string() }),
  chapter: z.object({
    number: z.number().int(),
    content: z.array(
      z.discriminatedUnion('type', [
        z.object({
          type: z.literal('verse'),
          number: z.number().int(),
          content: z.array(inline),
        }),
        z.object({ type: z.literal('heading'), content: z.array(z.string()) }),
        z.object({ type: z.literal('line_break') }),
        z.object({
          type: z.literal('hebrew_subtitle'),
          content: z.array(inline),
        }),
      ]),
    ),
    footnotes: z.array(z.object({ noteId: z.number(), text: z.string() })),
  }),
});
type Chapter = z.infer<typeof chapterSchema>;
export function normalizeChapter(data: Chapter): Verse[] {
  const notes = new Map(data.chapter.footnotes.map((n) => [n.noteId, n.text]));
  const normalize = (parts: z.infer<typeof inline>[]): Inline[] =>
    parts.map((p) => {
      if (typeof p === 'string') return { kind: 'text', text: p };
      if ('text' in p) return { kind: 'text', ...p };
      if ('lineBreak' in p) return { kind: 'break' };
      if ('heading' in p) return { kind: 'heading', text: p.heading };
      const text = notes.get(p.noteId);
      if (!text)
        throw new Error('A translator note is missing from the API response.');
      return { kind: 'note', id: p.noteId, text };
    });
  let paragraphStart = true,
    headings: string[] = [],
    subtitle: Inline[] = [];
  const verses: Verse[] = [];
  for (const item of data.chapter.content) {
    if (item.type === 'heading') headings.push(item.content.join(' '));
    else if (item.type === 'hebrew_subtitle')
      subtitle.push(...normalize(item.content));
    else if (item.type === 'line_break') paragraphStart = true;
    else {
      verses.push({
        chapter: data.chapter.number,
        number: item.number,
        content: normalize(item.content),
        paragraphStart,
        headings,
        subtitle,
      });
      paragraphStart = false;
      headings = [];
      subtitle = [];
    }
  }
  return verses;
}
export class HelloAoProvider implements BibleProvider {
  private cache = new Map<
    string,
    { expires: number; promise: Promise<Verse[]> }
  >();
  constructor(
    private fetcher: typeof fetch = (...args) => fetch(...args),
    private ttl = 30 * 60 * 1000,
    private timeoutMs = 12000,
  ) {}
  clearCache() {
    this.cache.clear();
  }
  private chapter(book: string, chapter: number): Promise<Verse[]> {
    const key = book + '/' + chapter;
    const existing = this.cache.get(key);
    if (existing && existing.expires > Date.now()) return existing.promise;
    const promise = Promise.resolve().then(async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await this.fetcher(
          'https://bible.helloao.org/api/BSB/' + key + '.json',
          { signal: controller.signal },
        );
        if (!response.ok)
          throw new Error(
            'The BSB text service returned HTTP ' + response.status + '.',
          );
        const data = chapterSchema.parse(await response.json());
        if (
          data.translation.id !== 'BSB' ||
          data.book.id !== book ||
          data.chapter.number !== chapter
        )
          throw new Error(
            'The text service returned a different passage or translation.',
          );
        return normalizeChapter(data);
      } catch (error) {
        this.cache.delete(key);
        if (error instanceof z.ZodError)
          throw new Error(
            'The BSB text service returned an unexpected format.',
          );
        if (controller.signal.aborted)
          throw new Error('The BSB text service took too long to respond.');
        throw error;
      } finally {
        clearTimeout(timer);
      }
    });
    this.cache.set(key, { expires: Date.now() + this.ttl, promise });
    if (this.cache.size > 100)
      this.cache.delete(this.cache.keys().next().value!);
    return promise;
  }
  async getPassage(
    input: PassageReference,
    translation = 'BSB',
  ): Promise<Passage> {
    const reference = referenceSchema.parse(input);
    if (translation !== 'BSB')
      throw new Error(
        'This provider currently supports BSB only. No translation was substituted.',
      );
    const verses: Verse[] = [];
    // Bounded batches avoid issuing a whole book of requests at once.
    for (
      let first = reference.start.chapter;
      first <= reference.end.chapter;
      first += 4
    ) {
      const chapters = await Promise.all(
        Array.from(
          { length: Math.min(4, reference.end.chapter - first + 1) },
          (_, i) => this.chapter(reference.book, first + i),
        ),
      );
      chapters.forEach((items, i) => {
        const chapter = first + i,
          start =
            chapter === reference.start.chapter
              ? reference.start.verse
              : items[0]?.number;
        const end =
          chapter === reference.end.chapter
            ? reference.end.verse
            : items.at(-1)?.number;
        if (
          !start ||
          !end ||
          !items.some((v) => v.number === start) ||
          !items.some((v) => v.number === end)
        )
          throw new Error('The requested verse range is not present in BSB.');
        verses.push(
          ...items.filter((v) => v.number >= start && v.number <= end),
        );
      });
    }
    return {
      reference,
      translation: {
        id: 'BSB',
        name: 'Berean Standard Bible',
        attribution:
          'Berean Standard Bible (BSB). Public domain. Text supplied by AO Lab’s Free Use Bible API.',
        url: 'https://berean.bible/licensing.htm',
      },
      verses,
    };
  }
}
export const bible: BibleProvider = new HelloAoProvider();
