import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, X } from 'lucide-react';

export default function AlertBanner({ type = 'error', message, onDismiss }) {
  if (!message) return null;

  const isError = type === 'error';
  const isWarning = type === 'warning';
  const isSuccess = type === 'success';

  return (
    <div className={`alert-banner ${isSuccess ? 'alert-success' : 'alert-error'}`}>
      {isError && <AlertCircle size={18} style={{ flexShrink: 0 }} />}
      {isWarning && <AlertTriangle size={18} style={{ flexShrink: 0 }} />}
      {isSuccess && <CheckCircle size={18} style={{ flexShrink: 0 }} />}
      
      <div style={{ flex: 1, wordBreak: 'break-word' }}>
        {message}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.8
          }}
          title="Dismiss notice"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
