import React from 'react';
import FilterPanel from '../../components/dashboard/FilterPanel';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import LiveTicker from '../../components/dashboard/LiveTicker';
import KPISection from '../../components/dashboard/KPISection';
import ProductionOverview from '../../components/dashboard/ProductionOverview';
import OperationalStatus from '../../components/dashboard/OperationalStatus';
import PlantCapacity from '../../components/dashboard/PlantCapacity';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700 pb-12">
      <FilterPanel />
      <LiveTicker />
      <DashboardHeader />

      <KPISection />
      <ProductionOverview />
      <OperationalStatus />
      <PlantCapacity />
    </div>
  );
};

export default Dashboard;
