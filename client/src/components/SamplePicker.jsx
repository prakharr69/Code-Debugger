import React from 'react';
import { Sparkles } from 'lucide-react';
import { SAMPLE_SNIPPETS } from '../data/samples';

export default function SamplePicker({ onSelectSample, disabled }) {
  const handleChange = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const sample = SAMPLE_SNIPPETS.find(s => s.id === selectedId);
    if (sample) {
      onSelectSample(sample);
      e.target.value = ''; // Reset dropdown after selection
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
      <select
        className="btn btn-sm"
        onChange={handleChange}
        defaultValue=""
        disabled={disabled}
        style={{
          cursor: 'pointer',
          paddingRight: '1rem',
          outline: 'none'
        }}
        title="Load a preset buggy Python code snippet"
      >
        <option value="" disabled>Load Example Bug...</option>
        {SAMPLE_SNIPPETS.map(sample => (
          <option key={sample.id} value={sample.id}>
            {sample.title}
          </option>
        ))}
      </select>
    </div>
  );
}
