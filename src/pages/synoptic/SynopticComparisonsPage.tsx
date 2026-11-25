import { ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { synopticComparisonCollection } from '../../pageCatalog';
import { comparisonSorts, sortedComparisons } from './comparisonOrder';
import styles from './Synoptic.module.css';
import { SynopticLayout, SynopticResourceList } from './SynopticLayout';
import { useOpenedComparisons } from './useOpenedComparisons';

export function SynopticComparisonsPage() {
  const openedIds = useOpenedComparisons();
  const [params, setParams] = useSearchParams();
  const selected =
    comparisonSorts.find(({ value }) => value === params.get('sort')) ??
    comparisonSorts[0];

  function changeSort(value: string) {
    const next = new URLSearchParams(params);
    if (value === 'gospel') next.delete('sort');
    else next.set('sort', value);
    setParams(next, { replace: true, preventScrollReset: true });
  }

  return (
    <SynopticLayout readingWidth>
      <header className="page-intro">
        <h1>{synopticComparisonCollection.title}</h1>
        <p className="lead">
          {synopticComparisonCollection.description} An “Unread” tag marks a
          comparison you haven’t opened in this browser.
        </p>
      </header>
      <div className={styles.sortPanel}>
        <div className={styles.sortRow}>
          <label htmlFor="comparison-sort">Sort comparisons</label>
          <div className={styles.selectWrap}>
            <select
              id="comparison-sort"
              value={selected.value}
              aria-describedby="sort-description"
              onChange={(event) => changeSort(event.target.value)}
            >
              {comparisonSorts.map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown size={17} aria-hidden="true" />
          </div>
        </div>
        <p id="sort-description">{selected.description}</p>
      </div>
      <SynopticResourceList
        entries={sortedComparisons(selected.value, openedIds)}
        openedIds={openedIds}
      />
    </SynopticLayout>
  );
}
