import { Fragment, useEffect, useState } from 'react';
import { bible } from '../bible/helloao';
import type { Inline, Passage } from '../bible/types';
import { formatReference, type PassageReference } from '../content/schema';
import styles from './PassageDisplay.module.css';

export function InlineText({ items }: { items: Inline[] }) {
  return (
    <>
      {items.map((item, i) => (
        <Fragment key={i}>
          {item.kind === 'break' ? (
            <br />
          ) : item.kind === 'heading' ? (
            <span className={styles.textHeading}>{item.text}</span>
          ) : item.kind === 'note' ? (
            <details className={styles.translatorNote}>
              <summary aria-label={'Translator note ' + (item.id + 1)}>
                <sup>[{item.id + 1}]</sup>
              </summary>
              <span>{item.text}</span>
            </details>
          ) : (
            <span
              className={
                item.poem !== undefined ? styles.poetryLine : undefined
              }
              style={
                item.poem !== undefined
                  ? { paddingInlineStart: Math.min(item.poem, 6) * 0.6 + 'em' }
                  : undefined
              }
            >
              {i > 0 &&
              items[i - 1].kind === 'note' &&
              !/^[.,;:!?…’”)]/.test(item.text)
                ? ' '
                : ''}
              {item.text}
              {i < items.length - 1 && items[i + 1].kind === 'text' ? ' ' : ''}
            </span>
          )}
        </Fragment>
      ))}
    </>
  );
}
export function PassageDisplay({
  reference,
  passage,
  title,
  compact = false,
}: {
  reference: PassageReference | null;
  passage?: Passage;
  title: string;
  compact?: boolean;
}) {
  if (!reference)
    return (
      <div className={styles.absent}>
        <span className={styles.gospelLabel}>{title}</span>
        <p>No parallel assigned in this reading group.</p>
      </div>
    );
  const verses = passage?.verses.filter(
    (v) =>
      (v.chapter > reference.start.chapter ||
        (v.chapter === reference.start.chapter &&
          v.number >= reference.start.verse)) &&
      (v.chapter < reference.end.chapter ||
        (v.chapter === reference.end.chapter &&
          v.number <= reference.end.verse)),
  );
  return (
    <article
      className={compact ? `${styles.passage} compact` : styles.passage}
      aria-label={formatReference(reference)}
    >
      <header>
        <span className={styles.gospelLabel}>{title}</span>
        <span>
          {formatReference(reference)} · {passage?.translation.id ?? 'BSB'}
        </span>
      </header>
      <div className={styles.passageText}>
        {verses?.map((v) => (
          <Fragment key={v.chapter + ':' + v.number}>
            {v.headings.map((h, i) => (
              <p className={styles.translationHeading} key={i}>
                {h}
              </p>
            ))}
            {v.subtitle.length > 0 && (
              <div className="subtitle">
                <InlineText items={v.subtitle} />
              </div>
            )}
            <div
              className={
                v.paragraphStart
                  ? `${styles.verse} ${styles.paragraphStart}`
                  : styles.verse
              }
            >
              <sup aria-label={'Verse ' + v.chapter + ':' + v.number}>
                {reference.start.chapter !== reference.end.chapter
                  ? v.chapter + ':'
                  : ''}
                {v.number}
              </sup>{' '}
              <InlineText items={v.content} />
            </div>
          </Fragment>
        ))}
      </div>
    </article>
  );
}
export function usePassages(references: PassageReference[]) {
  const [state, setState] = useState<{
    status: 'loading' | 'ready' | 'error';
    passages: Passage[];
    error?: string;
  }>({ status: 'loading', passages: [] });
  const [attempt, setAttempt] = useState(0);
  const key = JSON.stringify(references);
  useEffect(() => {
    let active = true;
    setState({ status: 'loading', passages: [] });
    Promise.all(
      (JSON.parse(key) as PassageReference[]).map((r) => bible.getPassage(r)),
    )
      .then((passages) => {
        if (active) setState({ status: 'ready', passages });
      })
      .catch((error: unknown) => {
        if (active)
          setState({
            status: 'error',
            passages: [],
            error:
              error instanceof Error
                ? error.message
                : 'The text could not be loaded.',
          });
      });
    return () => {
      active = false;
    };
  }, [key, attempt]);
  return { ...state, retry: () => setAttempt((a) => a + 1) };
}
