import React, { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { Columns, AlignJustify } from 'lucide-react';

export default function DiffView({ originalCode, fixedCode, theme }) {
  const [splitView, setSplitView] = useState(true);

  const customStyles = {
    variables: {
      dark: {
        diffViewerBackground: '#090d16',
        diffViewerColor: '#f8fafc',
        addedBackground: 'rgba(16, 185, 129, 0.18)',
        addedColor: '#34d399',
        removedBackground: 'rgba(239, 68, 68, 0.18)',
        removedColor: '#f87171',
        wordAddedBackground: 'rgba(16, 185, 129, 0.35)',
        wordRemovedBackground: 'rgba(239, 68, 68, 0.35)',
        addedGutterBackground: 'rgba(16, 185, 129, 0.25)',
        removedGutterBackground: 'rgba(239, 68, 68, 0.25)',
        gutterBackground: '#0f172a',
        gutterBackgroundDark: '#090d16',
        gutterColor: '#64748b',
        codeFoldGutterBackground: '#1e293b',
        codeFoldBackground: '#1e293b'
      },
      light: {
        diffViewerBackground: '#ffffff',
        diffViewerColor: '#0f172a',
        addedBackground: 'rgba(16, 185, 129, 0.12)',
        addedColor: '#059669',
        removedBackground: 'rgba(239, 68, 68, 0.12)',
        removedColor: '#dc2626',
        wordAddedBackground: 'rgba(16, 185, 129, 0.25)',
        wordRemovedBackground: 'rgba(239, 68, 68, 0.25)',
        gutterBackground: '#f1f5f9',
        gutterColor: '#94a3b8'
      }
    },
    line: {
      fontFamily: "'JetBrains Mono', Consolas, monospace",
      fontSize: '13px',
      lineHeight: '1.45'
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setSplitView(!splitView)}
          title={splitView ? 'Switch to Unified Inline View' : 'Switch to Split Side-by-Side View'}
        >
          {splitView ? <AlignJustify size={14} /> : <Columns size={14} />}
          <span>{splitView ? 'Unified View' : 'Split View'}</span>
        </button>
      </div>

      <div className="diff-container">
        <ReactDiffViewer
          oldValue={originalCode}
          newValue={fixedCode}
          splitView={splitView}
          useDarkTheme={theme === 'dark'}
          styles={customStyles}
          leftTitle="Original Code"
          rightTitle="Corrected Code"
        />
      </div>
    </div>
  );
}
