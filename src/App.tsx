import { Component, lazy, Suspense, useEffect, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './layout/SiteLayout';
import { pageCatalog, pagesPath } from './pageCatalog';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PagesDirectory } from './pages/PagesDirectory';

const catalogRoutes = pageCatalog.map(({ load, ...entry }) => ({
  ...entry,
  Component: lazy(load),
}));

class PageLoadBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="page-shell" role="alert">
        <h1>This page couldn’t be loaded</h1>
        <p>Reload the page to try again.</p>
        <button
          className="button primary"
          type="button"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      </div>
    );
  }
}

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
      <PageLoadBoundary key={id}>
        <Suspense
          fallback={
            <p className="page-shell" role="status">
              Loading page…
            </p>
          }
        >
          {children}
        </Suspense>
      </PageLoadBoundary>
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
          path={pagesPath}
          element={
            <Page id="pages" title="Pages">
              <PagesDirectory />
            </Page>
          }
        />
        {catalogRoutes.map(({ id, title, path, Component }) => (
          <Route
            key={id}
            path={path}
            element={
              <Page id={id} title={title}>
                <Component />
              </Page>
            }
          />
        ))}
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
