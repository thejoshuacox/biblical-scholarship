import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gospelReadingOrder } from './comparisonOrder';
import { Comparison } from '../../components/Comparison';
import { pages } from '../../content/pages';
import type { Library } from '../../content/schema';
import {
  synopticComparisonCollection,
  synopticGuideEntries,
  synopticTopic,
} from '../../pageCatalog';
import { NextComparisons } from './NextComparisons';
import { ParableExercise } from './ParableExercise';
import { SynopticBreadcrumbs } from './SynopticLayout';
import styles from './Synoptic.module.css';

export function SynopticComparisonPage({
  comparison,
}: {
  comparison: Library['comparisons'][number];
}) {
  const position = gospelReadingOrder.findIndex(
    ({ id }) => id === comparison.id,
  );
  const next = gospelReadingOrder[position + 1];
  const readingGuide = synopticGuideEntries.find(
    ({ id }) => id === 'how-to-compare',
  );

  return (
    <div className={styles.theme}>
      <Comparison
        comparison={comparison}
        copy={pages.comparison}
        breadcrumb={
          <SynopticBreadcrumbs
            links={[synopticTopic, synopticComparisonCollection]}
          />
        }
        sequenceNavigation={
          <nav aria-label="Gospel reading order" className={styles.sequenceNav}>
            <span className={styles.sequenceCount}>
              Comparison {position + 1} of {gospelReadingOrder.length}
            </span>
            <Link
              to={next?.path ?? synopticComparisonCollection.path}
              rel={next ? 'next' : undefined}
            >
              <span className={styles.sequenceLabel}>
                {next ? 'Next in Gospel order' : 'End of Gospel order'}
              </span>
              <span className={styles.sequenceTitle}>
                {next?.title ?? 'Browse all comparisons'}
              </span>
              <ChevronRight size={19} aria-hidden="true" />
            </Link>
          </nav>
        }
        readingGuide={readingGuide}
        notesContent={
          comparison.id === 'mustard-seed-and-yeast' ? (
            <ParableExercise notes={comparison.notes} />
          ) : undefined
        }
        related={<NextComparisons currentId={comparison.id} />}
      />
    </div>
  );
}
