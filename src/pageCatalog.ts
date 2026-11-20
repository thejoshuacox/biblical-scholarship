import { createElement, type ComponentType } from 'react';
import type { ModulePageProps } from './components/ModulePreview';
import { comparisonById, library, lordsPrayer, storm } from './content';
import type { Library } from './content/schema';
import { synoptic } from './content/synoptic';
import { formatReference } from './content/schema';

export const libraryPath = '/library';
export const legacyLibraryPath = '/pages';
export const stormPath = '/compare/calming-the-storm';

type CatalogPage = {
  id: string;
  path: `/${string}`;
  title: string;
  description: string;
  thumbnail?: string;
  keywords?: readonly string[];
  load: () => Promise<{ default: ComponentType }>;
};

export type TopicEntry = CatalogPage & { kind: 'topic' };
type ResourceEntry = CatalogPage & {
  kind: 'resource';
  resourceType:
    'Article' | 'Collection' | 'Passage comparison' | 'Tool' | 'Game';
  topicId?: string;
  preview?: boolean;
};
export type PageEntry =
  TopicEntry | ResourceEntry | (CatalogPage & { kind: 'site' });

export const synopticTopic: TopicEntry = {
  kind: 'topic',
  id: 'synoptic',
  path: '/explore/synoptic',
  title: 'The Synoptic Gospels',
  description:
    'Read Matthew, Mark, and Luke side by side and see where their accounts differ.',
  thumbnail: '/images/open-books.jpg',
  load: () =>
    import('./pages/synoptic/SynopticPage').then((page) => ({
      default: page.SynopticPage,
    })),
};

export const torahTopic: TopicEntry = {
  kind: 'topic',
  id: 'torah',
  path: '/explore/torah',
  title: 'The Torah',
  description:
    'See what’s planned for comparing Torah laws and studying how the books took shape.',
  keywords: [
    'Pentateuch',
    'Genesis',
    'Exodus',
    'Leviticus',
    'Numbers',
    'Deuteronomy',
  ],
  load: () =>
    import('./pages/torah/TorahPage').then((page) => ({
      default: page.TorahPage,
    })),
};

const moduleLoaders = new Map<
  string,
  () => Promise<ComponentType<ModulePageProps>>
>([
  [
    'torah-law',
    () =>
      import('./pages/torah-law/TorahLawPage').then(
        (page) => page.TorahLawPage,
      ),
  ],
  [
    'torah-sources',
    () =>
      import('./pages/torah-sources/TorahSourcesPage').then(
        (page) => page.TorahSourcesPage,
      ),
  ],
]);

const moduleEntries = library.modules.map<ResourceEntry>((module) => ({
  kind: 'resource',
  resourceType: 'Tool',
  topicId: module.topicId,
  id: module.id,
  path: `/explore/${module.id}`,
  title: module.title,
  description: module.description,
  thumbnail: module.thumbnail,
  preview: module.status === 'preview',
  async load() {
    const loader = moduleLoaders.get(module.id);
    const Component = loader
      ? await loader()
      : (await import('./components/ModulePreview')).ModulePreview;
    return { default: () => createElement(Component, { module }) };
  },
}));

export const synopticComparisonCollection: ResourceEntry = {
  kind: 'resource',
  resourceType: 'Collection',
  topicId: synopticTopic.id,
  id: 'synoptic-comparisons',
  path: '/explore/synoptic/comparisons',
  title: 'Side-by-side comparisons',
  description: 'Choose a story or a teaching to read across the Gospels.',
  thumbnail: '/images/storm-cover.jpg',
  load: () =>
    import('./pages/synoptic/SynopticComparisonsPage').then((page) => ({
      default: page.SynopticComparisonsPage,
    })),
};

function synopticComparisonEntry(
  comparison: Library['comparisons'][number],
  description: string,
  themes: readonly string[],
  thumbnail?: string,
): ResourceEntry & { references: string; themes: readonly string[] } {
  const references = comparison.columns.map(({ reference }) =>
    formatReference(reference),
  );
  return {
    kind: 'resource',
    resourceType: 'Passage comparison',
    topicId: synopticTopic.id,
    id: comparison.id,
    path: `/compare/${comparison.id}`,
    title: comparison.title,
    description,
    themes,
    thumbnail,
    keywords: references,
    references: references.join(' · '),
    async load() {
      const { SynopticComparisonPage } =
        await import('./pages/synoptic/SynopticComparisonPage');
      return {
        default: () => createElement(SynopticComparisonPage, { comparison }),
      };
    },
  };
}

