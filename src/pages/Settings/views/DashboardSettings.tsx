import React, { useState } from 'react';
import { LayoutDashboard, Save, RefreshCw } from 'lucide-react';

const DashboardSettings: React.FC = () => {
  const [panels, setPanels] = useState([
    { id: 'kpi', name: 'KPI Cards', desc: '6 thẻ thống kê chính (sản lượng, trạm, sự cố...)', visible: true, req: true },
    { id: 'charts', name: 'Biểu đồ sản lượng', desc: 'Sản lượng 12h + 6 tháng (2 biểu đồ)', visible: true, req: false },
    { id: 'stations', name: 'Trạng thái Trạm bơm', desc: 'Danh sách trạm bơm + trạng thái realtime', visible: true, req: false },
    { id: 'heatmap', name: 'Heatmap sự cố', desc: 'Bản đồ nhiệt sự cố theo giờ / ngày trong tuần', visible: true, req: false },
    { id: 'alarms', name: 'Cảnh báo hệ thống', desc: 'Danh sách cảnh báo chưa xử lý', visible: true, req: false },
    { id: 'factories', name: 'Nhà máy & Công suất', desc: 'Bảng công suất sử dụng từng nhà máy', visible: true, req: false },
    { id: 'ticker', name: 'LIVE Ticker', desc: 'Dải thông tin sự kiện realtime phía trên trang chủ', visible: true, req: false },
  ]);

  const togglePanel = (id: string) => {
    setPanels(panels.map(p => {
      if (p.id === id && !p.req) return { ...p, visible: !p.visible };
      return p;
    }));
  };

  return (
    <div className="card flex flex-col h-full min-h-[500px]">
      <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center bg-[color:var(--bg-surface)]">
        <div className="flex items-center gap-2 font-semibold">
          <LayoutDashboard size={14} className="text-[color:var(--cyan)]" /> Cấu hình các khối Dashboard
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm flex items-center gap-1.5"><RefreshCw size={14}/> Mặc định</button>
          <button className="btn btn-primary btn-sm flex items-center gap-1.5"><Save size={14}/> Lưu</button>
        </div>
      </div>
      <div className="p-5 flex-1">
        <p className="text-[13px] text-[color:var(--muted)] mb-5">
          Tùy chỉnh bố cục của trang chủ: Bật/tắt để ẩn hoặc hiện các khối tính năng trên giao diện Dashboard.
        </p>

        <div className="flex flex-col gap-3">
          {panels.map((p, idx) => (
            <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${p.visible ? 'bg-[color:var(--cyan)]/5 border-[color:var(--cyan)]/20' : 'bg-[color:var(--bg-surface)] border-[color:var(--border)] opacity-60'}`}>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-[color:var(--cyan)]/10 text-[color:var(--cyan)] font-mono font-bold text-sm flex items-center justify-center">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-semibold text-[14px] flex items-center gap-2">
                    {p.name}
                    {p.req && <span className="badge badge-gray text-[9px] uppercase">Cố định</span>}
                  </div>
                  <div className="text-[12px] text-[color:var(--muted)] mt-0.5">{p.desc}</div>
                </div>
              </div>
              <label className={`relative inline-block w-10 h-6 ${p.req ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input type="checkbox" className="sr-only peer" checked={p.visible} onChange={() => togglePanel(p.id)} disabled={p.req} />
                <span className="absolute inset-0 rounded-full transition-colors bg-[color:var(--bg-surface)] peer-checked:bg-[color:var(--cyan)]">
                  <span className="absolute w-4 h-4 bg-white rounded-full top-1 left-1 transition-all peer-checked:left-5" />
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
