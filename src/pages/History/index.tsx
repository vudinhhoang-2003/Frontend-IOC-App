import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Download, Search, FileJson, X } from 'lucide-react';
import { mockActivityLog, type AuditLog } from './data';

const History: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('Tất cả');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const uniqueUsers = useMemo(() => {
    const users = new Set(mockActivityLog.map(log => log.user));
    return Array.from(users);
  }, []);

  const filteredLogs = useMemo(() => {
    return mockActivityLog.filter(log => {
      const matchSearch = 
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchUser = selectedUser ? log.user === selectedUser : true;
      
      return matchSearch && matchUser;
    });
  }, [searchQuery, selectedUser]);

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'UPDATE': return 'badge-blue';
      case 'CREATE': return 'badge-green';
      case 'DELETE': return 'badge-red';
      case 'SYSTEM': return 'badge-gray';
      case 'EXPORT': return 'badge-yellow';
      default: return 'badge-gray';
    }
  };

  const getInitials = (name: string) => {
    if (name === 'System') return 'S';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto custom-scrollbar animate-fadeInScale">
      {/* Page Header */}
      <div className="page-header mb-6 flex justify-between items-start">
        <div className="page-title">
          <h1 className="text-[22px] font-bold text-[color:var(--text)]">Lịch sử thay đổi</h1>
          <p className="text-[13px] text-[color:var(--muted)] mt-0.5">
            Audit log toàn bộ thao tác trong hệ thống
          </p>
        </div>
        <div className="page-actions flex gap-2.5">
          <button className="btn btn-ghost btn-sm" onClick={() => alert('Đang xuất log...')}>
            <Download size={14} className="mr-1 inline-block" /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative flex-1 min-w-[250px] max-w-[400px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" />
          <input 
            type="text" 
            placeholder="Tìm theo user, hành động, đối tượng..."
            className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg pl-9 pr-4 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select 
          className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors text-[color:var(--text)]"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="Hôm nay">Hôm nay</option>
          <option value="7 ngày qua">7 ngày qua</option>
          <option value="30 ngày qua">30 ngày qua</option>
          <option value="Tất cả">Tất cả</option>
        </select>

        <select 
          className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors text-[color:var(--text)]"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Tất cả người dùng</option>
          {uniqueUsers.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      {/* Main Table */}
      <div className="card overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-[color:var(--border)] whitespace-nowrap">
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase w-[80px]">#</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase w-[150px]">Thời gian</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Tài khoản</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase w-[100px]">Loại</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Hành động</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Đối tượng</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase w-[120px]">IP</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase w-[80px] text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-surface)] transition-colors">
                <td className="p-3 font-mono text-[12px] text-[color:var(--muted)]">{log.id}</td>
                <td className="p-3 font-mono text-[12px] text-[color:var(--muted)]">{log.time}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0050cc] to-[color:var(--cyan)] flex items-center justify-center text-[11px] font-bold text-white shadow-sm shrink-0">
                      {getInitials(log.user)}
                    </div>
                    <span className="text-[13px] font-semibold">{log.user}</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`badge ${getTypeBadgeClass(log.type)} text-[10px]`}>
                    {log.type}
                  </span>
                </td>
                <td className="p-3 text-[13px] text-[color:var(--text)]">{log.action}</td>
                <td className="p-3 text-[12px] text-[color:var(--cyan)]">{log.target}</td>
                <td className="p-3 font-mono text-[11px] text-[color:var(--muted)]">{log.ip}</td>
                <td className="p-3 text-right">
                  <button 
                    className="btn btn-ghost btn-sm px-2 text-[color:var(--muted)] hover:text-[color:var(--text)]" 
                    title="Xem JSON Data"
                    onClick={() => setSelectedLog(log)}
                  >
                    <FileJson size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[color:var(--muted)] text-[13px]">
                  Không tìm thấy nhật ký phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail */}
      {selectedLog && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-[4px] p-4 animate-fadeIn" onClick={() => setSelectedLog(null)}>
          <div className="bg-[color:var(--bg-elevated)] border border-[color:var(--border)] rounded-xl w-full max-w-[500px] shadow-2xl flex flex-col overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-[color:var(--border)]">
              <h3 className="font-bold text-lg text-[color:var(--text)]">Chi tiết Audit Log #{selectedLog.id}</h3>
              <button 
                className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
                onClick={() => setSelectedLog(null)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto">
              <div className="grid grid-cols-[110px_1fr] gap-3 mb-5 text-[13px] text-[color:var(--text)]">
                <div className="text-[color:var(--muted)]">Tài khoản:</div>
                <div className="font-semibold">{selectedLog.user}</div>
                
                <div className="text-[color:var(--muted)]">Hành động:</div>
                <div className="text-[color:var(--text)]">{selectedLog.action}</div>
                
                <div className="text-[color:var(--muted)]">Đối tượng:</div>
                <div className="text-[color:var(--cyan)] font-medium">{selectedLog.target}</div>
                
                <div className="text-[color:var(--muted)]">Thời gian:</div>
                <div className="font-mono text-[12px]">{selectedLog.time}</div>
                
                <div className="text-[color:var(--muted)]">IP Address:</div>
                <div className="font-mono text-[12px] opacity-80">{selectedLog.ip}</div>
              </div>

              <div className="text-[12px] font-bold text-[color:var(--muted)] mb-2 tracking-wide uppercase flex items-center gap-2">
                <FileJson size={12} /> Payload (JSON)
              </div>
              <pre className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg p-3 text-[color:var(--green)] font-mono text-[12px] whitespace-pre-wrap break-all shadow-inner max-h-[250px] overflow-y-auto">
                {selectedLog.details 
                  ? JSON.stringify(JSON.parse(selectedLog.details), null, 2) 
                  : '{}'}
              </pre>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default History;
