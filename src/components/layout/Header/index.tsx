import { useAppStore } from '../../../store/useAppStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuItems } from '../../../constants/menu';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentPath = location.pathname.toLowerCase();
  const currentMenuItem = menuItems.find(item => 
    item.path.toLowerCase() === currentPath || 
    (currentPath === '/' && item.path.toLowerCase() === '/dashboard')
  );
  
  const pageTitle = currentMenuItem ? t(currentMenuItem.translationKey) : t('dashboard.title');

  const formatTime = (date: Date) => {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  const formatDate = (date: Date) => {
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    const weekday = date.toLocaleDateString(locale, { weekday: 'short' });
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return i18n.language === 'vi' 
      ? `${weekday}, ${day}/${month}/${year}`
      : `${weekday}, ${month}/${day}/${year}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
  };

  return (
    <header className="h-[var(--header-h)] bg-[var(--bg-header)] backdrop-blur-md border-b border-[var(--border)] flex items-center px-5 gap-4 sticky top-0 z-[500]">
      <div className="flex items-center gap-[14px]">
        <button 
          className="bg-none border-none cursor-pointer text-[var(--muted)] p-1.5 rounded-md flex transition-colors hover:text-[var(--cyan)]" 
          onClick={toggleSidebar} 
          title="Thu/Mở sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="text-[13px] text-[var(--muted)]">
          <strong className="text-[var(--text)]">{pageTitle || 'Dashboard'}</strong>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-[7px] text-[12px] font-mono text-[var(--muted)]">
          <div className="w-[7px] h-[7px] bg-[var(--green)] rounded-full shadow-[0_0_8px_var(--green)] animate-[pd_2s_ease-in-out_infinite]"></div>
          <span>Hệ thống hoạt động bình thường</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-none border-none cursor-pointer text-[var(--muted)] relative p-1.5 rounded-md flex transition-colors hover:text-[var(--cyan)]" title="Cảnh báo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute top-0 right-0 bg-[var(--red)] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button>

        <div className="flex items-center gap-2 mr-3 pr-4 border-r border-[rgba(255,255,255,0.1)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.5">
            <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1166 20.1517 10.1683 17.8091 10.0152C17.3875 6.6346 14.4984 4 11 4C7.13401 4 4 7.13401 4 11C4 11.2312 4.01121 11.4597 4.03306 11.6845C2.28588 12.3023 1 13.9961 1 16C1 18.2091 2.79086 20 5 20H17.5V19Z" fill="rgba(0,200,255,.1)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="leading-[1.2] text-left">
            <div className="text-[13px] font-semibold text-[var(--text)]">24°C Hạ Long</div>
            <div className="text-[10px] text-[var(--muted)]">Độ ẩm 78% · Gió ĐN 4m/s</div>
          </div>
        </div>

        <div>
          <div className="font-mono text-[13px] text-[var(--cyan)] min-w-[80px] text-right">{formatTime(time)}</div>
          <div className="font-mono text-[11px] text-[var(--muted)]">{formatDate(time)}</div>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[9px] cursor-pointer border border-[var(--border)] transition-all hover:border-[rgba(0,200,255,0.3)] hover:bg-[rgba(0,200,255,0.04)]">
          <div className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center text-[16px] bg-gradient-to-br from-[#0050cc] to-[#00c8ff] border-[1.5px] border-[rgba(0,200,255,0.3)]">👨‍💻</div>
          <div className="leading-[1.3]">
            <div className="text-[13px] font-semibold">{user?.full_name || 'Người dùng'}</div>
            <div className="text-[10px] text-[var(--muted)] capitalize">{user?.role || '—'}</div>
          </div>
        </div>

        <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-[12px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[var(--muted)] transition-all hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] hover:text-[var(--text)]" onClick={toggleTheme}>
           {isDarkMode ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
          <span className="text-[12px] font-semibold">{isDarkMode ? 'Sáng' : 'Tối'}</span>
        </button>

        <button 
          className="flex items-center justify-center p-1.5 rounded-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[var(--muted)] transition-all hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--text)]" 
          onClick={toggleFullscreen} 
          title="Toàn màn hình"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
          </svg>
        </button>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)] text-[var(--text)] text-[12.5px] font-semibold transition-all hover:bg-[rgba(255,61,87,0.05)] hover:border-[rgba(255,61,87,0.2)] hover:text-[var(--red)]" onClick={handleLogout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}




