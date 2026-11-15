import { library } from '../content';
import { formatReference, type Library } from '../content/schema';
import styles from './Editorial.module.css';

export function Citation({
  sourceId,
  locator,
  direct = false,
}: {
  sourceId: string;
  locator: string;
  direct?: boolean;
}) {
  const source = library.sources.find((s) => s.id === sourceId)!;
  return (
    <a
      className={styles.citation}
      href={direct ? source.url : '#source-' + sourceId}
    >
      {source.author}, {source.title.replace('Lecture ', 'lecture ')}
      <span> ({locator})</span>
    </a>
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
                <strong>{s.author}.</strong> <a href={s.url}>{s.title}</a>.{' '}
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
