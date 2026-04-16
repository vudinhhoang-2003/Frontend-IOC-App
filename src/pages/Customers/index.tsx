import React, { useState, useRef } from 'react';
import {
  Users2,
  Receipt,
  Tractor,
  Download,
  FileSpreadsheet,
  UserPlus
} from 'lucide-react';

import CustomerList from './views/CustomerList';
import Billing from './views/Billing';
import Metering from './views/Metering';

type TabType = 'customers' | 'billing' | 'metering';

const CustomersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('customers');
  const customerListRef = useRef<{ openCreateModal: () => void }>(null);

  const tabs = [
    { id: 'customers', label: 'Khách hàng & HĐ', icon: Users2 },
    { id: 'billing', label: 'Hóa đơn & Thanh toán', icon: Receipt },
    { id: 'metering', label: 'Ghi chỉ số đồng hồ', icon: Tractor },
  ];

  const handleAddCustomer = () => {
    setActiveTab('customers');
    // Dispatch custom event for CustomerList to listen
    window.dispatchEvent(new CustomEvent('open-create-customer'));
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto custom-scrollbar animate-fadeInScale">
      {/* Page Header */}
      <div className="page-header mb-6 flex justify-between items-start">
        <div className="page-title">
          <h1 className="text-[22px] font-bold text-[color:var(--text)] mb-0.5">Kinh doanh & Khách hàng</h1>
          <p className="text-[13px] text-[color:var(--muted)]">
            Hợp đồng, Hóa đơn, Ghi chỉ số và Công nợ
          </p>
        </div>
        <div className="page-actions flex gap-2.5">
          <button onClick={() => alert('Chức năng Import file đang được cấu hình!')} className="btn btn-ghost btn-sm flex items-center gap-1.5 text-[color:var(--muted)] hover:text-[color:var(--text)]">
            <Download size={14} /> Import File
          </button>
          <button onClick={() => alert('Đang xuất Template...') } className="btn btn-ghost btn-sm flex items-center gap-1.5 text-[color:var(--muted)] hover:text-[color:var(--text)]">
            <FileSpreadsheet size={14} /> Template
          </button>
          <button onClick={handleAddCustomer}
            className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,102,255,0.3)]">
            <UserPlus size={14} /> Thêm KH
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5 border-b border-[color:var(--border)] relative pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all font-bold text-[13px] whitespace-nowrap ${
                isActive
                  ? 'bg-[color:var(--bg-hover)] text-[color:var(--cyan)] border-b-2 border-[color:var(--cyan)] shadow-[0_-4px_16px_rgba(0,200,255,0.05)]'
                  : 'text-[color:var(--muted)] hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text)]'
              }`}
              onClick={() => setActiveTab(tab.id as TabType)}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === 'customers' && <div className="animate-fadeInScale"><CustomerList /></div>}
        {activeTab === 'billing' && <div className="animate-fadeInScale"><Billing /></div>}
        {activeTab === 'metering' && <div className="animate-fadeInScale"><Metering /></div>}
      </div>
    </div>
  );
};

export default CustomersPage;
