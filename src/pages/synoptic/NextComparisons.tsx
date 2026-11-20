import { Link } from 'react-router-dom';
import {
  synopticComparisonCollection,
  synopticComparisonEntries,
} from '../../pageCatalog';
import { useOpenedComparisons } from './useOpenedComparisons';
import styles from './NextComparisons.module.css';
import synopticStyles from './Synoptic.module.css';

function focusLinkedChooser(chooser: HTMLElement | null) {
  if (chooser && window.location.hash === '#' + chooser.id) {
    chooser.focus({ preventScroll: true });
    chooser.scrollIntoView();
  }
}

export function NextComparisons({ currentId }: { currentId: string }) {
  const opened = useOpenedComparisons(currentId);
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
  const cards = choices.slice(0, 2).map(({ entry, previouslyOpened }) => (
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
        {cards}
      </ul>
      <Link
        to={synopticComparisonCollection.path}
        className={synopticStyles.collectionLink}
      >
        View all side-by-side comparisons
      </Link>
    </nav>
  );
}
