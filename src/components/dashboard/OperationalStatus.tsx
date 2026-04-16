import React from 'react';

const OperationalStatus: React.FC = () => {
  const stations = [
    { id: 'hong_gai', name: 'Trạm Hồng Gai', region: 'Hồng Gai', press: '3.2 bar', flow: '1250 m³/h', color: 'bg-[var(--green)] shadow-[0_0_8px_var(--green)] text-[var(--green)]' },
    { id: 'bai_chay', name: 'Trạm Bãi Cháy', region: 'Bãi Cháy', press: '2.8 bar', flow: '980 m³/h', color: 'bg-[var(--green)] shadow-[0_0_8px_var(--green)] text-[var(--green)]' },
    { id: 'cam_pha', name: 'Trạm Cẩm Phả', region: 'Cẩm Phả', press: '1.4 bar', flow: '620 m³/h', color: 'bg-[var(--yellow)] shadow-[0_0_8px_var(--yellow)] text-[var(--yellow)]' },
    { id: 'uong_bi', name: 'Trạm Uông Bí', region: 'Uông Bí', press: '3 bar', flow: '875 m³/h', color: 'bg-[var(--green)] shadow-[0_0_8px_var(--green)] text-[var(--green)]' },
    { id: 'mong_cai', name: 'Trạm Móng Cái', region: 'Móng Cái', press: '2.6 bar', flow: '550 m³/h', color: 'bg-[var(--green)] shadow-[0_0_8px_var(--green)] text-[var(--green)]' },
    { id: 'van_don', name: 'Trạm Vân Đồn', region: 'Vân Đồn', press: '—', flow: 'Offline', color: 'bg-[var(--red)] shadow-[0_0_8px_var(--red)] text-[var(--red)]' },
    { id: 'hoanh_bo', name: 'Trạm Hoành Bồ', region: 'Hồng Gai', press: '3.1 bar', flow: '420 m³/h', color: 'bg-[var(--green)] shadow-[0_0_8px_var(--green)] text-[var(--green)]' },
    { id: 'quang_yen', name: 'Trạm Quảng Yên', region: 'Bãi Cháy', press: '2.7 bar', flow: '310 m³/h', color: 'bg-[var(--green)] shadow-[0_0_8px_var(--green)] text-[var(--green)]' },
  ];

  const heatRows = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const getCellBg = (val: number) => {
    if (val >= 8) return 'bg-[#00d2ff] opacity-90';
    if (val >= 7) return 'bg-[#00d2ff]/60';
    if (val >= 5) return 'bg-[#00d2ff]/30';
    if (val >= 3) return 'bg-[#00d2ff]/15';
    return 'bg-[#00d2ff]/5';
  };
  const generateRow = (isWeekend: boolean) => {
    const pattern = isWeekend 
      ? [3,2,1,1,2,3,5,8,10,9,9,9,9,9,9,9,9,8,8,7,6,5,4,3] 
      : [2,1,1,1,2,4,7,9,9,8,8,8,9,8,7,7,8,9,9,8,7,6,5,3];
    return pattern.map(v => ({ val: v, bg: getCellBg(v) }));
  };

  const alerts = [
    { type: 'critical', title: 'Áp lực giảm (1.4 bar)', desc: 'Trạm Cẩm Phả: Lưới cực thấp', time: '22:15' },
    { type: 'critical', title: 'Lỗi Motor', desc: 'Bơm #2 Cẩm Phả: Quá tải nhiệt', time: '21:45' },
    { type: 'warning', title: 'Mất kết nối', desc: 'Trạm Vân Đồn (SCADA)', time: '20:58' },
    { type: 'warning', title: 'Clo dư mức cao', desc: 'Nhà máy Cẩm Phả: 0.61 mg/L', time: '18:55' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
      
      {/* Station List */}
      <div className="card xl:col-span-1 h-[480px] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-[14px] font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> 
            Trạng thái Trạm bơm
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
          <div className="flex flex-col gap-3">
            {stations.map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-between cursor-pointer transition-all hover:bg-[var(--bg-hover)] hover:border-[var(--border-active)] hover:-translate-y-0.5 group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${s.color.split(' ')[0]} ${s.color.split(' ')[1]}`} />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[12.5px] font-bold text-[var(--text)] group-hover:text-[var(--cyan)] transition-colors">{s.name}</span>
                    <span className="text-[10px] text-[var(--muted)] font-semibold mt-0.5">{s.region}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end leading-tight">
                  <span className={`text-[13px] font-mono font-bold ${s.color.split(' ')[2]}`}>{s.press}</span>
                  <span className="text-[10px] text-[var(--muted)] font-semibold mt-0.5 uppercase">{s.flow}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Grid Mockup */}
      <div className="card xl:col-span-2 h-[480px] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-[14px] font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 
             Bản đồ tiêu thụ theo giờ
          </h3>
          <span className="text-[10px] font-bold text-[var(--muted)] bg-[var(--bg-elevated)] px-2 py-1 rounded border border-[var(--border)] uppercase tracking-wider">Tuần điển hình</span>
        </div>
        
        <div className="flex-1 overflow-x-auto p-5 flex flex-col justify-center custom-scrollbar">
          <table className="w-full border-collapse table-fixed min-w-[500px]">
            <thead>
              <tr>
                <th className="w-8"></th>
                {Array.from({ length: 24 }).map((_, i) => (
                  <th key={i} className="text-[9px] font-bold text-[var(--muted)] pb-4 w-full text-center border-none uppercase">
                    {i === 0 ? '00h' : i === 6 ? '06h' : i === 12 ? '12h' : i === 18 ? '18h' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatRows.map((day, dIdx) => (
                <tr key={day} className="group/row">
                  <td className="text-[11px] font-bold text-[var(--muted)] pr-3 text-right border-none group-hover/row:text-[var(--text)] transition-colors">{day}</td>
                  {generateRow(dIdx >= 5).map((cell, cIdx) => (
                    <td key={cIdx} className="p-[1.5px] border-none">
                      <div className={`w-full h-8 rounded-sm ${cell.bg} border-t border-l border-white/5 hover:scale-110 hover:border-[var(--cyan)] hover:shadow-[0_0_12px_rgba(0,210,255,0.6)] transition-all cursor-pointer relative z-0 hover:z-10`} title={cell.val.toString()}></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-[var(--border)]">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Thấp</span>
            <div className="flex gap-1.5">
              <div className="w-3.5 h-3.5 rounded-sm bg-[var(--cyan)] opacity-[0.05] border border-[var(--border)]"></div>
              <div className="w-3.5 h-3.5 rounded-sm bg-[var(--cyan)] opacity-[0.15] border border-[var(--border)]"></div>
              <div className="w-3.5 h-3.5 rounded-sm bg-[var(--cyan)] opacity-30 border border-[var(--border)]"></div>
              <div className="w-3.5 h-3.5 rounded-sm bg-[var(--cyan)] opacity-60 border border-[var(--border)]"></div>
              <div className="w-3.5 h-3.5 rounded-sm bg-[var(--cyan)] opacity-90 border border-[var(--border)]"></div>
            </div>
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Cao điểm</span>
          </div>
        </div>
      </div>

      {/* Latest Alerts */}
      <div className="card xl:col-span-1 h-[480px] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-[14px] font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> 
            Cảnh báo mới
          </h3>
          <button className="text-[9px] font-bold text-[var(--muted)] border border-[var(--border)] px-2 py-1 rounded bg-[var(--bg-elevated)] uppercase tracking-wider hover:text-[var(--text)] hover:border-[var(--border-active)] transition-all">Xem tất cả</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
          <div className="flex flex-col gap-3.5">
            {alerts.map((a, i) => (
              <div key={i} className={`p-4 rounded-xl border transition-all cursor-pointer group hover:-translate-y-0.5 flex flex-col gap-2 ${a.type === 'critical' ? 'bg-[var(--red)]/5 border-[var(--red)]/20 hover:border-[var(--red)]/40 hover:bg-[var(--red)]/10 hover:shadow-[0_10px_20px_rgba(255,61,87,0.1)]' : 'bg-[var(--yellow)]/5 border-[var(--yellow)]/20 hover:border-[var(--yellow)]/40 hover:bg-[var(--yellow)]/10 hover:shadow-[0_10px_20px_rgba(255,219,77,0.1)]'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${a.type === 'critical' ? 'bg-[var(--red)] shadow-[0_0_8px_var(--red)]' : 'bg-[var(--yellow)] shadow-[0_0_8px_var(--yellow)]'}`} />
                    <span className={`text-[11px] font-extrabold uppercase tracking-widest ${a.type === 'critical' ? 'text-[var(--red)]' : 'text-[var(--yellow)]'}`}>{a.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--muted)] font-semibold">{a.time}</span>
                </div>
                <p className="text-[13px] text-[var(--text-2)] font-medium leading-relaxed opacity-90">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default OperationalStatus;
