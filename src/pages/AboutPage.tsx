import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { pages } from '../content/pages';
import { ExternalReference } from '../components/ExternalReference';
import { Bibliography, Citation } from '../components/Editorial';
import styles from './AboutPage.module.css';

export function AboutPage() {
  return (
    <div className="page-shell">
      <Link className="breadcrumb" to="/">
        Home / About
      </Link>
      <section className="page-intro">
        <h1>{pages.about.title}</h1>
        <p className="lead">{pages.about.intro}</p>
      </section>
      <div className={styles.aboutLayout}>
        <aside>
          <span className="eyebrow">On this page</span>
          {pages.about.sections.map((s) => (
            <a href={'#' + s.id} key={s.id}>
              {s.nav}
            </a>
          ))}
        </aside>
        <div className={styles.prose}>
          {pages.about.sections.map((s) => (
            <section id={s.id} key={s.id}>
              <h2>{s.title}</h2>
              {s.definitions && (
                <dl>
                  {s.definitions.map((d) => (
                    <Fragment key={d.term}>
                      <dt>{d.term}</dt>
                      <dd>{d.text}</dd>
                    </Fragment>
                  ))}
                </dl>
              )}
              {s.paragraphs.map((p, i) => (
                <p key={i}>
                  {p.text}
                  {p.citation && (
                    <>
                      {' '}
                      <Citation {...p.citation} />
                    </>
                  )}
                  {p.link && (
                    <>
                      {' '}
                      <ExternalReference href={p.link.url}>
                        {p.link.label}
                      </ExternalReference>
                    </>
                  )}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
      <Bibliography />
    </div>
  );
}
