import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import DigestFilter from './components/DigestFilter';
import DigestView from './components/DigestView';

const API = '/api';

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

function computeStats(contacts) {
  if (!contacts) return null;
  const stale = contacts.filter(c => c.days_since_activity !== null);
  const never = contacts.filter(c => c.days_since_activity === null);
  const byStage = {};
  const byType  = {};
  contacts.forEach(c => {
    byStage[c.deal_stage]  = (byStage[c.deal_stage]  || 0) + 1;
    byType[c.contact_type] = (byType[c.contact_type] || 0) + 1;
  });
  return {
    total: contacts.length,
    stale: stale.length,
    neverContacted: never.length,
    worstDays: stale.length ? Math.max(...stale.map(c => c.days_since_activity)) : 0,
    byStage,
    byType,
  };
}

export default function App() {
  const [threshold, setThreshold] = useState(14);
  const [contacts, setContacts]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [toasts, setToasts]       = useState([]);

  const handleThresholdChange = useCallback((t) => {
    setThreshold(t);
    setContacts(null);
  }, []);

  function addToast(message, type = 'success') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }

  async function handleGenerate() {
    setLoading(true);
    setContacts(null);
    try {
      const res  = await fetch(`${API}/digest/generate`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ threshold }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setContacts(data.contacts);
      addToast(`Digest ready — ${data.count} contacts flagged`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  const stats = computeStats(contacts);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Header digestDate={today} />

      <DigestFilter
        threshold={threshold}
        onThresholdChange={handleThresholdChange}
        stats={stats}
        onGenerate={handleGenerate}
        loading={loading}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <DigestView contacts={contacts} loading={loading} />
      </main>

      <footer style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '16px 40px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>
          <span style={{ color: 'var(--accent)', marginRight: 8 }}>»»</span>
          ICONIC FOUNDERS GROUP &nbsp;·&nbsp; Grow. Partner. Exit. On Your Terms.
        </div>
      </footer>

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="toast-icon">{t.type === 'success' ? '✓' : '✕'}</span>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
