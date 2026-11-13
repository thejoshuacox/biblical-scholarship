# Design and voice

This is a personal educational project for people interested in biblical scholarship. Its pages should help someone find a passage, understand an explanation, and follow a source. The design should suit reading and comparison.

## What the research supports

Anthropic describes how generated interfaces can converge on familiar layouts and decorative choices when a model has little specific direction. That is a useful explanation for repetitive output, not proof that any particular font or card was made by AI. [Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills).

A 2025 PNAS study found systematic differences between human writing and the tested language models, including less stylistic variation and heavier use of some grammatical constructions. These are findings across samples, not a reliable checklist for identifying the author of one paragraph. For this project, the useful response is to edit vague, repetitive prose and let sentence structure follow the thought. [Do LLMs write like humans?](https://pmc.ncbi.nlm.nih.gov/articles/PMC11874169/).

Nielsen Norman Group describes tone along four dimensions: formality, humor, respect, and enthusiasm. The intended tone here is conversational, serious about the subject, respectful of readers, and matter-of-fact about what the tools do. [The Four Dimensions of Tone of Voice](https://www.nngroup.com/articles/tone-of-voice-dimensions/).

GOV.UK's content guidance starts with the reader's task and recommends clear, useful language. Here that means naming what a link opens and explaining what is actually available. [Understanding content design](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/understand-content-design/).

## Applying this to the site

- Use a simple masthead, readable text, and a contents list. The working comparison comes first. Rules separate sections; boxes are reserved for content or states that need grouping.
- Keep the locally hosted serif and sans-serif fonts. The typography should establish hierarchy without decorative icons, excessive labels, or repeated marketing blocks.
- Use descriptive headings: “Jesus calms the storm” and “Reading notes” replace “One storm. Three tellings.” and “Notice first. Then interpret.”
- Keep the distinction between the biblical text, editorial observations, and cited scholarship. Plain language must not erase qualifications or disagreement.
- Say which tools exist and which are planned. Do not make unfinished sections sound available.

## The owner's voice

The owner supplied the paragraph used to request the original project prompt. It explains intentions directly, gives concrete examples, and distinguishes present work from future plans. That is the reference for the introduction and project descriptions.

First-person wording describes those stated intentions. Do not invent personal experiences, qualifications, beliefs, or a team. Use contractions naturally. Prefer concrete verbs and examples over paired slogans, sweeping promises, and generic invitations to “explore.” Technical terms are useful when explained; the audience does not need to be addressed as specialists.

Future edits should preserve that direction without turning these notes into another rigid template. A card, a short sentence, or an em dash is not evidence of AI authorship. Judge each choice by whether it helps a reader.

## Designing a section

The Synoptic Gospels, Torah Law Comparisons, and Torah Sources entry components live in their own folders under `src/pages/`. Start a redesign in that section’s folder. Replace its `ModulePreview` with the section’s own layout when the tool is ready. Existing URLs, navigation, and the saved light or dark preference come from the shared app and layout.

Put the section’s styles in a colocated `.module.css` file and apply a local class to its outer element. Give that element its own layout, typography, and color variables as needed. Variables such as `--ink`, `--accent`, `--surface`, and `--serif` can be overridden on the section’s root. Add dark palette overrides with `:global(html[data-theme='dark']) .root`, where `.root` is that stylesheet’s local root class. The surrounding header and footer use the site palette. Use `background: var(--paper)` and `color: var(--ink)` on the section root if it overrides those colors.

The shared `page-shell`, `page-intro`, and button styles are available for pages that use the current layout. A new section can compose its own layout and still reuse passages, citations, or bibliographies from `src/components/`. `App.tsx` gives each route’s main landmark a stable `data-page` value and connects the section entry components to their URLs. Add further routes there when a section grows.
