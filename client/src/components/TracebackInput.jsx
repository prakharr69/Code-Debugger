import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Terminal } from 'lucide-react';

const MAX_TRACEBACK_CHARS = 4000;

export default function TracebackInput({ error, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(Boolean(error && error.trim().length > 0));

  const charCount = (error || '').length;
  const isOver = charCount > MAX_TRACEBACK_CHARS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <button
        type="button"
        className="traceback-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle error traceback input field"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Terminal size={14} style={{ color: 'var(--accent-primary)' }} />
          <span>Error Traceback (Optional)</span>
          {error && error.trim().length > 0 && (
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--accent-primary)',
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px'
              }}
            >
              Provided
            </span>
          )}
        </span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <textarea
            className="traceback-area"
            value={error}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Paste your terminal error or Python exception traceback here (e.g. IndexError, TypeError, SyntaxError)..."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.7rem', color: isOver ? 'var(--status-high-text)' : 'var(--text-dim)' }}>
            {charCount} / {MAX_TRACEBACK_CHARS} chars
          </div>
        </div>
      )}
    </div>
  );
}
