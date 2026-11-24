import { useId, useState } from 'react';
import type { StudyQuestion } from '../../content/synopticActivities';
import styles from './Exercises.module.css';

export function ChoiceQuestion({ prompt, choices }: StudyQuestion) {
  const name = useId();
  const [selected, setSelected] = useState<number>();
  return (
    <fieldset className={styles.question}>
      <legend>{prompt}</legend>
      <div className={styles.choices}>
        {choices.map(({ label }, index) => (
          <label key={label} className={styles.choice}>
            <input
              type="radio"
              name={name}
              checked={selected === index}
              onChange={() => setSelected(index)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      <p role="status" className={styles.feedback}>
        {selected !== undefined && choices[selected].feedback}
      </p>
    </fieldset>
  );
}
