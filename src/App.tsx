import { Fragment, useEffect, useState, useRef } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Columns3,
  Layers3,
  Scale,
  Menu,
  X,
  Bookmark,
  LibraryBig,
  Sparkles,
} from 'lucide-react';
import { library, storm } from './content';
import { pages } from './content/pages';
import { Comparison } from './components/Comparison';
import { Bibliography, Citation } from './components/Editorial';
import type { Library } from './content/schema';
const icons = {
  'torah-law': Scale,
  synoptic: Columns3,
  'torah-sources': Layers3,
};
function ModulePreview({
  module,
  index,
}: {
  module: Library['modules'][number];
  index: number;
}) {
  const Icon = icons[module.id as keyof typeof icons] || BookOpen;
  return (
    <Link
      to={'/explore/' + module.id}
      className={'module-card module-' + module.id}
    >
      <div className="card-top">
        <Icon size={27} strokeWidth={1.4} />
        <span className="badge">PREVIEW</span>
      </div>
      <span className="eyebrow">{module.eyebrow}</span>
      <h3>{module.title}</h3>
      <p>{module.description}</p>
      <div className="card-bottom">
        <span>Explore the preview</span>
        <span className="card-number">0{index + 1}</span>
      </div>
    </Link>
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
            <BookOpen size={34} strokeWidth={1.4} />
            <span>
              Biblical Text <i>&</i> Context
              <small>EXPLORE BIBLICAL SCHOLARSHIP</small>
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
            <BookOpen size={25} />
            Biblical Text & Context
          </Link>
          <p>Ancient texts. Thoughtful questions. Room to explore.</p>
        </div>
        <div>
          <Link to="/about">Our approach</Link>
          <a href="https://bible.helloao.org/docs/">Bible text provider</a>
          <span>An independent educational project</span>
        </div>
      </footer>
    </>
  );
}
function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="tiny-rule" />
            {pages.home.eyebrow}
          </span>
          <h1>
            {pages.home.titleStart}
            <br />
            {pages.home.titleMiddle} <em>{pages.home.titleEmphasis}</em>
          </h1>
          <p>{pages.home.intro}</p>
          <div className="hero-actions">
            <Link className="button primary" to="/compare/calming-the-storm">
              <Columns3 size={18} />
              Try a passage comparison
            </Link>
            <Link className="text-link" to="/about">
              Meet our approach
            </Link>
          </div>
          <div className="hero-note">
            <BookOpen size={17} />
            <span>{pages.home.note}</span>
          </div>
        </div>
        <div
          className="hero-study"
          aria-label="A reading guide to the three Synoptic Gospels"
        >
          <div className="study-top">
            <span className="eyebrow">A CLOSER LOOK</span>
            <span className="edition">01 / THE GOSPELS</span>
          </div>
          <h2>
            {pages.home.studyTitle}
            <br />
            <em>{pages.home.studyEmphasis}</em>
          </h2>
          <div className="gospel-diagram">
            <div>
              <span>01</span>
              <strong>Matthew</strong>
              <small>8:23–27</small>
            </div>
            <div>
              <span>02</span>
              <strong>Mark</strong>
              <small>4:35–41</small>
            </div>
            <div>
              <span>03</span>
              <strong>Luke</strong>
              <small>8:22–25</small>
            </div>
          </div>
          <div className="study-bottom">
            <Bookmark size={19} />
            <p>
              The calming of the storm
              <br />
              <span>{pages.home.studyCaption}</span>
            </p>
          </div>
        </div>
      </section>
      <div className="principles-strip">
        <span>
          <BookOpen size={19} />
          Begin with the text
        </span>
        <span>
          <LibraryBig size={19} />
          Follow the sources
        </span>
        <span>
          <Sparkles size={19} />
          Make room for questions
        </span>
      </div>
      <section className="explore-section" aria-labelledby="explore-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{pages.home.exploreEyebrow}</span>
            <h2 id="explore-title">{pages.home.exploreTitle}</h2>
          </div>
          <p>{pages.home.exploreIntro}</p>
        </div>
        <div className="module-grid">
          {library.modules.map((m, i) => (
            <ModulePreview module={m} index={i} key={m.id} />
          ))}
        </div>
      </section>
      <section className="invitation">
        <div>
          <span className="eyebrow">{pages.home.welcomeEyebrow}</span>
          <h2>{pages.home.welcomeTitle}</h2>
        </div>
        <div>
          <p>{pages.home.welcomeText}</p>
          <Link className="text-link" to="/about">
            How we approach the Bible
          </Link>
        </div>
      </section>
    </>
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
        <span className="badge">MODULE PREVIEW</span>
        <h1>{module.title}</h1>
        <p className="lead">{module.description}</p>
      </section>
      <div className="preview-layout">
        <section className="question-panel">
          <span className="eyebrow">THE GUIDING QUESTION</span>
          <h2>{module.question}</h2>
          <BookOpen size={48} strokeWidth={1} />
        </section>
        <section>
          <h2>What this space will offer</h2>
          <ul className="planned-list">
            {module.planned.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="muted">
            This is a preview.{' '}
            {isSynoptic
              ? 'One small comparison is ready to explore; the wider passage library is still ahead.'
              : 'The full interactive tool and scholarly dataset are not yet available.'}
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
        <Link to="/about">Read our methods</Link>
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
        <span className="eyebrow">ABOUT & METHODS</span>
        <h1>
          {pages.about.title}
          <br />
          <em>{pages.about.titleEmphasis}</em>
        </h1>
        <p className="lead">{pages.about.intro}</p>
      </section>
      <div className="about-layout">
        <aside>
          <span className="eyebrow">OUR COMMITMENTS</span>
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
      <span className="eyebrow">PAGE NOT FOUND</span>
      <h1>A different path.</h1>
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
