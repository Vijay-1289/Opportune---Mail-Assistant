import { Opportunity } from "@/types";

export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    subject: "Summer 2024 Software Engineering Internship",
    company: "Google",
    category: "internship",
    priority: "high",
    date: "2024-01-15",
    deadline: "2024-02-28",
    location: "Mountain View, CA",
    description: "Join our world-class engineering team and work on products used by billions of users worldwide.",
    isNew: true,
    tags: ["Software Engineering", "Python", "Machine Learning"],
    attachments: 2,
    salary: "$8,500/month"
  },
  {
    id: "2",
    subject: "Frontend Developer Position - Remote",
    company: "Stripe",
    category: "job",
    priority: "high",
    date: "2024-01-14",
    deadline: "2024-03-15",
    location: "Remote",
    description: "Build and maintain our payment infrastructure used by millions of businesses worldwide.",
    isNew: true,
    tags: ["React", "TypeScript", "Remote"],
    attachments: 1,
    salary: "$120k - $180k",
    type: "Full-time"
  },
  {
    id: "3",
    subject: "AI/ML Hackathon 2024 - Win $50K",
    company: "TechCrunch",
    category: "hackathon",
    priority: "medium",
    date: "2024-01-13",
    deadline: "2024-02-10",
    location: "San Francisco, CA",
    description: "Build the next generation of AI applications in this 48-hour hackathon.",
    isNew: false,
    tags: ["AI", "Machine Learning", "48 hours"],
    attachments: 3
  },
  {
    id: "4",
    subject: "Grace Hopper Scholarship 2024",
    company: "ACM",
    category: "scholarship",
    priority: "high",
    date: "2024-01-12",
    deadline: "2024-03-01",
    location: "Orlando, FL",
    description: "Full scholarship to attend the Grace Hopper Conference including travel and accommodation.",
    isNew: true,
    tags: ["Women in Tech", "Conference", "Networking"],
    attachments: 1
  },
  {
    id: "5",
    subject: "React Conference 2024 - Early Bird Tickets",
    company: "React Team",
    category: "event",
    priority: "medium",
    date: "2024-01-11",
    deadline: "2024-01-31",
    location: "Las Vegas, NV",
    description: "Learn about the latest React features and best practices from the core team.",
    isNew: false,
    tags: ["React", "Conference", "JavaScript"],
    attachments: 0
  },
  {
    id: "6",
    subject: "International Coding Competition 2024",
    company: "CodeChef",
    category: "competition",
    priority: "medium",
    date: "2024-01-10",
    deadline: "2024-02-20",
    location: "Online",
    description: "Compete with programmers worldwide and win cash prizes up to $10,000.",
    isNew: false,
    tags: ["Competitive Programming", "Algorithms", "Prize"],
    attachments: 1
  },
  {
    id: "7",
    subject: "Product Manager Internship",
    company: "Meta",
    category: "internship",
    priority: "high",
    date: "2024-01-09",
    deadline: "2024-02-15",
    location: "Menlo Park, CA",
    description: "Lead product development for next-generation social media features.",
    isNew: true,
    tags: ["Product Management", "Strategy", "Innovation"],
    attachments: 2,
    salary: "$9,000/month"
  },
  {
    id: "8",
    subject: "Senior DevOps Engineer",
    company: "Netflix",
    category: "job",
    priority: "medium",
    date: "2024-01-08",
    deadline: "2024-03-30",
    location: "Los Gatos, CA",
    description: "Scale our global streaming infrastructure to serve 250+ million members.",
    isNew: false,
    tags: ["DevOps", "AWS", "Kubernetes"],
    attachments: 1,
    salary: "$150k - $220k",
    type: "Full-time"
  },
  {
    id: "9",
    subject: "Blockchain Hackathon - DeFi Track",
    company: "Ethereum Foundation",
    category: "hackathon",
    priority: "low",
    date: "2024-01-07",
    deadline: "2024-02-25",
    location: "Denver, CO",
    description: "Build innovative DeFi applications on Ethereum and win crypto prizes.",
    isNew: false,
    tags: ["Blockchain", "DeFi", "Ethereum"],
    attachments: 2
  },
  {
    id: "10",
    subject: "Women in STEM Leadership Grant",
    company: "IEEE",
    category: "scholarship",
    priority: "medium",
    date: "2024-01-06",
    deadline: "2024-04-15",
    location: "Various",
    description: "Support for women pursuing leadership roles in STEM fields.",
    isNew: false,
    tags: ["Women in STEM", "Leadership", "Grant"],
    attachments: 3
  }
];

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