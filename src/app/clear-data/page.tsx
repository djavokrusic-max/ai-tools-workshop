'use client';

import { useState } from 'react';

export default function ClearDataPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const clearData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/clear-data', { method: 'POST' });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setResult('Error: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>🗑️ 清除数据</h1>
      <p>清除需求和评论，保留用户数据</p>
      <button 
        onClick={clearData}
        disabled={loading}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '清空中...' : '清除数据'}
      </button>
      {result && (
        <pre style={{ marginTop: '20px', padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
          {result}
        </pre>
      )}
    </div>
  );
}
