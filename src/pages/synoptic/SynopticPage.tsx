import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { synoptic } from '../../content/synoptic';
import {
  parablesComparisonEntry,
  stormComparisonEntry,
  synopticComparisonCollection,
  synopticGuideEntries,
  synopticTopic,
} from '../../pageCatalog';
import {
  SynopticLayout,
  SynopticResourceList,
  SynopticText,
} from './SynopticLayout';
import styles from './Synoptic.module.css';

export function SynopticPage() {
  const featured = stormComparisonEntry;
  const introductoryReadings = synopticGuideEntries
    .filter(({ resourceType }) => resourceType === 'Article')
    .flatMap((entry) =>
      entry.id === 'how-to-compare'
        ? [entry, parablesComparisonEntry]
        : [entry],
    );

  return (
    <SynopticLayout isTopic>
      <header className={styles.masthead}>
        <h1>{synopticTopic.title}</h1>
        <p className="lead">{synopticTopic.description}</p>
      </header>
      <section
        className={styles.definition}
        aria-labelledby="synoptic-definition"
      >
        <h2 id="synoptic-definition">{synoptic.definition.title}</h2>
        <SynopticText
          paragraph={synoptic.definition.paragraph}
          directCitations
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
            <h3>Reading guides</h3>
            <SynopticResourceList entries={introductoryReadings} />
          </div>
        </div>
      </section>
    </SynopticLayout>
  );
}
