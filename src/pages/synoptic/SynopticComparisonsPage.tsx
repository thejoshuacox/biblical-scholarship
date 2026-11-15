import {
  synopticComparisonCollection,
  synopticComparisonEntries,
} from '../../pageCatalog';
import { SynopticLayout, SynopticResourceList } from './SynopticLayout';

export function SynopticComparisonsPage() {
  return (
    <SynopticLayout readingWidth>
      <header className="page-intro">
        <h1>{synopticComparisonCollection.title}</h1>
        <p className="lead">{synopticComparisonCollection.description}</p>
      </header>
      <SynopticResourceList entries={synopticComparisonEntries} />
    </SynopticLayout>
  );
}
