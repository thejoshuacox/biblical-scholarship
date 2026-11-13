import { Link } from 'react-router-dom';
import { library } from '../content';
import { pages } from '../content/pages';
import type { Library } from '../content/schema';
import styles from './HomePage.module.css';

function ModuleEntry({ module }: { module: Library['modules'][number] }) {
  const available = module.id === 'synoptic';
  return (
    <article
      className={
        available
          ? `${styles.moduleEntry} ${styles.featured}`
          : styles.moduleEntry
      }
    >
      <h3>
        <Link to={'/explore/' + module.id}>{module.title}</Link>
      </h3>
      <p>{module.description}</p>
      <div className={styles.moduleLinks}>
        {available ? (
          <>
            <Link to="/compare/calming-the-storm">
              Read the storm comparison
            </Link>
            <span>One comparison available</span>
          </>
        ) : (
          <>
            <Link to={'/explore/' + module.id}>See what’s planned</Link>
            <span>Planned tool</span>
          </>
        )}
      </div>
    </article>
  );
}

export function HomePage() {
  const modules = [...library.modules].sort(
    (a, b) => Number(b.id === 'synoptic') - Number(a.id === 'synoptic'),
  );
  return (
    <div className={styles.homeShell}>
      <section className={styles.homeIntro}>
        <h1>{pages.home.title}</h1>
        <p className={styles.introCopy}>{pages.home.intro}</p>
        <p className={styles.introNote}>{pages.home.note}</p>
      </section>
      <section className={styles.contents} aria-labelledby="explore-title">
        <header className={styles.contentsHeading}>
          <h2 id="explore-title">{pages.home.exploreTitle}</h2>
          <p>{pages.home.exploreIntro}</p>
        </header>
        <div>
          {modules.map((module) => (
            <ModuleEntry module={module} key={module.id} />
          ))}
        </div>
      </section>
      <section className={styles.projectNote}>
        <h2>{pages.home.welcomeTitle}</h2>
        <div>
          <p>{pages.home.welcomeText}</p>
          <Link to="/about">About the project and its methods</Link>
        </div>
      </section>
    </div>
  );
}
