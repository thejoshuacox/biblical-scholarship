import { Link } from 'react-router-dom';
import { pageCatalog } from '../pageCatalog';
import styles from './PagesDirectory.module.css';

export function PagesDirectory() {
  return (
    <div className="page-shell">
      <header className={`page-intro ${styles.intro}`}>
        <h1>Pages</h1>
        <p className="lead">
          Find a reading, learn how the site works, or see what’s planned for a
          study section.
        </p>
      </header>
      <ul className={styles.grid} role="list">
        {pageCatalog.map((entry) => {
          const titleId = `directory-title-${entry.id}`;
          return (
            <li key={entry.id}>
              <Link
                to={entry.path}
                className={styles.card}
                aria-labelledby={titleId}
              >
                <div
                  className={
                    entry.thumbnail
                      ? styles.cover
                      : `${styles.cover} ${styles.logo}`
                  }
                >
                  <img
                    src={entry.thumbnail ?? '/favicon.svg'}
                    alt=""
                    width="512"
                    height="512"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className={styles.cardBody}>
                  {entry.preview && (
                    <span className={styles.preview}>Section preview</span>
                  )}
                  <h2 id={titleId}>{entry.title}</h2>
                  <p>{entry.description}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
