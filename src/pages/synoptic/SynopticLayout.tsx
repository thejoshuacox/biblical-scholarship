import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Citation } from '../../components/Editorial';
import type { SynopticParagraph } from '../../content/synoptic';
import { libraryPath, synopticTopic, type PageEntry } from '../../pageCatalog';
import styles from './Synoptic.module.css';

type ResourceListEntry = Pick<
  PageEntry,
  'id' | 'path' | 'title' | 'description'
> & {
  references?: string;
};
const libraryLink = { path: libraryPath, title: 'Library' };

export function SynopticBreadcrumbs({
  links,
}: {
  links: readonly { path: string; title: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol>
        {links.map(({ path, title }, index) => (
          <li key={path}>
            {index > 0 && <ChevronRight size={13} aria-hidden />}
            <Link className="breadcrumb" to={path}>
              {title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SynopticLayout({
  children,
  isTopic = false,
  readingWidth = false,
}: {
  children: ReactNode;
  isTopic?: boolean;
  readingWidth?: boolean;
}) {
  return (
    <div className={styles.theme}>
      <div className={`page-shell ${readingWidth ? styles.readingShell : ''}`}>
        <SynopticBreadcrumbs
          links={isTopic ? [libraryLink] : [libraryLink, synopticTopic]}
        />
        {children}
      </div>
    </div>
  );
}

export function SynopticText({
  paragraph,
  directCitations = false,
}: {
  paragraph: SynopticParagraph;
  directCitations?: boolean;
}) {
  return (
    <div className={styles.paragraph}>
      <p>{paragraph.text}</p>
      {paragraph.readings.length > 0 && (
        <ul className={styles.references} aria-label="Passages" role="list">
          {paragraph.readings.map(({ label, url }) => (
            <li key={label}>
              <a href={url}>{label}</a>
            </li>
          ))}
        </ul>
      )}
      {paragraph.citations.map((citation) => (
        <p className={styles.source} key={citation.sourceId}>
          <Citation {...citation} direct={directCitations} />
        </p>
      ))}
    </div>
  );
}

export function SynopticResourceList({
  entries,
  openedIds,
}: {
  entries: readonly ResourceListEntry[];
  openedIds?: ReadonlySet<string>;
}) {
  return (
    <ul className={styles.resources} role="list">
      {entries.map(({ id, path, title, description, references }) => {
        const unreadId =
          openedIds && !openedIds.has(id) ? 'unread-' + id : undefined;
        return (
          <li key={id}>
            <Link to={path} aria-describedby={unreadId}>
              <span>{title}</span>
              <ChevronRight size={18} aria-hidden />
            </Link>
            {(references || unreadId) && (
              <p className={styles.referenceLine}>
                {references && <span>{references}</span>}
                {unreadId && (
                  <span className={styles.unreadNote} id={unreadId}>
                    Unread
                  </span>
                )}
              </p>
            )}
            <p>{description}</p>
          </li>
        );
      })}
    </ul>
  );
}
