import React from 'react';

export default function Header({ digestDate }) {
  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      padding: '0 40px',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img
            src="/Logo.PNG"
            alt="Iconic Founders Group"
            style={{ height: 48, width: 'auto', objectFit: 'contain' }}
          />
          <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase' }}>
            Follow-Up Reminder Agent
          </div>
        </div>

        {/* Right side */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Daily Digest</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{digestDate}</div>
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
