import React from 'react';
import { Activity, Droplets, AlertTriangle, TrendingUp } from 'lucide-react';

const tickerItems = [
  { icon: Activity, text: 'Trạm bơm Miếu Công: Áp lực 2.4 bar - Lưu lượng 150m³/h', color: 'var(--cyan)' },
  { icon: Droplets, text: 'Độ đục nhà máy Bãi Cháy: 0.15 NTU (Đạt chuẩn)', color: 'var(--green)' },
  { icon: AlertTriangle, text: 'Cảnh báo: Áp lực thấp tại khu vực Giếng Đáy', color: 'var(--yellow)' },
  { icon: TrendingUp, text: 'Sản lượng toàn hệ thống tăng 5% so với cùng kỳ', color: 'var(--cyan)' },
  { icon: Activity, text: 'Trạm bơm Miếu Công: Áp lực 2.4 bar - Lưu lượng 150m³/h', color: 'var(--cyan)' },
  { icon: Droplets, text: 'Độ đục nhà máy Bãi Cháy: 0.15 NTU (Đạt chuẩn)', color: 'var(--green)' },
];

const LiveTicker: React.FC = () => {
  return (
    <div className="ticker-container">
      <div className="ticker-live-badge">LIVE</div>
      <div className="ticker-content">
        <div className="ticker-scroll">
          {tickerItems.map((item, index) => (
            <div key={index} className="ticker-item">
              <item.icon size={14} style={{ color: item.color }} />
              <span>{item.text}</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {tickerItems.map((item, index) => (
            <div key={`dup-${index}`} className="ticker-item">
              <item.icon size={14} style={{ color: item.color }} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default LiveTicker;
