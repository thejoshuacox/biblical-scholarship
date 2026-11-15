import { useId } from 'react';
import { Link } from 'react-router-dom';
import { findTopic, resourceLabel, type PageEntry } from '../pageCatalog';
import styles from './CatalogCards.module.css';

export function CatalogCards({
  entries,
  compact = false,
  showTopics = false,
}: {
  entries: readonly PageEntry[];
  compact?: boolean;
  showTopics?: boolean;
}) {
  const idPrefix = useId();

  return (
    <ul
      className={compact ? `${styles.grid} ${styles.compact}` : styles.grid}
      role="list"
    >
      {entries.map((entry) => {
        const titleId = `${idPrefix}-${entry.id}`;
        const topic =
          entry.kind === 'resource' && showTopics
            ? findTopic(entry.topicId)
            : undefined;

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
                {entry.kind === 'resource' && (
                  <p className={styles.label}>
                    {resourceLabel(entry)}
                    {topic && ` · ${topic.title}`}
                  </p>
                )}
                <h3 id={titleId}>{entry.title}</h3>
                <p>{entry.description}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
