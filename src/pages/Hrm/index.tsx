import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CalendarDays, 
  TrendingUp, 
  Network, 
  Building2, 
  Download, 
  UserPlus,
  History
} from 'lucide-react';

import { apiClient } from '../../services/apiClient';

// Sub-components
import EmployeeList from './views/EmployeeList';
import Attendance from './views/Attendance';
import KpiBoard from './views/KpiBoard';
import OrgChart from './views/OrgChart';
import Departments from './views/Departments';
import ChangeHistory from './views/ChangeHistory';

type TabType = 'employees' | 'attendance' | 'kpi' | 'orgchart' | 'departments' | 'history';

const Hrm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('employees');
  
  // API States
  const [stats, setStats] = useState<any>({ total_employees: 0, active_employees: 0, avg_kpi_score: 0, on_leave: 0 });
  const [employees, setEmployees] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>({});
  const [kpis, setKpis] = useState<any[]>([]);
  const [orgStructure, setOrgStructure] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  // State for EmployeeList
  const [empPage, setEmpPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [_stats, _emps, _shifts, _att, _kpis, _org, _depts, _hist] = await Promise.all([
        apiClient.get('/hrm/stats'),
        apiClient.get('/hrm/employees?limit=200'),
        apiClient.get('/hrm/shifts'),
        apiClient.get('/hrm/attendance?year=2026&month=2'),
        apiClient.get('/hrm/kpi?limit=200'),
        apiClient.get('/hrm/orgchart'),
        apiClient.get('/hrm/departments'),
        apiClient.get('/hrm/history')
      ]);

      if (_stats.data?.success) setStats(_stats.data.data);
      if (_emps.data?.success) setEmployees(_emps.data.data);
      if (_shifts.data?.success) setShifts(_shifts.data.data);
      if (_att.data?.success) setAttendance(_att.data.data.schedule);
      if (_kpis.data?.success) setKpis(_kpis.data.data);
      if (_org.data?.success) setOrgStructure(_org.data.data);
      if (_depts.data?.success) setDepartments(_depts.data.data);
      if (_hist.data?.success) setHistory(_hist.data.data);
    } catch (e) {
      console.error('Error fetching HRM data', e);
    }
  };

  // Calculate KPIs (local fallback logic if needed)
  const totalEmployees = stats.total_employees || employees.length || 0;
  const activeEmployees = stats.active_employees || employees.filter(e => e.status === 'active').length || 0;
  const avgAge = employees.length ? Math.round(employees.reduce((acc, e) => acc + (e.age || 0), 0) / employees.length) : 0;
  const avgExp = employees.length ? (employees.reduce((acc, e) => acc + (e.exp || 0), 0) / employees.length).toFixed(1) : '0.0';
  const avgKpi = stats.avg_kpi_score || 0;

  // Tab definitions
  const tabs = [
    { id: 'employees', label: 'Danh sách CBCNV', icon: Users },
    { id: 'attendance', label: 'Chấm công & Phân ca', icon: CalendarDays },
    { id: 'kpi', label: 'KPI Nhân viên', icon: TrendingUp },
    { id: 'orgchart', label: 'Sơ đồ tổ chức', icon: Network },
    { id: 'departments', label: 'Phòng ban', icon: Building2 },
    { id: 'history', label: 'Lịch sử thay đổi', icon: History },
  ];

  const handleEditEmployee = (id: string) => {
    alert(`Chức năng sửa thông tin nhân viên: ${id}`);
  };

  const handleDeleteEmployee = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${name}"?`)) {
      alert(`Đã xóa nhân viên: ${name}`);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto custom-scrollbar">
      {/* Page Header */}
      <div className="page-header mb-6">
        <div className="page-title">
          <h1 className="text-[22px] font-bold text-[color:var(--text)]">Quản lý Nhân sự</h1>
          <p className="text-[13px] text-[color:var(--muted)] mt-0.5">
            Hồ sơ CBCNV, phân quyền, chấm công và KPI
          </p>
        </div>
        <div className="page-actions flex gap-2.5">
          <button className="btn btn-ghost btn-sm" onClick={() => alert('Đang xuất template...')}>
            <Download size={14} className="mr-1 inline-block" /> Template
          </button>
          <button className="btn btn-primary btn-sm flex items-center gap-1.5" onClick={() => alert('Chi tiết form thêm nhân viên')}>
            <UserPlus size={14} /> Thêm nhân viên
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <div className="kpi-card !min-h-[100px] !p-4" style={{ '--accent-color': 'var(--cyan)' } as any}>
          <div className="kpi-label mb-1">Tổng CBCNV</div>
          <div className="kpi-value text-2xl">{totalEmployees}</div>
        </div>
        <div className="kpi-card !min-h-[100px] !p-4" style={{ '--accent-color': 'var(--green)' } as any}>
          <div className="kpi-label mb-1">Đang làm việc</div>
          <div className="kpi-value text-2xl">{activeEmployees}</div>
        </div>
        <div className="kpi-card !min-h-[100px] !p-4" style={{ '--accent-color': 'var(--yellow)' } as any}>
          <div className="kpi-label mb-1">Ca 24/7 hôm nay</div>
          <div className="kpi-value text-2xl">3</div>
          <div className="kpi-sub mt-1 text-[11px]">Sáng · Chiều · Đêm</div>
        </div>
        <div className="kpi-card !min-h-[100px] !p-4" style={{ '--accent-color': 'var(--blue)' } as any}>
          <div className="kpi-label mb-1">Tuổi trung bình</div>
          <div className="kpi-value text-2xl">{avgAge}</div>
          <div className="kpi-sub mt-1 text-[11px]">Năm tuổi</div>
        </div>
        <div className="kpi-card !min-h-[100px] !p-4" style={{ '--accent-color': 'var(--purple)' } as any}>
          <div className="kpi-label mb-1">KN trung bình</div>
          <div className="kpi-value text-2xl">{avgExp}</div>
          <div className="kpi-sub mt-1 text-[11px]">Năm kinh nghiệm</div>
        </div>
        <div className="kpi-card !min-h-[100px] !p-4" style={{ '--accent-color': 'var(--green)' } as any}>
          <div className="kpi-label mb-1">KPI TB tháng 2</div>
          <div className="kpi-value text-2xl text-[color:var(--green)]">
            {avgKpi}<span className="text-base text-[color:var(--muted)] ml-0.5">%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 custom-scrollbar border-b border-[color:var(--border)] relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-colors font-semibold text-sm whitespace-nowrap ${
                isActive 
                  ? 'bg-[color:var(--bg-hover)] text-white border-b-2 border-[color:var(--cyan)]' 
                  : 'text-[color:var(--muted)] hover:bg-white/5 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id as TabType)}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === 'employees' && (
          <div className="animate-fadeInScale">
            {/* Simple search bar before the table */}
            <div className="flex items-center gap-4 mb-4">
              <input 
                type="text" 
                placeholder="Tìm kiếm mã NV, tên..."
                className="bg-black/20 border border-[color:var(--border)] rounded-lg px-4 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors w-64"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setEmpPage(1);
                }}
              />
            </div>
            <EmployeeList 
              employees={employees} 
              page={empPage} 
              setPage={setEmpPage}
              searchQuery={searchQuery}
              factoryFilter=""
              deptFilter=""
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          </div>
        )}
        
        {activeTab === 'attendance' && (
          <div className="animate-fadeInScale">
            <Attendance 
              employees={employees} 
              shifts={shifts} 
              attendanceSchedule={attendance} 
            />
          </div>
        )}
        
        {activeTab === 'kpi' && (
          <div className="animate-fadeInScale">
            <KpiBoard 
              employees={employees} 
              employeeKpi={kpis} 
            />
          </div>
        )}
        
        {activeTab === 'orgchart' && (
          <div className="animate-fadeInScale">
            <OrgChart 
              employees={employees} 
              orgStructure={orgStructure} 
            />
          </div>
        )}
        
        {activeTab === 'departments' && (
          <div className="animate-fadeInScale">
            <Departments 
              departments={departments} 
              onAddDept={() => alert('Mo popup thêm phòng ban')}
              onEditDept={(id) => alert(`Sửa phòng ban: ${id}`)}
              onDeleteDept={(id, name) => alert(`Xóa phòng ban: ${name}`)}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fadeInScale">
            <ChangeHistory history={history} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Hrm;
