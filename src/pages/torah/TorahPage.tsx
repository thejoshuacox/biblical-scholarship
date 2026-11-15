import { Link } from 'react-router-dom';
import { TopicResources } from '../../components/TopicResources';
import { libraryPath, torahTopic } from '../../pageCatalog';

export function TorahPage() {
  return (
    <div className="page-shell">
      <Link className="breadcrumb" to={libraryPath}>
        Library
      </Link>
      <header className="page-intro">
        <h1>{torahTopic.title}</h1>
        <p className="lead">{torahTopic.description}</p>
      </header>
      <TopicResources topicId={torahTopic.id} />
    </div>
  );
}
