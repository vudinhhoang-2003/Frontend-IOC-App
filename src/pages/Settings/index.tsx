import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Users, 
  LayoutDashboard, 
  Bell, 
  Plug,
  Download,
  Save
} from 'lucide-react';

import SystemSettings from './views/SystemSettings';
import SecuritySettings from './views/SecuritySettings';
import RoleSettings from './views/RoleSettings';
import DashboardSettings from './views/DashboardSettings';
import NotificationSettings from './views/NotificationSettings';
import IntegrationSettings from './views/IntegrationSettings';

type TabType = 'system' | 'security' | 'roles' | 'dashboard' | 'notifications' | 'integrations';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('system');

  const tabs = [
    { id: 'system', label: 'Hệ thống', icon: SettingsIcon },
    { id: 'security', label: 'Bảo mật', icon: ShieldCheck },
    { id: 'roles', label: 'Phân quyền', icon: Users },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'integrations', label: 'Tích hợp', icon: Plug },
  ];

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto custom-scrollbar animate-fadeInScale">
      {/* Page Header */}
      <div className="page-header mb-6 flex justify-between items-start">
        <div className="page-title">
          <h1 className="text-[22px] font-bold text-[color:var(--text)]">Cài đặt hệ thống</h1>
          <p className="text-[13px] text-[color:var(--muted)] mt-0.5">
            Cấu hình, bảo mật, phân quyền và tích hợp
          </p>
        </div>
        <div className="page-actions flex gap-2.5">
          <button className="btn btn-ghost btn-sm flex items-center gap-1.5" onClick={() => alert('Đang xuất cấu hình...')}>
            <Download size={14} /> Xuất cấu hình
          </button>
          <button className="btn btn-primary btn-sm flex items-center gap-1.5" onClick={() => alert('Đã lưu toàn bộ thay đổi!')}>
            <Save size={14} /> Lưu thay đổi
          </button>
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
                  ? 'bg-[color:var(--bg-hover)] text-[color:var(--text)] border-b-2 border-[color:var(--cyan)]' 
                  : 'text-[color:var(--muted)] hover:bg-[color:var(--bg-surface)] hover:text-[color:var(--text)]'
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
        {activeTab === 'system' && (
          <div className="animate-fadeInScale"><SystemSettings /></div>
        )}
        {activeTab === 'security' && (
          <div className="animate-fadeInScale"><SecuritySettings /></div>
        )}
        {activeTab === 'roles' && (
          <div className="animate-fadeInScale"><RoleSettings /></div>
        )}
        {activeTab === 'dashboard' && (
          <div className="animate-fadeInScale"><DashboardSettings /></div>
        )}
        {activeTab === 'notifications' && (
          <div className="animate-fadeInScale"><NotificationSettings /></div>
        )}
        {activeTab === 'integrations' && (
          <div className="animate-fadeInScale"><IntegrationSettings /></div>
        )}
      </div>
    </div>
  );
};

export default Settings;
