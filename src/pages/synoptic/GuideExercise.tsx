import { useId, useState } from 'react';
import type { GuideActivity } from '../../content/synoptic';
import {
  gospelSequences,
  healingExcerpts,
  herodQuestion,
  herodReadings,
  prayerCopies,
  prayerEvidence,
  speakerFeedback,
  storyScenes,
  type StoryScene,
} from '../../content/synopticActivities';
import { ChoiceQuestion } from './ChoiceQuestion';
import styles from './Exercises.module.css';

function NarratorExercise() {
  return (
    <div className={styles.exercise}>
      <p>
        Select the storyteller’s words in each line. These short excerpts follow
        the Berean Standard Bible (BSB).
      </p>
      {healingExcerpts.map(({ reference, words }) => (
        <ChoiceQuestion
          key={reference}
          prompt={reference}
          choices={words.map((label, index) => ({
            label,
            feedback: speakerFeedback[index],
          }))}
        />
      ))}
      <details className={styles.disclosure}>
        <summary>Compare the Greek wording</summary>
        <p>
          Read just the narrator’s phrase. The English alongside it is a close
          rendering of the Greek.
        </p>
        <dl className={styles.greekList}>
          {healingExcerpts.map(({ reference, greek, gloss, url }) => (
            <div key={reference}>
              <dt>
                <a href={url}>{reference}</a>
              </dt>
              <dd>
                <span lang="grc">{greek}</span>
                <span>{gloss}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className={styles.caption}>
          Greek text from Westcott and Hort’s 1881 edition.
        </p>
      </details>
    </div>
  );
}

function HerodExercise() {
  return (
    <div className={styles.exercise}>
      <div className={styles.pair}>
        {herodReadings.map((row) => (
          <div className={styles.sample} key={row.gospel}>
            <h3>{row.gospel}</h3>
            <dl className={styles.excerpts}>
              <dt>When Herod hears about Jesus</dt>
              <dd>
                “{row.opening}” <a href={row.url}>{row.first}</a>
              </dd>
              <dt>At the banquet</dt>
              <dd>
                “{row.later}” <a href={row.url}>{row.last}</a>
              </dd>
            </dl>
          </div>
        ))}
      </div>
      <ChoiceQuestion {...herodQuestion} />
    </div>
  );
}

function StoryOrder() {
  const [selected, setSelected] = useState<StoryScene>('hometown');
  const scene = storyScenes[selected];
  const readings = gospelSequences.flatMap(({ stops }) =>
    stops.filter((stop) => stop.scene === selected),
  );
  return (
    <div className={styles.exercise}>
      <p>Select any scene to highlight its position in all three books.</p>
      <div className={styles.sequences}>
        {gospelSequences.map(({ gospel, stops }) => (
          <div className={styles.sequence} key={gospel}>
            <h3>{gospel}</h3>
            <ol aria-label={gospel + ' story order'}>
              {stops.map((stop) => (
                <li key={stop.scene}>
                  <button
                    type="button"
                    aria-label={
                      storyScenes[stop.scene].title + ', ' + stop.reference
                    }
                    aria-pressed={selected === stop.scene}
                    onClick={() => setSelected(stop.scene)}
                  >
                    <span className={styles.fullTitle}>
                      {storyScenes[stop.scene].title}
                    </span>
                    <span className={styles.shortTitle}>
                      {storyScenes[stop.scene].shortTitle}
                    </span>
                    <small>{stop.reference.slice(gospel.length + 1)}</small>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <div className={styles.finding} aria-live="polite" aria-atomic="true">
        <h3>{scene.title}</h3>
        <p>{scene.detail}</p>
        <p>{scene.question}</p>
        <ul
          className={styles.readings}
          aria-label="Read this scene"
          role="list"
        >
          {readings.map((stop) => (
            <li key={stop.reference}>
              <a href={stop.url}>{stop.reference}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ManuscriptReading() {
  const name = useId();
  const [selected, setSelected] = useState(0);
  const copy = prayerCopies[selected];
  return (
    <div className={styles.exercise}>
      <fieldset className={styles.question}>
        <legend>Choose a copy of Luke</legend>
        <div className={styles.choices}>
          {prayerCopies.map(({ name: title }, index) => (
            <label className={styles.choice} key={title}>
              <input
                type="radio"
                name={name}
                checked={selected === index}
                onChange={() => setSelected(index)}
              />
              <span>{title}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className={styles.pair}>
        <div className={styles.sample} aria-live="polite" aria-atomic="true">
          <h3>{copy.name}</h3>
          <p className={styles.quote}>{copy.gloss}</p>
          <p lang="grc" className={styles.greek}>
            {copy.greek}
          </p>
          <p>{copy.observation}</p>
        </div>
        <div className={styles.sample}>
          <h3>Matthew 6:9</h3>
          <p className={styles.quote}>Our Father in heaven</p>
          <p>
            Matthew’s opening words stay here as you switch between the two
            copies of Luke.
          </p>
          <a href="https://biblehub.com/bsb/matthew/6.htm">
            Read Matthew’s prayer (BSB)
          </a>
        </div>
      </div>
      <p className={styles.caption}>
        The English translates each opening address. The Greek uses modern word
        spacing and accents.
      </p>
    </div>
  );
}

export function GuideExercise({ activity }: { activity: GuideActivity }) {
  switch (activity) {
    case 'narrator':
      return <NarratorExercise />;
    case 'herod':
      return <HerodExercise />;
    case 'sequence':
      return <StoryOrder />;
    case 'manuscripts':
      return <ManuscriptReading />;
    case 'prayer-evidence':
      return (
        <div className={styles.exercise}>
          <ChoiceQuestion {...prayerEvidence} />
        </div>
      );
  }
}
