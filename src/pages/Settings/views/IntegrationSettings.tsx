import React from 'react';
import { KeyRound, Globe, DatabaseBackup, Copy, Link2, Unplug, Download } from 'lucide-react';

const IntegrationSettings: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Top row: API Keys and External Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* API Keys */}
        <div className="card">
          <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center font-semibold">
            <div className="flex items-center gap-2"><KeyRound size={14} className="text-[color:var(--yellow)]"/> Access API Keys</div>
            <button className="btn btn-ghost btn-sm">+ Tạo Key Mới</button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {[
              { name: 'Dashboard Public API', keyCode: 'qwc_pub_a7f3...d91c', scope: 'read:all', expire: 'Không hết hạn', active: true },
              { name: 'SCADA Integration Key', keyCode: 'qwc_int_b2e8...5f0a', scope: 'read:scada write:scada', expire: '31/12/2026', active: true },
              { name: 'Webhook Signature Key', keyCode: 'qwc_whk_c4d1...88b2', scope: 'webhook', expire: '28/08/2026', active: true },
              { name: 'Mobile App Key (old)', keyCode: 'qwc_mob_xxx...xxx', scope: 'read:basic', expire: '01/01/2026', active: false },
            ].map((k, i) => (
              <div key={i} className={`p-3 border rounded-lg transition-colors ${k.active ? 'border-[color:var(--border)] hover:border-[color:var(--cyan)]/40 bg-[color:var(--bg-card)]' : 'border-[color:var(--border)] opacity-50 bg-transparent'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-[13px]">{k.name}</div>
                    <div className="font-mono text-[11px] text-[color:var(--cyan)] my-1">{k.keyCode}</div>
                    <div className="text-[11px] text-[color:var(--muted)]">Scope: {k.scope} · Exp: {k.expire}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="p-1.5 rounded hover:bg-[color:var(--bg-surface)] text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"><Copy size={13}/></button>
                    {k.active && <button className="p-1.5 rounded hover:bg-red-500/10 text-[color:var(--muted)] hover:text-red-400 transition-colors"><Unplug size={13}/></button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Services */}
        <div className="card">
          <div className="p-4 border-b border-[color:var(--border)] font-semibold flex items-center gap-2">
            <Globe size={14} className="text-[color:var(--blue)]"/> Connectors (Dịch vụ bên ngoài)
          </div>
          <div className="p-0">
            {[
              { name: 'GIS / OSM Map Tiles', url: 'tile.openstreetmap.org', latency: '45ms', status: 'connected' },
              { name: 'SCADA Core Gateway', url: '10.0.1.200:8080', latency: '8ms', status: 'connected' },
              { name: 'Viettel SMS Endpoint', url: 'api.viettel-sms.vn', latency: '120ms', status: 'connected' },
              { name: 'Zalo ZNS API', url: 'business.openapi.zalo.me', latency: '—', status: 'disconnected' },
              { name: 'Cổng báo cáo Chính phủ', url: 'dichvucong.gov.vn', latency: '150ms', status: 'connected' },
            ].map((s, i) => (
              <div key={i} className="flex justify-between items-center p-4 border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--bg-surface)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[color:var(--bg-surface)] text-[color:var(--muted)]"><Link2 size={14}/></div>
                  <div>
                    <div className="font-medium text-[13px]">{s.name}</div>
                    <div className="font-mono text-[11px] text-[color:var(--muted)] mt-0.5">{s.url}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${s.status === 'connected' ? 'badge-green' : 'badge-gray'} text-[10px]`}>
                    {s.status === 'connected' ? '● Connected' : '○ Offline'}
                  </span>
                  <div className="text-[10px] text-[color:var(--muted)] mt-1">{s.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backup and Restore */}
      <div className="card">
        <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center">
          <div className="flex items-center gap-2 font-semibold">
            <DatabaseBackup size={14} className="text-[color:var(--green)]" /> Quy hoạch Tự động Sao lưu Database
          </div>
          <button className="btn btn-primary btn-sm min-w-32">Backup ngay (Force)</button>
        </div>
        <div className="p-5 flex flex-col md:flex-row gap-6">
          {/* Configs */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[color:var(--muted)] mb-1.5">Lịch thực thi cronjob</label>
              <select className="w-[80%] bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors">
                <option>Hàng ngày lúc 02:00 sáng</option>
                <option>Hàng tuần (Chủ nhật lúc 00:00)</option>
                <option>Mỗi 4 giờ/lần</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[color:var(--muted)] mb-1.5">Đích lưu trữ File</label>
              <select className="w-[80%] bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors">
                <option>Network Storage (NAS-Quawaco)</option>
                <option>Google Cloud Storage Coldline</option>
                <option>Nội bộ máy chủ Local</option>
              </select>
            </div>
          </div>
          
          {/* Recent Archives */}
          <div className="flex-1 border-t md:border-t-0 md:border-l border-[color:var(--border)] pt-4 md:pt-0 md:pl-6">
            <div className="text-xs font-semibold text-[color:var(--muted)] mb-3 uppercase tracking-wider">Danh sách File đã lưu gần đây</div>
            <div className="flex flex-col">
              {[
                { file: 'quawaco_prod_backup_1004.sql.gz', size: '254 MB', time: '10/04/2026 02:00' },
                { file: 'quawaco_prod_backup_0904.sql.gz', size: '252 MB', time: '09/04/2026 02:00' },
                { file: 'quawaco_prod_backup_0804.sql.gz', size: '250 MB', time: '08/04/2026 02:00' },
                { file: 'quawaco_prod_backup_0704.sql.gz', size: '248 MB', time: '07/04/2026 02:00' },
              ].map((b, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--bg-surface)] transition-colors px-2 -mx-2 rounded">
                  <div>
                    <div className="font-mono text-[11px] text-[color:var(--cyan)]">{b.file}</div>
                    <div className="text-[10px] text-[color:var(--muted)] mt-1">{b.time}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] text-[color:var(--muted)] font-mono">{b.size}</span>
                    <button className="text-[color:var(--cyan)] hover:text-[color:var(--text)] transition-colors px-2 py-1"><Download size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;
