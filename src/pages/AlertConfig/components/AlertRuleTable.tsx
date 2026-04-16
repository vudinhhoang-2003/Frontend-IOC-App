import React from 'react';
import { Edit2, Trash2, Zap } from 'lucide-react';
import type { AlertRule, Severity } from '../types';

interface Props {
  rules: AlertRule[];
  onToggle: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const AlertRuleTable: React.FC<Props> = ({ rules, onToggle, onEdit, onDelete }) => {
  const renderSeverity = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500/15 text-red-500 border border-red-500/20 uppercase tracking-tighter">
            Nghiêm trọng
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-yellow-500/15 text-yellow-500 border border-yellow-500/20 uppercase tracking-tighter">
            Cảnh báo
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-cyan-500/15 text-[var(--cyan)] border border-[var(--cyan)]/20 uppercase tracking-tighter">
            Thông tin
          </span>
        );
    }
  };

  return (
    <div className="card bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-[var(--border)] flex items-center gap-2">
        <div className="w-5 h-5 flex items-center justify-center rounded-md bg-[var(--cyan)]/10 text-[var(--cyan)]">
          <Zap size={14} strokeWidth={2.5} />
        </div>
        <span className="text-[14.5px] font-bold text-[var(--text)] tracking-tight uppercase">Danh sách Cảnh báo</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-surface)]/50 border-b border-[var(--border)]">
              <th className="py-4 px-6 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Tên Cảnh báo</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Trạm áp dụng</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Thông số</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Ngưỡng</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider text-center">Độ ưu tiên</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider text-center">Trạng thái</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(r => (
              <tr key={r.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-hover)] transition-colors group">
                <td className="py-5 px-6 font-bold text-[14px] text-[var(--text)] whitespace-nowrap">{r.name}</td>
                <td className="py-5 px-6">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[11px] font-bold text-[var(--muted)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--muted)] opacity-50" />
                    {r.station}
                  </div>
                </td>
                <td className="py-5 px-6 text-[13.5px] font-medium text-[var(--text-2)]">{r.param}</td>
                <td className="py-5 px-6 font-mono font-bold text-[14px] text-[var(--cyan)] uppercase tracking-widest">{r.threshold}</td>
                <td className="py-5 px-6">
                  <div className="flex justify-center">
                    {r.severity === 'critical' ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/40 uppercase tracking-tight">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--red)] shadow-[0_0_8px_var(--red)]" /> Nghiêm trọng
                      </span>
                    ) : r.severity === 'warning' ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--yellow)]/10 text-[var(--yellow)] border border-[var(--yellow)]/40 uppercase tracking-tight">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--yellow)] shadow-[0_0_8px_var(--yellow)]" /> Cảnh báo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/40 uppercase tracking-tight">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)]" /> Thông tin
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div 
                    className="flex justify-center items-center gap-2 cursor-pointer group/status" 
                    onClick={() => onToggle(r.id)}
                  >
                    {r.active ? (
                      <>
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--green)] shadow-[0_0_12px_var(--green)]" />
                        <span className="text-[13px] font-bold text-[var(--text)]">Đang chạy</span>
                      </>
                    ) : (
                      <span className="text-[13px] font-bold text-[var(--muted)] opacity-60">Tạm ngưng</span>
                    )}
                  </div>
                </td>
                <td className="py-5 px-6 text-right">
                  <div className="flex justify-end gap-2 pr-2">
                    <button 
                      onClick={() => onEdit(r.id)}
                      className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[11.5px] font-bold text-[var(--muted)] hover:text-[var(--cyan)] hover:border-[var(--cyan)]/30 transition-all"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => onDelete(r.id)}
                      className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[11.5px] font-bold text-[var(--muted)] hover:text-red-500 hover:border-red-500/30 transition-all"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertRuleTable;
