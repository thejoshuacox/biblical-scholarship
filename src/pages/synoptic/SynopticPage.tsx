import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { synoptic } from '../../content/synoptic';
import {
  mockingComparisonEntry,
  parablesComparisonEntry,
  stormComparisonEntry,
  synopticComparisonCollection,
  synopticGuideEntries,
  synopticTopic,
} from '../../pageCatalog';
import {
  focusLinkedSection,
  SynopticLayout,
  SynopticResourceList,
  SynopticText,
} from './SynopticLayout';
import styles from './Synoptic.module.css';

const introductoryReadings = synopticGuideEntries.filter(
  ({ resourceType }) => resourceType === 'Article',
);
const handsOnStudies = [
  parablesComparisonEntry,
  ...synopticGuideEntries.filter(({ resourceType }) => resourceType === 'Tool'),
  mockingComparisonEntry,
];

export function SynopticPage() {
  const featured = stormComparisonEntry;

  return (
    <SynopticLayout isTopic>
      <header className={styles.masthead}>
        <h1>{synopticTopic.title}</h1>
        <p className="lead">{synopticTopic.description}</p>
        <nav className={styles.topicNav} aria-label="On this topic">
          <a href="#hands-on-studies">Hands-on studies</a>
          <a href="#reading-guides">Reading guides</a>
          <Link to={synopticComparisonCollection.path}>Browse comparisons</Link>
        </nav>
      </header>
      <section
        className={styles.definition}
        aria-labelledby="synoptic-definition"
      >
        <h2 id="synoptic-definition">{synoptic.definition.title}</h2>
        <SynopticText
          paragraph={synoptic.definition.paragraph}
          showSourceDetails={false}
        />
      </section>
      <section
        className={styles.resourceSection}
        aria-labelledby="topic-resources"
      >
        <h2 id="topic-resources">Resources</h2>
        <div className={styles.resourceColumns}>
          <div>
            <article className={styles.featured}>
              <img src={featured.thumbnail} width={300} height={300} alt="" />
              <div className={styles.featuredText}>
                <h3>
                  <Link to={featured.path}>{featured.title}</Link>
                </h3>
                <p className={styles.referenceLine}>{featured.references}</p>
                <p>
                  When does Jesus question the disciples about their fear or
                  faith?
                </p>
              </div>
            </article>
            <Link
              className={styles.collectionLink}
              to={synopticComparisonCollection.path}
            >
              {synopticComparisonCollection.title}
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <div className={styles.guideLinks}>
            <h3 id="reading-guides" ref={focusLinkedSection} tabIndex={-1}>
              Reading guides
            </h3>
            <SynopticResourceList entries={introductoryReadings} />
          </div>
        </div>
      </section>
      <section
        className={styles.resourceSection}
        aria-labelledby="hands-on-studies"
      >
        <h2 id="hands-on-studies" ref={focusLinkedSection} tabIndex={-1}>
          Hands-on studies
        </h2>
        <ul className={styles.studyGrid} role="list">
          {handsOnStudies.map(({ id, title, description, path }) => (
            <li key={id}>
              <Link
                to={path}
                aria-labelledby={'study-' + id}
                aria-describedby={'summary-' + id}
              >
                <span className={styles.studyTitle} id={'study-' + id}>
                  {title}
                </span>
                <span className={styles.studyDescription} id={'summary-' + id}>
                  {description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SynopticLayout>
  );
}
