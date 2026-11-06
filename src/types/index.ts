export interface Student {
  id: string;
  name: string;
  regNo: string;
  email: string;
  batch: string;
  year: string;
  capstoneGroup?: string;
}

export interface Session {
  id: string;
  title: string;
  cohort: string;
  date: string;
  time: string;
  timeDisplay?: string;
  duration?: string;
  platform: 'meet' | 'teams' | 'zoom' | 'hybrid' | string;
  platformName?: string;
  link: string;
  notes?: string;
  status: 'upcoming' | 'completed' | 'drafts';
  recipientGroup?: string;
  recipientText?: string;
  recipientCount?: number;
  selectedRecipients?: string[];
  deliveryRate?: string;
  openedCount?: number;
  created_at?: string;
}

export interface DispatchResultItem {
  recipient: string;
  messageId: string;
  status: string;
}

export interface EmailDispatchLog {
  id: string;
  title: string;
  date: string;
  time: string;
  totalAttempted: number;
  deliveredCount: number;
  failedCount: number;
  recipients: string[];
  results: DispatchResultItem[];
  errors: Array<{ recipient: string; error: string }>;
  timestamp: string;
}

export interface PortalStats {
  totalSessions: number;
  upcomingScheduled: number;
  completedSessions: number;
  drafts: number;
  totalStudents: number;
  totalEmailReach: number;
  engagementRate: string;
  deliveryRate: string;
  domainHealth: string;
}

export interface SmtpStatus {
  ready: boolean;
  user: string;
  host?: string;
  port?: number;
  message?: string;
  error?: string;
}

export interface SupabaseStatus {
  configured: boolean;
  endpoint: string;
}
