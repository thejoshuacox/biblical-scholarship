import { ExternalReference } from './ExternalReference';
import { library } from '../content';
import { formatReference, type Library } from '../content/schema';
import styles from './Editorial.module.css';

export function Citation({
  sourceId,
  locator,
  showDetails = true,
}: {
  sourceId: string;
  locator: string;
  showDetails?: boolean;
}) {
  const source = library.sources.find((s) => s.id === sourceId)!;
  return (
    <>
      <ExternalReference className={styles.citation} href={source.url}>
        {source.author}, {source.title.replace('Lecture ', 'lecture ')}
        <span> ({locator})</span>
      </ExternalReference>
      {showDetails && (
        <>
          {' '}
          <a
            className={styles.sourceDetails}
            href={'#source-' + sourceId}
            aria-label={
              'Source details for ' + source.author + ', ' + source.title
            }
          >
            Source details
          </a>
        </>
      )}
    </>
  );
}
export function Annotation({
  note,
}: {
  note: Library['comparisons'][number]['notes'][number];
}) {
  return (
    <article className={styles.annotation}>
      <span className="eyebrow">
        {note.kind === 'editorial'
          ? 'Textual observation'
          : 'Scholarly interpretation'}
      </span>
      <h3>{note.title}</h3>
      <p>{note.text}</p>
      {note.greek && (
        <details className={styles.greekReading}>
          <summary>Read the Greek question</summary>
          <p>
            <span lang="grc">{note.greek.text}</span> · {note.greek.gloss}
          </p>
          {note.greek.readings.map(({ label, url }) => (
            <ExternalReference key={url} href={url}>
              {label}
            </ExternalReference>
          ))}
        </details>
      )}
      {note.references.length > 0 && (
        <p className={styles.small}>
          Primary texts: {note.references.map(formatReference).join('; ')}{' '}
          (BSB).
        </p>
      )}
      {note.citations.map((c, i) => (
        <p key={i}>
          <Citation {...c} />
        </p>
      ))}
    </article>
  );
}
export function Bibliography({ ids }: { ids?: string[] }) {
  return (
    <section className={styles.bibliography} aria-labelledby="sources-heading">
      <h2 id="sources-heading">Sources & further reading</h2>
      <ol>
        {library.sources
          .filter((s) => !ids || ids.includes(s.id))
          .map((s) => (
            <li key={s.id} id={'source-' + s.id}>
              <p>
                <strong>{s.author}.</strong>{' '}
                <ExternalReference href={s.url}>{s.title}</ExternalReference>.{' '}
                {s.publisher}. {s.date}.
              </p>
              <p className={styles.small}>
                {s.details} Checked {s.verified}.
              </p>
            </li>
          ))}
      </ol>
    </section>
  );
}
