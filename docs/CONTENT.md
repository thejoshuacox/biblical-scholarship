# Editing and extending the content

## A tool preview

Add an entry to `src/content/library.json → modules` with a stable `id`, title, short title, eyebrow, description, guiding question, planned capabilities, and `status: "preview"`. This adds an `/explore/{id}` route and a Library resource card. Set `topicId` to the ID of an existing topic to list the preview there as well. Include an optional `thumbnail` URL for an image in `public/`.

When a study section needs its own layout, add a component under `src/pages/` and register its loader in `moduleLoaders` in `src/pageCatalog.ts`. See the [section design guide](DESIGN.md#designing-a-section).

## Adding a topic or resource

Create the page component in `src/pages/` and add an entry to `pageCatalog` in `src/pageCatalog.ts`. A `topic` entry appears in the Library’s Topics section and navigation dropdown. Its component can use `TopicResources` to list entries with the corresponding `topicId`. Keep the layout in the topic’s own component and stylesheet. A `site` entry, such as About & Methods, appears in matching searches.

Use `resource` for an individual article, comparison, tool, or game. For example, an article with a default-exported component can use this entry:

```ts
{
  kind: 'resource',
  resourceType: 'Article',
  id: 'reading-guide',
  path: '/guides/reading',
  title: 'Reading guide',
  description: 'How to read the passages and notes on this site.',
  topicId: 'synoptic',
  load: () => import('./pages/ReadingGuide'),
},
```

Use a unique ID and URL. URL segments use lowercase letters, numbers, and hyphens. The same entry supplies the route, Library listing, topic listing when applicable, and static entry file. The page’s component and CSS load when a reader opens it. Library search uses the title, description, resource type, topic title, and optional `keywords`. Use `keywords` for alternate titles, terminology, and passage references.

For a custom thumbnail, put a square image in `public/images/` and add `thumbnail: '/images/reading-guide.webp'` to the entry. Omit `thumbnail` to use the site’s book logo. Run `npm run build` to check the registration and referenced image.

Keep “preview” visible until the tool is real. Avoid adding unverified historical claims to marketing copy.

## A cited comparison

1. Verify the passage boundaries in the selected translation.
2. Add bibliographic records under `sources` with author, title, publisher/institution, date, URL, source type, a verified date, and locator details. Do not invent page references.
3. Add a comparison with a stable ID, title, subtitle, `translation: "BSB"`, columns, reading groups, and notes.
4. Each column has a stable ID and a full passage reference. Each reading group must explicitly include **every** column ID. A cell is a reference or `null` for an absent parallel.
5. Label notes `editorial` or `scholarly`. Scholarly notes must include citations; textual observations should include primary passage references. Cite the source that supports the actual claim.
6. Register the page in `src/pageCatalog.ts` as a `Passage comparison` resource. Supply the comparison record, a short description, and themes in `synopticComparisonEntry`. Reuse theme names for related passages so the chooser can suggest them together.
7. The collection and the reader’s next link use the opening verse in Mark for Gospel order. For a comparison with no Mark column, set its ID in `readingOrderAfter` in `src/content/synoptic.json` to the ID of the preceding Mark comparison, or to `null` for an opening reading. Readings at the same placement follow Matthew’s order and then Luke’s.
8. Run `npm test`, `npm run build`, and `npm run verify:api` to check the registered comparisons. Check the new comparison on a narrow screen.

A reference is provider-neutral except for its standard book identifier:

```json
{
  "book": "MRK",
  "bookName": "Mark",
  "start": { "chapter": 4, "verse": 41 },
  "end": { "chapter": 5, "verse": 2 }
}
```

Endpoints are inclusive. Cross-book ranges are not supported; represent them as separate references. Do not squeeze unequal passages into equal verse counts. Check that reading groups cover the intended material without accidental duplication or omitted verses. Group alignment is an editorial choice, not a claim about original-language correspondence.

## A scholarly model and source assignment

The `hypotheses` and `assignments` arrays are intentionally empty until researched records are ready. A hypothesis requires `id`, `name`, `attributedTo`, `description`, citations, and a list of alternative model IDs. Every assignment requires a passage reference, a known `modelId`, a source label, a rationale, and citations.

Do not assign “J”, “E”, “P”, or another hypothetical source without naming the model. A bibliography verifies attribution, not the truth of a reconstruction. Explain the evidence and disagreement in the eventual tool.

## Page copy and references

`src/content/pages.json` contains homepage prose, methods sections, and reading guidance. Methods paragraphs support optional scholarly citations and external reference links. UI labels stay in components; editorial prose stays in content. Validation runs in development and during production builds.

Links are plain text data; content is never injected as raw HTML. Keep citations accessible through the bibliography as well as inline links.

## Editorial checklist

- Separate primary texts, direct observations, and interpretation.
- Attribute contested interpretations to named scholars or models.
- Use official academic institutions, scholarly publishers, peer-reviewed research, or major academic references.
- Verify the exact section or page cited; use timestamps for lectures.
- Distinguish a source's example from this site's example.
- Treat translation and API metadata separately from historical scholarship.
- Do not claim consensus without evidence or infer Greek/Hebrew relationships solely from English.
- Welcome religious and nonreligious readers without prescribing a conclusion.
