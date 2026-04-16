/**
 * Auth Service – kết nối các endpoint xác thực từ BE
 * Base URL: https://dev.iclever.vn/projects/quawaco/api/v1
 */
import apiClient from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  /** Access token (JWT) dùng để gọi API */
  access_token: string;
  /** Refresh token để làm mới access_token */
  refresh_token: string;
  /** Thông tin người dùng */
  user: UserProfile;
  /** Bước tiếp theo sau login: 'mfa_required' nếu cần 2FA, 'success' nếu không */
  next_step: 'mfa_required' | 'success';
  /** Danh sách phương thức MFA khả dụng (nếu next_step = 'mfa_required') */
  mfa_methods?: ('totp' | 'sms' | 'email' | 'zalo')[];
  /** Token tạm thời dùng khi verify 2FA (thay vì access_token) */
  mfa_token?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'dispatcher' | 'operator' | 'viewer' | 'executive' | 'workforce';
  dept?: string;
  factory_id?: number;
  phone?: string;
  avatar_url?: string;
  specialization?: string;
  can_scada_control: boolean;
  is_active: boolean;
  last_login?: string;
}

export interface Verify2FARequest {
  /** Token tạm thời nhận được sau bước login */
  mfa_token: string;
  /** Phương thức xác thực */
  method: 'totp' | 'sms' | 'email' | 'zalo';
  /** Mã OTP 6 số */
  code: string;
}

export interface Verify2FAResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
}

export interface SendOtpRequest {
  /** Token tạm thời nhận được sau bước login */
  mfa_token: string;
  /** Kênh gửi OTP */
  method: 'sms' | 'email' | 'zalo';
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

// ─── Helper: chuẩn hoá lỗi API ───────────────────────────────────────────────
export const extractApiError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      'Đã xảy ra lỗi. Vui lòng thử lại.'
    );
  }
  if (error instanceof Error) return error.message;
  return 'Đã xảy ra lỗi không xác định.';
};

// ─── Auth Service ─────────────────────────────────────────────────────────────

const authService = {
  /**
   * Đăng nhập bằng username/password
   * POST /auth/login
   */
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  /**
   * Gửi OTP qua kênh chỉ định (SMS/Email/Zalo)
   * POST /auth/otp/send
   */
  sendOtp: async (payload: SendOtpRequest): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>('/auth/otp/send', payload);
    return data;
  },

  /**
   * Xác thực mã 2FA (TOTP hoặc OTP)
   * POST /auth/2fa/verify
   */
  verify2FA: async (payload: Verify2FARequest): Promise<Verify2FAResponse> => {
    const { data } = await apiClient.post<Verify2FAResponse>('/auth/2fa/verify', payload);
    return data;
  },

  /**
   * Đăng xuất – revoke token trên server
   * POST /auth/logout
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Luôn xóa token local dù server lỗi
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  /**
   * Làm mới access token
   * POST /auth/refresh
   */
  refresh: async (refreshToken: string): Promise<{ access_token: string; refresh_token?: string }> => {
    const { data } = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    return data?.data || data;
  },
};

export default authService;
