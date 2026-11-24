import { z } from 'zod';
const position = z.object({
  chapter: z.number().int().positive().max(150),
  verse: z.number().int().positive().max(176),
});
export const referenceSchema = z
  .object({
    book: z.string().regex(/^[A-Z0-9]{3}$/),
    bookName: z.string().min(1),
    start: position,
    end: position,
  })
  .refine(
    (r) =>
      r.end.chapter > r.start.chapter ||
      (r.end.chapter === r.start.chapter && r.end.verse >= r.start.verse),
    'Passage end precedes start',
  );
export type PassageReference = z.infer<typeof referenceSchema>;
export const citationSchema = z.object({
  sourceId: z.string(),
  locator: z.string().min(1),
});
export const internalLinkSchema = z.object({
  label: z.string().min(1),
  path: z.string().regex(/^\/[a-z\d-]+(?:\/[a-z\d-]+)*$/),
});
const note = z
  .object({
    id: z.string(),
    kind: z.enum(['editorial', 'scholarly']),
    title: z.string(),
    text: z.string(),
    citations: z.array(citationSchema),
    references: z.array(referenceSchema).default([]),
    greek: z
      .object({
        text: z.string().min(1),
        gloss: z.string().min(1),
        readings: z
          .array(z.object({ label: z.string().min(1), url: z.string().url() }))
          .min(1),
      })
      .optional(),
  })
  .refine(
    (n) => n.kind !== 'scholarly' || n.citations.length > 0,
    'Scholarly notes require citations',
  );
export const librarySchema = z.object({
  sources: z.array(
    z.object({
      id: z.string(),
      author: z.string(),
      title: z.string(),
      publisher: z.string(),
      date: z.string(),
      url: z.string().url(),
      type: z.enum(['academic-lecture', 'book', 'article', 'reference']),
      verified: z.string(),
      details: z.string(),
    }),
  ),
  hypotheses: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      attributedTo: z.string(),
      description: z.string(),
      citations: z.array(citationSchema).min(1),
      alternatives: z.array(z.string()),
    }),
  ),
  assignments: z.array(
    z.object({
      reference: referenceSchema,
      modelId: z.string(),
      sourceLabel: z.string(),
      rationale: z.string(),
      citations: z.array(citationSchema).min(1),
    }),
  ),
  modules: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      shortTitle: z.string(),
      eyebrow: z.string(),
      description: z.string(),
      question: z.string(),
      planned: z.array(z.string()),
      thumbnail: z.string().startsWith('/').optional(),
      topicId: z.string().min(1).optional(),
      status: z.literal('preview'),
    }),
  ),
  comparisons: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      introduction: z.string().min(1).optional(),
      readNext: internalLinkSchema.optional(),
      translation: z.literal('BSB'),
      columns: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            reference: referenceSchema,
          }),
        )
        .min(2),
      groups: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            explanation: z.string(),
            cells: z.record(z.union([referenceSchema, z.null()])),
          }),
        )
        .min(1),
      notes: z.array(note),
    }),
  ),
});
export type Library = z.infer<typeof librarySchema>;
export function validateLibrary(input: unknown): Library {
  const data = librarySchema.parse(input);
  const unique = (ids: string[], label: string) => {
    if (new Set(ids).size !== ids.length) throw new Error('Duplicate ' + label);
  };
  for (const key of [
    'sources',
    'hypotheses',
    'modules',
    'comparisons',
  ] as const)
    unique(
      data[key].map((x) => x.id),
      key,
    );
  const sources = new Set(data.sources.map((s) => s.id));
  const checkCitations = (items: z.infer<typeof citationSchema>[]) =>
    items.forEach((c) => {
      if (!sources.has(c.sourceId))
        throw new Error('Unknown source: ' + c.sourceId);
    });
  data.hypotheses.forEach((h) => {
    checkCitations(h.citations);
    h.alternatives.forEach((id) => {
      if (!data.hypotheses.some((x) => x.id === id))
        throw new Error('Unknown alternative model');
    });
  });
  data.assignments.forEach((a) => {
    checkCitations(a.citations);
    if (!data.hypotheses.some((h) => h.id === a.modelId))
      throw new Error('Unknown assignment model');
  });
  data.comparisons.forEach((c) => {
    unique(
      c.columns.map((x) => x.id),
      'column',
    );
    unique(
      c.groups.map((x) => x.id),
      'group',
    );
    unique(
      c.notes.map((x) => x.id),
      'note',
    );
    c.notes.forEach((n) => checkCitations(n.citations));
    c.groups.forEach((g) => {
      if (Object.keys(g.cells).length !== c.columns.length)
        throw new Error(
          'Each group must explicitly include every column; use null for absent parallels',
        );
      c.columns.forEach((col) => {
        if (!(col.id in g.cells)) throw new Error('Missing comparison cell');
        const r = g.cells[col.id],
          full = col.reference;
        const order = (p: { chapter: number; verse: number }) =>
          p.chapter * 1000 + p.verse;
        if (
          r &&
          (r.book !== full.book ||
            order(r.start) < order(full.start) ||
            order(r.end) > order(full.end))
        )
          throw new Error('Group falls outside column passage');
      });
    });
  });
  return data;
}
export function formatReference(r: PassageReference) {
  const end =
    r.start.chapter === r.end.chapter
      ? String(r.end.verse)
      : r.end.chapter + ':' + r.end.verse;
  return (
    r.bookName +
    ' ' +
    r.start.chapter +
    ':' +
    r.start.verse +
    (r.start.chapter === r.end.chapter && r.start.verse === r.end.verse
      ? ''
      : '–' + end)
  );
}
