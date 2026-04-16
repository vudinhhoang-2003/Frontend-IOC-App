import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Employee } from '../data';

interface EmployeeListProps {
  employees: Employee[];
  page: number;
  setPage: (page: number) => void;
  searchQuery: string;
  factoryFilter: string;
  deptFilter: string;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

const PAGE_SIZE = 10;

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  page,
  setPage,
  searchQuery,
  factoryFilter,
  deptFilter,
  onEdit,
  onDelete,
}) => {
  const filtered = employees.filter((e) => {
    const matchSearch =
      !searchQuery ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFactory = !factoryFilter || e.factory === factoryFilter;
    const matchDept = !deptFilter || e.dept === deptFilter;
    return matchSearch && matchFactory && matchDept;
  });

  const start = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, Math.min(start + PAGE_SIZE, filtered.length));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

  const getRoleBadge = (role: string) => {
    const map: Record<string, string> = {
      admin: 'badge-red',
      dispatcher: 'badge-yellow',
      operator: 'badge-blue',
      viewer: 'badge-gray',
    };
    return map[role] || 'badge-gray';
  };

  const getRoleLabel = (role: string) => {
    const map: Record<string, string> = {
      admin: 'Admin',
      dispatcher: 'Dispatcher',
      operator: 'Operator',
      viewer: 'Viewer',
    };
    return map[role] || role;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-green">Hoạt động</span>;
      case 'leave':
        return <span className="badge badge-yellow">Nghỉ phép</span>;
      case 'inactive':
        return <span className="badge badge-gray">Ngừng HĐ</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(
          <button
            key={i}
            className={`btn btn-sm ${i === page ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setPage(i)}
          >
            {i}
          </button>
        );
      } else if (i === page - 2 || i === page + 2) {
        pages.push(
          <span key={i} style={{ padding: '0 4px', color: 'var(--muted)' }}>
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 whitespace-nowrap">
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Mã NV</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Họ tên</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Chức vụ</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Role</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Nhà máy</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Phòng ban</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Trạng thái</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Email</th>
              <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((e) => (
              <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-3 font-mono text-[color:var(--cyan)]">{e.id}</td>
                <td className="p-3 font-semibold">{e.name}</td>
                <td className="p-3 text-[13px]">{e.position}</td>
                <td className="p-3">
                  <span className={`badge ${getRoleBadge(e.role)}`}>{getRoleLabel(e.role)}</span>
                </td>
                <td className="p-3 text-[12px]">{e.factory || '—'}</td>
                <td className="p-3 text-[12px] text-[color:var(--muted)]">{e.dept}</td>
                <td className="p-3">{getStatusBadge(e.status)}</td>
                <td className="p-3 text-[12px] text-[color:var(--muted)]">{e.email}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <button
                      className="btn btn-ghost btn-sm px-2 text-white/70 hover:text-white"
                      onClick={() => onEdit(e.id)}
                    >
                      <Pencil size={14} /> Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-icon text-red-400 bg-transparent border-none hover:bg-red-400/10 hover:text-red-300 px-2"
                      title="Xóa"
                      onClick={() => onDelete(e.id, e.name)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-[color:var(--muted)]">
                  Không tìm thấy nhân viên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-2 p-3 border-t border-[color:var(--border)] flex items-center justify-between">
        <div className="text-[12px] text-[color:var(--muted)]">
          Hiển thị {filtered.length > 0 ? start + 1 : 0}-
          {Math.min(start + PAGE_SIZE, filtered.length)} / {filtered.length} nhân viên
        </div>
        <div className="flex gap-1 items-center">
          <button
            className="btn btn-ghost btn-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Trước
          </button>
          {renderPageNumbers()}
          <button
            className="btn btn-ghost btn-sm"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
