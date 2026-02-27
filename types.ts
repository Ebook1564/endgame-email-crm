export enum DealStage {
  LEAD = 'Lead',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost',
}

export enum TaskStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  OVERDUE = 'Overdue',
}

export enum EmailStatus {
  INBOX = 'Inbox',
  SENT = 'Sent',
  DRAFT = 'Draft',
  TRASH = 'Trash',
  UNANSWERED = 'Unanswered',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  ownerId: string;
  closeDate: string;
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  assigneeId: string;
  status: TaskStatus;
  relatedDealId?: string;
  relatedEmailId?: string;
}

export interface Email {
  id: string;
  subject: string;
  sender: User | string;
  recipient: User | string;
  snippet: string;
  body: string;
  date: string;
  isRead: boolean;
  status: EmailStatus;
  labels: string[];
  dealId?: string;
  hasAttachment: boolean;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  // New fields for unanswered emails
  threadLink?: string;
  lastReply?: string;
  response?: string;
  notes?: string;
}

export interface Activity {
  id: string;
  type: 'email' | 'deal' | 'task';
  description: string;
  timestamp: string;
  user?: User;
  dealId?: string;
}

export interface FilterState {
  search: string;
  status: EmailStatus | 'All';
  stage: DealStage | 'All';
  dateRange: 'All' | 'Today' | 'Last 7 Days' | 'Last 30 Days';
  hasAttachment: boolean | 'All';
  sentiment: 'All' | 'Positive' | 'Neutral' | 'Negative';
}

export interface SortState {
  field: keyof Email | 'dealValue';
  direction: 'asc' | 'desc';
}
