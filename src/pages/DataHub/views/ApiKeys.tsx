import React from 'react';
import { Copy, Trash2 } from 'lucide-react';

const ApiKeys: React.FC = () => {
  const keys = [
    { key: 'qwc_live_aK7x...3nPm', name: 'SCADA Integration Key', scope: 'read:scada,write:alerts', created: '01/01/2026', lastUsed: '27/02/2026 22:30', status: 'active' },
    { key: 'qwc_live_bR2y...8qLs', name: 'Mobile App Key', scope: 'read:customers,write:metering', created: '15/01/2026', lastUsed: '27/02/2026 18:00', status: 'active' },
    { key: 'qwc_live_cT5w...1kFz', name: 'ERP Kế toán Key', scope: 'read:revenue,read:contracts', created: '01/02/2026', lastUsed: '27/02/2026 22:00', status: 'active' },
    { key: 'qwc_test_dU9v...6mBn', name: 'Test Key (DEV)', scope: '*', created: '10/02/2026', lastUsed: '25/02/2026', status: 'inactive' },
  ];

  return (
    <div className="card overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-[color:var(--border)] whitespace-nowrap bg-black/10">
            <th className="p-4 text-xs font-semibold text-[color:var(--muted)] uppercase">API Key</th>
            <th className="p-4 text-xs font-semibold text-[color:var(--muted)] uppercase">Tên ứng dụng tích hợp</th>
            <th className="p-4 text-xs font-semibold text-[color:var(--muted)] uppercase">Scope (Quyền hạn)</th>
            <th className="p-4 text-xs font-semibold text-[color:var(--muted)] uppercase">Ngày tạo</th>
            <th className="p-4 text-xs font-semibold text-[color:var(--muted)] uppercase">Dùng lần cuối</th>
            <th className="p-4 text-xs font-semibold text-[color:var(--muted)] uppercase">Trạng thái</th>
            <th className="p-4 text-xs font-semibold text-[color:var(--muted)] uppercase text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((k, i) => (
            <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${k.status === 'inactive' ? 'opacity-60' : ''}`}>
              <td className="p-4 font-mono text-[12px] text-[color:var(--cyan)] font-bold">{k.key}</td>
              <td className="p-4 font-semibold text-[13px]">{k.name}</td>
              <td className="p-4">
                <code className="text-[11px] bg-[color:var(--cyan)]/10 text-white/80 px-2 py-1 rounded-md border border-[color:var(--cyan)]/20 select-all">
                  {k.scope}
                </code>
              </td>
              <td className="p-4 font-mono text-[12px] text-[color:var(--muted)]">{k.created}</td>
              <td className="p-4 font-mono text-[12px] text-[color:var(--muted)]">{k.lastUsed}</td>
              <td className="p-4">
                {k.status === 'active' ? (
                  <span className="badge badge-green font-bold text-[10px]">Đang hoạt động</span>
                ) : (
                  <span className="badge badge-gray font-bold text-[10px]">Tạm khóa</span>
                )}
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="btn btn-ghost btn-sm px-2 text-[color:var(--muted)] hover:text-[color:var(--cyan)] transition-colors">
                    <Copy size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm px-2 text-[color:var(--muted)] hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApiKeys;
