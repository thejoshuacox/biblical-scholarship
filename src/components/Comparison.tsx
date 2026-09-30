import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, RotateCcw } from 'lucide-react';
import { pages } from '../content/pages';
import type { Library } from '../content/schema';
import { PassageDisplay, usePassages } from './PassageDisplay';
import { Annotation, Bibliography } from './Editorial';
export function Comparison({
  comparison,
}: {
  comparison: Library['comparisons'][number];
}) {
  const [aligned, setAligned] = useState(true),
    [notes, setNotes] = useState(true);
  const state = usePassages(comparison.columns.map((c) => c.reference));
  return (
    <div className="page-shell comparison-page">
      <Link className="breadcrumb" to="/explore/synoptic">
        Explore / Synoptic Gospels
      </Link>
      <section className="page-intro">
        <span className="eyebrow">Synoptic Gospel comparison</span>
        <h1>{comparison.title}</h1>
        <p className="lead">{pages.comparison.intro}</p>
      </section>
      <div className="comparison-toolbar">
        <div className="translation-label">
          <BookOpen size={18} />
          <span>
            Berean Standard Bible <strong>BSB</strong>
          </span>
        </div>
        <div className="controls">
          <div className="segmented" role="group" aria-label="Reading layout">
            <button aria-pressed={aligned} onClick={() => setAligned(true)}>
              Aligned groups
            </button>
            <button aria-pressed={!aligned} onClick={() => setAligned(false)}>
              Whole passages
            </button>
          </div>
          <button
            className="note-toggle"
            aria-pressed={notes}
            onClick={() => setNotes(!notes)}
          >
            {notes ? 'Hide' : 'Show'} reading notes
          </button>
        </div>
      </div>
      <p className="comparison-help">{pages.comparison.help}</p>
      {state.status === 'loading' && (
        <div className="load-panel" role="status">
          <span className="loading-bar" />
          <h2>Opening the passages…</h2>
          <p>Fetching the selected passages in the BSB translation.</p>
        </div>
      )}
      {state.status === 'error' && (
        <div className="error-panel" role="alert">
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
        <div className="comparison-content">
          {aligned ? (
            comparison.groups.map((g, i) => (
              <section
                className="comparison-group"
                key={g.id}
                aria-labelledby={'group-' + g.id}
              >
                <div className="group-heading">
                  <h2 id={'group-' + g.id}>
                    <span>0{i + 1}</span>
                    {g.title}
                  </h2>
                  {notes && <p>{g.explanation}</p>}
                </div>
                <div className="passage-grid">
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
            <div className="passage-grid whole">
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
      <p className="attribution">
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
      {notes && (
        <section className="reading-notes">
          <div className="section-heading">
            <div>
              <h2>Reading notes</h2>
            </div>
          </div>
          <div className="annotation-grid">
            {comparison.notes.map((note) => (
              <Annotation key={note.id} note={note} />
            ))}
          </div>
          <p className="method-footnote">{pages.comparison.caution}</p>
        </section>
      )}
      <Bibliography
        ids={[
          ...new Set(
            comparison.notes.flatMap((n) => n.citations.map((c) => c.sourceId)),
          ),
        ]}
      />
    </div>
  );
}
