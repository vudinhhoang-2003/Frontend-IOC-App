import React from 'react';
import type { ApprovalRequest, ApprovalHistory } from '../types';

interface SummaryCardsProps {
  pendingRequests: ApprovalRequest[];
  history: ApprovalHistory[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ pendingRequests, history }) => {
  const pendingCount = pendingRequests.length;
  const urgentCount = pendingRequests.filter(x => x.urgency === 'high').length;

  const cards = [
    { label: 'Chờ phê duyệt', val: pendingCount, sub: '', color: '#ff6d00', icon: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
    { label: 'Ưu tiên cao', val: urgentCount, sub: 'Cần xử lý hôm nay', color: '#ff4444', icon: '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
    { label: 'Đã duyệt tháng này', val: history.filter(h => h.status === 'approved').length, sub: 'Tháng 3/2026', color: 'var(--green)', icon: '<polyline points="20 6 9 17 4 12"/>' },
    { label: 'Từ chối tháng này', val: history.filter(h => h.status === 'rejected').length, sub: 'Tháng 3/2026', color: 'var(--muted)', icon: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
      {cards.map((c, i) => (
        <div key={i} className="card" style={{ padding: '16px', borderLeft: `3px solid ${c.color}`, background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)', borderLeftWidth: '3px', borderLeftColor: c.color }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', background: `${c.color}18`, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.color.startsWith('var') ? `var(--${c.color.slice(6, -1)})` : c.color} strokeWidth="2" dangerouslySetInnerHTML={{ __html: c.icon }} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: c.color }}>{c.val}</div>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{c.label}</div>
          {c.sub ? <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{c.sub}</div> : null}
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
