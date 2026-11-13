import { useEffect, type ComponentType, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  ModulePreview,
  type ModulePageProps,
} from './components/ModulePreview';
import { library } from './content';
import { SiteLayout } from './layout/SiteLayout';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import {
  SynopticPage,
  StormComparisonPage,
} from './pages/synoptic/SynopticPage';
import { TorahLawPage } from './pages/torah-law/TorahLawPage';
import { TorahSourcesPage } from './pages/torah-sources/TorahSourcesPage';

const modulePages = new Map<string, ComponentType<ModulePageProps>>([
  ['synoptic', SynopticPage],
  ['torah-law', TorahLawPage],
  ['torah-sources', TorahSourcesPage],
]);

function Page({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title = `${title} — Biblical Text & Context`;
  }, [title]);

  return (
    <main id="main" data-page={id} tabIndex={-1}>
      {children}
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route
          index
          element={
            <Page id="home" title="Explore Biblical Scholarship">
              <HomePage />
            </Page>
          }
        />
        <Route
          path="about"
          element={
            <Page id="about" title="About & Methods">
              <AboutPage />
            </Page>
          }
        />
        {library.modules.map((module) => {
          const ModulePage = modulePages.get(module.id) ?? ModulePreview;
          return (
            <Route
              key={module.id}
              path={`explore/${module.id}`}
              element={
                <Page id={module.id} title={module.title}>
                  <ModulePage module={module} />
                </Page>
              }
            />
          );
        })}
        <Route
          path="compare/calming-the-storm"
          element={
            <Page id="calming-the-storm" title="Jesus Calms the Storm">
              <StormComparisonPage />
            </Page>
          }
        />
        <Route
          path="*"
          element={
            <Page id="not-found" title="Page not found">
              <NotFoundPage />
            </Page>
          }
        />
      </Route>
    </Routes>
  );
}
