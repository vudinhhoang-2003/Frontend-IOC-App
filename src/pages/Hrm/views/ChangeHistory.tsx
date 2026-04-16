import React, { useState } from 'react';
import { Clock, Plus, Edit2, Trash2, Settings, Search } from 'lucide-react';
import type { ChangeHistoryLog } from '../data';

interface ChangeHistoryProps {
  history: ChangeHistoryLog[];
}

const ChangeHistory: React.FC<ChangeHistoryProps> = ({ history }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'add': return <Plus size={14} className="text-[color:var(--green)]" />;
      case 'update': return <Edit2 size={14} className="text-[color:var(--blue)]" />;
      case 'delete': return <Trash2 size={14} className="text-[color:var(--red)]" />;
      case 'system': return <Settings size={14} className="text-[color:var(--purple)]" />;
      default: return <Clock size={14} className="text-[color:var(--muted)]" />;
    }
  };

  const formattedDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const filteredHistory = history.filter(h => 
    h.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <p className="text-[13px] text-[color:var(--muted)]">
          Theo dõi chi tiết các thao tác, thay đổi dữ liệu nhân sự trên hệ thống.
        </p>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" />
          <input 
            type="text" 
            placeholder="Tìm kiếm tác vụ, người thực hiện..." 
            className="bg-black/20 border border-[color:var(--border)] rounded-lg pl-9 pr-4 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors w-72"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[color:var(--border)]">
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase w-[160px]">Thời gian</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase w-[200px]">Tác vụ</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Chi tiết thay đổi</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase w-[160px]">Người thực hiện</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((log) => (
              <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2 text-[12px] text-[color:var(--muted)]">
                    <Clock size={12} />
                    {formattedDate(log.timestamp)}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center shrink-0">
                      {getIconForType(log.type)}
                    </div>
                    <span className="font-semibold text-[13px]">{log.action}</span>
                  </div>
                </td>
                <td className="p-3 text-[13px] text-[color:var(--muted)]">
                  {log.description}
                </td>
                <td className="p-3">
                  <span className="text-[13px] font-medium">{log.user}</span>
                </td>
              </tr>
            ))}
            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-[color:var(--muted)]">
                  Không tìm thấy lịch sử thay đổi phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChangeHistory;
