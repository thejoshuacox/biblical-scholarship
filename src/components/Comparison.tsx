import { useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, RotateCcw } from 'lucide-react';
import { formatReference, type Library } from '../content/schema';
import { libraryPath, type TopicEntry } from '../pageCatalog';
import { PassageDisplay, usePassages } from './PassageDisplay';
import { Annotation, Bibliography } from './Editorial';
import { ReadNextLink } from './ReadNextLink';
import styles from './Comparison.module.css';

export function Comparison({
  comparison,
  copy,
  topic,
  breadcrumb,
  readingGuide,
  notesContent,
  related,
}: {
  comparison: Library['comparisons'][number];
  copy: { intro: string; help: string; caution: string };
  topic?: Pick<TopicEntry, 'path' | 'title'>;
  breadcrumb?: ReactNode;
  readingGuide?: Pick<TopicEntry, 'path' | 'title'>;
  notesContent?: ReactNode;
  related?: ReactNode;
}) {
  const [aligned, setAligned] = useState(true),
    [notes, setNotes] = useState(true);
  const state = usePassages(comparison.columns.map((c) => c.reference));
  return (
    <div
      className={`page-shell ${styles.comparisonPage}`}
      style={
        { '--passage-columns': comparison.columns.length } as CSSProperties
      }
    >
      {breadcrumb ?? (
        <Link className="breadcrumb" to={topic?.path ?? libraryPath}>
          {topic?.title ?? 'Library'}
        </Link>
      )}
      <section className="page-intro">
        <h1>{comparison.title}</h1>
        <p className={styles.references}>
          {comparison.columns
            .map(({ reference }) => formatReference(reference))
            .join(' · ')}
        </p>
        <p className="lead">{comparison.introduction ?? copy.intro}</p>
      </section>
      <div className={styles.comparisonToolbar}>
        <div className={styles.translationLabel}>
          <BookOpen size={18} />
          <span>
            Berean Standard Bible <strong>BSB</strong>
          </span>
        </div>
        <div className={styles.controls}>
          <div
            className={styles.segmented}
            role="group"
            aria-label="Reading layout"
          >
            <button
              id="comparison-passages"
              aria-pressed={aligned}
              onClick={() => setAligned(true)}
            >
              Aligned groups
            </button>
            <button aria-pressed={!aligned} onClick={() => setAligned(false)}>
              Whole passages
            </button>
          </div>
          <button
            className={styles.noteToggle}
            aria-pressed={notes}
            onClick={() => setNotes(!notes)}
          >
            {notes ? 'Hide' : 'Show'} reading notes
          </button>
        </div>
      </div>
      <p className={styles.comparisonHelp}>
        {copy.help}{' '}
        {readingGuide && (
          <Link to={readingGuide.path}>{readingGuide.title}</Link>
        )}
      </p>
      {state.status === 'loading' && (
        <div className={styles.loadPanel} role="status">
          <span className={styles.loadingBar} />
          <h2>Opening the passages…</h2>
          <p>Fetching the selected passages in the BSB translation.</p>
        </div>
      )}
      {state.status === 'error' && (
        <div className={styles.errorPanel} role="alert">
          <h2>The passages couldn’t be loaded</h2>
          <p>{state.error}</p>
          <p>
            Check your connection and try again. No other translation has been
            substituted.
          </p>
          <button className="button primary" onClick={state.retry}>
            <RotateCcw size={16} />
            Retry loading passages
          </button>
        </div>
      )}
      {state.status === 'ready' && (
        <div>
          {aligned ? (
            comparison.groups.map((g) => (
              <section
                className={styles.comparisonGroup}
                key={g.id}
                aria-labelledby={'group-' + g.id}
              >
                <div className={styles.groupHeading}>
                  <h2 id={'group-' + g.id}>{g.title}</h2>
                  {notes && <p>{g.explanation}</p>}
                </div>
                <div className={styles.passageGrid}>
                  {comparison.columns.map((c, j) => (
                    <PassageDisplay
                      key={c.id}
                      reference={g.cells[c.id]}
                      passage={state.passages[j]}
                      title={c.title}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className={`${styles.passageGrid} ${styles.whole}`}>
              {comparison.columns.map((c, i) => (
                <PassageDisplay
                  key={c.id}
                  reference={c.reference}
                  passage={state.passages[i]}
                  title={c.title}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <p className={styles.attribution}>
        Scripture:{' '}
        <a href="https://berean.bible/licensing.htm">
          Berean Standard Bible (BSB), public domain
        </a>
        . Text supplied by{' '}
        <a href="https://bible.helloao.org/docs/">
          AO Lab’s Free Use Bible API
        </a>
        . Section headings and translator notes belong to the translation;
        reading groups are editorial.
      </p>
      <section className={styles.readingNotes} hidden={!notes}>
        <div className={styles.sectionHeading}>
          <div>
            <h2>Reading notes</h2>
          </div>
        </div>
        {notesContent ?? (
          <div className={styles.annotationGrid}>
            {comparison.notes.map((note) => (
              <Annotation key={note.id} note={note} />
            ))}
          </div>
        )}
        <p className={styles.methodFootnote}>{copy.caution}</p>
      </section>
      {comparison.readNext && <ReadNextLink {...comparison.readNext} />}
      <Bibliography
        ids={[
          ...new Set(
            comparison.notes.flatMap((n) => n.citations.map((c) => c.sourceId)),
          ),
        ]}
      />
      {related}
    </div>
  );
}
