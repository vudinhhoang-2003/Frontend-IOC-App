import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Plant, ViewMode } from './types';
import { MOCK_PLANTS } from './mockPlantData';
import { PlantCard } from './components/PlantCard';
import { PlantTable } from './components/PlantTable';
import { PlantDetailModal } from './components/PlantDetailModal';
import { PlantGISModal } from './components/PlantGISModal';
import { PlantFormModal } from './components/PlantFormModal';

const PlantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState<Plant[]>(MOCK_PLANTS);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [detailPlant, setDetailPlant] = useState<Plant | null>(null);
  const [gisPlant, setGisPlant] = useState<Plant | null>(null);
  const [formPlant, setFormPlant] = useState<Plant | null | undefined>(undefined); // undefined = closed, null = add new

  const filteredPlants = useMemo(() => {
    return plants.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDistrict = selectedDistrict === 'All' || p.location === selectedDistrict;
      return matchSearch && matchDistrict;
    });
  }, [plants, searchQuery, selectedDistrict]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDistrict, viewMode]);

  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
  const currentPlants = filteredPlants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSavePlant = (data: Partial<Plant>) => {
    if (formPlant) {
      // Edit
      setPlants(prev => prev.map(p => p.id === formPlant.id ? { ...p, ...data } : p));
      console.log('Updated plant:', data);
    } else {
      // Add new
      const newPlant = {
        ...data,
        id: Math.max(...plants.map(p => p.id)) + 1,
      } as Plant;
      setPlants(prev => [...prev, newPlant]);
      console.log('Added new plant:', newPlant);
    }
  };

  const handleOpenCamera = (plant: Plant) => {
    console.log('Navigating to camera with filter:', plant.name);
    // Thực hiện điều hướng thực tế sang trang Camera với state lọc
    navigate('/camera', { state: { siteFilter: plant.name } });
  };

  const handleExport = () => {
    alert('Đang chuẩn bị dữ liệu xuất Excel cho ' + filteredPlants.length + ' nhà máy...');
  };

  return (
    <div className="plants-page" style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      <style>{`
        .btn-primary {
          background: linear-gradient(135deg, #0050cc, #00c8ff) !important;
          color: #fff !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 8px 18px !important;
          font-weight: 600 !important;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(0, 80, 204, 0.3);
          height: 38px;
          font-size: 13px;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 80, 204, 0.4);
          filter: brightness(1.1);
        }

        .btn-ghost {
          background: var(--bg-surface, rgba(128, 128, 128, 0.1)) !important;
          color: var(--text) !important;
          border: 1px solid var(--border) !important;
          border-radius: 10px !important;
          padding: 0 16px !important;
          height: 38px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          font-size: 13px;
        }
        .btn-ghost:hover {
          background: var(--hover-bg, rgba(128, 128, 128, 0.2)) !important;
          border-color: var(--cyan) !important;
        }

        .view-toggle-wrap {
          display: flex;
          background: var(--bg-surface, rgba(128, 128, 128, 0.1));
          padding: 3px;
          border-radius: 10px;
          border: 1px solid var(--border);
          height: 38px;
          align-items: center;
        }

        .view-toggle-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: var(--muted);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .view-toggle-btn.active {
          background: var(--cyan);
          color: #fff;
          box-shadow: 0 0 12px rgba(0, 210, 255, 0.5);
        }

        .search-wrap {
          position: relative;
        }
        .search-input {
          width: 320px;
          height: 38px;
          background: var(--bg-surface, rgba(128, 128, 128, 0.1));
          border: 1px solid var(--border);
          border-radius: 10px;
          padding-left: 36px;
          padding-right: 16px;
          color: var(--text);
          outline: none;
          transition: all 0.2s;
          font-size: 13px;
        }
        .search-input:focus {
          border-color: var(--cyan);
          background: var(--bg-surface-active, rgba(128, 128, 128, 0.15));
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.1);
        }

        .grid-auto {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 10px;
        }

        @media (max-width: 1400px) {
          .grid-auto { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 1024px) {
          .grid-auto { grid-template-columns: repeat(2, 1fr); }
        }

        .pagination-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--bg-surface, rgba(128, 128, 128, 0.05));
          color: var(--text);
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }
        .pagination-btn:hover:not(:disabled) {
          border-color: var(--cyan);
          color: var(--cyan);
        }
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pagination-btn.active {
          background: var(--cyan);
          color: #fff;
          border-color: var(--cyan);
        }
      `}</style>

      {/* HEADER */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div className="page-title">
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--text)' }}>Quản lý Nhà máy</h1>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '4px 0 0' }}>Hệ thống quản lý, giám sát và vận hành các nhà máy nước & trạm bơm</p>
          </div>

          {/* Search */}
          <div className="search-wrap">
            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              className="search-input"
              placeholder="Tìm tên nhà máy, địa điểm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="page-actions" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          {/* Export */}
          <button className="btn-ghost" onClick={handleExport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Xuất Excel
          </button>

          {/* View Toggle */}
          <div className="view-toggle-wrap">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Dạng lưới"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Dạng danh sách"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
            </button>
          </div>

          {/* Add Button */}
          <button
            className="btn-primary"
            onClick={() => setFormPlant(null)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Thêm nhà máy
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {filteredPlants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div style={{ fontSize: '48px', color: 'var(--muted)', opacity: 0.5, marginBottom: '16px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          <div style={{ fontSize: '16px', color: 'var(--muted)' }}>Không tìm thấy nhà máy nào khớp với từ khóa "{searchQuery}"</div>
          <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={() => { setSearchQuery(''); setSelectedDistrict('All'); }}>Xóa lọc</button>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid-auto">
            {currentPlants.map(p => (
              <PlantCard
                key={p.id}
                plant={p}
                onClick={() => setDetailPlant(p)}
                canEdit={true}
                onEdit={() => setFormPlant(p)}
                onOpenCamera={() => handleOpenCamera(p)}
              />
            ))}
          </div>
        ) : (
          <PlantTable
            plants={currentPlants}
            onOpenDetail={setDetailPlant}
            canEdit={true}
            onEdit={setFormPlant}
          />
        )
      )}

      {/* Pagination Component */}
      {filteredPlants.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredPlants.length)} trong tổng số {filteredPlants.length} bản ghi
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      {detailPlant && (
        <PlantDetailModal
          plant={detailPlant}
          onClose={() => setDetailPlant(null)}
          onOpenGIS={() => { setGisPlant(detailPlant); setDetailPlant(null); }}
          onOpenCamera={() => handleOpenCamera(detailPlant)}
        />
      )}

      {gisPlant && (
        <PlantGISModal
          plant={gisPlant}
          onClose={() => setGisPlant(null)}
        />
      )}

      {formPlant !== undefined && (
        <PlantFormModal
          plant={formPlant}
          onClose={() => setFormPlant(undefined)}
          onSave={handleSavePlant}
        />
      )}
    </div>
  );
};

export default PlantsPage;
