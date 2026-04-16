import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isSidebarOpen: boolean;
  isMobile: boolean;
  isDarkMode: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isSidebarOpen: window.innerWidth >= 1024,
      isMobile: window.innerWidth < 1024,
      isDarkMode: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      setIsMobile: (isMobile) => set((state) => {
        const newState: Partial<AppState> = { isMobile };
        if (isMobile && state.isSidebarOpen) {
          newState.isSidebarOpen = false;
        }
        return newState;
      }),
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'quawaco-ioc-settings', // key trong localStorage
      partialize: (state) => ({ isDarkMode: state.isDarkMode }), // chỉ lưu isDarkMode
    }
  )
);

// Helper function to initialize resize listener
export const initAppStore = () => {
  const handler = () => {
    const isMobile = window.innerWidth < 1024;
    useAppStore.getState().setIsMobile(isMobile);
  };
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
};
