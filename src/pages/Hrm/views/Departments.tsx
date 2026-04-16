import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Department } from '../data';

interface DepartmentsProps {
  departments: Department[];
  onAddDept: () => void;
  onEditDept: (id: string) => void;
  onDeleteDept: (id: string, name: string) => void;
}

const Departments: React.FC<DepartmentsProps> = ({
  departments,
  onAddDept,
  onEditDept,
  onDeleteDept,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-[13px] text-[color:var(--muted)]">
          Quản lý cơ cấu phòng ban, trưởng/phó phòng và nhân sự trực thuộc.
        </p>
        <button className="btn btn-primary btn-sm flex items-center gap-1.5" onClick={onAddDept}>
          <Plus size={14} /> Thêm phòng ban
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {departments.map((d) => (
          <div key={d.id} className="card p-4">
            <div className="flex items-center gap-3.5">
              {/* Color badge */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border-[1.5px]"
                style={{
                  backgroundColor: `${d.color}18`,
                  borderColor: `${d.color}44`,
                }}
              >
                <span
                  className="text-[11px] font-bold font-mono tracking-wider"
                  style={{ color: d.color }}
                >
                  {d.code}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold">{d.name}</span>
                  <span className="text-[11px] text-[color:var(--muted)]">{d.desc}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="text-xs">
                    <span className="text-[color:var(--muted)]">Trưởng phòng: </span>
                    <strong>{d.head}</strong>
                  </span>
                  {d.deputies.length > 0 && (
                    <span className="text-xs">
                      <span className="text-[color:var(--muted)]">Phó phòng: </span>
                      {d.deputies.join(', ')}
                    </span>
                  )}
                  <span className="badge badge-blue text-[10px] py-0.5">{d.staff} nhân viên</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1.5 shrink-0 ml-4">
                <button
                  className="btn btn-ghost btn-sm flex items-center gap-1.5 px-2 text-white/70 hover:text-white"
                  onClick={() => onEditDept(d.id)}
                >
                  <Pencil size={14} /> Sửa
                </button>
                <button
                  className="btn btn-sm btn-icon text-red-400 bg-transparent border-none hover:bg-red-400/10 hover:text-red-300 px-2 flex items-center gap-1.5"
                  onClick={() => onDeleteDept(d.id, d.name)}
                >
                  <Trash2 size={14} /> <span className="text-sm font-medium">Xóa</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;
