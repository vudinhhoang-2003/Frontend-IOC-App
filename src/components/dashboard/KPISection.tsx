import React from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Droplet, LocateFixed, Settings, BellRing, Users, Cable } from 'lucide-react';

const mockSparkData = [
  { value: 40 }, { value: 35 }, { value: 55 }, { value: 45 }, { value: 60 }, { value: 50 }, { value: 75 }
];

interface KPICardProps {
  title: string;
  value: string | React.ReactNode;
  unit?: string;
  trendText: string;
  trendType?: 'up' | 'down' | 'none';
  trendSubtext?: string;
  icon: any;
  glowClass: string;
  hexColor: string;
  hideSparkline?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, value, unit, trendText, trendType, trendSubtext, icon: Icon, glowClass, hexColor, hideSparkline 
}) => {
  return (
    <div className="kpi-card" style={{ '--accent-color': hexColor } as React.CSSProperties}>
      <div className="flex justify-between items-start mb-3">
        <div className="kpi-label">{title}</div>
        <div className={`kpi-icon ${glowClass}`}>
          <Icon />
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="kpi-value flex items-baseline">
          {value}
          {unit && <span className="text-[14px] text-[var(--muted)] ml-1 font-medium">{unit}</span>}
        </div>
        
        <div className="kpi-sub">
          {trendType === 'up' && <span className="kpi-trend-up font-bold">▲ {trendText}</span>}
          {trendType === 'down' && <span className="kpi-trend-down font-bold">▼ {trendText}</span>}
          {trendType === 'none' && <span style={{ color: hexColor }} className="font-bold">{trendText}</span>}
          <span className="text-[var(--muted)] text-[11px]">{trendSubtext}</span>
        </div>
      </div>

      {!hideSparkline && (
        <div className="absolute bottom-[15px] right-[15px] w-[100px] h-[45px] opacity-80 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockSparkData}>
              <Area 
                type="monotone" dataKey="value" stroke={hexColor} strokeWidth={2.5} 
                fill="transparent" isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const KPISection: React.FC = () => {
  return (
    <div className="kpi-grid">
      <KPICard 
        title="SẢN LƯỢNG HÔM NAY" 
        value="138.056" 
        unit="m³"
        trendText="3.2%" trendType="up" trendSubtext="so với hôm qua" 
        glowClass="glow-cyan" hexColor="var(--cyan, #00c8ff)" 
        icon={Droplet} 
      />
      <KPICard 
        title="TRẠM ONLINE / TỔNG" 
        value="6/8" 
        trendText="75%" trendType="up" trendSubtext="tỷ lệ hoạt động" 
        glowClass="glow-green" hexColor="var(--green, #00f080)" 
        icon={LocateFixed} 
      />
      <KPICard 
        title="SỰ CỐ ĐANG XỬ LÝ" 
        value="20" 
        trendText="2" trendType="down" trendSubtext="so với tuần trước" 
        glowClass="glow-yellow" hexColor="var(--yellow, #ffdb4d)" 
        icon={Settings} 
      />
      <KPICard 
        title="CẢNH BÁO CHƯA XỬ LÝ" 
        value="2" 
        trendText="Yêu cầu xử lý ngay" trendType="none" 
        glowClass="glow-red" hexColor="var(--red, #ff3d57)" 
        icon={BellRing} 
        hideSparkline 
      />
      <KPICard 
        title="TỔNG KHÁCH HÀNG" 
        value="302.450" 
        trendText="2,450" trendType="up" trendSubtext="tháng này" 
        glowClass="glow-blue" hexColor="var(--blue, #3b82f6)" 
        icon={Users} 
        hideSparkline 
      />
      <KPICard 
        title="TỶ LỆ NRW TRUNG BÌNH" 
        value="14.4" 
        unit="%"
        trendText="0.3%" trendType="down" trendSubtext="so với T1/2026" 
        glowClass="glow-purple" hexColor="var(--purple, #a855f7)" 
        icon={Cable} 
      />
    </div>
  );
};

export default KPISection;
