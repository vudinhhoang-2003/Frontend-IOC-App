import React, { useState } from 'react';
import { Server, Activity, Sliders, Download, Settings as SettingsIcon } from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [devBanner, setDevBanner] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [auditLog, setAuditLog] = useState(true);
  const [rateLimit, setRateLimit] = useState(true);

  const toggleStyle = (on: boolean) => ({
    background: on ? 'var(--cyan)' : 'var(--bg-surface)',
    border: `1px solid ${on ? 'var(--cyan)' : 'var(--border)'}`,
    transition: '0.3s'
  });

  const toggleThumbStyle = (on: boolean) => ({
    left: on ? '21px' : '3px',
    transition: '0.3s'
  });

  const ToggleItem = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-[color:var(--border)] last:border-0">
      <div className="text-[13px] font-medium">{label}</div>
      <label className="relative inline-block w-10 h-[22px] cursor-pointer">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="absolute inset-0 rounded-full" style={toggleStyle(checked)}>
          <span className="absolute w-4 h-4 bg-white rounded-full top-[3px]" style={toggleThumbStyle(checked)} />
        </span>
      </label>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Thông tin hệ thống */}
        <div className="card">
          <div className="p-4 border-b border-[color:var(--border)] flex items-center gap-2 font-semibold">
            <Server size={14} /> Thông tin hệ thống
          </div>
          <div className="p-4 flex flex-col">
            {[
              ['Phiên bản', 'Quawaco IOC v1.0.0'],
              ['Môi trường', 'Production'],
              ['Máy chủ', 'ioc.quawaco.vn'],
              ['Cổng HTTPS', '443'],
              ['Cơ sở dữ liệu', 'PostgreSQL 15.2'],
              ['Bộ nhớ cache', 'Redis 7.0'],
              ['Cập nhật lần cuối', '28/02/2026 00:00'],
              ['Trạng thái', '<span class="badge badge-green">Trực tuyến</span>']
            ].map(([k, v], i) => (
              <div key={i} className="flex items-center py-2.5 border-b border-[color:var(--border)] last:border-0">
                <span className="min-w-[160px] text-xs text-[color:var(--muted)]">{k}</span>
                <span className="text-[13px]" dangerouslySetInnerHTML={{ __html: v }} />
              </div>
            ))}
          </div>
        </div>

        {/* Hiệu suất realtime */}
        <div className="card">
          <div className="p-4 border-b border-[color:var(--border)] flex items-center gap-2 font-semibold">
            <Activity size={14} /> Hiệu suất realtime
          </div>
          <div className="p-4 flex flex-col">
            {[
              ['CPU Server', '34%', 'var(--green)'],
              ['RAM sử dụng', '2.1 / 8 GB', 'var(--cyan)'],
              ['Disk I/O', '12 MB/s', 'var(--cyan)'],
              ['Kết nối DB', '18 / 100', 'var(--green)'],
              ['Uptime', '99.94% (30 ngày)', 'var(--green)'],
              ['Latency API', '28 ms', 'var(--green)'],
              ['WebSocket clients', '7 kết nối', 'var(--cyan)'],
              ['Hàng đợi job', '0 pending', 'var(--green)']
            ].map(([k, v, c], i) => (
              <div key={i} className="flex items-center py-2.5 border-b border-[color:var(--border)] last:border-0">
                <span className="min-w-[160px] text-xs text-[color:var(--muted)]">{k}</span>
                <span className="text-[13px] font-mono font-semibold" style={{ color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chế độ vận hành */}
        <div className="card">
          <div className="p-4 border-b border-[color:var(--border)] flex items-center gap-2 font-semibold">
            <Sliders size={14} /> Chế độ vận hành
          </div>
          <div className="p-4 flex flex-col">
            <ToggleItem label="Chế độ bảo trì — Khóa toàn bộ người dùng trừ Admin" checked={maintenance} onChange={setMaintenance} />
            <ToggleItem label="Debug mode — Ghi log chi tiết (tăng disk I/O)" checked={debugMode} onChange={setDebugMode} />
            <ToggleItem label="Hiện banner môi trường Dev/Test" checked={devBanner} onChange={setDevBanner} />
            <ToggleItem label="Tự động backup cơ sở dữ liệu hàng ngày lúc 02:00" checked={autoBackup} onChange={setAutoBackup} />
            <ToggleItem label="Ghi nhật ký thao tác người dùng (Audit Log)" checked={auditLog} onChange={setAuditLog} />
            <ToggleItem label="Rate Limiting API — giới hạn 1000 req/phút/IP" checked={rateLimit} onChange={setRateLimit} />
          </div>
        </div>

        {/* Cấu hình chung */}
        <div className="card">
          <div className="p-4 border-b border-[color:var(--border)] flex items-center gap-2 font-semibold">
            <SettingsIcon size={14} /> Cấu hình chung
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-[color:var(--muted)] mb-1.5">Múi giờ hệ thống</label>
              <select className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors text-[color:var(--text)] w-full">
                <option>Asia/Ho_Chi_Minh (GMT+7)</option>
                <option>Asia/Bangkok (GMT+7)</option>
                <option>UTC (GMT+0)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[color:var(--muted)] mb-1.5">Ngôn ngữ mặc định</label>
              <select className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors text-[color:var(--text)] w-full">
                <option>Tiếng Việt (vi-VN)</option>
                <option>English (en-US)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[color:var(--muted)] mb-1.5">Chu kỳ làm mới dữ liệu (giây)</label>
              <input type="number" defaultValue={30} min={5} max={300} className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[color:var(--muted)] mb-1.5">Giới hạn phiên đăng nhập (phút)</label>
              <input type="number" defaultValue={480} min={30} max={1440} className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 - Recent Logs */}
      <div className="card">
        <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center">
          <div className="flex items-center gap-2 font-semibold">
            <Activity size={14} /> Nhật ký hệ thống gần đây
          </div>
          <button className="btn btn-ghost btn-sm flex items-center gap-1.5">
            <Download size={14} /> Tải xuống log
          </button>
        </div>
        <div className="p-4">
          <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg p-3 font-mono text-[11px] leading-relaxed max-h-[160px] overflow-y-auto custom-scrollbar">
            <div><span className="text-[color:var(--green)]">[INFO]</span> <span className="text-[color:var(--muted)]">28/02 02:00:01</span> Database backup completed — 243 MB</div>
            <div><span className="text-[color:var(--cyan)]">[INFO]</span> <span className="text-[color:var(--muted)]">28/02 01:45:12</span> SCADA sync: 12 stations refreshed OK</div>
            <div><span className="text-[color:var(--yellow)]">[WARN]</span> <span className="text-[color:var(--muted)]">28/02 01:30:55</span> DMA-03 flow sensor packet timeout (retry OK)</div>
            <div><span className="text-[color:var(--cyan)]">[INFO]</span> <span className="text-[color:var(--muted)]">28/02 00:00:00</span> System v1.0.0 deployed successfully</div>
            <div><span className="text-[color:var(--green)]">[INFO]</span> <span className="text-[color:var(--muted)]">27/02 23:55:03</span> User admin@quawaco.vn logged in (2FA: TOTP)</div>
            <div><span className="text-[color:var(--red)]">[ERROR]</span> <span className="text-[color:var(--muted)]">27/02 22:10:18</span> SMS OTP gateway timeout for +84912xxx — retried OK</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
