import React from 'react';

const THRESHOLDS = [7, 14, 30];

const STAGE_COLORS = {
  'Business Development': 'var(--blue)',
  'Prospect':            'var(--green)',
  'Actionable':          'var(--orange)',
  'Active':              'var(--accent)',
  'Monitoring (Stay in Touch)': 'var(--purple)',
};

export default function DigestFilter({
  threshold,
  onThresholdChange,
  stats,
  onGenerate,
  loading,
}) {
  const neverCount  = stats?.neverContacted ?? 0;
  const staleCount  = stats?.stale ?? 0;
  const totalCount  = stats?.total ?? 0;
  const worstDays   = stats?.worstDays ?? 0;

  const stageBreakdown = stats?.byStage ?? {};
  const typeBreakdown  = stats?.byType ?? {};

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      padding: '24px 40px',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Top row: threshold selector + action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>

          {/* Left: threshold */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
              Flag contacts not touched in
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {THRESHOLDS.map((t) => (
                <button
                  key={t}
                  onClick={() => onThresholdChange(t)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: threshold === t ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: threshold === t ? 'var(--accent-dim)' : 'transparent',
                    color: threshold === t ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {t}d
                </button>
              ))}
            </div>
          </div>

          {/* Right: action button */}
          <button
            className="btn btn-primary"
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : <span>»</span>}
            {loading ? 'Generating digest…' : 'Generate AI Digest'}
          </button>
        </div>

        {/* Stats row */}
        {totalCount > 0 && (
          <div style={{ marginTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <StatPill label="Need Attention" value={totalCount} color="var(--accent)" />
            <StatPill label="Never Contacted" value={neverCount} color="var(--orange)" />
            <StatPill label="Stale Contacts" value={staleCount} color="var(--accent)" />
            <StatPill label="Most Days Stale" value={worstDays > 0 ? `${worstDays}d` : '—'} color="var(--red)" />

            {/* Stage breakdown */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginLeft: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Stages:</span>
              {Object.entries(stageBreakdown).map(([stage, count]) => (
                <span key={stage} className="badge" style={{
                  color: STAGE_COLORS[stage] || 'var(--text-secondary)',
                  borderColor: `${STAGE_COLORS[stage]}44` || 'var(--border)',
                  background: `${STAGE_COLORS[stage]}18` || 'transparent',
                }}>
                  {stage.replace('Monitoring (Stay in Touch)', 'Monitoring')} {count}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '8px 16px',
    }}>
      <span style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'Playfair Display', serif" }}>{value}</span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</span>
    </div>
  );
}
