import React, { useState, useMemo } from 'react';
import {
  Download,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  X,
  Eye
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import FilterBar from '../../components/common/FilterBar';

const stats = [
  { label: 'Doanh thu tháng', value: '59.95', unit: 'Tỉ VND', trend: '+5.2%', isUp: true, color: 'text-[color:var(--cyan)]', border: 'border-[color:var(--cyan)]/30' },
  { label: 'Sản lượng tiêu thụ', value: '5.45', unit: 'Triệu m³', trend: '+1.8%', isUp: true, color: 'text-[color:var(--green)]', border: 'border-[color:var(--green)]/30' },
  { label: 'Khách hàng mới', value: '+350', unit: 'KH', trend: '+12%', isUp: true, color: 'text-[color:var(--blue)]', border: 'border-[color:var(--blue)]/30' },
  { label: 'Tỷ lệ thu tiền', value: '94', unit: '%', trend: '+0.5%', isUp: true, color: 'text-[color:var(--purple)]', border: 'border-[color:var(--purple)]/30' },
  { label: 'Nợ khó đòi', value: '2.45', unit: 'Tỉ VND', trend: '-15%', isUp: false, color: 'text-[color:var(--red)]', border: 'border-[color:var(--red)]/30' },
  { label: 'Yêu cầu hỗ trợ', value: '4,870', unit: 'Cuộc', trend: '+3.5%', isUp: true, color: 'text-[color:var(--yellow)]', border: 'border-[color:var(--yellow)]/30' },
];

const trendData = [
  { name: 'T9', revenue: 52, consumption: 4.8 },
  { name: 'T10', revenue: 55, consumption: 5.0 },
  { name: 'T11', revenue: 54, consumption: 4.9 },
  { name: 'T12', revenue: 61, consumption: 5.6 },
  { name: 'T1', revenue: 57, consumption: 5.3 },
  { name: 'T2', revenue: 60, consumption: 5.5 },
];

const factoryData = [
  { name: 'Diễn Vọng', revenue: 22, output: 850 },
  { name: 'Đồng Ho', revenue: 16, output: 600 },
  { name: 'Lán Tháp', revenue: 8, output: 350 },
  { name: 'Yên Lập', revenue: 14, output: 550 },
];

const customerDistData = [
  { name: 'Sinh hoạt / Cư dân', value: 245000, color: 'var(--cyan)' },
  { name: 'Doanh nghiệp / Sản xuất', value: 35000, color: 'var(--green)' },
  { name: 'Hành chính sự nghiệp', value: 12000, color: 'var(--yellow)' },
  { name: 'Dịch vụ / Thương mại', value: 10450, color: 'var(--purple)' },
];

const historyData = [
  { date: '28/02/2026', factory: 'Toàn Công ty', revenue: 59.95, consumption: 5.45, newCust: 350, status: 'approved' },
  { date: '27/02/2026', factory: 'Diễn Vọng', revenue: 18.2, consumption: 1.6, newCust: 120, status: 'approved' },
  { date: '26/02/2026', factory: 'Đồng Ho', revenue: 12.5, consumption: 1.1, newCust: 85, status: 'pending' },
  { date: '25/02/2026', factory: 'Yên Lập', revenue: 11.2, consumption: 1.0, newCust: 65, status: 'approved' },
];

const BusinessOverview: React.FC = () => {
  const [search, setSearch] = useState('');
  const [factory, setFactory] = useState('all');
  const [period, setPeriod] = useState('today');
  const [selectedKpi, setSelectedKpi] = useState<typeof stats[0] | null>(null);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof historyData[0] | null>(null);

  const handleExport = () => {
    // Export full business report as CSV
    const csvRows = [
      ['BAO CAO KINH DOANH - HE THONG QUAWACO'],
      ['Ngay xuat', new Date().toLocaleDateString('vi-VN')],
      [],
      ['TONG QUAN CHI TIEU'],
      ['Chi tieu', 'Gia tri', 'Don vi', 'Xu huong'],
    ];

    stats.forEach(s => {
      csvRows.push([s.label, s.value, s.unit, s.trend]);
    });

    csvRows.push([]);
    csvRows.push(['XU HUONG DOANH THU & SAN LUONG']);
    csvRows.push(['Thang', 'Doanh thu (Ty VND)', 'San luong (Trieu m3)']);
    trendData.forEach(t => {
      csvRows.push([t.name, t.revenue.toString(), t.consumption.toString()]);
    });

    csvRows.push([]);
    csvRows.push(['DOANH THU THEO NHA MAY']);
    csvRows.push(['Nha may', 'Doanh thu (Ty VND)', 'San luong (Ngan m3)']);
    factoryData.forEach(f => {
      csvRows.push([f.name, f.revenue.toString(), f.output.toString()]);
    });

    csvRows.push([]);
    csvRows.push(['LICH SU BAO CAO']);
    csvRows.push(['Ngay', 'Nha may', 'Doanh thu (Ty)', 'San luong (M m3)', 'KH Moi', 'Trang thai']);
    historyData.forEach(h => {
      csvRows.push([h.date, h.factory, h.revenue.toString(), h.consumption.toString(), h.newCust.toString(), h.status === 'approved' ? 'Da chot' : 'Cho duyet']);
    });

    const csvContent = csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `bao-cao-kinh-doanh-${today}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadReport = (report: typeof historyData[0]) => {
    const csvContent = [
      ['Chi tiêu', 'Gia tri', 'Don vi'],
      ['Doanh thu thuan', report.revenue.toString(), 'Ti VND'],
      ['San luong tieu thu', report.consumption.toString(), 'Trieu m3'],
      ['Khach hang moi', report.newCust.toString(), 'KH'],
      ['Trang thai', report.status === 'approved' ? 'Da chot' : 'Cho duyet', ''],
      ['Ngay bao cao', report.date, ''],
      ['Nha may', report.factory, ''],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-${report.factory.replace(/\s+/g, '-').toLowerCase()}-${report.date.replace(/\//g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered data based on selected factory
  const filteredFactoryData = useMemo(() => {
    if (factory === 'all') return factoryData;
    const factoryMap: Record<string, string> = { dv: 'Diễn Vọng', dh: 'Đồng Ho', yl: 'Yên Lập' };
    const selectedName = factoryMap[factory];
    return factoryData.filter(f => f.name === selectedName);
  }, [factory]);

  const filteredHistoryData = useMemo(() => {
    if (factory === 'all') return historyData;
    const factoryMap: Record<string, string> = { dv: 'Diễn Vọng', dh: 'Đồng Ho', yl: 'Yên Lập' };
    const selectedName = factoryMap[factory];
    return historyData.filter(h => h.factory === selectedName || h.factory === 'Toàn Công ty');
  }, [factory]);

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto custom-scrollbar animate-fadeInScale">
      {/* Header */}
      <div className="page-header mb-6 flex justify-between items-start">
        <div className="page-title">
          <h1 className="text-[22px] font-bold text-[color:var(--text)] mb-0.5">Tổng quan Kinh doanh</h1>
          <p className="text-[13px] text-[color:var(--muted)]">Thống kê hiệu quả kinh doanh toàn hệ thống Quawaco</p>
        </div>
        <button
          onClick={handleExport}
          className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,102,255,0.3)]"
        >
          <Download size={14} /> Xuất báo cáo
        </button>
      </div>

      {/* FilterBar Integration */}
      <div className="mb-6">
        <FilterBar
          searchPlaceholder="Tìm kiếm nhanh..."
          searchValue={search}
          onSearchChange={setSearch}
          onReset={() => {
            setSearch('');
            setFactory('all');
            setPeriod('today');
          }}
          filters={[
            {
              key: 'factory',
              label: 'NHÀ MÁY',
              value: factory,
              onChange: setFactory,
              options: [
                { value: 'all', label: 'Tất cả nhà máy' },
                { value: 'dv', label: 'NM Diễn Vọng' },
                { value: 'dh', label: 'NM Đồng Ho' },
                { value: 'yl', label: 'NM Yên Lập' }
              ]
            },
            {
              key: 'period',
              label: 'THỜI GIAN',
              value: period,
              onChange: setPeriod,
              options: [
                { value: 'today', label: 'Hôm nay' },
                { value: 'week', label: '7 ngày qua' },
                { value: 'month', label: 'Tháng này' },
                { value: 'year', label: 'Năm nay' }
              ]
            }
          ]}
        />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {stats.map((s, i) => (
          <div
            key={i}
            onClick={() => setSelectedKpi(s)}
            className={`kpi-card p-4 border-t-2 ${s.border} bg-[color:var(--bg-card)] hover:bg-[color:var(--bg-hover)] transition-all cursor-pointer group`}
          >
            <div className="text-[11px] text-[color:var(--muted)] font-bold uppercase mb-1 tracking-wider">{s.label}</div>
            <div className="flex items-end gap-1 mb-2">
              <span className={`text-[22px] font-black leading-none ${s.color}`}>{s.value}</span>
              <span className="text-[12px] text-[color:var(--muted)] font-semibold pb-0.5">{s.unit}</span>
            </div>
            <div className={`text-[11px] font-semibold flex items-center gap-1 ${s.isUp ? 'text-[color:var(--green)]' : 'text-[color:var(--red)]'}`}>
              {s.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {s.trend}
              <span className="text-[color:var(--muted)] font-normal ml-0.5 whitespace-nowrap">vs kỳ trước</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Trend Chart */}
        <div className="card bg-[color:var(--bg-card)] overflow-hidden">
          <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center bg-[color:var(--bg-surface)]">
            <span className="font-bold text-[14px] text-[color:var(--text)]">Xu hướng Doanh thu & Sản lượng</span>
          </div>
          <div className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} tickMargin={8} />
                <YAxis yAxisId="left" stroke="var(--muted)" fontSize={11} tickFormatter={(v) => `${v}Tỷ`} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--muted)" fontSize={11} tickFormatter={(v) => `${v}M`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: 'var(--text)'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: 'var(--muted)' }} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" name="Doanh thu (Tỷ VND)" fill="url(#colorRev)" stroke="var(--cyan)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="consumption" name="Sản lượng (Triệu m³)" stroke="var(--green)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: 'var(--green)' }} />
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Factory Ranking */}
        <div className="card bg-[color:var(--bg-card)] overflow-hidden">
          <div className="p-4 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]">
            <span className="font-bold text-[14px] text-[color:var(--text)]">Doanh thu & Sản lượng theo Nhà máy</span>
          </div>
          <div className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredFactoryData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted)" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="var(--text-2)" fontSize={11} width={70} />
                <Tooltip
                  cursor={{ fill: 'var(--bg-hover)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="revenue" name="Doanh thu (Tỷ VND)" fill="var(--cyan)" radius={[0, 4, 4, 0]} barSize={16} />
                <Bar dataKey="output" name="Sản lượng (Ngàn m³)" fill="var(--green)" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Customer Types */}
        <div className="card bg-[color:var(--bg-card)]">
          <div className="p-4 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]">
            <span className="font-bold text-[14px] text-[color:var(--text)]">Cơ cấu Khách hàng</span>
          </div>
          <div className="p-5 flex flex-col items-center">
            <div className="h-[180px] w-full mb-4 relative flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={customerDistData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {customerDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => Number(value).toLocaleString()}
                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-[20px] font-black text-[color:var(--text)]">302k</span>
                <span className="text-[10px] text-[color:var(--muted)]">Tổng KH</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              {customerDistData.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-[12px] border-b border-[color:var(--border)] pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-[color:var(--text-2)]">{d.name}</span>
                  </div>
                  <div className="font-bold font-mono text-[color:var(--text)]">{d.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Data */}
        <div className="card bg-[color:var(--bg-card)] lg:col-span-2 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)] flex justify-between items-center">
            <span className="font-bold text-[14px] text-[color:var(--text)]">Dữ liệu gần đây & Lối tắt</span>
            <button
              onClick={() => setShowHistoryView(true)}
              className="text-[12px] text-[color:var(--cyan)] hover:underline font-semibold cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>
          <div className="overflow-x-auto custom-scrollbar flex-1">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-[color:var(--bg-surface)] text-[11px] uppercase text-[color:var(--muted)] font-bold border-b border-[color:var(--border)]">
                  <th className="p-3 pl-4">Ngày</th>
                  <th className="p-3">Khu vực / Nhà máy</th>
                  <th className="p-3">Doanh thu</th>
                  <th className="p-3">Sản lượng</th>
                  <th className="p-3 text-center">KH Mới</th>
                  <th className="p-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistoryData.map((r, i) => (
                  <tr key={i} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors">
                    <td className="p-3 pl-4 font-mono text-[12px] text-[color:var(--muted)]">{r.date}</td>
                    <td className="p-3 font-semibold text-[13px] text-[color:var(--text)]">{r.factory}</td>
                    <td className="p-3 font-mono text-[13px] font-bold text-[color:var(--cyan)]">{r.revenue} Tỉ</td>
                    <td className="p-3 font-mono text-[13px] text-[color:var(--green)]">{r.consumption}M m³</td>
                    <td className="p-3 text-center font-bold text-[color:var(--blue)]">+{r.newCust}</td>
                    <td className="p-3">
                      {r.status === 'approved' ? (
                        <span className="flex items-center gap-1.5 text-[color:var(--green)] text-[11px] font-bold">
                          <CheckCircle2 size={14} /> Đã chốt
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[color:var(--yellow)] text-[11px] font-bold">
                          <AlertCircle size={14} /> Chờ duyệt
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* KPI Detail Modal */}
      {selectedKpi && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedKpi(null)}
        >
          <div
            className="bg-[color:var(--bg-elevated)] border border-[color:var(--border)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-[color:var(--border)]">
              <h3 className="text-lg font-bold text-[color:var(--text)]">{selectedKpi.label}</h3>
              <button
                onClick={() => setSelectedKpi(null)}
                className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-end gap-2 mb-6">
                <span className={`text-4xl font-black ${selectedKpi.color}`}>{selectedKpi.value}</span>
                <span className="text-[14px] text-[color:var(--muted)] font-semibold pb-1">{selectedKpi.unit}</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-[color:var(--border)]">
                  <span className="text-[13px] text-[color:var(--muted)]">Xu hướng so với kỳ trước</span>
                  <span className={`flex items-center gap-1 font-bold ${selectedKpi.isUp ? 'text-[color:var(--green)]' : 'text-[color:var(--red)]'}`}>
                    {selectedKpi.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {selectedKpi.trend}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-[color:var(--border)]">
                  <span className="text-[13px] text-[color:var(--muted)]">Kỳ báo cáo</span>
                  <span className="text-[13px] text-[color:var(--text)] font-semibold">
                    {period === 'today' ? 'Hôm nay' : period === 'week' ? '7 ngày qua' : period === 'month' ? 'Tháng này' : 'Năm nay'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-[color:var(--border)]">
                  <span className="text-[13px] text-[color:var(--muted)]">Nhà máy áp dụng</span>
                  <span className="text-[13px] text-[color:var(--text)] font-semibold">
                    {factory === 'all' ? 'Tất cả nhà máy' : factory === 'dv' ? 'NM Diễn Vọng' : factory === 'dh' ? 'NM Đồng Ho' : 'NM Yên Lập'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-[13px] text-[color:var(--muted)]">Trạng thái</span>
                  <span className="flex items-center gap-1.5 text-[color:var(--green)] text-[13px] font-bold">
                    <CheckCircle2 size={14} /> Đã cập nhật
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[color:var(--border)] flex justify-end gap-3">
              <button
                onClick={() => setSelectedKpi(null)}
                className="px-4 py-2 text-[13px] font-semibold text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setSelectedReport({
                    date: period === 'today' ? 'Hôm nay' : period === 'week' ? '7 ngày qua' : period === 'month' ? 'Tháng này' : 'Năm nay',
                    factory: factory === 'all' ? 'Toàn Công ty' : factory === 'dv' ? 'NM Diễn Vọng' : factory === 'dh' ? 'NM Đồng Ho' : 'NM Yên Lập',
                    revenue: parseFloat(selectedKpi.value.replace(',', '')),
                    consumption: parseFloat(selectedKpi.value.replace(',', '')),
                    newCust: 0,
                    status: 'approved'
                  });
                  setShowReportDetail(true);
                }}
                className="btn btn-primary btn-sm flex items-center gap-1.5"
              >
                <Eye size={14} /> Xem báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full History View Modal */}
      {showHistoryView && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowHistoryView(false)}
        >
          <div
            className="bg-[color:var(--bg-elevated)] border border-[color:var(--border)] rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-[color:var(--border)]">
              <div>
                <h3 className="text-lg font-bold text-[color:var(--text)]">Lịch sử báo cáo Kinh doanh</h3>
                <p className="text-[12px] text-[color:var(--muted)] mt-1">Tất cả báo cáo đã ghi nhận</p>
              </div>
              <button
                onClick={() => setShowHistoryView(false)}
                className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-auto flex-1 custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-[color:var(--bg-surface)] z-10">
                  <tr className="text-[11px] uppercase text-[color:var(--muted)] font-bold border-b border-[color:var(--border)]">
                    <th className="p-4 pl-6">Ngày</th>
                    <th className="p-4">Khu vực / Nhà máy</th>
                    <th className="p-4">Doanh thu</th>
                    <th className="p-4">Sản lượng</th>
                    <th className="p-4 text-center">KH Mới</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 pr-6">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((r, i) => (
                    <tr key={i} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors">
                      <td className="p-4 pl-6 font-mono text-[12px] text-[color:var(--muted)]">{r.date}</td>
                      <td className="p-4 font-semibold text-[13px] text-[color:var(--text)]">{r.factory}</td>
                      <td className="p-4 font-mono text-[13px] font-bold text-[color:var(--cyan)]">{r.revenue} Tỉ</td>
                      <td className="p-4 font-mono text-[13px] text-[color:var(--green)]">{r.consumption}M m³</td>
                      <td className="p-4 text-center font-bold text-[color:var(--blue)]">+{r.newCust}</td>
                      <td className="p-4">
                        {r.status === 'approved' ? (
                          <span className="flex items-center gap-1.5 text-[color:var(--green)] text-[11px] font-bold">
                            <CheckCircle2 size={14} /> Đã chốt
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[color:var(--yellow)] text-[11px] font-bold">
                            <AlertCircle size={14} /> Chờ duyệt
                          </span>
                        )}
                      </td>
                      <td className="p-4 pr-6">
                        <button
                          onClick={() => {
                            setSelectedReport(r);
                            setShowReportDetail(true);
                          }}
                          className="text-[12px] text-[color:var(--cyan)] hover:underline font-semibold flex items-center gap-1"
                        >
                          <Eye size={12} /> Xem
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[color:var(--border)] flex justify-between items-center">
              <span className="text-[12px] text-[color:var(--muted)]">Tổng: {historyData.length} báo cáo</span>
              <button
                onClick={() => setShowHistoryView(false)}
                className="btn btn-ghost btn-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {showReportDetail && selectedReport && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => { setShowReportDetail(false); setSelectedReport(null); }}
        >
          <div
            className="bg-[color:var(--bg-elevated)] border border-[color:var(--border)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]">
              <div>
                <h3 className="text-lg font-bold text-[color:var(--text)]">Chi tiết Báo cáo</h3>
                <p className="text-[12px] text-[color:var(--muted)] mt-1">{selectedReport.date} — {selectedReport.factory}</p>
              </div>
              <button
                onClick={() => { setShowReportDetail(false); setSelectedReport(null); }}
                className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* KPI Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-xl p-4 text-center">
                  <div className="text-[11px] text-[color:var(--muted)] uppercase font-bold mb-1">Doanh thu</div>
                  <div className="text-2xl font-black text-[color:var(--cyan)]">{selectedReport.revenue} Tỉ</div>
                </div>
                <div className="bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-xl p-4 text-center">
                  <div className="text-[11px] text-[color:var(--muted)] uppercase font-bold mb-1">Sản lượng</div>
                  <div className="text-2xl font-black text-[color:var(--green)]">{selectedReport.consumption}M m³</div>
                </div>
                <div className="bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-xl p-4 text-center">
                  <div className="text-[11px] text-[color:var(--muted)] uppercase font-bold mb-1">KH Mới</div>
                  <div className="text-2xl font-black text-[color:var(--blue)]">+{selectedReport.newCust}</div>
                </div>
              </div>

              {/* Detail Table */}
              <div className="border border-[color:var(--border)] rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[color:var(--bg-surface)]">
                    <tr className="text-[11px] uppercase text-[color:var(--muted)] font-bold border-b border-[color:var(--border)]">
                      <th className="p-3 text-left pl-4">Chỉ tiêu</th>
                      <th className="p-3 text-right pr-4">Giá trị</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)]">
                      <td className="p-3 pl-4 text-[color:var(--text-2)]">Doanh thu thuần</td>
                      <td className="p-3 pr-4 text-right font-mono font-bold text-[color:var(--cyan)]">{selectedReport.revenue} Tỉ VND</td>
                    </tr>
                    <tr className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)]">
                      <td className="p-3 pl-4 text-[color:var(--text-2)]">Sản lượng tiêu thụ</td>
                      <td className="p-3 pr-4 text-right font-mono text-[color:var(--green)]">{selectedReport.consumption} Triệu m³</td>
                    </tr>
                    <tr className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)]">
                      <td className="p-3 pl-4 text-[color:var(--text-2)]">Khách hàng mới</td>
                      <td className="p-3 pr-4 text-right font-mono font-bold text-[color:var(--blue)]">+{selectedReport.newCust} KH</td>
                    </tr>
                    <tr className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)]">
                      <td className="p-3 pl-4 text-[color:var(--text-2)]">Đơn giá trung bình</td>
                      <td className="p-3 pr-4 text-right font-mono text-[color:var(--text)]">{selectedReport.revenue > 0 ? Math.round(selectedReport.revenue * 1000 / selectedReport.consumption).toLocaleString() : 0} VND/m³</td>
                    </tr>
                    <tr className="hover:bg-[color:var(--bg-hover)]">
                      <td className="p-3 pl-4 text-[color:var(--text-2)]">Trạng thái</td>
                      <td className="p-3 pr-4 text-right">
                        {selectedReport.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 text-[color:var(--green)] text-[12px] font-bold">
                            <CheckCircle2 size={14} /> Đã chốt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[color:var(--yellow)] text-[12px] font-bold">
                            <AlertCircle size={14} /> Chờ duyệt
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Notes */}
              <div className="mt-4 p-4 bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-xl">
                <div className="text-[12px] text-[color:var(--muted)] leading-relaxed">
                  <span className="text-[color:var(--text)] font-semibold">Ghi chú:</span> Báo cáo được tổng hợp từ dữ liệu vận hành của {selectedReport.factory}.
                  Số liệu đã bao gồm doanh thu bán nước, phí dịch vụ và các khoản thu khác.
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[color:var(--border)] flex justify-between items-center">
              <span className="text-[12px] text-[color:var(--muted)]">Ngày tạo: {selectedReport.date}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowReportDetail(false); setSelectedReport(null); }}
                  className="px-4 py-2 text-[13px] font-semibold text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => handleDownloadReport(selectedReport)}
                  className="btn btn-primary btn-sm flex items-center gap-1.5"
                >
                  <Download size={14} /> Tải CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessOverview;
