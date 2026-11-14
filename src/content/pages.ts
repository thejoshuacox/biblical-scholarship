import { z } from 'zod';
import raw from './pages.json';
import { library } from './index';
const paragraph = z.object({
  text: z.string().min(1),
  citation: z
    .object({ sourceId: z.string(), locator: z.string().min(1) })
    .optional(),
  link: z.object({ label: z.string(), url: z.string().url() }).optional(),
});
const pageSchema = z.object({
  home: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
    note: z.string().min(1),
    firstReading: z.object({
      title: z.string().min(1),
      references: z.string().min(1),
      text: z.string().min(1),
    }),
    welcomeTitle: z.string().min(1),
    welcomeText: z.string().min(1),
  }),
  about: z.object({
    title: z.string(),
    intro: z.string(),
    sections: z.array(
      z.object({
        id: z.string(),
        nav: z.string(),
        title: z.string(),
        paragraphs: z.array(paragraph),
        definitions: z
          .array(z.object({ term: z.string(), text: z.string() }))
          .optional(),
      }),
    ),
  }),
  comparison: z.object({
    intro: z.string(),
    help: z.string(),
    caution: z.string(),
  }),
  preview: z.object({
    synoptic: z.object({ title: z.string(), text: z.string() }),
    other: z.object({ title: z.string(), text: z.string() }),
  }),
});
export const pages = pageSchema.parse(raw);
for (const section of pages.about.sections)
  for (const p of section.paragraphs)
    if (
      p.citation &&
      !library.sources.some((s) => s.id === p.citation!.sourceId)
    )
      throw new Error('Unknown page citation');
