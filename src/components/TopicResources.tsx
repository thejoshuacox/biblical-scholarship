import { resourcesForTopic } from '../pageCatalog';
import { CatalogCards } from './CatalogCards';

export function TopicResources({ topicId }: { topicId: string }) {
  const resources = resourcesForTopic(topicId);

  return (
    <section aria-labelledby="topic-resources">
      <h2 id="topic-resources">Resources</h2>
      {resources.length > 0 ? (
        <CatalogCards entries={resources} compact />
      ) : (
        <p>Resources for this topic will appear here as they’re added.</p>
      )}
    </section>
  );
}
