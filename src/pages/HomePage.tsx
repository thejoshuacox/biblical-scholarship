import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pages } from '../content/pages';
import { pagesPath, stormPath } from '../pageCatalog';
import styles from './HomePage.module.css';

export function HomePage() {
  const { intro, note, title, firstReading, welcomeTitle, welcomeText } =
    pages.home;

  return (
    <div className={styles.homeShell}>
      <section className={styles.homeIntro}>
        <div className={styles.introText}>
          <h1>{title}</h1>
          <p className={styles.introCopy}>{intro}</p>
          <p className={styles.introNote}>{note}</p>
          <Link className="button primary" to={pagesPath}>
            Browse pages <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <img
          className={styles.introImage}
          src="/images/open-books.jpg"
          width="1448"
          height="1086"
          alt=""
          fetchPriority="high"
        />
      </section>
      <section className={styles.reading} aria-labelledby="first-reading">
        <div>
          <h2 id="first-reading">Start with a passage</h2>
          <p className={styles.reference}>{firstReading.references}</p>
        </div>
        <div>
          <h3>{firstReading.title}</h3>
          <p>{firstReading.text}</p>
          <Link to={stormPath}>
            Read the storm comparison <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </section>
      <section className={styles.projectNote}>
        <h2>{welcomeTitle}</h2>
        <div>
          <p>{welcomeText}</p>
          <Link to="/about">About the project and its methods</Link>
        </div>
      </section>
    </div>
  );
}
