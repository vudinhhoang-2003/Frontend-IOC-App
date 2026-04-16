import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { FactoryBasic, EmployeeBasic } from '../types';

interface Props {
  factories: FactoryBasic[];
  employees: EmployeeBasic[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export const QualityAddModal: React.FC<Props> = ({ factories, employees, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    factory: factories[0]?.name || '',
    time: '',
    pH: '',
    chlorine: '',
    turbidity: '',
    TDS: '',
    arsenic: '',
    coliform: '',
    employee: employees[0]?.name || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`;

  const modalContent = (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div onClick={e => e.stopPropagation()} className="w-[660px] max-w-full bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl animate-[chatPop_0.2s_ease-out]" style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
        <div className="px-6 py-6 border-b border-[var(--border)] flex justify-between items-center relative gap-4">
          <span className="text-[18px] font-bold text-[var(--text)]">Nhập chỉ số chất lượng nước</span>
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent border-none text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer absolute right-5 top-5" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Nhà máy</label>
              <select className="appearance-none w-full h-[44px] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text)] px-4 text-[14px] outline-none focus:border-[var(--cyan)] transition-colors cursor-pointer bg-no-repeat font-medium" style={{ backgroundImage: selectBg, backgroundPosition: 'right 14px center', backgroundSize: '14px' }} name="factory" value={formData.factory} onChange={handleChange}>
                {factories.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Thời gian lấy mẫu</label>
              <div className="relative">
                <input className="w-full h-[44px] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text)] px-4 pr-10 text-[14px] outline-none focus:border-[var(--cyan)] transition-colors appearance-none font-medium" type="datetime-local" name="time" value={formData.time} onChange={handleChange} />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">pH</label>
              <input className="w-full h-[44px] bg-[var(--bg-card,#0b1521)] border border-[var(--border)] rounded-xl text-[var(--text)] px-4 text-[14px] outline-none focus:border-[var(--cyan)] transition-colors placeholder:text-[var(--muted)]/40 font-medium" type="number" step="0.1" min="0" max="14" placeholder="7.0" name="pH" value={formData.pH} onChange={handleChange}/>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Clo dư (mg/L)</label>
              <input className="w-full h-[44px] bg-[var(--bg-card,#0b1521)] border border-[var(--border)] rounded-xl text-[var(--text)] px-4 text-[14px] outline-none focus:border-[var(--cyan)] transition-colors placeholder:text-[var(--muted)]/40 font-medium" type="number" step="0.01" placeholder="0.30" name="chlorine" value={formData.chlorine} onChange={handleChange}/>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Độ đục (NTU)</label>
              <input className="w-full h-[44px] bg-[var(--bg-card,#0b1521)] border border-[var(--border)] rounded-xl text-[var(--text)] px-4 text-[14px] outline-none focus:border-[var(--cyan)] transition-colors placeholder:text-[var(--muted)]/40 font-medium" type="number" step="0.1" placeholder="1.5" name="turbidity" value={formData.turbidity} onChange={handleChange}/>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-7">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">TDS (mg/L)</label>
              <input className="w-full h-[44px] bg-[var(--bg-card,#0b1521)] border border-[var(--border)] rounded-xl text-[var(--text)] px-4 text-[14px] outline-none focus:border-[var(--cyan)] transition-colors placeholder:text-[var(--muted)]/40 font-medium" type="number" placeholder="150" name="TDS" value={formData.TDS} onChange={handleChange}/>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Arsenic (mg/L)</label>
              <input className="w-full h-[44px] bg-[var(--bg-card,#0b1521)] border border-[var(--border)] rounded-xl text-[var(--text)] px-4 text-[14px] outline-none focus:border-[var(--cyan)] transition-colors placeholder:text-[var(--muted)]/40 font-medium" type="number" step="0.001" placeholder="0.002" name="arsenic" value={formData.arsenic} onChange={handleChange}/>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Coliform (CFU/100mL)</label>
              <input className="w-full h-[44px] bg-[var(--bg-card,#0b1521)] border border-[var(--border)] rounded-xl text-[var(--text)] px-4 text-[14px] outline-none focus:border-[var(--cyan)] transition-colors placeholder:text-[var(--muted)]/40 font-medium" type="number" placeholder="0" name="coliform" value={formData.coliform} onChange={handleChange}/>
            </div>
          </div>
          
          <div className="grid grid-cols-1">
            <label className="block text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Người lấy mẫu</label>
            <select className="appearance-none w-full h-[44px] bg-[var(--bg-card,#0b1521)] border border-[var(--border)] rounded-xl text-[var(--text)] px-4 text-[14px] outline-none focus:border-[var(--cyan)] transition-colors cursor-pointer bg-no-repeat font-medium" style={{ backgroundImage: selectBg, backgroundPosition: 'right 14px center', backgroundSize: '14px' }} name="employee" value={formData.employee} onChange={handleChange}>
              {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          </div>
        </div>
        <div className="px-6 py-5 border-t border-[var(--border)] flex justify-end gap-3.5 bg-[var(--bg-surface)]">
          <button className="px-6 py-2.5 min-w-[100px] h-[42px] items-center justify-center border border-[var(--border)] rounded-xl text-[14px] text-[var(--muted)] hover:text-[var(--text)] font-semibold bg-transparent hover:border-[var(--muted)] transition-colors cursor-pointer flex" onClick={onClose}>Hủy</button>
          <button className="px-6 py-2.5 min-w-[140px] h-[42px] items-center justify-center border-none rounded-xl text-[14px] text-white font-bold flex bg-[#0cf] hover:bg-[#00b4e6] shadow-[0_4px_15px_rgba(0,204,255,0.2)] hover:shadow-[0_6px_20px_rgba(0,204,255,0.4)] transition-all cursor-pointer" onClick={() => onSave(formData)}>
             Lưu kết quả
          </button>
        </div>
      </div>
      <style>{`
        @keyframes chatPop {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};
