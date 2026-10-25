import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Check, Wrench, Copy } from 'lucide-react';

export default function BugCard({ bug }) {
  const [fixCopied, setFixCopied] = useState(false);
  const { line, type, severity, explanation, fix } = bug;

  const severityBadgeClass = {
    high: 'badge-high',
    med: 'badge-med',
    low: 'badge-low'
  }[severity] || 'badge-med';

  const severityIcon = {
    high: <AlertCircle size={13} />,
    med: <AlertTriangle size={13} />,
    low: <Info size={13} />
  }[severity] || <Info size={13} />;

  return (
    <div className="bug-card">
      <div className="bug-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="bug-line-chip">Line {line}</span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 600
            }}
          >
            {type}
          </span>
        </div>

        <div className={`bug-badge ${severityBadgeClass}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {severityIcon}
          <span>{severity}</span>
        </div>
      </div>

      <p className="bug-explanation">{explanation}</p>

      {fix && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              <Wrench size={13} />
              <span>Recommended Fix</span>
            </div>
            <button
              type="button"
              className="btn btn-sm"
              style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem', background: 'transparent' }}
              onClick={() => {
                navigator.clipboard.writeText(fix);
                setFixCopied(true);
                setTimeout(() => setFixCopied(false), 1500);
              }}
              title="Copy this fix"
            >
              {fixCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{fixCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="bug-fix">{fix}</div>
        </div>
      )}
    </div>
  );
}
