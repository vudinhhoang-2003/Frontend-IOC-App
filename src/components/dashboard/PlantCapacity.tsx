import React from 'react';

const PlantCapacity: React.FC = () => {
  const plants = [
    { name: 'Nhà máy Hồng Gai', region: 'TP. Hạ Long', val: '27.500', max: '30.000 m³', pct: 92, pClr: 'var(--cyan)' },
    { name: 'Nhà máy Bãi Cháy', region: 'TP. Hạ Long', val: '18.200', max: '20.000 m³', pct: 91, pClr: 'var(--green)' },
    { name: 'Nhà máy Cẩm Phả', region: 'TP. Cẩm Phả', val: '13.800', max: '15.000 m³', pct: 92, pClr: 'var(--yellow)' },
    { name: 'Nhà máy Uông Bí', region: 'TP. Uông Bí', val: '9.200', max: '10.000 m³', pct: 92, pClr: 'var(--cyan)' },
    { name: 'Nhà máy Móng Cái', region: 'TP. Móng Cái', val: '7.100', max: '8.000 m³', pct: 89, pClr: 'var(--green)' },
    { name: 'Trạm Vân Đồn', region: 'H. Vân Đồn', val: '4.300', max: '5.000 m³', pct: 86, pClr: 'var(--yellow)' },
    { name: 'Nhà máy Tiên Yên', region: 'H. Tiên Yên', val: '3.800', max: '4.000 m³', pct: 95, pClr: 'var(--red)' },
    { name: 'Trạm bơm Hải Hà', region: 'H. Hải Hà', val: '11.000', max: '12.000 m³', pct: 92, pClr: 'var(--cyan)' },
  ];

  return (
    <div className="card mb-6 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-[14px] font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Nhà máy & Công suất sử dụng
        </h3>
        <button className="text-[9px] font-bold text-[var(--muted)] border border-[rgba(255,255,255,0.1)] px-2 py-1 rounded bg-[rgba(0,0,0,0.2)] uppercase tracking-wider hover:text-[var(--text)] hover:border-[rgba(255,255,255,0.2)] transition-all">Chi tiết trạm</button>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-6">
          {plants.map((p, idx) => (
            <div key={idx} className="flex flex-col gap-2.5">
              <div className="flex justify-between items-baseline">
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[var(--text)] leading-tight">{p.name}</span>
                  <span className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-wider mt-0.5">{p.region}</span>
                </div>
                <div className="text-right flex flex-col items-end leading-tight">
                  <span style={{ color: p.pClr }} className="text-[13px] font-mono font-bold">{p.val}</span>
                  <span className="text-[10px] text-[var(--muted)] font-bold">/ {p.max}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ background: p.pClr, width: `${p.pct}%`, boxShadow: `0 0 8px ${p.pClr}44` }} 
                  />
                </div>
                <span style={{ color: p.pClr }} className="text-[12px] font-mono font-extrabold w-8 text-right">{p.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantCapacity;
