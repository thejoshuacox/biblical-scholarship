import { Citation } from '../../components/Editorial';
import type { Library } from '../../content/schema';
import { parableQuestion } from '../../content/synopticActivities';
import { ChoiceQuestion } from './ChoiceQuestion';
import styles from './Exercises.module.css';

export function ParableExercise({
  notes,
}: {
  notes: Library['comparisons'][number]['notes'];
}) {
  return (
    <div className={styles.exercise}>
      <ChoiceQuestion {...parableQuestion} />
      <h3>How could the pair have reached both writers?</h3>
      <p>Compare what each explanation asks Luke to have read.</p>
      {notes.map((note) => (
        <details key={note.id} className={styles.disclosure}>
          <summary>{note.title}</summary>
          <p>{note.text}</p>
          {note.citations.map((citation) => (
            <p key={citation.sourceId} className={styles.citation}>
              <Citation {...citation} />
            </p>
          ))}
        </details>
      ))}
      <p>
        <a href="#comparison-passages">Return to the passages</a>
      </p>
    </div>
  );
}
