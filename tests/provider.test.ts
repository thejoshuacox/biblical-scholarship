import { describe, it, expect, vi } from 'vitest';
import { HelloAoProvider } from '../src/bible/helloao';
import { referenceSchema, validateLibrary } from '../src/content/schema';
import raw from '../src/content/library.json';
const ref = (a = 1, b = 2, endChapter = 1) => ({
  book: 'GEN',
  bookName: 'Genesis',
  start: { chapter: 1, verse: a },
  end: { chapter: endChapter, verse: b },
});
const fixture = (chapter = 1, translation = 'BSB') => ({
  translation: { id: translation, name: 'Berean Standard Bible' },
  book: { id: 'GEN' },
  chapter: {
    number: chapter,
    content: [
      { type: 'heading', content: ['A translation heading'] },
      { type: 'hebrew_subtitle', content: ['A subtitle'] },
      { type: 'verse', number: 1, content: ['A beginning', { noteId: 0 }] },
      { type: 'line_break' },
      {
        type: 'verse',
        number: 2,
        content: [
          { text: 'A poem', poem: 1 },
          { lineBreak: true },
          { text: 'Second line', poem: 2, wordsOfJesus: true },
          { heading: 'Inline heading' },
        ],
      },
      { type: 'verse', number: 3, content: ['Last verse.'] },
    ],
    footnotes: [{ noteId: 0, text: 'A translator note' }],
  },
});
const response = (data: unknown) =>
  new Response(JSON.stringify(data), { status: 200 });
describe('Hello AO provider', () => {
  it('retains verse numbers, notes, paragraph breaks, subtitles and formatting', async () => {
    const p = await new HelloAoProvider(
      vi.fn(async () => response(fixture())),
    ).getPassage(ref());
    expect(p.verses.map((v) => v.number)).toEqual([1, 2]);
    expect(p.verses[0].content[1]).toEqual({
      kind: 'note',
      id: 0,
      text: 'A translator note',
    });
    expect(p.verses[0].headings).toEqual(['A translation heading']);
    expect(p.verses[0].subtitle[0]).toEqual({
      kind: 'text',
      text: 'A subtitle',
    });
    expect(p.verses[1].paragraphStart).toBe(true);
    expect(p.verses[1].content).toContainEqual({
      kind: 'text',
      text: 'Second line',
      poem: 2,
      wordsOfJesus: true,
    });
    expect(p.verses[1].content).toContainEqual({ kind: 'break' });
  });
  it('fetches cross-chapter ranges inclusively', async () => {
    const fetcher = vi.fn(async (url: RequestInfo | URL) =>
      response(fixture(String(url).includes('/2.json') ? 2 : 1)),
    );
    const p = await new HelloAoProvider(fetcher).getPassage(ref(3, 2, 2));
    expect(p.verses.map((v) => [v.chapter, v.number])).toEqual([
      [1, 3],
      [2, 1],
      [2, 2],
    ]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('deduplicates concurrent and cached chapter requests', async () => {
    const fetcher = vi.fn(async () => response(fixture()));
    const provider = new HelloAoProvider(fetcher);
    await Promise.all([
      provider.getPassage(ref()),
      provider.getPassage(ref(2, 3)),
    ]);
    await provider.getPassage(ref());
    expect(fetcher).toHaveBeenCalledTimes(1);
    provider.clearCache();
    await provider.getPassage(ref());
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('expires cached chapters', async () => {
    const fetcher = vi.fn(async () => response(fixture()));
    const provider = new HelloAoProvider(fetcher, -1);
    await provider.getPassage(ref());
    await provider.getPassage(ref());
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('allows retry after API failure and never substitutes another translation', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(response(fixture()));
    const provider = new HelloAoProvider(fetcher);
    await expect(provider.getPassage(ref())).rejects.toThrow('503');
    await expect(provider.getPassage(ref())).resolves.toHaveProperty(
      'translation.id',
      'BSB',
    );
    await expect(provider.getPassage(ref(), 'NRSVue')).rejects.toThrow(
      'No translation was substituted',
    );
  });
  it('rejects returned translation and passage mismatches', async () => {
    await expect(
      new HelloAoProvider(
        vi.fn(async () => response(fixture(1, 'KJV'))),
      ).getPassage(ref()),
    ).rejects.toThrow('different passage or translation');
    await expect(
      new HelloAoProvider(vi.fn(async () => response(fixture(2)))).getPassage(
        ref(),
      ),
    ).rejects.toThrow('different passage or translation');
  });
  it('rejects malformed data and missing verses', async () => {
    await expect(
      new HelloAoProvider(vi.fn(async () => response({}))).getPassage(ref()),
    ).rejects.toThrow('unexpected format');
    await expect(
      new HelloAoProvider(vi.fn(async () => response(fixture()))).getPassage(
        ref(1, 99),
      ),
    ).rejects.toThrow('not present');
  });
  it('reports network failure and times out stalled requests', async () => {
    await expect(
      new HelloAoProvider(
        vi.fn(async () => {
          throw new TypeError('Network offline');
        }),
      ).getPassage(ref()),
    ).rejects.toThrow('Network offline');
    const fetcher = vi.fn(
      (_url: RequestInfo | URL, options?: RequestInit) =>
        new Promise<Response>((_resolve, reject) =>
          options?.signal?.addEventListener('abort', () =>
            reject(new Error('abort')),
          ),
        ),
    );
    await expect(
      new HelloAoProvider(fetcher, 1000, 10).getPassage(ref()),
    ).rejects.toThrow('too long');
  });
});
describe('editorial validation', () => {
  it('accepts curated comparison and unequal passage lengths', () =>
    expect(validateLibrary(raw).comparisons[0].columns).toHaveLength(3));
  it('supports an explicit absent parallel', () => {
    const data = structuredClone(raw);
    (data.comparisons[0].groups[0].cells as Record<string, unknown>).mark =
      null;
    expect(() => validateLibrary(data)).not.toThrow();
  });
  it('rejects reversed or invalid references', () => {
    expect(referenceSchema.safeParse(ref(3, 1)).success).toBe(false);
    expect(referenceSchema.safeParse(ref(0, 1)).success).toBe(false);
  });
  it('rejects broken citations and missing columns', () => {
    const data = structuredClone(raw);
    data.comparisons[0].notes[1].citations[0].sourceId = 'invented';
    expect(() => validateLibrary(data)).toThrow('Unknown source');
    const missing = structuredClone(raw);
    delete (missing.comparisons[0].groups[0].cells as Record<string, unknown>)
      .mark;
    expect(() => validateLibrary(missing)).toThrow('every column');
  });
  it('requires a named known model for source assignments', () => {
    expect(() =>
      validateLibrary({
        ...raw,
        assignments: [
          {
            reference: ref(),
            modelId: 'unknown',
            sourceLabel: 'J',
            rationale: 'Example',
            citations: [{ sourceId: 'martin-mark', locator: 'Example' }],
          },
        ],
      }),
    ).toThrow('Unknown assignment model');
  });
});
