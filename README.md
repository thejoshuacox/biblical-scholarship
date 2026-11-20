# Biblical Text & Context

An approachable, independent educational site for exploring academic biblical scholarship. Welcoming to Christians and readers of any background, with explicit separation between primary texts, editorial observations, and scholarly interpretations.

Live site: [Biblical Text & Context](https://biblical-text-and-context.onrender.com/).

The [design and voice notes](docs/DESIGN.md) explain the visual direction and the research behind it.

## Included

- Homepage, searchable Library, two topic pages, About & Methods, and two clearly marked tool previews.
- A Synoptic Gospels topic with three cited guides and eight side-by-side comparisons.
- Aligned thematic groups or whole passages; reading-note controls; responsive layout; keyboard navigation.
- Live Berean Standard Bible passages through AO Lab, with loading, failure, timeout, and retry states.
- Validated JSON content, reusable display components, and an interchangeable Bible-provider interface.

The full Torah law tool, identification game, Torah source explorer, and further Synoptic comparisons are planned. There are no accounts, database, CMS, analytics, or runtime AI.

## Local development

Use Node **22.12+** (Node 22 LTS recommended) and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. No API key or environment variables are required.

```sh
npm test                 # deterministic provider/content tests
npm run build            # TypeScript, content checks, assets, and static page entries
npm run preview          # serve dist locally
npm run verify:api       # live API smoke check, internet required
npm run test:e2e         # desktop/mobile browser + accessibility tests
```

Browser tests use Microsoft Edge on Windows by default. On another platform install Playwright Chromium (`npx playwright install chromium`) and run with `CI=1` (PowerShell: `$env:CI='1'`). These tests use the real Bible API and require network access. An optional GitHub Actions template is provided at `docs/github-actions-verify.example.yml`. It runs only deterministic tests and the production build, so an upstream API outage will not block editorial commits. It is not activated because the current CLI login cannot upload workflow files. To enable it later, copy it to `.github/workflows/verify.yml` using an account or token with workflow permission.

## Architecture

**React + TypeScript + Vite**, React Router, and Zod. Render serves the built static files. A backend would add complexity without serving a current requirement: the Bible API permits browser access and needs no secret.

| Location                            | Purpose                                                                                |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| `src/content/library.json`          | Modules, comparison mappings, notes, bibliography, future named models and assignments |
| `src/content/pages.json`            | Homepage and methods prose, comparison guidance                                        |
| `src/content/schema.ts`, `pages.ts` | Runtime/build validation and referential integrity                                     |
| `src/bible/types.ts`                | Provider-independent passage, verse, and formatting models                             |
| `src/bible/helloao.ts`              | AO Lab requests, validation, normalization, bounded chapter cache                      |
| `src/components/`                   | Passage display, citations, bibliography, scholarly annotations                        |
| `src/App.tsx`                       | Shared route rendering and page landmarks                                              |
| `src/pageCatalog.ts`                | Routes, topic and resource registration, and Library search                            |
| `src/pages/`                        | Homepage, methods, and independent section entry components                            |
| `src/layout/`                       | Shared navigation, footer, and focus handling                                          |
| `src/styles.css`                    | Light and dark palettes, base typography, and shared controls                          |
| `tests/`                            | Provider/content tests and browser verification                                        |
| `render.yaml`                       | Optional Render Blueprint equivalent to the manual settings                            |

Chapter promises are shared across concurrent requests and retained in memory for 30 minutes, with a maximum of 100 entries. Failed requests are evicted for retry; requests time out after 12 seconds. Cross-chapter passages fetch at most four chapters at a time. Reloading clears the in-memory cache. The browser can also use normal HTTP caching.

The Synoptic comparison chooser stores a flag in this browser for each comparison opened. It puts unopened comparisons first and ranks each group by shared themes from the page catalog.

The provider checks the returned translation, book, and chapter. It supports structured book identifiers and inclusive chapter/verse endpoints, including cross-chapter ranges. It retains translation headings, paragraphs, poetry indentation, inline breaks, subtitles, and translator notes. Missing requested endpoints and unsupported translations are errors. There is no fallback to another translation.

Stable module, comparison, and note IDs leave a straightforward future integration point for saved progress. Add a separate persistence/authentication service only when that feature is actually needed; public reading and editorial files should remain independent.

## Add content or a provider

See [the content guide](docs/CONTENT.md). Edit structured data rather than putting scholarly prose in components. Build validation checks references, citations, model IDs, duplicate IDs, and explicit comparison columns. A JSON schema cannot establish that a claim is true: editorial source checking remains necessary.

For another translation/provider, implement `BibleProvider`, normalize into `Passage`, and configure the exported provider. Carry correct attribution and licensing with each translation. Extend translation validation and the UI before enabling it. **NRSVue is not enabled or assumed available**; verify rights and a suitable source first.

## Render hosting

Create a **Static Site**, not a Web Service. Use:

| Setting                           | Value                                                      |
| --------------------------------- | ---------------------------------------------------------- |
| Branch                            | `main`                                                     |
| Root directory                    | Leave blank (repository root)                              |
| Build command                     | `npm ci && npm run build`                                  |
| Publish directory                 | `dist`                                                     |
| Node version                      | `22.22.0` via `NODE_VERSION`                               |
| Skip automatic dependency install | `SKIP_INSTALL_DEPS=true`                                   |
| Start command                     | None                                                       |
| Optional rewrite                  | Source `/*`, destination `/index.html`, action **Rewrite** |

The production build writes an `index.html` entry for the Library, its former `/pages` URL, and each catalog route so direct links and refreshes can load on a static host. The app redirects `/pages` to `/library`. The optional Render rewrite serves the app’s “Page not found” screen for unmatched paths, with HTTP 200.

You can alternatively connect the repository as a Blueprint using `render.yaml`; connecting a Blueprint triggers deployment. The owner has connected the GitHub repository to the live Render site linked above.

After a deployment: verify the homepage, directly open `/about` and `/compare/calming-the-storm`, and test a passage retry on your deployed domain. No database, paid dependency, or secret is needed.

Settings checked against [Render Static Sites](https://render.com/docs/static-sites), [Vite's Render guide](https://vite.dev/guide/static-deploy), and [Render Blueprint reference](https://render.com/docs/blueprint-spec), 2026-09-29.

## Text, sources, and assets

BSB is supplied by [AO Lab's Free Use Bible API](https://bible.helloao.org/docs/); its publisher identifies the text as [public domain](https://berean.bible/licensing.htm). API docs and live responses were checked on 2026-09-29. The API is a text provider, not scholarly authority.

The demonstration's academic explanations cite Dale B. Martin's official Open Yale Courses lectures. Section timestamps and transcript locators are supplied rather than unverified page numbers. Editorial alignment and direct observations are labeled separately. The example does not infer Greek source relationships from English wording.

DM Sans and Libre Caslon Display fonts are served locally via Fontsource (SIL Open Font License); Lucide icons use the ISC license. No remote image or font service is required.
