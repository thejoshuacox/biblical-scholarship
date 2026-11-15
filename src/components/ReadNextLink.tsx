import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './ReadNextLink.module.css';

export function ReadNextLink({ path, label }: { path: string; label: string }) {
  return (
    <Link className={styles.card} to={path}>
      <span className={styles.text}>
        <span className={styles.label}>Read next</span>
        <span className={styles.title}>{label}</span>
      </span>
      <ArrowRight className={styles.arrow} size={22} aria-hidden />
    </Link>
  );
}