export const stormComparisonEntry = synopticComparisonEntry(
  storm,
  'Notice when Jesus asks the disciples about their fear or faith in each telling.',
  ['Narrative', 'Miracle'],
  '/images/storm-cover.jpg',
);

export const synopticComparisonEntries = [
  stormComparisonEntry,
  synopticComparisonEntry(
    lordsPrayer,
    'Read the prayer in Matthew and Luke and see how each Gospel introduces it.',
    ['Teaching', 'Sermon on the Mount', 'Prayer'],
  ),
  synopticComparisonEntry(
    comparisonById('baptism-of-jesus'),
    'Hear what the voice from heaven says in Matthew, Mark, and Luke, and notice whom it addresses.',
    ['Narrative', 'Prayer', 'John the Baptist', 'Son of God'],
  ),
  synopticComparisonEntry(
    comparisonById('healing-a-paralyzed-man'),
    'See how the man reaches Jesus in each telling and what happens when Jesus forgives him.',
    ['Narrative', 'Miracle'],
  ),
  synopticComparisonEntry(
    comparisonById('beatitudes'),
    'Compare Jesus’ opening blessings and the warnings that follow them in Luke.',
    ['Teaching', 'Sermon on the Mount'],
  ),
  synopticComparisonEntry(
    comparisonById('death-of-john-the-baptist'),
    'Follow the story of Herod’s birthday in Matthew and Mark, then read what Herod himself says about John in Luke.',
    ['Narrative', 'John the Baptist', 'Burial'],
  ),
  synopticComparisonEntry(
    comparisonById('temptation-of-jesus'),
    'Compare Mark’s two verses with Matthew and Luke’s three tests. Which test comes last in each account?',
    ['Narrative', 'Son of God', 'Scripture'],
  ),
  synopticComparisonEntry(
    comparisonById('women-at-the-empty-tomb'),
    'Follow the women to the tomb and notice what each messenger says about Galilee.',
    ['Narrative', 'Burial', 'Resurrection'],
  ),
];

export const synopticGuideEntries = synoptic.guides.map<ResourceEntry>(
  (guide) => ({
    kind: 'resource',
    resourceType: 'Article',
    topicId: synopticTopic.id,
    id: guide.id,
    path: `/explore/synoptic/${guide.id}`,
    title: guide.title,
    description: guide.description,
    async load() {
      const { SynopticGuidePage } =
        await import('./pages/synoptic/SynopticGuidePage');
      return { default: () => createElement(SynopticGuidePage, { guide }) };
    },
  }),
);

export const pageCatalog: readonly PageEntry[] = [
  synopticTopic,
  torahTopic,
  ...synopticComparisonEntries,
  synopticComparisonCollection,
  ...synopticGuideEntries,
  ...moduleEntries,
  {
    kind: 'site',
    id: 'about',
    path: '/about',
    title: 'About & Methods',
    description:
      'Learn who the site is for and how I choose sources, explain disagreements, and present the biblical text.',
    thumbnail: '/images/open-books.jpg',
    load: () =>
      import('./pages/AboutPage').then((page) => ({ default: page.AboutPage })),
  },
];

export const topics = pageCatalog.filter((entry) => entry.kind === 'topic');

export function findTopic(id: string | undefined) {
  return topics.find((topic) => topic.id === id);
}

export function resourcesForTopic(topicId: string) {
  return pageCatalog.filter(
    (entry) => entry.kind === 'resource' && entry.topicId === topicId,
  );
}

export function resourceLabel(entry: ResourceEntry) {
  return entry.preview ? `${entry.resourceType} preview` : entry.resourceType;
}

function normalize(text: string) {
  return text
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

const searchablePages = pageCatalog.map((entry) => ({
  entry,
  text: normalize(
    [
      entry.title,
      entry.description,
      ...(entry.keywords ?? []),
      ...(entry.kind === 'resource'
        ? [resourceLabel(entry), findTopic(entry.topicId)?.title ?? '']
        : []),
    ].join(' '),
  ),
}));

export function searchCatalog(query: string): readonly PageEntry[] {
  if (!query.trim()) return pageCatalog;
  const terms = normalize(query).split(' ').filter(Boolean);
  if (!terms.length) return [];
  return searchablePages
    .filter(({ text }) => terms.every((term) => text.includes(term)))
    .map(({ entry }) => entry);
}
