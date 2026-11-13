# Editing and extending the content

## A module

Add an entry to `src/content/library.json → modules` with a stable `id`, title, short title, eyebrow, description, guiding question, planned capabilities, and `status: "preview"`. The homepage entry and `/explore/{id}` preview are generated from it. When the section needs its own layout, add an entry component under `src/pages/` and register it in `src/App.tsx`. See the [section design guide](DESIGN.md#designing-a-section).

Keep “preview” visible until the tool is real. Avoid adding unverified historical claims to marketing copy.

## A cited comparison

1. Verify the passage boundaries in the selected translation.
2. Add bibliographic records under `sources` with author, title, publisher/institution, date, URL, source type, a verified date, and locator details. Do not invent page references.
3. Add a comparison with a stable ID, title, subtitle, `translation: "BSB"`, columns, reading groups, and notes.
4. Each column has a stable ID and a full passage reference. Each reading group must explicitly include **every** column ID. A cell is a reference or `null` for an absent parallel.
5. Label notes `editorial` or `scholarly`. Scholarly notes must include citations; textual observations should include primary passage references. Cite the source that supports the actual claim.
6. Wire a new route to the reusable comparison component and supply its record; keep unique page descriptions with the content.
7. Run `npm test`, `npm run build`, and `npm run verify:api` after updating that script to include the new passages. Check the new comparison on a narrow screen.

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
