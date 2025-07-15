export interface Opportunity {
  id: string;
  subject: string;
  company: string;
  category: 'internship' | 'job' | 'hackathon' | 'scholarship' | 'event' | 'competition';
  priority: 'high' | 'medium' | 'low';
  date: string;
  deadline?: string;
  location?: string;
  description: string;
  isNew: boolean;
  tags: string[];
  attachments?: number;
  salary?: string;
  type?: string;
}

export interface CategoryStats {
  total: number;
  new: number;
  urgent: number;
}

export type CategoryType = Opportunity['category'];

export interface FilterState {
  category: CategoryType | 'all';
  priority: 'all' | 'high' | 'medium' | 'low';
  dateRange: 'all' | 'today' | 'week' | 'month';
  company: string;
}