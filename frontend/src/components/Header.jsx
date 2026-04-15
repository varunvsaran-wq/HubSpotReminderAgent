import React from 'react';

export default function Header({ digestDate }) {
  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      padding: '0 40px',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo / wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'var(--accent)', fontSize: 20, letterSpacing: 2, fontWeight: 400 }}>»»</span>
          <div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: 1,
            }}>
              Iconic Founders Group
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 1 }}>
              Follow-Up Reminder Agent
            </div>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Daily Digest</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{digestDate}</div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--accent-dim)',
            border: '1px solid var(--border-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', fontSize: 14, fontWeight: 600,
          }}>
            IFG
          </div>
        </div>
      </div>

      {/* Tagline bar */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '8px 0',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
      }}>
        {['Grow', 'Partner', 'Exit'].map((word, i) => (
          <React.Fragment key={word}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase' }}>
              {word}
            </span>
            {i < 2 && <span style={{ color: 'var(--accent)', fontSize: 10 }}>·</span>}
          </React.Fragment>
        ))}
        <span style={{ color: 'var(--border)', margin: '0 4px' }}>|</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', letterSpacing: 1 }}>
          On Your Terms.
        </span>
      </div>
    </header>
  );
}
