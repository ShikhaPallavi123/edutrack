import { useState } from 'react';
export default function AiPanel({ onGenerate, buttonLabel = '✨ Generate AI Summary' }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  async function handle() {
    setLoading(true);
    setResult('');
    const text = await onGenerate();
    setResult(text);
    setLoading(false);
  }
  return (
    <div>
      <button onClick={handle} disabled={loading} style={{
        padding: '7px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
        background: '#E8EFF9', color: '#1E4D8C', border: '1px solid #C0D4F0',
        cursor: loading ? 'not-allowed' : 'pointer'
      }}>
        {loading ? '⏳ Generating...' : buttonLabel}
      </button>
      {result && (
        <div style={{ marginTop: 12, background: 'linear-gradient(135deg,#EAF0FB,#F3EDF9)', border: '1px solid #C8D8F0', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span style={{ background: '#1E4D8C', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>AI</span>
            <span style={{ fontSize: 12, color: '#5C5955' }}>Generated</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{result}</p>
        </div>
      )}
    </div>
  );
}
