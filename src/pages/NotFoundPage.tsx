import { Link } from 'react-router-dom';
import { libraryPath } from '../pageCatalog';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <div className={`page-shell ${styles.notFound}`}>
      <h1>Page not found</h1>
      <p>
        Browse the Library to find the reading or topic you were looking for.
      </p>
      <Link className="button primary" to={libraryPath}>
        Browse the Library
      </Link>
    </div>
  );
}
