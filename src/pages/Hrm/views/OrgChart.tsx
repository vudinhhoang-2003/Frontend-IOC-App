import React from 'react';
import type { Employee } from '../data';

interface OrgChartProps {
  employees: Employee[];
  orgStructure: any; // Using any for simplicity with the recursive structure, could be properly typed
}

const OrgChart: React.FC<OrgChartProps> = ({ employees, orgStructure }) => {
  const ceo = orgStructure;

  const renderOrgNode = (dept: any) => {
    const c = dept.color || '#00c8ff';
    const deptPrefix = dept.name.replace('Phòng ', '').replace('Ban ', '').split(' ')[0];
    const staffCount = employees.filter((e) => e.dept && e.dept.includes(deptPrefix)).length;

    return (
      <div 
        key={dept.id}
        className="bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-2xl relative overflow-hidden flex flex-col"
        style={{ '--dept-color': c } as React.CSSProperties}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: c, opacity: 0.8 }} />
        
        <div className="p-4 flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 border"
            style={{ backgroundColor: `${c}22`, borderColor: `${c}44`, color: c }}
          >
            {dept.head?.initials || '??'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[14px] mb-0.5">{dept.name}</div>
            <div className="text-[11px] text-[color:var(--muted)]">
              {dept.head?.name} — <span style={{ color: c }}>{dept.head?.title}</span>
            </div>
          </div>
          <div className="text-right shrink-0 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
            <div className="text-sm font-bold leading-none">{staffCount || '—'}</div>
            <div className="text-[9px] text-[color:var(--muted)] mt-1 uppercase tracking-wider">NV</div>
          </div>
        </div>

        {dept.deputies && dept.deputies.length > 0 && (
          <div className="px-4 pb-3">
            {dept.deputies.map((d: any, idx: number) => (
              <div 
                key={idx}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 mt-1"
              >
                <div 
                  className="w-[22px] h-[22px] rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold shrink-0"
                  style={{ color: c }}
                >
                  {d.initials}
                </div>
                <div>
                  <div className="text-[10px] font-bold">{d.name}</div>
                  <div className="text-[9px] text-white/40">{d.title}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {dept.children && dept.children.length > 0 && (
          <div className="mt-auto px-4 pb-4 pt-2 border-t border-white/5 bg-black/20">
            <div className="space-y-1.5">
              {dept.children.map((ch: any) => (
                <div 
                  key={ch.id}
                  className="flex items-center gap-2 p-2 rounded-lg border bg-white/5"
                  style={{ borderColor: `${ch.color}33` }}
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold">{ch.name}</div>
                    <div className="text-[10px] text-white/40">TL: {ch.headName} · {ch.staff} NV</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto py-2">
      {/* CEO Box */}
      <div className="flex justify-center mb-0">
        <div className="flex items-center gap-4 bg-[#0a182b] border border-[color:var(--cyan)] p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,200,255,0.15)] relative max-w-sm w-full">
          {/* Subtle glow behind CEO */}
          <div className="absolute inset-0 rounded-2xl bg-[color:var(--cyan)] opacity-5 blur-xl -z-10" />
          
          <div className="w-[60px] h-[60px] rounded-full p-1 border-2 border-[color:var(--cyan)] bg-[color:var(--bg-base)] shrink-0 flex items-center justify-center text-2xl">
            👨‍💼
          </div>
          <div>
            <div className="text-[15px] font-bold">{ceo.head.name}</div>
            <div className="text-[12px] text-[color:var(--cyan)] opacity-90 mt-0.5">{ceo.head.title}</div>
            <div className="text-[11px] text-white/40 mt-0.5">{ceo.name}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xl font-bold text-[color:var(--cyan)]">{employees.length}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wide">Tổng NV</div>
          </div>
        </div>
      </div>

      {/* Connector line */}
      <div className="flex justify-center">
        <div className="w-0.5 h-6 bg-[color:var(--cyan)] opacity-25" />
      </div>
      <div className="flex justify-center relative">
        <div className="w-[90%] h-px bg-[color:var(--cyan)] opacity-20 relative">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[color:var(--cyan)] opacity-40" />
        </div>
      </div>

      {/* Department cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4 relative mt-2">
        {/* Branching top connectors for grid items */}
        {ceo.children.map((d: any) => renderOrgNode(d))}
      </div>
    </div>
  );
};

export default OrgChart;
