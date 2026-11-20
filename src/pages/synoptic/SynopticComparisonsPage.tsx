import {
  synopticComparisonCollection,
  synopticComparisonEntries,
} from '../../pageCatalog';
import { SynopticLayout, SynopticResourceList } from './SynopticLayout';
import { useOpenedComparisons } from './useOpenedComparisons';

export function SynopticComparisonsPage() {
  const openedIds = useOpenedComparisons();

  return (
    <SynopticLayout readingWidth>
      <header className="page-intro">
        <h1>{synopticComparisonCollection.title}</h1>
        <p className="lead">
          {synopticComparisonCollection.description} An “Unread” tag marks a
          comparison you haven’t opened in this browser.
        </p>
      </header>
      <SynopticResourceList
        entries={synopticComparisonEntries}
        openedIds={openedIds}
      />
    </SynopticLayout>
  );
}
