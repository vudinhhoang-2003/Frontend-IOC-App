export type CallType = 'inbound' | 'outbound';
export type CallStatus = 'resolved' | 'pending' | 'escalated';
export type TicketStatus = 'new' | 'processing' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';
export type AgentStatusType = 'available' | 'busy' | 'break';

export interface CallLog {
  id: string;
  customer: string;
  phone: string;
  type: CallType;
  topic: string;
  note: string;
  ticketId?: string;
  agent: string;
  status: CallStatus;
  time: string;
}

export interface TicketTimeline {
  action: string;
  time: string;
  user: string;
  note: string;
}

export interface CallTicket {
  id: string;
  title: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee: string;
  calls: number;
  created: string;
  factory?: string;
  timeline?: TicketTimeline[];
  rating?: number;
  feedback?: string;
}

export interface AgentStatus {
  name: string;
  status: AgentStatusType;
}

export interface CallCenterStats {
  totalCalls: number;
  resolvedCalls: number;
  openTickets: number;
  csat: number;
  avgDuration: string;
  topTopic: string;
  topFactory: string;
}

export type CallCenterTab = 'stats' | 'calls' | 'tickets';
