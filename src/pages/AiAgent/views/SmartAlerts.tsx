import React from 'react';
import { Settings, Send } from 'lucide-react';

const SmartAlerts: React.FC = () => {
  const alerts = [
    { msg: 'Chất lượng nước Cẩm Phả – Clo dư 0.61 mg/L vượt ngưỡng (max 0.5)', sent: 'SMS + Zalo → GĐ IOC', time: '27/02/2026 18:55', level: 'warning' },
    { msg: 'Trạm bơm Vân Đồn mất kết nối SCADA > 30 phút', sent: 'Push → Kỹ thuật trưởng', time: '27/02/2026 20:58', level: 'critical' },
    { msg: 'PIN tồn kho Polymer Anion dưới mức tối thiểu', sent: 'Email → Phòng Vật tư', time: '27/02/2026 19:30', level: 'warning' },
    { msg: 'Máy bơm #2 Cẩm Phả – Motor Overload, dừng tự động', sent: 'SMS + Email → Ban Điều hành', time: '27/02/2026 21:45', level: 'critical' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[color:var(--muted)]">
          Hệ thống tự động gửi khi phát hiện chỉ số vượt ngưỡng. Tổng tháng 2: <strong className="text-[color:var(--cyan)]">12 cảnh báo</strong> đã gửi.
        </p>
        <button className="btn btn-outline btn-sm flex items-center gap-1.5 border-[color:var(--border)] bg-[color:var(--bg-card)] text-[color:var(--text)] hover:bg-[color:var(--bg-hover)] font-bold transition-all">
          <Settings size={14} /> Cấu hình ngưỡng
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {alerts.map((a, i) => (
          <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${a.level === 'warning' ? 'bg-[color:var(--yellow)]/5 border-[color:var(--yellow)]/30 shadow-[0_4px_12px_rgba(250,204,21,0.05)]' : 'bg-[color:var(--red)]/5 border-[color:var(--red)]/30 shadow-[0_4px_12px_rgba(248,113,113,0.05)]'} relative group hover:bg-[color:var(--bg-hover)] transition-all`}>
            {/* Status Dot */}
            <div className={`w-3 h-3 mt-1.5 rounded-full shrink-0 ${a.level === 'warning' ? 'bg-[color:var(--yellow)] shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'bg-[color:var(--red)] shadow-[0_0_8px_rgba(248,113,113,0.4)]'}`} />
            
            <div className="flex-1">
              <div className="text-[14px] font-bold text-[color:var(--text)] mb-2 leading-relaxed">{a.msg}</div>
              <div className="flex items-center gap-2 text-[11px] text-[color:var(--muted)] font-bold">
                <Send size={11} className={a.level === 'warning' ? 'text-[color:var(--yellow)] opacity-80' : 'text-[color:var(--red)] opacity-80'} />
                Gửi qua: <span className="text-[color:var(--cyan)] font-black uppercase tracking-tight">{a.sent}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0 text-right">
              <div className="text-[11px] font-mono font-bold text-[color:var(--muted)] bg-[color:var(--bg-surface)] border border-[color:var(--border)] px-2.5 py-1 rounded-lg">{a.time}</div>
              <span className="badge badge-green text-[9px] font-black uppercase tracking-widest shadow-sm">Đã gửi</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartAlerts;
