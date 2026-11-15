import { Link } from 'react-router-dom';
import { Comparison } from '../../components/Comparison';
import { pages } from '../../content/pages';
import type { Library } from '../../content/schema';
import {
  synopticComparisonCollection,
  synopticGuideEntries,
  synopticTopic,
} from '../../pageCatalog';
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
        related={
          readingGuide && (
            <p>
              <Link to={readingGuide.path}>{readingGuide.title}</Link>
            </p>
          )
        }
      />
    </div>
  );
}
