import { Fragment, useEffect, useState, useRef } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { library, storm } from './content';
import { pages } from './content/pages';
import { Comparison } from './components/Comparison';
import { Bibliography, Citation } from './components/Editorial';
import { ThemeToggle } from './components/ThemeToggle';
import type { Library } from './content/schema';
function ModulePreview({ module }: { module: Library['modules'][number] }) {
  const available = module.id === 'synoptic';
  return (
    <article className={available ? 'module-entry featured' : 'module-entry'}>
      <h3>
        <Link to={'/explore/' + module.id}>{module.title}</Link>
      </h3>
      <p>{module.description}</p>
      <div className="module-links">
        {available ? (
          <>
            <Link to="/compare/calming-the-storm">
              Read the storm comparison
            </Link>
            <span>One comparison available</span>
          </>
        ) : (
          <>
            <Link to={'/explore/' + module.id}>See what’s planned</Link>
            <span>Planned tool</span>
          </>
        )}
      </div>
    </article>
  );
}
function Layout() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    setMenu(false);
    const titles: Record<string, string> = {
      '/': 'Explore Biblical Scholarship',
      '/about': 'About & Methods',
      '/compare/calming-the-storm': 'Jesus Calms the Storm',
    };
    document.title =
      (titles[location.pathname] ||
        library.modules.find((m) => location.pathname.endsWith(m.id))?.title ||
        'Page not found') + ' — Biblical Text & Context';
    if (!location.hash) {
      window.scrollTo(0, 0);
      if (previousPath.current !== location.pathname)
        document.getElementById('main')?.focus({ preventScroll: true });
    }
    previousPath.current = location.pathname;
  }, [location.pathname, location.hash]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link
            to="/"
            className="brand"
            aria-label="Biblical Text & Context home"
          >
            <span>
              Biblical Text <i>&</i> Context
            </span>
          </Link>
          <button
            className="menu-toggle"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-controls="primary-nav"
            aria-label={menu ? 'Close menu' : 'Open menu'}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <nav
            id="primary-nav"
            className={menu ? 'open' : ''}
            aria-label="Main navigation"
          >
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/explore/torah-law">Torah laws</NavLink>
            <NavLink to="/explore/synoptic">Synoptic Gospels</NavLink>
            <NavLink to="/explore/torah-sources">Torah sources</NavLink>
            <NavLink to="/about">About & methods</NavLink>
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore/:moduleId" element={<ModulePage />} />
          <Route
            path="/compare/calming-the-storm"
            element={<Comparison comparison={storm} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div>
          <Link className="footer-brand" to="/">
            Biblical Text & Context
          </Link>
          <p>An independent project about biblical scholarship.</p>
        </div>
        <div>
          <Link to="/about">About & methods</Link>
          <a href="https://bible.helloao.org/docs/">Bible text provider</a>
        </div>
      </footer>
    </>
  );
}
function Home() {
  const modules = [...library.modules].sort(
    (a, b) => Number(b.id === 'synoptic') - Number(a.id === 'synoptic'),
  );
  return (
    <div className="home-shell">
      <section className="home-intro">
        <h1>{pages.home.title}</h1>
        <p className="intro-copy">{pages.home.intro}</p>
        <p className="intro-note">{pages.home.note}</p>
      </section>
      <section className="contents" aria-labelledby="explore-title">
        <header className="contents-heading">
          <h2 id="explore-title">{pages.home.exploreTitle}</h2>
          <p>{pages.home.exploreIntro}</p>
        </header>
        <div className="module-list">
          {modules.map((module) => (
            <ModulePreview module={module} key={module.id} />
          ))}
        </div>
      </section>
      <section className="project-note">
        <h2>{pages.home.welcomeTitle}</h2>
        <div>
          <p>{pages.home.welcomeText}</p>
          <Link to="/about">About the project and its methods</Link>
        </div>
      </section>
    </div>
  );
}
function ModulePage() {
  const { pathname } = useLocation();
  const module = library.modules.find((m) => pathname === '/explore/' + m.id);
  if (!module) return <NotFound />;
  const isSynoptic = module.id === 'synoptic';
  return (
    <div className="page-shell">
      <Link className="breadcrumb" to="/">
        Home / Explore
      </Link>
      <section className="page-intro">
        <span className="badge">Tool preview</span>
        <h1>{module.title}</h1>
        <p className="lead">{module.description}</p>
      </section>
      <div className="preview-layout">
        <section className="question-panel">
          <span className="eyebrow">This section will ask</span>
          <h2>{module.question}</h2>
        </section>
        <section>
          <h2>What’s planned</h2>
          <ul className="planned-list">
            {module.planned.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="muted">
            This is a preview.{' '}
            {isSynoptic
              ? 'One comparison is available. More passages will be added later.'
              : 'The interactive tool and its dataset haven’t been built yet.'}
          </p>
          {isSynoptic ? (
            <Link className="button primary" to="/compare/calming-the-storm">
              Compare the calming of the storm
            </Link>
          ) : (
            <Link className="button secondary" to="/compare/calming-the-storm">
              Try the Gospel comparison
            </Link>
          )}
        </section>
      </div>
      <section className="method-callout">
        <h3>{pages.preview[isSynoptic ? 'synoptic' : 'other'].title}</h3>
        <p>{pages.preview[isSynoptic ? 'synoptic' : 'other'].text}</p>
        <Link to="/about">Read about the methods</Link>
      </section>
    </div>
  );
}
function About() {
  return (
    <div className="page-shell about-page">
      <Link className="breadcrumb" to="/">
        Home / About
      </Link>
      <section className="page-intro">
        <h1>{pages.about.title}</h1>
        <p className="lead">{pages.about.intro}</p>
      </section>
      <div className="about-layout">
        <aside>
          <span className="eyebrow">On this page</span>
          {pages.about.sections.map((s) => (
            <a href={'#' + s.id} key={s.id}>
              {s.nav}
            </a>
          ))}
        </aside>
        <div className="prose">
          {pages.about.sections.map((s) => (
            <section id={s.id} key={s.id}>
              <h2>{s.title}</h2>
              {s.definitions && (
                <dl>
                  {s.definitions.map((d) => (
                    <Fragment key={d.term}>
                      <dt>{d.term}</dt>
                      <dd>{d.text}</dd>
                    </Fragment>
                  ))}
                </dl>
              )}
              {s.paragraphs.map((p, i) => (
                <p key={i}>
                  {p.text}
                  {p.citation && (
                    <>
                      {' '}
                      <Citation {...p.citation} />
                    </>
                  )}
                  {p.link && (
                    <>
                      {' '}
                      <a href={p.link.url}>{p.link.label}</a>
                    </>
                  )}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
      <Bibliography />
    </div>
  );
}
function NotFound() {
  return (
    <div className="page-shell not-found">
      <h1>Page not found</h1>
      <p>
        We couldn’t find that page. Return to the homepage to explore the
        available modules.
      </p>
      <Link className="button primary" to="/">
        Back to home
      </Link>
    </div>
  );
}
export default Layout;
