import { library } from '../content';
import { formatReference, type Library } from '../content/schema';
export function Citation({
  sourceId,
  locator,
}: {
  sourceId: string;
  locator: string;
}) {
  const source = library.sources.find((s) => s.id === sourceId)!;
  return (
    <a className="citation" href={'#source-' + sourceId} title={locator}>
      {source.author}, {source.title.replace('Lecture ', 'lecture ')}
      <span className="sr-only">, {locator}</span>
    </a>
  );
}
export function Annotation({
  note,
}: {
  note: Library['comparisons'][number]['notes'][number];
}) {
  return (
    <article className="annotation">
      <span className="eyebrow">
        {note.kind === 'editorial'
          ? 'Textual observation'
          : 'Scholarly interpretation'}
      </span>
      <h3>{note.title}</h3>
      <p>{note.text}</p>
      {note.references.length > 0 && (
        <p className="small">
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
    <section className="bibliography" aria-labelledby="sources-heading">
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
              <p className="small">
                {s.details} Full transcript and recording available. Checked{' '}
                {s.verified}.
              </p>
            </li>
          ))}
      </ol>
    </section>
  );
}
