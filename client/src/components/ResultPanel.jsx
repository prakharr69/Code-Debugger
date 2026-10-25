import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { ListChecks, GitCompare, Code2, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import BugCard from './BugCard';
import DiffView from './DiffView';
import CodeActions from './CodeActions';

export default function ResultPanel({ result, originalCode, theme, isCached }) {
  const [activeTab, setActiveTab] = useState('bugs'); // 'bugs' | 'diff' | 'fixed'

  // If no debug result yet
  if (!result) {
    return (
      <div
        className="panel-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3rem 2rem',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ maxWidth: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}
          >
            <Code2 size={24} />
          </div>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>Ready to Debug</h3>
          <p style={{ fontSize: '0.85rem' }}>
            Paste Python code on the left, optionally provide an error traceback, or pick an example bug to get instant static analysis.
          </p>
        </div>
      </div>
    );
  }

  // Non-Python Code Rejection
  if (result.isPython === false) {
    return (
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title" style={{ color: 'var(--status-high-text)' }}>
            <ShieldAlert size={18} />
            <span>Non-Python Code Detected</span>
          </div>
        </div>
        <div className="panel-body" style={{ alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
          <div
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--status-high-bg)',
              border: '1px solid var(--status-high-border)',
              maxWidth: '460px'
            }}
          >
            <h4 style={{ color: 'var(--status-high-text)', marginBottom: '0.5rem', fontWeight: 600 }}>
              Unsupported Language
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
              {result.summary || 'PyFix AI debugs Python scripts only. The submitted input does not appear to be valid Python code.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const bugCount = result.bugs?.length || 0;

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div className="panel-title">
          <ListChecks size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>Diagnostic Results</span>
          {isCached && (
            <span
              style={{
                fontSize: '0.65rem',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--status-success-text)',
                border: '1px solid var(--status-success-border)'
              }}
              title="Served from in-memory LRU cache"
            >
              Cached
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            className={`bug-badge ${bugCount > 0 ? 'badge-high' : 'badge-low'}`}
            style={{ fontSize: '0.72rem' }}
          >
            {bugCount} {bugCount === 1 ? 'Bug' : 'Bugs'} Found
          </span>
        </div>
      </div>

      <div className="panel-body">
        {/* Executive Summary */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem'
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            Analysis Summary
          </div>
          <p style={{ color: 'var(--text-main)' }}>{result.summary}</p>
        </div>

        {/* Tab Controls */}
        <div className="result-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'bugs' ? 'active' : ''}`}
            onClick={() => setActiveTab('bugs')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ListChecks size={14} />
              <span>Bug Analysis ({bugCount})</span>
            </span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'diff' ? 'active' : ''}`}
            onClick={() => setActiveTab('diff')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <GitCompare size={14} />
              <span>Diff View</span>
            </span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'fixed' ? 'active' : ''}`}
            onClick={() => setActiveTab('fixed')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Code2 size={14} />
              <span>Fixed Code</span>
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'bugs' && (
          <div className="bug-list">
            {bugCount === 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--status-success-bg)',
                  border: '1px solid var(--status-success-border)',
                  color: 'var(--status-success-text)'
                }}
              >
                <CheckCircle2 size={20} />
                <span>No bugs detected! The Python code appears syntactically and logically sound.</span>
              </div>
            ) : (
              result.bugs.map((bug, index) => <BugCard key={index} bug={bug} />)
            )}
          </div>
        )}

        {activeTab === 'diff' && (
          <DiffView
            originalCode={originalCode}
            fixedCode={result.fixedCode || originalCode}
            theme={theme}
          />
        )}

        {activeTab === 'fixed' && (
          <div className="monaco-wrapper" style={{ height: '480px' }}>
            <MonacoEditor
              height="100%"
              language="python"
              theme={theme === 'dark' ? 'vs-dark' : 'vs'}
              value={result.fixedCode || ''}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontFamily: "'JetBrains Mono', Consolas, monospace",
                padding: { top: 10, bottom: 10 }
              }}
            />
          </div>
        )}

        {/* Code Actions (Copy & Download) */}
        {result.fixedCode && <CodeActions fixedCode={result.fixedCode} />}
      </div>
    </div>
  );
}
