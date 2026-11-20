import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { synopticComparisonEntries } from '../../pageCatalog';
import styles from './NextComparisons.module.css';

const openedPrefix = 'biblical-text-opened-comparison:';
const openedInMemory = new Set<string>();

function getOpenedComparisons() {
  const opened = new Set(openedInMemory);
  try {
    for (const { id } of synopticComparisonEntries) {
      if (localStorage.getItem(openedPrefix + id) === '1') opened.add(id);
    }
  } catch {
    // The in-memory flags still work when browser storage is unavailable.
  }
  return opened;
}

function focusLinkedChooser(chooser: HTMLElement | null) {
  if (chooser && window.location.hash === '#' + chooser.id) {
    chooser.focus({ preventScroll: true });
    chooser.scrollIntoView();
  }
}

export function NextComparisons({ currentId }: { currentId: string }) {
  const [opened, setOpened] = useState(getOpenedComparisons);

  useEffect(() => {
    try {
      localStorage.setItem(openedPrefix + currentId, '1');
    } catch {
      openedInMemory.add(currentId);
    }
    setOpened(getOpenedComparisons());

    function syncOpened(event: StorageEvent) {
      if (event.key === null || event.key.startsWith(openedPrefix)) {
        setOpened(getOpenedComparisons());
      }
    }
    window.addEventListener('storage', syncOpened);
    return () => window.removeEventListener('storage', syncOpened);
  }, [currentId]);

  const current = synopticComparisonEntries.find(({ id }) => id === currentId);
  const choices = synopticComparisonEntries
    .filter(({ id }) => id !== currentId)
    .map((entry) => ({
      entry,
      previouslyOpened: opened.has(entry.id),
      sharedThemes: entry.themes.filter((theme) =>
        current?.themes.includes(theme),
      ).length,
    }))
    .sort(
      (a, b) =>
        Number(a.previouslyOpened) - Number(b.previouslyOpened) ||
        b.sharedThemes - a.sharedThemes,
    );

  if (!choices.length) return null;
  const allOpened = choices.every(({ previouslyOpened }) => previouslyOpened);
  const cards = choices.map(({ entry, previouslyOpened }) => (
    <li key={entry.id}>
      <Link
        to={entry.path}
        className={styles.card}
        aria-labelledby={'next-title-' + entry.id}
        aria-describedby={'next-description-' + entry.id}
      >
        <span className={styles.title} id={'next-title-' + entry.id}>
          {entry.title}
        </span>
        <span
          className={styles.description}
          id={'next-description-' + entry.id}
        >
          {entry.description}
          {previouslyOpened && (
            <span className={styles.opened}>Previously opened</span>
          )}
        </span>
      </Link>
    </li>
  ));
  const more = cards.slice(2);

  return (
    <nav
      className={styles.chooser}
      id="next-comparisons"
      aria-labelledby="next-comparisons-heading"
      ref={focusLinkedChooser}
      tabIndex={-1}
    >
      <h2 id="next-comparisons-heading">Choose your next comparison</h2>
      <p className={styles.intro}>
        {allOpened
          ? 'You’ve opened every comparison in this browser. Choose one to revisit.'
          : 'Passages you haven’t opened in this browser come first, starting with related readings.'}
      </p>
      <ul className={styles.cards} role="list">
        {cards.slice(0, 2)}
      </ul>
      {more.length > 0 && (
        <details className={styles.more}>
          <summary>More comparisons ({more.length})</summary>
          <ul className={styles.cards} role="list">
            {more}
          </ul>
        </details>
      )}
    </nav>
  );
}
