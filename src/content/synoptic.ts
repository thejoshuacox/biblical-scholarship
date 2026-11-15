import { z } from 'zod';
import { library } from './index';
import { citationSchema } from './schema';
import raw from './synoptic.json';

const paragraphSchema = z.object({
  text: z.string().min(1),
  citations: z.array(citationSchema).default([]),
  readings: z
    .array(z.object({ label: z.string().min(1), url: z.string().url() }))
    .default([]),
});

const internalLinkSchema = z.object({
  label: z.string().min(1),
  path: z.string().regex(/^\/[a-z\d-]+(?:\/[a-z\d-]+)*$/),
});

const guideSchema = z.object({
  id: z.string().regex(/^[a-z]+(?:-[a-z]+)*$/),
  title: z.string().min(1),
  description: z.string().min(1),
  intro: z.string().min(1),
  sections: z
    .array(
      z.object({
        title: z.string().min(1),
        paragraphs: z.array(paragraphSchema).min(1),
        diagram: z
          .array(
            z.object({
              from: z.string().min(1),
              to: z.string().min(1),
              hypothetical: z.boolean().optional(),
            }),
          )
          .min(1)
          .optional(),
        links: z.array(internalLinkSchema).default([]),
      }),
    )
    .min(1),
  readNext: internalLinkSchema.optional(),
});

export type SynopticParagraph = z.infer<typeof paragraphSchema>;
export type SynopticGuide = z.infer<typeof guideSchema>;

export const synoptic = z
  .object({
    definition: z.object({
      title: z.string().min(1),
      paragraph: paragraphSchema,
    }),
    guides: z.array(guideSchema).min(1),
  })
  .parse(raw);

const sourceIds = new Set(library.sources.map((source) => source.id));
for (const { citations } of [
  synoptic.definition.paragraph,
  ...synoptic.guides.flatMap(({ sections }) =>
    sections.flatMap(({ paragraphs }) => paragraphs),
  ),
]) {
  for (const { sourceId } of citations) {
    if (!sourceIds.has(sourceId))
      throw new Error('Unknown Synoptic guide citation: ' + sourceId);
  }
}
