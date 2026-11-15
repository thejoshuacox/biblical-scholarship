# Design and voice

This is a personal educational project for people interested in biblical scholarship. Its pages should help someone find a passage, understand an explanation, and follow a source. The design should suit reading and comparison.

## What the research supports

Anthropic describes how generated interfaces can converge on familiar layouts and decorative choices when a model has little specific direction. That is a useful explanation for repetitive output, not proof that any particular font or card was made by AI. [Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills).

A 2025 PNAS study found systematic differences between human writing and the tested language models, including less stylistic variation and heavier use of some grammatical constructions. These are findings across samples, not a reliable checklist for identifying the author of one paragraph. For this project, the useful response is to edit vague, repetitive prose and let sentence structure follow the thought. [Do LLMs write like humans?](https://pmc.ncbi.nlm.nih.gov/articles/PMC11874169/).

Nielsen Norman Group describes tone along four dimensions: formality, humor, respect, and enthusiasm. The intended tone here is conversational, serious about the subject, respectful of readers, and matter-of-fact about what the tools do. [The Four Dimensions of Tone of Voice](https://www.nngroup.com/articles/tone-of-voice-dimensions/).

GOV.UK's content guidance starts with the reader's task and recommends clear, useful language. Here that means naming what a link opens and explaining what is actually available. [Understanding content design](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/understand-content-design/).

## Applying this to the site

- Use a simple masthead and readable text. Home introduces the project and suggests a reading. The Library puts broad topics first, followed by the individual resources readers can also find by searching.
- Keep the locally hosted serif and sans-serif fonts. The typography should establish hierarchy without decorative icons, excessive labels, or repeated marketing blocks.
- Use descriptive headings: “Jesus calms the storm” and “Reading notes” replace “One storm. Three tellings.” and “Notice first. Then interpret.”
- Keep the distinction between the biblical text, editorial observations, and cited scholarship. Plain language must not erase qualifications or disagreement.
- Say which tools exist and which are planned. Do not make unfinished sections sound available.

## The owner's voice

The owner supplied the paragraph used to request the original project prompt. It explains intentions directly, gives concrete examples, and distinguishes present work from future plans. That is the reference for the introduction and project descriptions.

First-person wording describes those stated intentions. Do not invent personal experiences, qualifications, beliefs, or a team. Use contractions naturally. Prefer concrete verbs and examples over paired slogans, sweeping promises, and generic invitations to “explore.” Technical terms are useful when explained; the audience does not need to be addressed as specialists.

Future edits should preserve that direction without turning these notes into another rigid template. A card, a short sentence, or an em dash is not evidence of AI authorship. Judge each choice by whether it helps a reader.

## Designing a section

The Synoptic Gospels and The Torah have their own page components under `src/pages/`. Start a topic redesign in its folder. Torah Law Comparisons and Torah Sources have separate resource components. Replace a tool’s `ModulePreview` when the tool is ready. Existing URLs, navigation, and the saved light or dark preference come from the shared app and layout.

Put the section’s styles in a colocated `.module.css` file and apply a local class to its outer element. Give that element its own layout, typography, and color variables as needed. Variables such as `--ink`, `--accent`, `--surface`, and `--serif` can be overridden on the section’s root. Add dark palette overrides with `:global(html[data-theme='dark']) .root`, where `.root` is that stylesheet’s local root class. The surrounding header and footer use the site palette. Use `background: var(--paper)` and `color: var(--ink)` on the section root if it overrides those colors.

The shared `page-shell`, `page-intro`, and button styles are available for pages that use the current layout. A new section can compose its own layout and still reuse passages, citations, or bibliographies from `src/components/`. Each registered page gets a main landmark with `data-page` set to its catalog ID. Add public routes in [the page catalog](../src/pageCatalog.ts). See the [content guide](CONTENT.md#adding-a-topic-or-resource) for an example.

The Home illustration (`public/images/open-books.jpg`) and the Gospel comparison thumbnail (`public/images/storm-cover.jpg`) were made with the built-in ImageGen tool. The Home illustration also appears on the Synoptic Gospels and About & Methods cards.

<details>
<summary>ImageGen prompts</summary>

**Open books**

> Use case: photorealistic-natural. A 4:3 landscape editorial still-life photograph for the home page of Biblical Text & Context, an approachable biblical scholarship reading site. Shot at a shallow angle from above: two well-used, plain clothbound reference books open on a dark olive-gray library table, one partially overlapping behind the other as if a reader has been comparing the pages. Show cream page edges, a worn cloth spine and the texture of the paper. Natural raking window light from upper left, deeply shaded tabletop at right, muted cream and umber, very subtle film grain. Loosely frame the books with space at the edges for responsive cropping; keep the visually interesting overlap in the middle. Close framing and shallow depth of field make any tiny text incidental and illegible. Contemporary quiet library still life. No people, lettering over the image, logos, symbols, decorative props, or watermark.

**Storm cover**

> Use case: illustration-story. Square editorial thumbnail for a biblical scholarship page comparing the Gospel accounts of Jesus calming the storm. A single small wooden sailboat with a lowered cloth sail on a windswept inland lake, a low shoreline barely visible, with a narrow opening in heavy clouds lighting part of the water. Restrained graphite, ink wash, and muted olive-gray watercolor on warm paper, with a readable boat silhouette at thumbnail size. Natural proportions, strong composition, serious quiet mood. Keep the boat near the center and visible in a square crop. No individual figures rendered in detail, saints, halos, lettering, borders, logos, or watermark. This is a modern illustrative scene, with no imitation of a specific historic artwork.

</details>
