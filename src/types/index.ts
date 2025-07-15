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
  isNew?: boolean;
  tags: string[];
  attachments?: number;
  salary?: string;
  type?: string;
  content?: string;
  requirements?: string[];
  applicationUrl?: string;
  isSaved?: boolean;
  messageId?: string;
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

export const categoryLabels = {
  internship: "Internships",
  job: "Jobs", 
  hackathon: "Hackathons",
  scholarship: "Scholarships",
  event: "Events",
  competition: "Competitions"
} as const;

export const categoryIcons = {
  internship: "🎓",
  job: "💼", 
  hackathon: "⚔️",
  scholarship: "🏆",
  event: "📅",
  competition: "🏅"
} as const;