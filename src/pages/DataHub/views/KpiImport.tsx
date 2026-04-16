import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, ChevronRight, FileJson, AlertCircle } from 'lucide-react';

const KpiImport: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const [aiState, setAiState] = useState<'idle' | 'analyzing' | 'done'>('idle');

  return (
    <div className="flex flex-col gap-4">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-[color:var(--blue-dark)]/20 to-[color:var(--cyan)]/10 border border-[color:var(--blue)]/30 rounded-2xl p-6 flex items-start gap-5 shadow-sm">
        <div className="w-12 h-12 bg-gradient-to-br from-[color:var(--blue-dark)] to-[color:var(--cyan)] rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-white">
          <UploadCloud size={24} />
        </div>
        <div className="flex-1">
          <div className="text-[16px] font-black text-[color:var(--text)] mb-1.5 uppercase tracking-tight">Nhập liệu KPI Kinh doanh bằng công nghệ AI</div>
          <div className="text-[14px] text-[color:var(--muted)] leading-relaxed font-bold">
            Upload dữ liệu KPI từ nhiều định dạng (Excel, PDF, CSV, DOCX, ảnh...). AI tự động bóc tách, chuẩn hóa và cấu trúc dữ liệu để bạn xác nhận trước khi import hệ thống.
          </div>
        </div>
        <button className="shrink-0 px-4 py-2.5 bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-xl text-[color:var(--blue)] text-[12px] font-black hover:bg-[color:var(--bg-hover)] transition-all flex items-center gap-2 shadow-sm">
          <AlertCircle size={14} /> Hướng dẫn & Template
        </button>
      </div>

      {/* Step 1: Period and Indices */}
      <div className="card bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center bg-[color:var(--bg-surface)]">
          <div className="font-black text-[13px] flex items-center gap-2 text-[color:var(--text)] uppercase tracking-wider">
            <span className="w-5 h-5 rounded-md bg-[color:var(--cyan)]/20 text-[color:var(--cyan)] flex items-center justify-center text-[11px] font-black border border-[color:var(--cyan)]/30">1</span>
            Chọn kỳ báo cáo & chỉ số KPI
          </div>
          <span className="badge badge-gray text-[10px] uppercase font-black tracking-widest">Bắt buộc</span>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          <div>
            <div className="text-[11px] font-bold text-[color:var(--muted)] uppercase tracking-wider mb-3">Kỳ báo cáo</div>
            <div className="flex flex-col gap-2">
              {[
                { v: 'day', l: 'Theo ngày', s: 'Hàng ngày' },
                { v: 'week', l: 'Theo tuần', s: '7 ngày' },
                { v: 'month', l: 'Theo tháng', s: 'Phổ biến' },
                { v: 'quarter', l: 'Theo quý', s: 'Q1-Q4' },
                { v: 'year', l: 'Cả năm', s: 'Tổng kết' },
              ].map(p => (
                <label key={p.v} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${period === p.v ? 'bg-[color:var(--cyan)]/10 border-[color:var(--cyan)]/40 shadow-sm' : 'bg-[color:var(--bg-surface)] border-[color:var(--border)] hover:border-[color:var(--cyan)]/30'}`} onClick={() => setPeriod(p.v)}>
                  <input type="radio" name="kpi-period" checked={period === p.v} readOnly className="accent-[color:var(--cyan)] w-4 h-4" />
                  <div>
                    <div className="text-[13px] font-bold text-[color:var(--text)]">{p.l}</div>
                    <div className="text-[10px] text-[color:var(--muted)] font-bold uppercase tracking-wide">{p.s}</div>
                  </div>
                </label>
              ))}
            </div>
            
            {period === 'month' && (
              <div className="flex gap-2 mt-4">
                <div className="flex-1">
                  <span className="text-[10px] text-[color:var(--muted)] font-black uppercase ml-1">Năm</span>
                  <select className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[12px] mt-1 text-[color:var(--text)] font-bold outline-none focus:border-[color:var(--cyan)]"><option>2026</option></select>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-[color:var(--muted)] font-black uppercase ml-1">Tháng</span>
                  <select className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[12px] mt-1 text-[color:var(--text)] font-bold outline-none focus:border-[color:var(--cyan)]"><option>Tháng 2</option></select>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="text-[11px] font-bold text-[color:var(--muted)] uppercase tracking-wider mb-3">Chỉ số KPI cần phân tích</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                { k: 'rev', n: 'Doanh thu', h: 'Tổng (Triệu đ)', on: true },
                { k: 'out', n: 'Sản lượng nước', h: 'm³', on: true },
                { k: 'nrw', n: 'Tỷ lệ thất thoát NRW', h: '%', on: true },
                { k: 'cus', n: 'Số lượng KH', h: 'KH hiện hoạt', on: true },
                { k: 'qua', n: 'Chất lượng nước', h: 'Mẫu đạt/tổng', on: false },
                { k: 'inc', n: 'Sự cố thiết bị', h: 'Số vụ', on: false },
                { k: 'opx', n: 'Chi phí OPEX', h: 'Triệu đ', on: false },
                { k: 'col', n: 'Tỷ lệ thu hóa đơn', h: '%', on: false },
              ].map((c, i) => (
                <label key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-surface)] cursor-pointer hover:border-[color:var(--cyan)]/40 transition-all hover:shadow-sm`}>
                  <input type="checkbox" defaultChecked={c.on} className="accent-[color:var(--cyan)] mt-0.5 w-4 h-4" />
                  <div>
                    <div className="text-[13px] font-bold text-[color:var(--text)]">{c.n}</div>
                    <div className="text-[11px] text-[color:var(--muted)] font-bold">{c.h}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 p-4 bg-[color:var(--yellow)]/10 border border-[color:var(--yellow)]/20 rounded-xl text-[13px] text-[color:var(--text)] leading-relaxed font-bold">
               AI sẽ đọc file và cố gắng bóc tách <b className="text-[color:var(--yellow)] tracking-tight uppercase">tất cả chỉ số được chọn</b> bằng hệ thống NLP nội bộ. Những chỉ số AI không tự tin (độ chính xác {'<'} 70%) sẽ được highlight để bạn điều chỉnh bằng tay ở bước tiếp theo.
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Upload */}
      <div className="card bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-sm overflow-hidden">
         <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center bg-[color:var(--bg-surface)]">
          <div className="font-black text-[13px] flex items-center gap-2 text-[color:var(--text)] uppercase tracking-wider">
            <span className="w-5 h-5 rounded-md bg-[color:var(--blue)]/20 text-[color:var(--blue)] flex items-center justify-center text-[11px] font-black border border-[color:var(--blue)]/30">2</span>
            Upload File dữ liệu cần trích xuất (PDF, Excel, Ảnh)
          </div>
        </div>
        <div className="p-5">
           <div className="border-2 border-dashed border-[color:var(--blue)]/30 rounded-2xl p-10 flex flex-col items-center justify-center bg-[color:var(--bg-surface)] hover:bg-[color:var(--blue)]/5 hover:border-[color:var(--cyan)] transition-all cursor-pointer shadow-inner">
              <div className="w-16 h-16 bg-gradient-to-br from-[color:var(--blue)]/20 to-[color:var(--cyan)]/10 rounded-2xl flex items-center justify-center mb-4 text-[color:var(--blue)]">
                <FileJson size={32} />
              </div>
              <div className="font-black text-[15px] text-[color:var(--text)] uppercase tracking-tight">Kéo & thả file hoặc click để chọn</div>
              <div className="text-[12px] text-[color:var(--muted)] mt-1.5 font-bold">Kích thước tối đa 50MB mỗi tệp</div>
              <div className="text-[11px] text-[color:var(--blue)] mt-4 font-black bg-[color:var(--blue)]/10 px-3 py-1 rounded-full uppercase tracking-widest border border-[color:var(--blue)]/20 shadow-sm">Hỗ trợ .XLSX, .CSV, .PDF, .DOCX, .JPG, .PNG</div>
           </div>
           
           <div className="mt-5 flex gap-3 text-right justify-end">
             <button className="btn btn-ghost px-6 text-[13px] font-bold text-[color:var(--muted)] hover:text-[color:var(--text)]">Làm lại</button>
             <button 
                className="btn btn-primary px-8 text-[13px] font-black bg-gradient-to-r from-[color:var(--blue-dark)] to-[color:var(--cyan)] border-none shadow-lg text-white uppercase tracking-wider hover:opacity-90 transition-all" 
                onClick={() => setAiState('analyzing')}
             >
                <UploadCloud size={16} className="mr-2" /> Bắt đầu Phân tích AI
             </button>
           </div>
        </div>
      </div>

       {/* Step 3: Mock AI Result */}
       {aiState !== 'idle' && (
         <div className="card bg-[color:var(--bg-card)] border border-[color:var(--green)]/30 shadow-[0_8px_30px_rgba(0,230,118,0.08)] animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
           <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center bg-[color:var(--green)]/5">
             <div className="font-black text-[13px] flex items-center gap-2 text-[color:var(--green)] uppercase tracking-wider">
                <CheckCircle2 size={18} /> Bước 3 — Dữ liệu đã trích xuất — Kiểm tra & Xác nhận
             </div>
             <button className="btn btn-primary btn-sm bg-[color:var(--green)] hover:bg-[color:var(--green)]/90 text-black border-none font-black shadow-sm px-4 uppercase text-[11px] tracking-wider">
               Xác nhận & Import vào hệ thống
             </button>
           </div>
           <div className="p-0 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-[color:var(--bg-surface)] text-[11px] uppercase text-[color:var(--muted)] font-black tracking-widest border-b border-[color:var(--border)]">
                     <th className="p-4">Chỉ số KPI</th>
                     <th className="p-4">Giá trị gốc (AI)</th>
                     <th className="p-4">Giá trị chuẩn hóa (Có thể sửa)</th>
                     <th className="p-4">Độ tin cậy AI</th>
                   </tr>
                 </thead>
                 <tbody>
                   {[
                     { n: 'Doanh thu', o: '59.420 Triệu', v: '59,420', u: 'Triệu đ', c: 98 },
                     { n: 'Sản lượng nước', o: '1,750,000 m3', v: '1,750,000', u: 'm³', c: 96 },
                     { n: 'Tỷ lệ thất thoát NRW', o: '14.4%', v: '14.4', u: '%', c: 95 },
                     { n: 'Chi phí OPEX', o: '38,2', v: '38,200', u: 'Triệu đ', c: 74, warn: true },
                   ].map((r, i) => (
                     <tr key={i} className="border-b border-[color:var(--border)] last:border-none hover:bg-[color:var(--bg-hover)] transition-all">
                       <td className="p-4 font-bold text-[13px] text-[color:var(--text)]">{r.n}</td>
                       <td className="p-4 font-mono text-[11px] text-[color:var(--muted)] font-bold">{r.o}</td>
                       <td className="p-4">
                         <div className="flex items-center gap-2">
                            <input type="text" defaultValue={r.v} className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-1.5 text-[13px] font-mono font-black text-[color:var(--cyan)] w-32 focus:border-[color:var(--cyan)] outline-none shadow-inner" />
                            <span className="text-[11px] text-[color:var(--muted)] font-bold uppercase">{r.u}</span>
                         </div>
                       </td>
                       <td className="p-4">
                         <div className="flex items-center gap-3">
                           <div className="flex-1 h-2 bg-[color:var(--bg-surface)] rounded-full min-w-[100px] max-w-[150px] overflow-hidden border border-[color:var(--border)] shadow-inner">
                             <div className={`h-full ${r.warn ? 'bg-[color:var(--yellow)] shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'bg-[color:var(--green)] shadow-[0_0_8px_rgba(0,230,118,0.5)]'}`} style={{ width: `${r.c}%` }} />
                           </div>
                           <span className={`text-[12px] font-mono font-black ${r.warn ? 'text-[color:var(--yellow)]' : 'text-[color:var(--green)]'}`}>{r.c}%</span>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
              </table>
           </div>
         </div>
       )}
    </div>
  );
};

export default KpiImport;
