import { useRef } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { CatalogCards } from '../components/CatalogCards';
import { searchCatalog } from '../pageCatalog';
import styles from './LibraryPage.module.css';

export function LibraryPage() {
  const [params, setParams] = useSearchParams();
  const searchInput = useRef<HTMLInputElement>(null);
  const query = params.get('q') ?? '';
  const searching = Boolean(query.trim());
  const matches = searchCatalog(query);
  const topics = matches.filter((entry) => entry.kind === 'topic');
  const resources = matches.filter((entry) => entry.kind === 'resource');
  const sitePages = searching
    ? matches.filter((entry) => entry.kind === 'site')
    : [];

  function updateQuery(value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set('q', value);
    else next.delete('q');
    setParams(next, { replace: true });
  }

  return (
    <div className="page-shell">
      <header className={`page-intro ${styles.intro}`}>
        <h1>Library</h1>
        <p className="lead">
          Choose a topic or look for a specific reading, passage, or tool.
        </p>
      </header>
      <form
        className={styles.search}
        role="search"
        aria-label="Library"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="library-search">Search the Library</label>
        <div className={styles.searchField}>
          <Search size={19} aria-hidden />
          <input
            ref={searchInput}
            id="library-search"
            name="q"
            type="search"
            placeholder="Try “Mark 4” or “Torah laws”"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                updateQuery('');
                searchInput.current?.focus();
              }}
            >
              Clear
            </button>
          )}
        </div>
        <p className={styles.resultCount} role="status">
          {searching
            ? `${matches.length} ${matches.length === 1 ? 'result' : 'results'}`
            : ''}
        </p>
      </form>
      {searching && !matches.length && (
        <p>Try a title, a book of the Bible, or a broader term.</p>
      )}
      {topics.length > 0 && (
        <section className={styles.section} aria-labelledby="library-topics">
          <h2 id="library-topics">Topics</h2>
          <CatalogCards entries={topics} compact />
        </section>
      )}
      {resources.length > 0 && (
        <section className={styles.section} aria-labelledby="library-resources">
          <h2 id="library-resources">Resources</h2>
          <CatalogCards entries={resources} showTopics />
        </section>
      )}
      {sitePages.length > 0 && (
        <section className={styles.section} aria-labelledby="library-site-info">
          <h2 id="library-site-info">About the site</h2>
          <CatalogCards entries={sitePages} compact />
        </section>
      )}
    </div>
  );
}
