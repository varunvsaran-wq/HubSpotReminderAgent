import React, { useState } from 'react';

const STAGE_CONFIG = {
  'Business Development': { color: 'var(--blue)',   short: 'Biz Dev' },
  'Prospect':             { color: 'var(--green)',   short: 'Prospect' },
  'Actionable':           { color: 'var(--orange)',  short: 'Actionable' },
  'Active':               { color: 'var(--accent)',  short: 'Active' },
  'Monitoring (Stay in Touch)': { color: 'var(--purple)', short: 'Monitoring' },
};

const TYPE_CONFIG = {
  'Seller':           { color: 'var(--green)', icon: '↑' },
  'Buyer':            { color: 'var(--blue)',  icon: '↓' },
  'Referral Partner': { color: 'var(--teal)',  icon: '⇄' },
};

function staleLabel(days) {
  if (days === null) return { text: 'Never contacted', urgent: true };
  if (days === 0) return { text: 'Today', urgent: false };
  if (days === 1) return { text: '1 day ago', urgent: false };
  return { text: `${days} days ago`, urgent: days >= 30 };
}

export default function ContactCard({ contact, index }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const stage = STAGE_CONFIG[contact.deal_stage] || { color: 'var(--text-secondary)', short: contact.deal_stage };
  const type  = TYPE_CONFIG[contact.contact_type]  || { color: 'var(--text-secondary)', icon: '○' };
  const { text: staleText, urgent } = staleLabel(contact.days_since_activity);

  const staleDays = contact.days_since_activity;
  let urgencyBorder = 'var(--border)';
  if (staleDays === null || staleDays >= 60) urgencyBorder = 'rgba(224,96,96,0.40)';
  else if (staleDays >= 30) urgencyBorder = 'rgba(232,138,74,0.40)';
  else if (staleDays >= 14) urgencyBorder = 'rgba(196,164,74,0.35)';

  async function copyMessage() {
    if (!contact.draft_message) return;
    await navigator.clipboard.writeText(contact.draft_message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fade-in"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${urgencyBorder}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        animationDelay: `${index * 40}ms`,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Card header */}
      <div style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* Avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Playfair Display', serif",
          fontSize: 16, fontWeight: 600, color: 'var(--accent)',
        }}>
          {contact.contact_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>

        {/* Main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
              {contact.contact_name}
            </span>
            {/* type badge */}
            <span className="badge" style={{
              color: type.color,
              borderColor: `${type.color}44`,
              background: `${type.color}18`,
              fontSize: 10,
            }}>
              {type.icon} {contact.contact_type}
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            {contact.company}
          </div>
          <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {/* Stage */}
            <span className="badge" style={{
              color: stage.color,
              borderColor: `${stage.color}44`,
              background: `${stage.color}18`,
            }}>
              {stage.short}
            </span>
            {/* Industry */}
            <span className="badge" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'transparent' }}>
              {contact.industry}
            </span>
            {/* Owner */}
            <span className="badge" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'transparent' }}>
              {contact.owner}
            </span>
          </div>
        </div>

        {/* Right: staleness */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: staleDays === null || staleDays >= 30 ? 'var(--orange)' : staleDays >= 14 ? 'var(--accent)' : 'var(--text-secondary)',
          }}>
            {staleText}
          </div>
          {contact.last_activity_date && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {new Date(contact.last_activity_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          )}
        </div>
      </div>

      {/* Last activity note */}
      {contact.last_activity_note && (
        <div style={{ padding: '0 24px 16px', paddingLeft: 24 + 44 + 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
            Last Note
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{contact.last_activity_note}"
          </div>
        </div>
      )}

      {/* AI suggestions panel */}
      {contact.next_action && (
        <>
          <div className="divider" />
          <div style={{ padding: '16px 24px' }}>
            {/* Next action */}
            <div style={{ display: 'flex', gap: 10, marginBottom: contact.draft_message ? 12 : 0 }}>
              <span style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>»</span>
              <div>
                <div style={{ fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>
                  Suggested Next Action
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {contact.next_action}
                </div>
              </div>
            </div>

            {/* Draft message — collapsible */}
            {contact.draft_message && (
              <div style={{ marginTop: 12, paddingLeft: 24 }}>
                <button
                  onClick={() => setExpanded(!expanded)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--accent)', fontSize: 12, fontWeight: 600,
                    letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4,
                    fontFamily: "'Inter', sans-serif", padding: 0,
                  }}
                >
                  <span style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>›</span>
                  {expanded ? 'Hide' : 'View'} Draft Message
                </button>
                {expanded && (
                  <div className="fade-in" style={{
                    marginTop: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 16px',
                  }}>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                      {contact.draft_message}
                    </p>
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm" onClick={copyMessage}>
                        {copied ? '✓ Copied' : '⎘ Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
