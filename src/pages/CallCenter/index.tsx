import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Ticket, BarChart3, 
  Search, Filter, Plus, 
  ChevronRight, ChevronLeft,
  CheckCircle2, AlertCircle, Clock3,
  PhoneCall, PhoneIncoming, PhoneOutgoing,
  Activity, Info, X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  MOCK_CALL_LOGS, MOCK_TICKETS, 
  AGENT_STATUSES, CALL_TRENDS 
} from './mockCallData';
import type { 
  CallTicket, CallCenterTab 
} from './types';

// --- Toast System ---
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const ToastItem: React.FC<{ toast: Toast; onClose: (id: number) => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle2 size={18} className="text-[color:var(--green)]" />,
    error: <AlertCircle size={18} className="text-[color:var(--red)]" />,
    info: <Info size={18} className="text-[color:var(--cyan)]" />,
    warning: <AlertCircle size={18} className="text-[color:var(--yellow)]" />
  };

  const borders = {
    success: 'border-[color:var(--green)]/30',
    error: 'border-[color:var(--red)]/30',
    info: 'border-[color:var(--cyan)]/30',
    warning: 'border-[color:var(--yellow)]/30'
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${borders[toast.type]} bg-[color:var(--bg-elevated)] backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-full duration-300 pointer-events-auto mb-2 w-[320px]`}>
      <div className="shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 text-[13px] font-bold text-[color:var(--text)] leading-tight">{toast.message}</div>
      <button onClick={() => onClose(toast.id)} className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors">
        <X size={14} />
      </button>
    </div>
  );
};

// --- Styled Components & Helpers ---

const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 40;
  const points = data.map((d, i) => {
    const x = (i * width) / (data.length - 1);
    const y = height - ((d - min) / range) * height + 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height + 4}`} preserveAspectRatio="none">
      <path 
        d={`M ${points}`} 
        fill="none" 
        stroke={color} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
};

const KPICard: React.FC<{ 
  label: string; 
  value: React.ReactNode; 
  subtext: React.ReactNode; 
  trend?: number[]; 
  accent: string;
  isSpecial?: boolean;
}> = ({ label, value, subtext, trend, accent, isSpecial }) => (
  <div 
    className="kpi-card relative flex flex-col justify-center min-h-[125px] p-5 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-card)] backdrop-blur-[16px] transition-all duration-300 hover:scale-[1.02] hover:border-[color:var(--cyan)] hover:translate-y-[-4px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group overflow-hidden"
  >
    {/* Accent Line */}
    <div className="absolute top-0 left-0 right-0 h-[2.5px] opacity-60 rounded-t-2xl" style={{ backgroundColor: accent }} />
    
    <div className="flex justify-between items-start mb-1">
      <div className="kpi-label text-[11px] font-bold uppercase tracking-[1px] text-[color:var(--muted)] font-['Inter',_sans-serif]">{label}</div>
      {trend && (
        <div className="w-[80px] h-[35px] flex-shrink-0">
          <Sparkline data={trend} color={accent} />
        </div>
      )}
    </div>

    <div className="kpi-card-content flex-1">
      <div className={`kpi-value font-['Roboto_Mono',_monospace] font-bold tracking-tight ${isSpecial ? 'text-[22px]' : 'text-[30px]'} text-[color:var(--text)] leading-none mb-1`}>
        {value}
      </div>
      <div className="kpi-sub text-[12px] text-[color:var(--muted)] mt-[2px] flex items-center gap-1 font-['Inter',_sans-serif]">
        {subtext}
      </div>
    </div>
  </div>
);

