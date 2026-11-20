import { Comparison } from '../../components/Comparison';
import { pages } from '../../content/pages';
import type { Library } from '../../content/schema';
import {
  synopticComparisonCollection,
  synopticGuideEntries,
  synopticTopic,
} from '../../pageCatalog';
import { NextComparisons } from './NextComparisons';
import { SynopticBreadcrumbs } from './SynopticLayout';
import styles from './Synoptic.module.css';

export function SynopticComparisonPage({
  comparison,
}: {
  comparison: Library['comparisons'][number];
}) {
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
        readingGuide={readingGuide}
        related={<NextComparisons currentId={comparison.id} />}
      />
    </div>
  );
}
