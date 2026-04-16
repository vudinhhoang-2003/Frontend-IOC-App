import React, { useState } from 'react';
import { Plus, BellRing, Settings, CheckCircle2, AlertTriangle, Zap, Sliders } from 'lucide-react';
import { INITIAL_ALERT_RULES } from './mockAlertData';
import type { AlertRule } from './types';
import AlertKPIs from './components/AlertKPIs';
import AlertRuleTable from './components/AlertRuleTable';
import { AlertRuleModal, ConfirmDeleteModal } from './components/AlertRuleModals';

// --- Toast System ---
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const ToastItem: React.FC<{ toast: Toast; onClose: (id: number) => void }> = ({ toast, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle2 size={16} className="text-green-500" />,
    error: <AlertTriangle size={16} className="text-red-500" />,
    info: <Zap size={16} className="text-[var(--cyan)]" />,
    warning: <AlertTriangle size={16} className="text-yellow-500" />
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-full duration-300 pointer-events-auto mb-2 w-[300px]">
      <div className="shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 text-[13px] font-bold text-[var(--text)] leading-tight">{toast.message}</div>
    </div>
  );
};

const AlertConfig: React.FC = () => {
  const [rules, setRules] = useState<AlertRule[]>(INITIAL_ALERT_RULES);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Modal States
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [ruleModalMode, setRuleModalMode] = useState<'create' | 'edit'>('create');
  const [editingRule, setEditingRule] = useState<AlertRule | undefined>(undefined);
  const [activeRuleId, setActiveRuleId] = useState<number | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // --- Toast Actions ---
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev.slice(-2), { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- CRUD Handlers ---
  const handleToggle = (id: number) => {
    const target = rules.find(r => r.id === id);
    if (!target) return;
    
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
    addToast(target.active ? `Đã tạm dừng luật: ${target.name}` : `Đã kích hoạt luật: ${target.name}`, target.active ? 'warning' : 'success');
  };

  const handleCreate = () => {
    setRuleModalMode('create');
    setEditingRule(undefined);
    setIsRuleModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return;
    setRuleModalMode('edit');
    setEditingRule(rule);
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = (data: Partial<AlertRule>) => {
    if (ruleModalMode === 'create') {
      const newRule: AlertRule = {
        ...(data as AlertRule),
        id: Math.max(...rules.map(r => r.id), 0) + 1,
      };
      setRules([...rules, newRule]);
      addToast('Đã tạo luật cảnh báo mới thành công', 'success');
    } else if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? { ...r, ...data } : r));
      addToast('Đã cập nhật thay đổi thành công', 'success');
    }
    setIsRuleModalOpen(false);
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      setRules(rules.filter(r => r.id !== deleteTargetId));
      addToast('Đã xóa luật cảnh báo khỏi hệ thống', 'info');
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="p-6 h-full overflow-y-auto relative">
      {/* Toast Container */}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col items-end pointer-events-none">
        {toasts.map(t => <ToastItem key={t.id} toast={t} onClose={removeToast} />)}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-in fade-in slide-in-from-top-4">
        <div>
          <h1 className="text-[25px] font-black tracking-tighter mb-1 text-[var(--text)] uppercase leading-none">
            Thiết lập cảnh báo
          </h1>
          <p className="text-[var(--muted)] text-[13.5px] font-medium leading-relaxed opacity-80">
            Thiết lập và quản lý các ngưỡng cảnh báo vận hành
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] text-white rounded-[10px] text-[13.5px] font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all hover:brightness-110"
          >
            <Plus size={16} strokeWidth={3} /> Tạo cảnh báo mới
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <AlertKPIs rules={rules} />

      {/* Table Section */}
      <div className="animate-in slide-in-from-bottom-4 duration-500 delay-150">
        <AlertRuleTable 
          rules={rules}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      </div>

      {/* Modals */}
      <AlertRuleModal 
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        initialData={editingRule}
        onSave={handleSaveRule}
      />

      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        name={rules.find(r => r.id === deleteTargetId)?.name || ''}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AlertConfig;
