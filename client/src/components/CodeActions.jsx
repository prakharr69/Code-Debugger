import React, { useState } from 'react';
import { Copy, Check, Download, AlertTriangle } from 'lucide-react';

export default function CodeActions({ fixedCode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([fixedCode], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fixed_script.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn-sm"
          onClick={handleCopy}
          title="Copy corrected Python code to clipboard"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy Fixed Code'}</span>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={handleDownload}
          title="Download corrected code as fixed_script.py"
        >
          <Download size={14} />
          <span>Download .py</span>
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.73rem',
          color: 'var(--text-dim)',
          padding: '0.4rem 0.6rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(148, 163, 184, 0.06)'
        }}
      >
        <AlertTriangle size={13} style={{ color: 'var(--status-med-text)', flexShrink: 0 }} />
        <span>
          AI-generated fixes should always be reviewed before running. Antigravity performs static analysis only and never executes code.
        </span>
      </div>
    </div>
  );
}
