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
        <p className="lead">{synopticComparisonCollection.description}</p>
      </header>
      <SynopticResourceList
        entries={synopticComparisonEntries}
        openedIds={openedIds}
      />
    </SynopticLayout>
  );
}
