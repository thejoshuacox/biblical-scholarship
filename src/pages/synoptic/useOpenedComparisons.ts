import { useEffect, useState } from 'react';
import { synopticComparisonEntries } from '../../pageCatalog';

const openedPrefix = 'biblical-text-opened-comparison:';
const openedInMemory = new Set<string>();

function getOpenedComparisons() {
  const opened = new Set(openedInMemory);
  try {
    for (const { id } of synopticComparisonEntries) {
      if (localStorage.getItem(openedPrefix + id) === '1') opened.add(id);
    }
  } catch {
    // The in-memory flags still work when browser storage is unavailable.
  }
  return opened;
}

export function useOpenedComparisons(currentId?: string) {
  const [opened, setOpened] = useState(getOpenedComparisons);

  useEffect(() => {
    if (currentId) {
      try {
        localStorage.setItem(openedPrefix + currentId, '1');
      } catch {
        openedInMemory.add(currentId);
      }
    }
    setOpened(getOpenedComparisons());

    function syncOpened(event: StorageEvent) {
      if (event.key === null || event.key.startsWith(openedPrefix)) {
        setOpened(getOpenedComparisons());
      }
    }
    window.addEventListener('storage', syncOpened);
    return () => window.removeEventListener('storage', syncOpened);
  }, [currentId]);

  return opened;
}
