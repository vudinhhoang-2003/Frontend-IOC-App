/**
 * Auth Store – quản lý trạng thái xác thực toàn ứng dụng
 * Lưu access_token vào localStorage để persist qua reload
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '../services/authService';
import authService from '../services/authService';

interface AuthState {
  // ─── State ────────────────────────────────────────────────────────────────
  isAuthenticated: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;

  // ─── Actions ──────────────────────────────────────────────────────────────
  /** Gọi sau khi verify 2FA thành công – lưu token và user */
  loginSuccess: (accessToken: string, refreshToken: string, user: UserProfile) => void;
  /** Đăng xuất: xóa token + gọi API logout */
  logout: () => Promise<void>;
  /** Cập nhật thông tin user (dùng cho profile update sau này) */
  setUser: (user: UserProfile) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Giá trị mặc định – chưa đăng nhập
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      loginSuccess: (accessToken, refreshToken, user) => {
        // Lưu token vào localStorage để Axios interceptor dùng
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        set({ isAuthenticated: true, user, accessToken, refreshToken });
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // Bỏ qua lỗi khi gọi logout API, vẫn xóa state local
        } finally {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({ isAuthenticated: false, user: null, accessToken: null, refreshToken: null });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'quawaco-auth', // key trong localStorage
      // Chỉ persist những field cần thiết
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      // Đồng bộ token vào localStorage khi hydrate từ persist
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) localStorage.setItem('access_token', state.accessToken);
        if (state?.refreshToken) localStorage.setItem('refresh_token', state.refreshToken);
      },
    }
  )
);
