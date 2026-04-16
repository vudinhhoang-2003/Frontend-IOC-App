import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Tìm class và nhãn tương ứng
  let badgeClass = 'badge-gray';
  let label = status;

  if (status === 'online') {
    badgeClass = 'badge-green';
    label = 'Hoạt động';
  } else if (status === 'warning') {
    badgeClass = 'badge-yellow';
    label = 'Cảnh báo';
  } else if (status === 'offline') {
    badgeClass = 'badge-red';
    label = 'Mất kết nối';
  } else if (status === 'fault') {
    badgeClass = 'badge-red';
    label = 'Sự cố';
  } else if (status === 'success') {
    badgeClass = 'badge-green';
    label = 'Thành công';
  } else if (status === 'fail') {
    badgeClass = 'badge-red';
    label = 'Thất bại';
  }

  return (
    <>
      <style>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .status-badge::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }
        .badge-green {
          background: rgba(0, 240, 128, 0.1);
          color: var(--green);
          border: 1px solid rgba(0, 240, 128, 0.2);
        }
        .badge-yellow {
          background: rgba(255, 219, 77, 0.1);
          color: var(--yellow);
          border: 1px solid rgba(255, 219, 77, 0.2);
        }
        .badge-red {
          background: rgba(255, 61, 87, 0.1);
          color: var(--red);
          border: 1px solid rgba(255, 61, 87, 0.2);
        }
        .badge-gray {
          background: var(--bg-hover);
          color: var(--muted);
          border: 1px solid var(--border);
        }
      `}</style>
      <span className={`status-badge ${badgeClass}`}>
        {label}
      </span>
    </>
  );
};
