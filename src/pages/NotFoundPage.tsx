import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <div className={`page-shell ${styles.notFound}`}>
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