const CallCenterPage: React.FC = () => {
  // Theme accessed via CSS variables, no JS state needed
  
  // State
  const [activeTab, setActiveTab] = useState<CallCenterTab>('stats');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<CallTicket | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const itemsPerPage = 8;


  // Helpers
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev.slice(-2), { id, message, type }]); // Keep max 3 toasts
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Filtered Data
  const filteredLogs = useMemo(() => {
    return MOCK_CALL_LOGS.filter(log => 
      log.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.phone.includes(searchQuery) ||
      log.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Pagination Logic
  const displayData = activeTab === 'calls' ? filteredLogs : filteredTickets;
  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = displayData.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: CallCenterTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const toggleOnDuty = () => {
    const newState = !isOnDuty;
    setIsOnDuty(newState);
    addToast(newState ? 'Đã bắt đầu ca trực' : 'Đã kết thúc ca trực', newState ? 'success' : 'warning');
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    const commonStyles = "inline-flex items-center gap-1 px-[10px] py-[3px] rounded-full text-[11px] font-bold border transition-all before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-current";
    
    switch (status) {
      case 'resolved':
      case 'closed':
      case 'done':
        return <span className={`${commonStyles} bg-[rgba(0,240,128,0.1)] text-[#00f080] border-[rgba(0,240,128,0.2)]`}>HOÀN TẤT</span>;
      case 'pending':
      case 'new':
      case 'inprogress':
      case 'processing':
        return <span className={`${commonStyles} bg-[rgba(255,219,77,0.1)] text-[#ffdb4d] border-[rgba(255,219,77,0.2)]`}>ĐANG XỬ LÝ</span>;
      case 'escalated':
      case 'high':
      case 'critical':
        return <span className={`${commonStyles} bg-[rgba(255,61,87,0.1)] text-[#ff3d57] border-[rgba(255,61,87,0.2)] uppercase`}>KHẨN CẤP</span>;
      case 'medium':
        return <span className={`${commonStyles} bg-[rgba(255,219,77,0.1)] text-[#ffdb4d] border-[rgba(255,219,77,0.2)]`}>TRUNG BÌNH</span>;
      case 'low':
        return <span className={`${commonStyles} bg-[rgba(0,210,255,0.1)] text-[#00d2ff] border-[rgba(0,210,255,0.2)] uppercase`}>THẤP</span>;
      default:
        return <span className={`${commonStyles} bg-[rgba(100,141,161,0.1)] text-[#648da1] border-[rgba(100,141,161,0.2)] uppercase`}>{status}</span>;
    }
  };

  return (
    <div className={`flex flex-col min-h-full p-6 relative overflow-x-hidden bg-[color:var(--bg-base)] text-[color:var(--text)] transition-colors duration-300 font-['Inter',_sans-serif]`}>
      
      {/* Toast Container */}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col items-end pointer-events-none">
        {toasts.map(t => <ToastItem key={t.id} toast={t} onClose={removeToast} />)}
      </div>

      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0" 
           style={{ 
             backgroundImage: `linear-gradient(rgba(0, 210, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 255, 0.02) 1px, transparent 1px)`,
             backgroundSize: '50px 50px' 
           }} 
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h1 className="text-[22px] font-bold text-[color:var(--text)] tracking-tight">Tổng đài CSKH</h1>
          <p className="text-[13px] text-[color:var(--muted)] mt-0.5">Tiếp nhận và điều phối phản ánh khách hàng — <span className="text-[color:var(--cyan)] font-['Roboto_Mono',_monospace] font-semibold">1900 545 520</span></p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => setIsNewTicketOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[color:var(--bg-surface)] border border-[color:var(--border)] text-[color:var(--muted)] text-[13px] font-bold hover:text-[color:var(--text)] hover:bg-[color:var(--bg-hover)] transition-all border-dashed"
          >
            <Plus size={16} /> Tạo Ticket
          </button>
          <button 
            onClick={toggleOnDuty}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:translate-y-[-1px] ${
              isOnDuty 
              ? 'bg-[color:var(--red)]/15 text-[color:var(--red)] border border-[color:var(--red)]/30' 
              : 'btn-primary'
            }`}
          >
            {isOnDuty ? <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[color:var(--red)] animate-pulse shadow-[0_0_8px_var(--red)]" /> Kết thúc ca trực</div> : <div className="flex items-center gap-2"><PhoneCall size={16} /> Bắt đầu ca trực</div>}
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 relative z-10">
        <KPICard label="Cuộc gọi hôm nay" value={MOCK_CALL_LOGS.length} accent="var(--cyan)" subtext="122 inbound · 63 outbound" trend={CALL_TRENDS.calls} />
        <KPICard label="Tỷ lệ giải quyết" value="94.5%" accent="var(--green)" subtext="Đã xử lý 172/185 cuộc gọi" trend={CALL_TRENDS.resolved} />
        <KPICard 
          label="Phản ánh nhiều nhất" 
          value={
            <div className="flex flex-col gap-0.5">
              <span className="text-[20px]">Hóa đơn tiền nước</span>
              <span className="text-[color:var(--red)] text-[13px] font-bold flex items-center gap-1.5 uppercase tracking-wider"><Activity size={12} /> NM Hồng Gai</span>
            </div>
          } 
          accent="var(--red)" subtext="Hồng Gai chiếm 45% cuộc gọi" isSpecial={true} 
        />
        <KPICard label="Ticket mở mới" value={MOCK_TICKETS.filter(t => t.status !== 'closed').length} accent="var(--yellow)" subtext="12 đang xử lý · 32 hoàn thành" trend={CALL_TRENDS.tickets} />
        <KPICard label="Thời gian đàm thoại TB" value="5:09" accent="var(--blue)" subtext="Dưới ngưỡng Target (6:00)" trend={CALL_TRENDS.duration} />
        <KPICard label="Điểm hài lòng (CSAT)" value="4.4" accent="var(--purple)" subtext="Dựa trên 1,250 lượt đánh giá" trend={CALL_TRENDS.csat} />
      </div>

      {/* Agent Status Bar */}
      <div className="flex items-center gap-6 px-6 py-4 bg-[color:var(--bg-card)] backdrop-blur-xl border border-[color:var(--border)] rounded-2xl mb-6 relative z-10 shadow-lg">
        <span className="text-[11px] font-black text-[color:var(--muted)] uppercase tracking-[1.5px] font-['Inter']">Agent trực ca:</span>
        <div className="flex flex-wrap gap-6">
          {AGENT_STATUSES.map((agent, i) => (
            <div key={i} className="flex items-center gap-2.5 text-[color:var(--muted)]">
              <div 
                className={`w-[8px] h-[8px] rounded-full pulse-dot`} 
                style={{ 
                  backgroundColor: agent.status === 'available' ? 'var(--green)' : agent.status === 'busy' ? 'var(--red)' : 'var(--yellow)',
                  boxShadow: `0 0 10px ${agent.status === 'available' ? 'var(--green)' : agent.status === 'busy' ? 'var(--red)' : 'var(--yellow)'}`
                }} 
              />
              <span className="text-[13.5px] font-bold text-[color:var(--text)] tracking-wide uppercase">{agent.name}</span>
              <span className="text-[11px] font-medium italic">({agent.status === 'available' ? 'Sẵn sàng' : agent.status === 'busy' ? 'Bận' : 'Nghỉ'})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 relative z-10">
        <div className="tabs flex items-center gap-1 p-1 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl">
          {[
            { id: 'stats', label: 'Thống kê', icon: BarChart3 },
            { id: 'calls', label: 'Lịch sử cuộc gọi', icon: PhoneIncoming },
            { id: 'tickets', label: 'Ticket hỗ trợ', icon: Ticket }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => handleTabChange(tab.id as CallCenterTab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-[color:var(--cyan)]/15 text-[color:var(--cyan)] shadow-inner' 
                  : 'text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-[color:var(--bg-hover)]'
              }`}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 max-w-[400px] relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--muted)] group-focus-within:text-[color:var(--cyan)] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Tìm theo khách hàng, SĐT, Ticket ID..." 
            className="w-full bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-xl py-2.5 pl-11 pr-4 text-[13.5px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)]/40 focus:bg-[color:var(--bg-surface)] transition-all font-medium placeholder:text-[color:var(--muted)]/50"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 overflow-hidden min-h-0">
        {activeTab === 'stats' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full overflow-y-auto pr-1 custom-scrollbar">
            {/* Chart 1 */}
            <div className="card bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-2xl p-5 backdrop-blur-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[14px] font-bold text-[color:var(--text)] flex items-center gap-2">
                  <Activity size={16} className="text-[color:var(--cyan)]" /> Cuộc gọi theo ngày (tháng 4)
                </h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: '1/4', in: 122, out: 52 }, { name: '2/4', in: 185, out: 85 },
                    { name: '3/4', in: 140, out: 64 }, { name: '4/4', in: 168, out: 72 },
                    { name: '5/4', in: 95, out: 45 }, { name: '6/4', in: 82, out: 38 },
                    { name: '7/4', in: 204, out: 82 }, { name: '8/4', in: 155, out: 68 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontWeight: 600}} />
                    <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontWeight: 600}} />
                    <Tooltip 
                      cursor={{fill: 'var(--bg-hover)', opacity: 0.3}} 
                      contentStyle={{backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '12px', borderRadius: '12px', color: 'var(--text)'}} 
                    />
                    <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '15px'}} />
                    <Bar dataKey="in" name="Cuộc gọi đến" fill="var(--cyan)" radius={[4, 4, 0, 0]} barSize={24} />
                    <Bar dataKey="out" name="Cuộc gọi đi" fill="var(--purple)" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2 */}
            <div className="card bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-2xl p-5 backdrop-blur-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[14px] font-bold text-[color:var(--text)] flex items-center gap-2">
                  <Filter size={16} className="text-[color:var(--cyan)]" /> Phân bổ chủ đề phản ánh
                </h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Chất lượng', value: 1420 },
                        { name: 'Hóa đơn', value: 985 },
                        { name: 'Áp lực yếu', value: 842 },
                        { name: 'Hợp đồng', value: 625 },
                        { name: 'Sự cố', value: 580 },
                        { name: 'Khác', value: 418 }
                      ]}
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {[ 'var(--cyan)', 'var(--yellow)', 'var(--red)', 'var(--green)', 'var(--blue)', 'var(--purple)' ].map((c, i) => (
                        <Cell key={i} fill={c} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '12px', borderRadius: '12px', color: 'var(--text)'}} />
                    <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{fontSize: '12px', paddingLeft: '20px'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-2xl flex flex-col h-full backdrop-blur-2xl transition-none scale-100 shadow-sm overflow-hidden">
            <div className="flex-1 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-[color:var(--bg-surface)] border-b border-[color:var(--border)] sticky top-0 z-20 backdrop-blur-md">
                  <tr className="[&>th]:p-4 [&>th]:text-[11px] [&>th]:font-black [&>th]:text-[color:var(--muted)] [&>th]:uppercase [&>th]:tracking-[1.5px]">
                    {activeTab === 'calls' ? (
                      <>
                        <th>Mã ID</th>
                        <th>Khách hàng</th>
                        <th>Số điện thoại</th>
                        <th>Mục đích</th>
                        <th>Nhân viên</th>
                        <th className="text-center">Trạng thái</th>
                        <th className="text-right">Thời gian</th>
                      </>
                    ) : (
                      <>
                        <th>Mã Ticket</th>
                        <th>Nội dung yêu cầu</th>
                        <th>Lĩnh vực</th>
                        <th className="text-center">Ưu tiên</th>
                        <th className="text-center">Xử lý</th>
                        <th>Phụ trách</th>
                        <th className="text-right">Thao tác</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedData.map((itemValue: any) => (
                    <tr key={itemValue.id} className="hover:bg-white/5 transition-all text-[13.5px] group">
                      {activeTab === 'calls' ? (
                        <>
                          <td className="p-4 font-['Roboto_Mono'] font-bold text-[color:var(--blue)]">{itemValue.id}</td>
                          <td className="p-4 font-bold text-[color:var(--text)]">{itemValue.customer}</td>
                          <td className="p-4 font-['Roboto_Mono'] text-[color:var(--muted)]">{itemValue.phone}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 group-hover:text-[color:var(--text)] transition-colors">
                              {itemValue.type === 'inbound' ? <PhoneIncoming size={12} className="text-[color:var(--cyan)]" /> : <PhoneOutgoing size={12} className="text-[color:var(--purple)]" />}
                              <span className="truncate max-w-[200px]">{itemValue.topic}</span>
                            </div>
                          </td>
                          <td className="p-4">{itemValue.agent}</td>
                          <td className="p-4 text-center">{getStatusBadge(itemValue.status)}</td>
                          <td className="p-4 text-right font-['Roboto_Mono'] text-[11px] font-bold text-[color:var(--muted)]">{itemValue.time}</td>
                        </>
                      ) : (
                        <>
                          <td className="p-4 font-['Roboto_Mono'] font-bold text-[color:var(--yellow)]">{itemValue.id}</td>
                          <td className="p-4 font-bold text-[color:var(--text)] truncate max-w-[300px]">{itemValue.title}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded text-[10px] font-black uppercase text-[color:var(--muted)]">{itemValue.category}</span>
                          </td>
                          <td className="p-4 text-center">{getStatusBadge(itemValue.priority)}</td>
                          <td className="p-4 text-center">{getStatusBadge(itemValue.status)}</td>
                          <td className="p-4">{itemValue.assignee}</td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => setSelectedTicket(itemValue)}
                              className="px-4 py-1.5 bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg text-[13px] font-bold text-[color:var(--cyan)] hover:bg-[color:var(--cyan)] hover:text-black transition-all"
                            >XEM</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[color:var(--border)] bg-[color:var(--bg-surface)] flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-[13px] text-[color:var(--muted)] font-bold uppercase tracking-wider">Hiển thị {Math.min(displayData.length, startIndex + 1)} - {Math.min(startIndex + itemsPerPage, displayData.length)} của {displayData.length} mục</span>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-[color:var(--border)] rounded-lg text-[color:var(--muted)] hover:text-[color:var(--text)] hover:border-[color:var(--text)]/30 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-1.5 px-2">
                  {Array.from({length: totalPages}, (_, i) => i + 1).map(num => (
                    <button 
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`min-w-[34px] h-[34px] rounded-lg text-[13.5px] font-bold transition-all border ${
                        currentPage === num 
                          ? 'bg-[color:var(--cyan)] text-black border-[color:var(--cyan)] shadow-lg' 
                          : 'text-[color:var(--muted)] border-[color:var(--border)] hover:bg-[color:var(--bg-hover)]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-[color:var(--border)] rounded-lg text-[color:var(--muted)] hover:text-[color:var(--text)] hover:border-[color:var(--text)]/30 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Detail Modal — Portal to body */}
      {selectedTicket && createPortal(
        <div onClick={() => setSelectedTicket(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} className="bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-[24px] w-[850px] max-w-[95vw] overflow-hidden shadow-2xl" style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
            <div className="flex items-center justify-between p-6 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[color:var(--yellow)]/10 rounded-xl text-[color:var(--yellow)] shadow-inner"><Ticket size={24} /></div>
                <div>
                  <h3 className="text-[17px] font-black text-[color:var(--text)] uppercase tracking-wider">{selectedTicket.id} — CHI TIẾT TICKET</h3>
                  <p className="text-[12px] text-[color:var(--muted)] mt-0.5 font-medium">{selectedTicket.title}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-[color:var(--muted)] text-3xl font-light hover:text-[color:var(--text)] transition-all">&times;</button>
            </div>
            <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gradient-to-b from-transparent to-[color:var(--bg-surface)]/20">
              <div className="space-y-4">
                {[
                  {label: 'Danh mục', value: selectedTicket.category},
                  {label: 'Mức độ ưu tiên', value: getStatusBadge(selectedTicket.priority)},
                  {label: 'Trạng thái xử lý', value: getStatusBadge(selectedTicket.status)},
                  {label: 'Người xử lý', value: selectedTicket.assignee},
                  {label: 'Nhà máy', value: selectedTicket.factory || 'Chi nhánh Hạ Long'}
                ].map((row, i) => (
                  <div key={i} className="flex items-center py-3.5 border-b border-[color:var(--border)] border-dashed last:border-0">
                    <span className="w-1/3 text-[12px] font-black text-[color:var(--muted)] uppercase tracking-wider">{row.label}</span>
                    <span className="w-2/3 text-[14px] text-[color:var(--text)] font-bold">{row.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-[11px] font-black text-[color:var(--muted)] uppercase tracking-[2px] mb-5 flex items-center gap-2">
                  <Clock3 size={14} className="text-[color:var(--cyan)]" /> Nhật ký xử lý (Timeline)
                </h4>
                <div className="relative pl-5 space-y-7 before:absolute before:left-0.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[color:var(--border)]">
                  {(selectedTicket.timeline || [{time: '20/02/2026 10:00', action: 'Tiếp nhận', user: 'Hệ thống', note: 'Khởi tạo từ cuộc gọi'}]).map((step: any, i: number) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-[23.5px] top-1 w-[10px] h-[10px] rounded-full bg-[color:var(--cyan)] shadow-[0_0_10px_var(--cyan)] group-hover:scale-125 transition-transform" />
                      <div className="flex flex-col">
                        <div className="flex justify-between items-start">
                          <span className="text-[13px] font-black text-[color:var(--text)]">{step.action}</span>
                          <span className="text-[11px] font-mono font-bold text-[color:var(--muted)]">{step.time}</span>
                        </div>
                        <span className="text-[12px] text-[color:var(--cyan)] font-bold mt-0.5">@ {step.user}</span>
                        <p className="text-[12.5px] text-[color:var(--text-2)] mt-2 bg-[color:var(--bg-surface)] p-2.5 rounded-xl border border-[color:var(--border)] italic">"{step.note}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-[color:var(--border)] bg-[color:var(--bg-surface)] flex justify-end gap-3">
              <button onClick={() => setSelectedTicket(null)} className="btn btn-ghost px-6 rounded-xl font-bold">ĐÓNG</button>
              <button 
                onClick={() => addToast(`Cập nhật trạng thái cho ${selectedTicket.id}`, 'info')}
                className="btn btn-primary px-8 rounded-xl font-black shadow-[0_8px_20px_var(--cyan)/20]"
              >
                CẬP NHẬT TIẾN ĐỘ
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* New Ticket Modal — Portal to body */}
      {isNewTicketOpen && createPortal(
        <div onClick={() => setIsNewTicketOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} className="bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-[24px] w-[620px] max-w-[95vw] overflow-hidden shadow-2xl" style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
            <div className="flex items-center justify-between p-6 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]">
              <h3 className="text-[16px] font-black text-[color:var(--text)]">Tạo Ticket hỗ trợ mới</h3>
              <button onClick={() => setIsNewTicketOpen(false)} className="text-[color:var(--muted)] text-2xl hover:text-[color:var(--text)] transition-colors">&times;</button>
            </div>
            <div className="p-7 space-y-5 text-left">
              {/* Tiêu đề vấn đề */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-[color:var(--muted)] uppercase tracking-wider pl-1">Tiêu đề vấn đề</label>
                <input type="text" placeholder="Mô tả ngắn gọn..." className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-3 text-[13.5px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] transition-all placeholder:text-[color:var(--muted)]/30" />
              </div>
              {/* Danh mục + Mức ưu tiên */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-[color:var(--muted)] uppercase tracking-wider pl-1">Danh mục</label>
                  <select className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-3 text-[13.5px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] transition-all">
                    <option>Chất lượng nước</option>
                    <option>Hóa đơn &amp; Thanh toán</option>
                    <option>Sự cố mạng lưới</option>
                    <option>Áp lực nước yếu</option>
                    <option>Lắp đặt mới</option>
                    <option>Hợp đồng dịch vụ</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-[color:var(--muted)] uppercase tracking-wider pl-1">Mức ưu tiên</label>
                  <select className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-3 text-[13.5px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] transition-all">
                    <option>Thường</option>
                    <option>Trung bình</option>
                    <option>Cao</option>
                    <option>Khẩn cấp</option>
                  </select>
                </div>
              </div>
              {/* Khách hàng liên quan + Phân công */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-[color:var(--muted)] uppercase tracking-wider pl-1">Khách hàng liên quan</label>
                  <input type="text" placeholder="Mã KH hoặc tên..." className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-3 text-[13.5px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] transition-all placeholder:text-[color:var(--muted)]/30" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-[color:var(--muted)] uppercase tracking-wider pl-1">Phân công</label>
                  <select className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-3 text-[13.5px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] transition-all">
                    <option>Trần Đình Dũng – Ban Điều hành</option>
                    <option>Nguyễn Văn An – Kỹ thuật</option>
                    <option>Lê Thị Hoa – CSKH</option>
                    <option>Phạm Minh Tuấn – Vận hành</option>
                  </select>
                </div>
              </div>
              {/* Mô tả chi tiết */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-[color:var(--muted)] uppercase tracking-wider pl-1">Mô tả chi tiết</label>
                <textarea rows={4} placeholder="Ghi chép nội dung cuộc gọi..." className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-xl p-3 text-[13.5px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] transition-all placeholder:text-[color:var(--muted)]/30 resize-none"></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-[color:var(--border)] bg-[color:var(--bg-surface)] flex justify-end gap-3">
              <button onClick={() => setIsNewTicketOpen(false)} className="btn btn-ghost px-6 rounded-xl font-bold">Hủy</button>
              <button 
                onClick={() => {
                  addToast('Tạo Ticket thành công!', 'success');
                  setIsNewTicketOpen(false);
                }}
                className="btn btn-primary px-8 rounded-xl font-black shadow-[0_8px_25px_var(--cyan)/20] active:scale-95 transition-all text-[13.5px]"
              >
                Tạo ticket
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .pulse-dot {
          animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        .shadow-glow {
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 210, 255, 0.2); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 210, 255, 0.4); }
      `}</style>
    </div>
  );
};

export default CallCenterPage;
