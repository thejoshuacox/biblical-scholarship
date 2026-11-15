import { createElement, type ComponentType } from 'react';
import type { ModulePageProps } from './components/ModulePreview';
import { library, storm } from './content';
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
  resourceType: 'Article' | 'Passage comparison' | 'Tool' | 'Game';
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

export const pageCatalog: readonly PageEntry[] = [
  synopticTopic,
  torahTopic,
  {
    kind: 'resource',
    resourceType: 'Passage comparison',
    topicId: synopticTopic.id,
    id: storm.id,
    path: stormPath,
    title: storm.title,
    description:
      'Compare the accounts in Matthew, Mark, and Luke with notes on what each writer emphasizes.',
    thumbnail: '/images/storm-cover.jpg',
    keywords: storm.columns.map(({ reference }) => formatReference(reference)),
    load: () =>
      import('./pages/synoptic/StormComparisonPage').then((page) => ({
        default: page.StormComparisonPage,
      })),
  },
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
