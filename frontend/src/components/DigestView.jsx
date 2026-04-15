import React, { useState } from 'react';
import ContactCard from './ContactCard';

const CONTACT_TYPES = ['All', 'Seller', 'Buyer', 'Referral Partner'];

export default function DigestView({ contacts, loading }) {
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('staleness');

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 80 }}>
        <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
        <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Generating digest with AI suggestions…</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>This may take a few seconds</div>
      </div>
    );
  }

  if (!contacts) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>»»</div>
        <h2 style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: 20, marginBottom: 8 }}>Ready to surface your pipeline</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 360, lineHeight: 1.7 }}>
          Select a threshold above and click <strong style={{ color: 'var(--accent)' }}>Generate AI Digest</strong> to identify contacts that need follow-up — with Claude-powered next action suggestions.
        </p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h2 style={{ color: 'var(--text-primary)', fontSize: 20, marginBottom: 8 }}>All caught up</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No contacts have gone untouched beyond your selected threshold.</p>
      </div>
    );
  }

  // Filter + sort
  let filtered = contacts.filter(c => typeFilter === 'All' || c.contact_type === typeFilter);

  if (sortBy === 'staleness') {
    filtered = [...filtered].sort((a, b) => {
      if (a.days_since_activity === null) return -1;
      if (b.days_since_activity === null) return 1;
      return b.days_since_activity - a.days_since_activity;
    });
  } else if (sortBy === 'name') {
    filtered = [...filtered].sort((a, b) => a.contact_name.localeCompare(b.contact_name));
  } else if (sortBy === 'stage') {
    const stageOrder = ['Actionable', 'Active', 'Prospect', 'Business Development', 'Monitoring (Stay in Touch)'];
    filtered = [...filtered].sort((a, b) => stageOrder.indexOf(a.deal_stage) - stageOrder.indexOf(b.deal_stage));
  }

  const neverCount = filtered.filter(c => c.days_since_activity === null).length;

  return (
    <div style={{ flex: 1, maxWidth: 1400, margin: '0 auto', width: '100%', padding: '32px 40px' }}>

      {/* Filter / sort bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        {/* Type filter tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {CONTACT_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                border: typeFilter === t ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: typeFilter === t ? 'var(--accent-dim)' : 'var(--bg-secondary)',
                color: typeFilter === t ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {t}
              <span style={{ marginLeft: 6, color: 'var(--text-muted)', fontSize: 11 }}>
                {t === 'All' ? contacts.length : contacts.filter(c => c.contact_type === t).length}
              </span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Sort by</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)',
              padding: '6px 10px', fontSize: 12, cursor: 'pointer',
              fontFamily: "'Inter', sans-serif", outline: 'none',
            }}
          >
            <option value="staleness">Most Stale</option>
            <option value="stage">Deal Stage</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Section: never contacted */}
      {neverCount > 0 && (
        <section style={{ marginBottom: 32 }}>
          <SectionHeader
            icon="⚠"
            label="Never Contacted"
            count={neverCount}
            color="var(--orange)"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {filtered.filter(c => c.days_since_activity === null).map((c, i) => (
              <ContactCard key={c.id} contact={c} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Section: stale contacts */}
      {filtered.filter(c => c.days_since_activity !== null).length > 0 && (
        <section>
          <SectionHeader
            icon="»"
            label="Stale Contacts"
            count={filtered.filter(c => c.days_since_activity !== null).length}
            color="var(--accent)"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {filtered.filter(c => c.days_since_activity !== null).map((c, i) => (
              <ContactCard key={c.id} contact={c} index={i + neverCount} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({ icon, label, count, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
      <span style={{ color, fontSize: 14, fontWeight: 700 }}>{icon}</span>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 16, fontWeight: 600,
        color: 'var(--text-primary)', letterSpacing: 0.5,
      }}>
        {label}
      </h2>
      <span style={{
        background: `${color}22`, color, border: `1px solid ${color}44`,
        borderRadius: 20, padding: '1px 10px', fontSize: 12, fontWeight: 600,
      }}>
        {count}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)', marginLeft: 8 }} />
    </div>
  );
}
