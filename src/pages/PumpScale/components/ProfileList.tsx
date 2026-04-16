import React from 'react';
import { 
  Plus, Copy, Edit2, Trash2, Calendar, Coffee, Star, Sparkles, Sliders
} from 'lucide-react';
import type { PumpProfile } from '../types';
import { hexToRgb } from '../utils';

interface Props {
  profiles: PumpProfile[];
  currentId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProfileList: React.FC<Props> = ({ 
  profiles, currentId, onSelect, onCreate, onDuplicate, onEdit, onDelete 
}) => {
  const getIcon = (type: string, color: string) => {
    const props = { size: 18, style: { color } };
    switch (type) {
      case 'weekday': return <Calendar {...props} />;
      case 'weekend': return <Coffee {...props} />;
      case 'holiday': return <Star {...props} />;
      case 'tet': return <Sparkles {...props} />;
      default: return <Sliders {...props} />;
    }
  };

  const appliesToLabel = (t: string) => {
    const labels: Record<string, string> = { weekday: 'Ngày thường', weekend: 'Cuối tuần', holiday: 'Ngày lễ', custom: 'Tùy chỉnh' };
    return labels[t] || t;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1 px-1">Tất cả kịch bản</div>
      
      {profiles.map(p => {
        const isSelected = p.id === currentId;
        const rgb = hexToRgb(p.color);
        
        return (
          <div 
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`group card relative cursor-pointer border-2 transition-all p-4 rounded-xl ${
              isSelected 
                ? 'shadow-lg' 
                : 'hover:border-[var(--border-active)] border-[var(--border)]'
            }`}
            style={{ 
              borderColor: isSelected ? p.color : '',
              backgroundColor: isSelected ? `rgba(${rgb}, 0.08)` : '',
              boxShadow: isSelected ? `0 0 15px rgba(${rgb}, 0.15)` : ''
            }}
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-current opacity-80"
                style={{ 
                  backgroundColor: `rgba(${rgb}, 0.15)`,
                  color: p.color
                }}
              >
                {getIcon(p.icon, p.color)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span 
                    className={`text-[14px] font-bold truncate ${isSelected ? '' : 'text-[var(--text)]'}`}
                    style={{ color: isSelected ? p.color : '' }}
                  >
                    {p.name}
                  </span>
                  {p.isActive && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold whitespace-nowrap">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      ĐANG ÁP DỤNG
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-bold text-[var(--muted)] mb-1">{appliesToLabel(p.appliesTo)}</div>
                <div className="text-[11px] text-[var(--muted)] line-clamp-1">{p.description}</div>
              </div>
            </div>

            {isSelected && (
              <div className="flex gap-2 mt-4 pt-3 border-t border-[var(--border)] animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDuplicate(p.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[11px] font-bold text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)] transition-all"
                >
                  <Copy size={12} /> Nhân bản
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(p.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[11px] font-bold text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)] transition-all"
                >
                  <Edit2 size={12} /> Sửa
                </button>
                {!p.isActive && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                    className="ml-auto p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      <button 
        onClick={onCreate}
        className="w-full h-14 flex items-center justify-center gap-2 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] hover:text-[var(--cyan)] hover:border-[var(--cyan)]/50 hover:bg-[var(--cyan)]/5 transition-all text-[13px] font-bold mt-2"
      >
        <Plus size={16} /> Tạo kịch bản mới
      </button>
    </div>
  );
};

export default ProfileList;
