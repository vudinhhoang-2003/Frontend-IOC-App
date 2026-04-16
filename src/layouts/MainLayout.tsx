import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { useAppStore } from '../store/useAppStore';

import AIBot from '../components/common/AIBot';



export default function MainLayout() {
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen);
  const isMobile = useAppStore((state) => state.isMobile);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  // Sync theme with body class
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  }, [isDarkMode]);

  return (
    <div className="app" id="app">
      {/* Mobile Backdrop */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Component renders <aside class="sidebar"> */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-wrapper">
        <Header />
        <main className="content-area" id="contentArea">
          <Outlet />
        </main>
      </div>
      
      <AIBot />
    </div>
  );
}

