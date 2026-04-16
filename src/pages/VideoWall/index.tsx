import React, { useState, useEffect, useCallback } from 'react';
import type { LayoutType, ScenarioType, VwBlock } from './types';
import { VW_LAYOUTS, VW_SCENARIOS } from './constants';
import BlockRenderer from './components/BlockRenderer';

const VideoWall: React.FC = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutType>('1p4');
  const [scenario, setScenario] = useState<ScenarioType>('overview');
  const [isKiosk, setIsKiosk] = useState(false);

  // ── LOGIC: GET BLOCKS ──
  const getBlocks = useCallback((lMode: LayoutType, sScenario: ScenarioType): VwBlock[] => {
    const layout = VW_LAYOUTS.find(l => l.id === lMode)!;
    const count = layout.id === '1p4' ? 5 : layout.id === '1p3' ? 4 : layout.cols * layout.rows;
    const blocks: VwBlock[] = [];

    if (sScenario === 'overview') {
      blocks.push({ type: 'map', title: 'Bản đồ Mạng lưới Cấp nước (Live)' });
      blocks.push({ type: 'kpi', title: 'Chỉ số SXKD Tổng hợp' });
      blocks.push({ type: 'camera_rand', title: 'Camera – Trạm điều hành' });
      blocks.push({ type: 'scada_chart', title: 'Biểu đồ Lưu lượng & Áp lực' });
      blocks.push({ type: 'incidents', title: 'Cảnh báo & Sự cố' });
      blocks.push({ type: 'camera_rand', title: 'Camera – Tổ máy bơm' });
    } else if (sScenario === 'security') {
      blocks.push({ type: 'camera_gate', title: 'Camera – Cổng & Bảo vệ' });
      blocks.push({ type: 'camera_perimeter', title: 'Camera – Vành đai ngoài' });
      blocks.push({ type: 'camera_chemical', title: 'Camera – Kho Hóa chất' });
      blocks.push({ type: 'camera_pump', title: 'Camera – Trạm Bơm' });
      blocks.push({ type: 'incidents', title: 'Nhật ký An ninh (Live)' });
      blocks.push({ type: 'camera_rand', title: 'Camera – Tự động' });
    } else if (sScenario === 'scada') {
      blocks.push({ type: 'scada_iframe', title: 'SCADA – Toàn hệ thống' });
      blocks.push({ type: 'scada_kpi', title: 'Trạm bơm Hồng Gai' });
      blocks.push({ type: 'scada_kpi_2', title: 'Trạm bơm Bãi Cháy' });
      blocks.push({ type: 'map', title: 'Bản đồ Áp lực (GIS)' });
      blocks.push({ type: 'camera_pump', title: 'Camera – Trạm Bơm' });
      blocks.push({ type: 'incidents', title: 'Sự cố SCADA' });
    } else {
      blocks.push({ type: 'kpi_nrw', title: 'Phân tích Thất thoát (NRW)' });
      blocks.push({ type: 'water_quality', title: 'Chỉ số Clo / Đục / pH' });
      blocks.push({ type: 'map', title: 'Kết quả Dò rỉ' });
      blocks.push({ type: 'camera_lab', title: 'Camera – Phòng Lab' });
      blocks.push({ type: 'incidents', title: 'Cảnh báo Chất lượng' });
      blocks.push({ type: 'camera_rand', title: 'Camera – Điểm lấy mẫu' });
    }

    const result = blocks.slice(0, count);
    while (result.length < count) {
      result.push({ type: 'empty', title: 'Trống' });
    }
    return result;
  }, []);

  const currentLayout = VW_LAYOUTS.find(l => l.id === layoutMode)!;
  const blocks = getBlocks(layoutMode, scenario);

  // ── FULLSCREEN HANDLING ──
  const toggleKiosk = () => {
    if (!isKiosk) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsKiosk(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div className={`videowall-page ${isKiosk ? 'kiosk-active' : ''}`} style={{
      background: 'var(--bg-base)',
      minHeight: '100vh',
      padding: isKiosk ? '0' : '0 0 20px 0',
      color: 'var(--text)',
      position: 'relative'
    }}>
      <style>{`
        .kiosk-active {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 9999;
        }
        /* Custom scrollbar - follows theme */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg-base); }
        ::-webkit-scrollbar-thumb { background: var(--muted); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-2); }

        .fade-in { animation: vwFadeIn 0.5s ease-out; }
        @keyframes vwFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {!isKiosk && (
        <div className="fade-in" style={{ padding: '20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 5px 0', color: 'var(--text)' }}>Video Wall & Kiosk Mode</h1>
              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>Trình duyệt đa màn hình điều hành trung tâm (Hỗ trợ ghép màn lớn: 4× TV 65" + 1× TV 55")</p>
            </div>
            <button
              onClick={toggleKiosk}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg,var(--cyan),#0088ff)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--bg-base)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 5px 15px rgba(0,200,255,0.2)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              Bật Chế Độ Kiosk (Fullscreen)
            </button>
          </div>

          {/* Selectors Card */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>

              {/* Layout Selector */}
              <div style={{ flex: 1, minWidth: '300px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                  1. Chọn Layout (Bố cục)
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {VW_LAYOUTS.map(l => (
                    <div
                      key={l.id}
                      onClick={() => setLayoutMode(l.id)}
                      style={{
                        cursor: 'pointer',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: `1px solid ${layoutMode === l.id ? 'var(--cyan)' : 'var(--border)'}`,
                        background: layoutMode === l.id ? 'rgba(0,200,255,.06)' : 'var(--bg-surface)',
                        transition: '.2s'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 700, color: layoutMode === l.id ? 'var(--cyan)' : 'var(--text)', marginBottom: '4px' }}>{l.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{l.cols} cột × {l.rows} hàng</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scenario Selector */}
              <div style={{ flex: 1.5, minWidth: '400px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                  2. Chọn Kịch bản hiển thị
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {VW_SCENARIOS.map(s => (
                    <div
                      key={s.id}
                      onClick={() => setScenario(s.id)}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '10px',
                        border: `1px solid ${scenario === s.id ? 'var(--green)' : 'var(--border)'}`,
                        background: scenario === s.id ? 'rgba(0,230,118,.06)' : 'var(--bg-surface)',
                        transition: '.2s'
                      }}
                    >
                      <div style={{ fontSize: '20px', width: '40px', height: '40px', background: 'var(--bg-hover)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: scenario === s.id ? 'var(--green)' : 'var(--text)', marginBottom: '2px' }}>{s.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: '1.4' }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GRID AREA ── */}
      <div
        className="vw-grid fade-in"
        style={{
          display: 'grid',
          gap: isKiosk ? '8px' : '16px',
          height: isKiosk ? '100vh' : 'calc(100vh - 200px)',
          minHeight: isKiosk ? 'auto' : '650px',
          padding: isKiosk ? '8px' : '0 20px',
          ...currentLayout.css
        }}
      >
        {blocks.map((block, idx) => {
          const isFirst = idx === 0;
          const noHeader = block.type.startsWith('camera') || block.type === 'map' || block.type === 'scada_iframe';

          return (
            <div
              key={`${block.type}-${idx}`}
              className="vw-block"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                ...(isFirst ? currentLayout.firstSpan : {})
              }}
            >
              {/* Block Header (Overlay) */}
              <div
                className="vw-block-header"
                style={{
                  padding: '8px 12px',
                  background: 'var(--bg-card)',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  zIndex: 10,
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  backdropFilter: 'blur(8px)',
                  color: 'var(--text)'
                }}
              >
                <span>{block.title}</span>
                <button style={{ background: 'var(--bg-hover)', border: 'none', color: 'var(--muted)', borderRadius: '4px', width: '20px', height: '20px', cursor: 'pointer' }}>⋮</button>
              </div>

              {/* Block Content */}
              <div
                className="vw-block-content"
                style={{
                  flex: 1,
                  minHeight: 0,
                  paddingTop: noHeader ? '0' : '36px'
                }}
              >
                <BlockRenderer block={block} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Exit Kiosk Button (Floating) */}
      {isKiosk && (
        <button
          onClick={toggleKiosk}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 10000,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            padding: '10px 16px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3v3h13M8 21v-3h13M3 8h3V3m-3 13h3v5" /></svg>
          Thoát Kiosk Mode (ESC)
        </button>
      )}
    </div>
  );
};

export default VideoWall;
