import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { pageCatalog, pagesPath } from '../pageCatalog';
import styles from './SiteLayout.module.css';

export function PagesMenu() {
  const [open, setOpen] = useState(false);
  const group = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;

    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (list.current?.contains(document.activeElement))
        toggle.current?.focus();
      setOpen(false);
    }

    function dismissOutside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !group.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', dismissOnEscape);
    document.addEventListener('pointerdown', dismissOutside);
    return () => {
      document.removeEventListener('keydown', dismissOnEscape);
      document.removeEventListener('pointerdown', dismissOutside);
    };
  }, [open]);

  return (
    <div
      className={styles.pagesMenu}
      ref={group}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType === 'mouse' &&
          !list.current?.contains(document.activeElement)
        ) {
          setOpen(false);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <NavLink to={pagesPath} end onClick={() => setOpen(false)}>
        Pages
      </NavLink>
      <button
        ref={toggle}
        className={styles.pagesToggle}
        type="button"
        aria-label="Page links"
        aria-controls="page-links"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <ChevronDown size={16} aria-hidden />
      </button>
      <ul
        className={styles.pageLinks}
        id="page-links"
        ref={list}
        hidden={!open}
      >
        {pageCatalog.map((entry) => (
          <li key={entry.id}>
            <NavLink to={entry.path} end onClick={() => setOpen(false)}>
              {entry.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
