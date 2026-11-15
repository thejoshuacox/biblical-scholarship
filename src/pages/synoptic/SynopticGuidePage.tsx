import { Link } from 'react-router-dom';
import { Bibliography } from '../../components/Editorial';
import { ReadNextLink } from '../../components/ReadNextLink';
import type { SynopticGuide } from '../../content/synoptic';
import { SynopticLayout, SynopticText } from './SynopticLayout';
import styles from './Synoptic.module.css';

export function SynopticGuidePage({ guide }: { guide: SynopticGuide }) {
  const sourceIds = [
    ...new Set(
      guide.sections.flatMap(({ paragraphs }) =>
        paragraphs.flatMap(({ citations }) =>
          citations.map(({ sourceId }) => sourceId),
        ),
      ),
    ),
  ];

  return (
    <SynopticLayout readingWidth>
      <header className="page-intro">
        <h1>{guide.title}</h1>
        <p className="lead">{guide.intro}</p>
      </header>
      {guide.sections.map(({ title, paragraphs, diagram, links }) => (
        <section className={styles.guideSection} key={title}>
          <h2>{title}</h2>
          {diagram && (
            <figure
              className={styles.diagram}
              aria-label={title + ' source relationships'}
            >
              <ul role="list">
                {diagram.map(({ from, to, hypothetical }) => (
                  <li key={from}>
                    <span
                      className={
                        hypothetical ? styles.proposed : styles.diagramLabel
                      }
                    >
                      {from}
                    </span>
                    <span className={styles.diagramArrow} aria-hidden>
                      →
                    </span>
                    <span className="sr-only"> used as a source by </span>
                    <span className={styles.diagramLabel}>{to}</span>
                  </li>
                ))}
              </ul>
            </figure>
          )}
          {paragraphs.map((paragraph) => (
            <SynopticText key={paragraph.text} paragraph={paragraph} />
          ))}
          {links.map(({ label, path }) => (
            <Link className={styles.readingLink} to={path} key={path}>
              {label}
            </Link>
          ))}
        </section>
      ))}
      {guide.readNext && <ReadNextLink {...guide.readNext} />}
      <Bibliography ids={sourceIds} />
    </SynopticLayout>
  );
}
