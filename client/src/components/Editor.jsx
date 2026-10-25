import React, { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Upload, Trash2, FileCode } from 'lucide-react';

const MAX_LINES = 300;
const MAX_CHARS = 12000;

export default function Editor({
  code,
  onChange,
  theme,
  isOverLimit,
  lineCount,
  charCount,
  disabled
}) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.py') && !file.name.endsWith('.txt')) {
      alert('Please upload a .py Python file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onChange(content);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
      <div className="editor-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            title="Upload Python script (.py)"
          >
            <Upload size={14} />
            <span>Upload .py</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".py,.txt"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />

          {code.trim().length > 0 && (
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => onChange('')}
              disabled={disabled}
              title="Clear editor code"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Real-time Safeguard Limit Badges */}
        <div className="editor-limits">
          <span className={`limit-tag ${lineCount > MAX_LINES ? 'limit-warning' : ''}`}>
            {lineCount} / {MAX_LINES} lines
          </span>
          <span className={`limit-tag ${charCount > MAX_CHARS ? 'limit-warning' : ''}`}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars
          </span>
        </div>
      </div>

      {/* Monaco Python Editor */}
      <div className="monaco-wrapper">
        <MonacoEditor
          height="100%"
          language="python"
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          value={code}
          onChange={(val) => onChange(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            readOnly: disabled,
            fontFamily: "'JetBrains Mono', Consolas, monospace",
            padding: { top: 10, bottom: 10 }
          }}
        />
      </div>
    </div>
  );
}
