import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';

const Templates: React.FC = () => {
  const tmpls = [
    { name: 'Template_NhanSu_CBCNV.xlsx', desc: 'Nhập liệu hồ sơ nhân sự hàng loạt', updated: '15/02/2026', rows: 'Tối đa 500 dòng' },
    { name: 'Template_KhachHang_HopDong.xlsx', desc: 'Nhập liệu khách hàng và hợp đồng', updated: '10/02/2026', rows: 'Tối đa 1000 dòng' },
    { name: 'Template_VatTu_HoaCHat.xlsx', desc: 'Nhập liệu kho vật tư và hóa chất', updated: '01/02/2026', rows: 'Tối đa 200 dòng' },
    { name: 'Template_ThietBi.xlsx', desc: 'Nhập liệu danh sách thiết bị tài sản', updated: '20/01/2026', rows: 'Tối đa 300 dòng' },
    { name: 'Template_ChatLuongNuoc.xlsx', desc: 'Nhập kết quả kiểm nghiệm chất lượng nước', updated: '01/01/2026', rows: 'Mỗi ngày' },
    { name: 'Template_GhiChiSo.xlsx', desc: 'Nhập chỉ số đồng hồ nước hàng tháng', updated: '01/01/2026', rows: 'Hàng tháng' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {tmpls.map((t, i) => (
        <div key={i} className="card p-4 hover:border-[color:var(--green)]/30 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[color:var(--green)]/10 border border-[color:var(--green)]/20 rounded-xl flex items-center justify-center text-[color:var(--green)] group-hover:scale-110 transition-transform">
              <FileSpreadsheet size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-white truncate" title={t.name}>{t.name}</div>
              <div className="text-[11px] text-[color:var(--muted)]">{t.rows}</div>
            </div>
          </div>
          
          <p className="text-[12px] text-[color:var(--muted)] leading-relaxed mb-4 min-h-[36px]">
            {t.desc}
          </p>
          
          <div className="flex justify-between items-center pt-3 border-t border-[color:var(--border)]">
            <span className="text-[11px] text-[color:var(--muted)] font-mono">
              Cập nhật: {t.updated}
            </span>
            <button className="btn btn-outline border-white/10 hover:bg-[color:var(--green)]/10 hover:border-[color:var(--green)]/30 hover:text-[color:var(--green)] btn-sm flex items-center gap-1.5 transition-colors">
              <Download size={12} /> Tải về
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Templates;
