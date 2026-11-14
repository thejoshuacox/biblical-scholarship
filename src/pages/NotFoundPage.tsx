import { Link } from 'react-router-dom';
import { pagesPath } from '../pageCatalog';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <div className={`page-shell ${styles.notFound}`}>
      <h1>Page not found</h1>
      <p>
        Browse the directory to find the reading or study section you were
        looking for.
      </p>
      <Link className="button primary" to={pagesPath}>
        Browse pages
      </Link>
    </div>
  );
}
