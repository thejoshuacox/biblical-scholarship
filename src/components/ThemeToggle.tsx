import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const root = document.documentElement;
  const [dark, setDark] = useState(root.dataset.theme === 'dark');

  useEffect(() => {
    const system = matchMedia('(prefers-color-scheme: dark)');
    function followSystem() {
      if (root.dataset.themePreference) return;
      root.dataset.theme = system.matches ? 'dark' : 'light';
      setDark(system.matches);
    }
    followSystem();
    system.addEventListener('change', followSystem);
    return () => system.removeEventListener('change', followSystem);
  }, [root]);

  function toggleTheme() {
    const next = dark ? 'light' : 'dark';
    root.dataset.theme = next;
    root.dataset.themePreference = next;
    setDark(!dark);
    try {
      localStorage.setItem('biblical-text-theme', next);
    } catch {
      // The choice still applies for the current visit.
    }
  }

  const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
    >
      {dark ? <Sun size={19} aria-hidden /> : <Moon size={19} aria-hidden />}
    </button>
  );
}
