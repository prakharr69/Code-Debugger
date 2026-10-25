import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="btn btn-sm"
      onClick={onToggle}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-sky-500" />}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
