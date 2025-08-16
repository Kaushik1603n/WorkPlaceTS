export interface ClientProfileType {
  _id: string;
  userId: string;
  profilePic?: string;
  coverPic?: string;
  companyName?: string;
  location?: string;
  website?: string;
  description?: string;
  totalJobsPosted: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FreelancerRatingStats {
  avgQuality: number;
  avgDeadlines: number;
  avgProfessionalism: number;
}
export interface FreelancerResultType {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profilePic?: string;
  bio?: string;
  location?: string;
  hourlyRate?: number;
  avgRating?: number;
  feedbackCount: number;
  freelancerRatings?: FreelancerRatingStats;
}

export interface FreelancerResultTypeWithPage {
  freelancers: FreelancerResultType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}

export interface ProjectStatsByMonth {
  month: string;      
  jobsPosted: number;  
  hiresMade: number;  
}

export interface ProjectJobCount {
  posted: number;  
  hired: number;  
}

export interface ProjectStatsResponse {
  result: ProjectStatsByMonth[];
  jobCount: ProjectJobCount;
}


export interface WeeklySpending {
  week: string;  
  spent: number;   
  avgCost: number; 
}

export interface AvgCostPerProject {
  avgCostPerProject: number;
  totalProjects: number;   
}

export interface FinancialStatsResponse {
  weeklySpending: WeeklySpending[];
  avgCostPerProject: AvgCostPerProject;
  totalSpent: number;
}

