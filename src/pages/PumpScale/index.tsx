import React, { useState, useMemo } from 'react';
import {
  CheckCircle2, Plus, Zap, AlertTriangle, RefreshCcw,
  Calendar, Coffee, Star, Sparkles, Sliders
} from 'lucide-react';
import {
  INITIAL_PROFILES, PUMP_STATIONS, AI_OPTIMIZED_DEFAULTS
} from './mockPumpData';
import type { PumpProfile, ScheduleInterval } from './types';
import { hexToRgb } from './utils';

import EVNPriceKPIs from './components/EVNPriceKPIs';
import ProfileList from './components/ProfileList';
import GanttChart from './components/GanttChart';
import StationTable from './components/StationTable';
import { ProfileModal, StationModal, ConfirmDeleteModal } from './components/PumpScaleModals';

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

const PumpScale: React.FC = () => {
  const [profiles, setProfiles] = useState<PumpProfile[]>(INITIAL_PROFILES);
  const [currentId, setCurrentId] = useState<string>(INITIAL_PROFILES[0].id);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modal States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalMode, setProfileModalMode] = useState<'create' | 'edit'>('create');
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [activeStationId, setActiveStationId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Derived Data
  const currentProfile = useMemo(() =>
    profiles.find(p => p.id === currentId) || profiles[0]
    , [profiles, currentId]);

  const stats = useMemo(() => {
    let totalH = 0;
    PUMP_STATIONS.forEach(s => {
      const sched = currentProfile.schedules[s.id] || [];
      totalH += sched.reduce((acc, curr) => acc + curr[1], 0);
    });

    const avgH = (totalH / PUMP_STATIONS.length).toFixed(1);
    const peakAvoided = Math.max(0, (PUMP_STATIONS.length * 24) - totalH);
    const costSaving = Math.round(peakAvoided * 3.171 * 250 / 10000) * 10000;

    return { totalH, avgH, costSaving };
  }, [currentProfile]);

  // --- Toast Actions ---
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev.slice(-2), { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Profile Actions ---
  const handleActivate = (id: string) => {
    const target = profiles.find(p => p.id === id);
    const isDeactivating = target?.isActive;

    setProfiles(profiles.map(p => ({
      ...p,
      isActive: p.id === id ? !p.isActive : false
    })));

    addToast(
      isDeactivating ? 'Đã tắt kịch bản' : 'Đã áp dụng kịch bản mới thành công', 
      isDeactivating ? 'info' : 'success'
    );
  };

  const handleCreate = () => {
    setProfileModalMode('create');
    setIsProfileModalOpen(true);
  };

  const handleEditMeta = (id: string) => {
    setCurrentId(id);
    setProfileModalMode('edit');
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = (data: Partial<PumpProfile>) => {
    const today = new Date().toLocaleDateString('vi-VN');
    if (profileModalMode === 'create') {
      const newProfile: PumpProfile = {
        ...data as PumpProfile,
        id: `PP-${Date.now().toString().slice(-4)}`,
        isActive: false,
        createdAt: today,
        updatedAt: today,
        schedules: { ...currentProfile.schedules } // Clone schedules from current viewed
      };
      setProfiles([...profiles, newProfile]);
      setCurrentId(newProfile.id);
      addToast('Đã tạo kịch bản mới', 'success');
    } else {
      setProfiles(profiles.map(p => p.id === currentId ? { ...p, ...data, updatedAt: today } : p));
      addToast('Đã cập nhật thông tin kịch bản', 'success');
    }
    setIsProfileModalOpen(false);
  };

  const handleDuplicate = (id: string) => {
    const target = profiles.find(p => p.id === id);
    if (!target) return;
    const today = new Date().toLocaleDateString('vi-VN');
    const duplicate: PumpProfile = {
      ...target,
      id: `PP-${Date.now().toString().slice(-4)}`,
      name: `${target.name} (Bản sao)`,
      isActive: false,
      createdAt: today,
      updatedAt: today
    };
    setProfiles([...profiles, duplicate]);
    setCurrentId(duplicate.id);
    addToast('Đã nhân bản kịch bản', 'info');
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    const nextProfiles = profiles.filter(p => p.id !== deleteTargetId);
    setProfiles(nextProfiles);
    if (currentId === deleteTargetId) {
      setCurrentId(nextProfiles[0]?.id || '');
    }
    setIsDeleteModalOpen(false);
  };

  // --- Station Actions ---
  const handleEditStation = (stationId: string) => {
    setActiveStationId(stationId);
    setIsStationModalOpen(true);
  };

  const handleSaveIntervals = (intervals: ScheduleInterval[]) => {
    if (!activeStationId) return;
    const today = new Date().toLocaleDateString('vi-VN');
    setProfiles(profiles.map(p => {
      if (p.id === currentId) {
        return {
          ...p,
          updatedAt: today,
          schedules: { ...p.schedules, [activeStationId]: intervals }
        };
      }
      return p;
    }));
    addToast(`Đã lưu lịch trình cho trạm ${activeStationId}`, 'success');
    setIsStationModalOpen(false);
  };

  const resetToAI = () => {
    const today = new Date().toLocaleDateString('vi-VN');
    setProfiles(profiles.map(p => {
      if (p.id === currentId) {
        return {
          ...p,
          updatedAt: today,
          schedules: { ...AI_OPTIMIZED_DEFAULTS }
        };
      }
      return p;
    }));
    addToast('Đã khôi phục lịch trình tối ưu AI', 'info');
  };

  return (
    <div className="p-6 h-full overflow-y-auto relative">
      {/* Toast Container */}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col items-end pointer-events-none">
        {toasts.map(t => <ToastItem key={t.id} toast={t} onClose={removeToast} />)}
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-in fade-in slide-in-from-top-4">
        <div>
          <h1 className="text-[24px] font-black tracking-tight mb-1 flex items-center gap-2 text-[var(--text)] uppercase">
            Kịch bản Lịch bơm <span className="text-[var(--cyan)] font-mono text-[16px] lowercase font-bold opacity-60"></span>
          </h1>
          <p className="text-[var(--muted)] text-[13px] font-medium">
            Quản lý nhiều profile lịch vận hành – Tối ưu chi phí điện năng theo giờ cao điểm
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetToAI}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-[10px] text-[13px] font-bold text-[var(--muted)] hover:text-[var(--cyan)] transition-all shadow-sm active:scale-[0.98]"
          >
            <RefreshCcw size={14} /> Reset AI tối ưu
          </button>
          <button
            onClick={() => handleActivate(currentId)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13.5px] font-bold transition-all shadow-lg active:scale-[0.98] ${
              currentProfile.isActive
                ? 'bg-[var(--green)]/15 text-[var(--green)] border border-[var(--green)]/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                : 'bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] text-white shadow-blue-500/20'
            }`}
          >
            {currentProfile.isActive ? (
              <><CheckCircle2 size={16} /> Đang áp dụng (Bật)</>
            ) : (
              <><Zap size={16} /> Áp dụng kịch bản</>
            )}
          </button>
        </div>
      </div>

      <EVNPriceKPIs costSaving={stats.costSaving} />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Left Sidebar */}
        <div className="animate-in slide-in-from-left-4 duration-500">
          <ProfileList
            profiles={profiles}
            currentId={currentId}
            onSelect={setCurrentId}
            onCreate={handleCreate}
            onDuplicate={handleDuplicate}
            onEdit={handleEditMeta}
            onDelete={handleDeleteRequest}
          />
        </div>

        {/* Right Detail Content */}
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
          {/* Active Profile Header Card */}
          <div
            className="card bg-[var(--bg-elevated)] border-l-4 p-6 shadow-sm flex flex-col md:flex-row items-center gap-6"
            style={{ borderLeftColor: currentProfile.color }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center border border-current opacity-80 flex-shrink-0"
              style={{
                backgroundColor: `rgba(${hexToRgb(currentProfile.color)}, 0.15)`,
                color: currentProfile.color
              }}
            >
              {(() => {
                const props = { size: 30 };
                switch (currentProfile.icon) {
                  case 'weekday': return <Calendar {...props} />;
                  case 'weekend': return <Coffee {...props} />;
                  case 'holiday': return <Star {...props} />;
                  case 'tet': return <Sparkles {...props} />;
                  default: return <Sliders {...props} />;
                }
              })()}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2 flex-wrap">
                <h2 className="text-[20px] font-black tracking-tight" style={{ color: currentProfile.color }}>{currentProfile.name}</h2>
                {currentProfile.isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold uppercase">đang hoạt động</span>
                )}
                <span className="px-2 py-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[10px] font-bold text-[var(--muted)] uppercase tracking-wide">
                  {currentProfile.appliesTo}
                </span>
              </div>
              <p className="text-[var(--text-2)] text-[13.5px] font-medium leading-relaxed">{currentProfile.description}</p>
            </div>

            <div className="flex gap-3 flex-shrink-0">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 text-center min-w-[100px]">
                <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tighter mb-1">Tổng giờ bơm</div>
                <div className="text-[18px] font-black" style={{ color: currentProfile.color }}>{stats.totalH.toFixed(1)}h</div>
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 text-center min-w-[100px]">
                <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tighter mb-1">TB / trạm</div>
                <div className="text-[18px] font-black text-[var(--text)]">{stats.avgH}h</div>
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 text-center min-w-[100px]">
                <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tighter mb-1">Cập nhật</div>
                <div className="text-[13.5px] font-bold text-[var(--muted)] mt-1.5">{currentProfile.updatedAt}</div>
              </div>
            </div>
          </div>

          <GanttChart
            profile={currentProfile}
            stations={PUMP_STATIONS}
            onEditStation={handleEditStation}
          />

          <StationTable
            profile={currentProfile}
            stations={PUMP_STATIONS}
            onEditStation={handleEditStation}
          />
        </div>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialData={profileModalMode === 'edit' ? currentProfile : undefined}
        onSave={handleSaveProfile}
      />

      <StationModal
        isOpen={isStationModalOpen}
        onClose={() => setIsStationModalOpen(false)}
        profileName={currentProfile.name}
        station={PUMP_STATIONS.find(s => s.id === activeStationId) || null}
        initialIntervals={currentProfile.schedules[activeStationId || ''] || []}
        onSave={handleSaveIntervals}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        name={profiles.find(p => p.id === deleteTargetId)?.name || ''}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default PumpScale;
