import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import styles from './SiteLayout.module.css';

export function SiteLayout() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    setMenu(false);
    if (!location.hash) {
      window.scrollTo(0, 0);
      if (previousPath.current !== location.pathname)
        document.getElementById('main')?.focus({ preventScroll: true });
    }
    previousPath.current = location.pathname;
  }, [location.pathname, location.hash]);
  return (
    <>
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <Link
            to="/"
            className={styles.brand}
            aria-label="Biblical Text & Context home"
          >
            <span>
              Biblical Text <i>&</i> Context
            </span>
          </Link>
          <button
            className={styles.menuToggle}
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-controls="primary-nav"
            aria-label={menu ? 'Close menu' : 'Open menu'}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <nav
            id="primary-nav"
            className={menu ? styles.open : undefined}
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
      <Outlet />
      <footer className={styles.siteFooter}>
        <div>
          <Link className={styles.footerBrand} to="/">
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
