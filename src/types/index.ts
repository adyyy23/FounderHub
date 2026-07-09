export type InvestorStage = 'SOURCED' | 'CONTACTED' | 'INTERESTED' | 'NEGOTIATING';
export type GoalCategory = 'product' | 'growth' | 'ops';
export type IdeaStatus = 'scoping' | 'validation' | 'backlog' | 'ready';
export type RoadmapItemStatus = 'backlog' | 'sprint' | 'gantt';
export type NotificationType = 'info' | 'success' | 'warning' | 'action';

export interface Investor {
  id: string;
  name: string;
  firm: string;
  sentiment: string;
  sentimentColor: string;
  commitment: string;
  lastActive: string;
  img: string;
  chartIdx: number;
  stage: InvestorStage;
  email?: string;
  bio?: string;
}

export interface KeyResult {
  label: string;
  current: number;
  target: number;
  unit: string;
  inverse?: boolean;
}

export interface Goal {
  id: string;
  category: string;
  categoryColor: string;
  dotColor: string;
  title: string;
  completion: number;
  confidence: string;
  owner: string;
  keyResults: KeyResult[];
  tab: GoalCategory;
}

export interface Milestone {
  id: string;
  date: string;
  label: string;
  done: boolean;
}

export interface Idea {
  id: string;
  category: string;
  categoryColor: string;
  impact: number;
  title: string;
  desc: string;
  confidence: number;
  effort: number;
  status: IdeaStatus;
  statusColor: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  status: RoadmapItemStatus;
  priority?: string;
  assignee?: string;
  startMonth?: number;
  duration?: number;
  color?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  dept: string;
  deptColor: string;
  load: number;
  status: string;
  img: string;
  email?: string;
}

export interface TeamTask {
  id: string;
  title: string;
  assignee: string;
  time: string;
  urgent: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: NotificationType;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  current: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ActivityUpdate {
  id: string;
  icon: string;
  title: string;
  time: string;
  desc: string;
  color: string;
  bg: string;
}

export interface DashboardInvestor {
  id: string;
  name: string;
  firm: string;
  amount: string;
  img: string;
}
