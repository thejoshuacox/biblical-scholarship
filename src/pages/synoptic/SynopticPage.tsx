import { Link } from 'react-router-dom';
import { TopicResources } from '../../components/TopicResources';
import { pages } from '../../content/pages';
import { libraryPath, synopticTopic } from '../../pageCatalog';

export function SynopticPage() {
  const { title, text, planned } = pages.topics.synoptic;

  return (
    <div className="page-shell">
      <Link className="breadcrumb" to={libraryPath}>
        Library
      </Link>
      <header className="page-intro">
        <h1>{synopticTopic.title}</h1>
        <p className="lead">{synopticTopic.description}</p>
      </header>
      <TopicResources topicId={synopticTopic.id} />
      <section className="page-intro">
        <h2>{title}</h2>
        <p>{text}</p>
        <p>{planned}</p>
      </section>
    </div>
  );
}
