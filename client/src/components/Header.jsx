import React from 'react';
import { Bug, History } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SamplePicker from './SamplePicker';

export default function Header({
  theme,
  onToggleTheme,
  onOpenHistory,
  historyCount,
  onSelectSample,
  isAnalyzing,
  modelName = 'Gemini Flash'
}) {
  return (
    <header className="header">
      <div className="brand">
        <div className="brand-icon">
          <Bug size={22} />
        </div>
        <div className="brand-text">
          <h1>PyFix AI</h1>
          <p>Intelligent Python Code Debugger</p>
        </div>
      </div>

      <div className="header-actions">

        {/* Example Snippet Picker */}
        <SamplePicker onSelectSample={onSelectSample} disabled={isAnalyzing} />

        {/* History Drawer Trigger */}
        <button
          type="button"
          className="btn btn-sm"
          onClick={onOpenHistory}
          title="View recent debug sessions"
        >
          <History size={15} />
          <span>History</span>
          {historyCount > 0 && (
            <span
              style={{
                background: 'var(--accent-primary)',
                color: 'white',
                fontSize: '0.65rem',
                borderRadius: '9999px',
                padding: '0 0.4rem',
                fontWeight: 600
              }}
            >
              {historyCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
