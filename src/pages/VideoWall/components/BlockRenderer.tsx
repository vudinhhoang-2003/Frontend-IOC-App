import React, { useState, useEffect } from 'react';
import type { VwBlock } from '../types';
import { CAM_IMAGES } from '../constants';

interface BlockRendererProps {
  block: VwBlock;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('vi-VN'));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('vi-VN'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderContent = () => {
    const t = block.type;

    if (t === 'map') {
      return (
        <iframe 
          src="https://gis.quawaco.com.vn/Home/Gis" 
          style={{ width: '100%', height: '100%', border: 'none', background: '#030e1c', display: 'block' }} 
          allowFullScreen 
        />
      );
    }

    if (t === 'scada_iframe') {
      return (
        <iframe 
          src="https://gis.quawaco.com.vn/Home/Index" 
          style={{ width: '100%', height: '100%', border: 'none', background: '#030e1c', display: 'block' }} 
          allowFullScreen 
        />
      );
    }

    if (t.startsWith('camera')) {
      let imgKey: keyof typeof CAM_IMAGES = 'gate_online';
      if (t === 'camera_perimeter') imgKey = 'perimeter';
      else if (t === 'camera_chemical') imgKey = 'chemical';
      else if (t === 'camera_pump' || t === 'camera_lab') imgKey = 'pump_room';
      else {
          const keys: (keyof typeof CAM_IMAGES)[] = ['gate_online', 'pump_room', 'reservoir', 'control_room'];
          imgKey = keys[Math.floor(Math.random() * keys.length)];
      }
      
      const imgUrl = CAM_IMAGES[imgKey];

      return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#030e1c' }}>
          <img src={imgUrl} alt={block.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
          <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div className="pulse-dot-red" style={{ width: '8px', height: '8px', backgroundColor: '#ff1744', borderRadius: '50%', boxShadow: '0 0 8px #ff1744' }}></div>
            <span style={{ color: '#ff1744', fontSize: '10px', fontWeight: 700 }}>REC</span>
          </div>
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', color: 'rgba(255,255,255,.8)', fontSize: '10px', fontFamily: 'monospace' }}>
            {time}
          </div>
          <style>{`
            .pulse-dot-red {
              animation: vwpulse 1.5s infinite;
            }
            @keyframes vwpulse {
              0% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.3; transform: scale(0.8); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      );
    }

    if (['kpi', 'scada_kpi', 'scada_kpi_2', 'water_quality'].includes(t)) {
      const vals = [
        { l: 'Sản lượng', v: '124,500 m³', c: 'var(--cyan)' },
        { l: 'Áp lực Mạng', v: '2.4 bar', c: 'var(--green)' },
        { l: 'Điện Năng', v: '4,200 kWh', c: 'var(--yellow)' },
        { l: 'Cảnh báo', v: '3 active', c: 'var(--red)' }
      ];
      return (
        <div style={{ padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', height: '100%', alignContent: 'center' }}>
          {vals.map((x, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '4px' }}>{x.l}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: x.c }}>{x.v}</div>
            </div>
          ))}
        </div>
      );
    }

    if (t === 'incidents') {
      return (
        <div style={{ padding: '10px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,23,68,.05)', borderLeft: '3px solid var(--red)', borderRadius: '4px', flexShrink: 0 }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', width: '50px' }}>10:{50 - i}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cảnh báo áp lực thấp - Khu {i}</div>
            </div>
          ))}
        </div>
      );
    }

    if (t === 'scada_chart' || t === 'kpi_nrw') {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'rgba(0,200,255,.02)' }}>
          <div style={{ width: '80%', height: '60%', borderBottom: '1px solid rgba(0,200,255,.2)', borderLeft: '1px solid rgba(0,200,255,.2)', position: 'relative' }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <polyline points="0,80 20,70 40,75 60,40 80,45 100,20" fill="none" stroke="var(--cyan)" strokeWidth="2" />
              <polyline points="0,90 20,85 40,88 60,60 80,70 100,50" fill="none" stroke="var(--green)" strokeWidth="2" />
            </svg>
          </div>
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--cyan)' }}>● Lưu lượng</span>
            <span style={{ fontSize: '10px', color: 'var(--green)' }}>● Áp lực</span>
          </div>
        </div>
      );
    }

    return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>Empty Block</div>;
  };

  return (
    <div style={{ height: '100%' }}>
      {renderContent()}
    </div>
  );
};

export default BlockRenderer;
