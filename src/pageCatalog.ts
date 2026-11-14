import { createElement, type ComponentType } from 'react';
import type { ModulePageProps } from './components/ModulePreview';
import { library, storm } from './content';

export const pagesPath = '/pages';
export const stormPath = '/compare/calming-the-storm';

export type PageEntry = {
  id: string;
  path: `/${string}`;
  title: string;
  description: string;
  thumbnail?: string;
  preview?: boolean;
  load: () => Promise<{ default: ComponentType }>;
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
    'synoptic',
    () =>
      import('./pages/synoptic/SynopticPage').then((page) => page.SynopticPage),
  ],
  [
    'torah-sources',
    () =>
      import('./pages/torah-sources/TorahSourcesPage').then(
        (page) => page.TorahSourcesPage,
      ),
  ],
]);

const moduleEntries = library.modules.map<PageEntry>((module) => ({
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
  {
    id: storm.id,
    path: stormPath,
    title: storm.title,
    description:
      'Compare the accounts in Matthew, Mark, and Luke with notes on what each writer emphasizes.',
    thumbnail: '/images/storm-cover.jpg',
    load: () =>
      import('./pages/synoptic/SynopticPage').then((page) => ({
        default: page.StormComparisonPage,
      })),
  },
  ...moduleEntries,
  {
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
