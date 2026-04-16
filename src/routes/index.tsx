import { createBrowserRouter, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import PublicRoute from '../components/auth/PublicRoute';

// Lazy load các trang
const Login = React.lazy(() => import('../pages/Login'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Gis = React.lazy(() => import('../pages/Gis'));
const Scada = React.lazy(() => import('../pages/Scada'));
const Production = React.lazy(() => import('../pages/Production'));
const Plants = React.lazy(() => import('../pages/Plants'));
const Quality = React.lazy(() => import('../pages/Quality'));
const Nrw = React.lazy(() => import('../pages/Nrw'));
const Business = React.lazy(() => import('../pages/Business'));
const CallCenter = React.lazy(() => import('../pages/CallCenter'));
const Hrm = React.lazy(() => import('../pages/Hrm'));
const Camera = React.lazy(() => import('../pages/Camera'));
const Incidents = React.lazy(() => import('../pages/Incidents'));
const Reports = React.lazy(() => import('../pages/Reports'));
const AiAgent = React.lazy(() => import('../pages/AiAgent'));
const Approve = React.lazy(() => import('../pages/Approve'));
const VideoWall = React.lazy(() => import('../pages/VideoWall'));
const Lab = React.lazy(() => import('../pages/Lab'));
const PumpScale = React.lazy(() => import('../pages/PumpScale'));
const AlertConfig = React.lazy(() => import('../pages/AlertConfig'));
const Inventory = React.lazy(() => import('../pages/Inventory'));
const Customers = React.lazy(() => import('../pages/Customers'));
const AiAssistant = React.lazy(() => import('../pages/AiAssistant'));
const DataHub = React.lazy(() => import('../pages/DataHub'));
const History = React.lazy(() => import('../pages/History'));
const Settings = React.lazy(() => import('../pages/Settings'));

// Wrapper cho chức năng Suspense fallback khi đang load lazy chunks
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="flex h-screen w-full items-center justify-center bg-base">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        <span className="text-cyan font-medium animate-pulse">Đang tải dữ liệu...</span>
      </div>
    </div>
  }>
    {children}
  </Suspense>
);

const basename = import.meta.env.PROD ? '/ioc' : '/';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
      { path: 'gis', element: <SuspenseWrapper><Gis /></SuspenseWrapper> },
      { path: 'scada', element: <SuspenseWrapper><Scada /></SuspenseWrapper> },
      { path: 'production', element: <SuspenseWrapper><Production /></SuspenseWrapper> },
      { path: 'plants', element: <SuspenseWrapper><Plants /></SuspenseWrapper> },
      { path: 'quality', element: <SuspenseWrapper><Quality /></SuspenseWrapper> },
      { path: 'nrw', element: <SuspenseWrapper><Nrw /></SuspenseWrapper> },
      { path: 'business', element: <SuspenseWrapper><Business /></SuspenseWrapper> },
      { path: 'callcenter', element: <SuspenseWrapper><CallCenter /></SuspenseWrapper> },
      { path: 'hrm', element: <SuspenseWrapper><Hrm /></SuspenseWrapper> },
      { path: 'camera', element: <SuspenseWrapper><Camera /></SuspenseWrapper> },
      { path: 'incidents', element: <SuspenseWrapper><Incidents /></SuspenseWrapper> },
      { path: 'reports', element: <SuspenseWrapper><Reports /></SuspenseWrapper> },
      { path: 'ai-agent', element: <SuspenseWrapper><AiAgent /></SuspenseWrapper> },
      
      // Placeholder routes for new menu items
      { path: 'approve', element: <SuspenseWrapper><Approve /></SuspenseWrapper> },
      { path: 'videowall', element: <SuspenseWrapper><VideoWall /></SuspenseWrapper> },
      { path: 'lab', element: <SuspenseWrapper><Lab /></SuspenseWrapper> },
      { path: 'pumpscale', element: <SuspenseWrapper><PumpScale /></SuspenseWrapper> },
      { path: 'alertconfig', element: <SuspenseWrapper><AlertConfig /></SuspenseWrapper> },
      { path: 'inventory', element: <SuspenseWrapper><Inventory /></SuspenseWrapper> },
      { path: 'customers', element: <SuspenseWrapper><Customers /></SuspenseWrapper> },
      { path: 'ai-assistant', element: <SuspenseWrapper><AiAssistant /></SuspenseWrapper> },
      { path: 'data-hub', element: <SuspenseWrapper><DataHub /></SuspenseWrapper> },
      { path: 'history', element: <SuspenseWrapper><History /></SuspenseWrapper> },
      { path: 'settings', element: <SuspenseWrapper><Settings /></SuspenseWrapper> },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { index: true, element: <SuspenseWrapper><Login /></SuspenseWrapper> },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-base gap-6">
        <h1 className="text-9xl font-black text-cyan/20">404</h1>
        <p className="text-xl text-text-2">Không tìm thấy trang yêu cầu</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-blue hover:bg-blue/80 rounded-xl transition-all font-bold shadow-glow"
        >
          Quay lại trang chủ
        </button>
      </div>
    ),
  }
], { basename });

