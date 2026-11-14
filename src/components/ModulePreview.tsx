import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { pages } from '../content/pages';
import type { Library } from '../content/schema';
import { pagesPath, stormPath } from '../pageCatalog';
import styles from './ModulePreview.module.css';

export type ModulePageProps = { module: Library['modules'][number] };

export function ModulePreview({
  module,
  method = pages.preview.other,
  children,
}: ModulePageProps & {
  method?: { title: string; text: string };
  children?: ReactNode;
}) {
  return (
    <div className="page-shell">
      <Link className="breadcrumb" to={pagesPath}>
        All pages
      </Link>
      <section className="page-intro">
        <span className="badge">Tool preview</span>
        <h1>{module.title}</h1>
        <p className="lead">{module.description}</p>
      </section>
      <div className={styles.previewLayout}>
        <section className={styles.questionPanel}>
          <span className="eyebrow">This section will ask</span>
          <h2>{module.question}</h2>
        </section>
        <section>
          <h2>What’s planned</h2>
          <ul className={styles.plannedList}>
            {module.planned.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          {children ?? (
            <>
              <p className="muted">
                This is a preview. The interactive tool and its dataset haven’t
                been built yet.
              </p>
              <Link className="button secondary" to={stormPath}>
                Try the Gospel comparison
              </Link>
            </>
          )}
        </section>
      </div>
      <section className={styles.methodCallout}>
        <h3>{method.title}</h3>
        <p>{method.text}</p>
        <Link to="/about">Read about the methods</Link>
      </section>
    </div>
  );
}
