/**
 * Định nghĩa các kiểu dữ liệu cho phân hệ Điều hành & Phê duyệt
 */

export type ApprovalType = 'kpi_import' | 'data_export' | 'scada_ctrl' | 'role_change' | 'user_mgmt' | 'api_key' | 'report_sign' | 'alert_ack';
export type UrgencyLevel = 'high' | 'med' | 'low';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface KPIData {
  kpi: string;
  val: string;
  conf: number;
}

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  urgency: UrgencyLevel;
  title: string;
  desc: string;
  submitter: string;
  submitterRole: string;
  submitterAvatar: string;
  submittedAt: string;
  files: string[];
  note: string;
  data: KPIData[];
  status: ApprovalStatus;
  requesterVerifiedOtp?: boolean;
}

export interface ApprovalHistory {
  id: string;
  type: ApprovalType;
  title: string;
  submitter: string;
  approver: string;
  approvedAt: string;
  status: 'approved' | 'rejected';
  note: string;
}

export interface ApprovalSetting {
  id: ApprovalType;
  name: string;
  desc: string;
  needApproval: boolean;
  approver: string;
  minApprovers: number;
  notify: boolean;
}
