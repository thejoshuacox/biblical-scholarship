import { Comparison } from '../../components/Comparison';
import { storm } from '../../content';
import { pages } from '../../content/pages';
import { synopticTopic } from '../../pageCatalog';

export function StormComparisonPage() {
  return (
    <Comparison
      comparison={storm}
      copy={pages.comparison}
      topic={synopticTopic}
    />
  );
}
