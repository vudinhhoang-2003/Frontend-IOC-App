import logo from '../../../assets/quawaco_logo.png';
import systemLogo from '../../../assets/system-logo.png';
import systemLogoSmall from '../../../assets/system-logo-small.png';
import { menuCategories } from '../../../constants/menu';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const { t } = useTranslation();
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen);
  const isMobile = useAppStore((state) => state.isMobile);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

  const handleNavClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const isCollapsed = !isSidebarOpen && !isMobile;

  return (
    <aside
      className={cn(
        "h-screen flex flex-col relative z-[100] transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] backdrop-blur-md border-r border-[var(--border)] bg-[var(--bg-header)]",
        isCollapsed ? "w-[64px] min-w-[64px]" : "w-[var(--sidebar-w)] min-w-[var(--sidebar-w)]"
      )}
      id="sidebar"
    >
      <div className="flex items-center gap-[10px] px-[14px] py-[16px] border-b border-[var(--border)] min-h-[var(--header-h)]">
        <div className="w-[34px] h-[34px] min-w-[34px] bg-gradient-to-br from-[#0050cc] to-[#00c8ff] rounded-[9px] flex items-center justify-center shadow-[0_0_14px_rgba(0,200,255,0.35)] overflow-hidden">
          <img src={logo} alt="Quawaco" className="w-full h-full object-contain" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <h2 className="text-[15px] font-bold tracking-[1.5px] text-[var(--text)] leading-none mb-1">QUAWACO</h2>
            <span className="text-[9px] tracking-[3px] text-[var(--cyan)] font-mono uppercase">IOC Center</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-[10px] custom-scrollbar" id="sidebarNav">
        {menuCategories.map((category) => (
          <div key={category.titleKey} className="mb-1">
            {!isCollapsed && (
              <div className="text-[10px] font-semibold tracking-[1.5px] text-[var(--muted)] uppercase px-2 pt-[14px] pb-[6px] whitespace-nowrap overflow-hidden opacity-100 transition-opacity duration-300">
                {t(category.titleKey)}
              </div>
            )}
            {category.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) => cn(
                  "flex items-center gap-[11px] px-[10px] py-[10px] rounded-[9px] cursor-pointer transition-all duration-300 mb-[2px] relative whitespace-nowrap group",
                  isActive ? "bg-[rgba(0,200,255,0.1)] text-[var(--cyan)]" : "text-[var(--text)] hover:bg-[var(--bg-hover)] hover:text-[var(--cyan)]"
                )}
                title={isCollapsed ? t(item.translationKey) : ""}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[var(--cyan)] rounded-r-[2px] shadow-[0_0_8px_var(--cyan)]" />
                    )}
                    <div className={cn("w-5 h-5 min-w-[20px] transition-opacity duration-300", isActive ? "opacity-100" : "opacity-85 group-hover:opacity-100")}>
                      <item.icon size={20} />
                    </div>
                    {!isCollapsed && (
                      <span className="text-[13px] font-medium overflow-hidden">{t(item.translationKey)}</span>
                    )}
                    {item.badge && !isCollapsed && (
                      <span className="ml-auto bg-[var(--red)] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-[10px] min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    )}
                    {item.badge && isCollapsed && (
                      <div className="absolute top-[-5px] right-[-6px] bg-[var(--red)] text-white text-[9px] font-bold min-w-[15px] h-[15px] px-1 rounded-[8px] text-center leading-[15px] shadow-[0_0_0_2px_var(--bg-surface)] z-10 pointer-events-none">
                        {item.badge}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-[rgba(255,255,255,0.05)] mx-3">
        {/* Expanded: text + full logo on same row */}
        {!isCollapsed ? (
          <div className="flex items-center justify-center gap-2 py-3">
            <div className="text-[10px] text-[var(--muted)] tracking-[1px] uppercase font-mono">
              Powered By
            </div>
            <img src={systemLogo} alt="System Logo" className="h-7 object-contain opacity-85" />
          </div>
        ) : (
          /* Collapsed: "By" label above, small icon below */
          <div className="flex flex-col items-center justify-center gap-1 py-[10px]">
            <div className="text-[9px] text-[var(--muted)] tracking-[1px] uppercase font-mono">
              By
            </div>
            <img src={systemLogoSmall} alt="System" className="w-8 h-8 object-contain opacity-85" />
          </div>
        )}
      </div>
    </aside>
  );
}
