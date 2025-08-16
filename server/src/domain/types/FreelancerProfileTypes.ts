import { TicketType } from "./ClientJobType";

export interface FreelancerProfileTypes {
  _id: string;
  userId: string;
  profilePic?: string;
  coverPic?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  location?: string;
  availability?: "full-time" | "part-time" | "not-available";
  experienceLevel?: string;
  education?: string;
  languages?: string;
  reference?: string;
  rating?: number;
  totalJobs?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClientRatingStats {
  avgClarity: number;
  avgPayment: number;
  avgCommunication: number;
}

export interface ClientResultType {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profilePic?: string;
  hourlyRate?: number;
  location?: string;
  description?: string;
  avgRating?: number;
  feedbackCount: number;
  clientRatings?: ClientRatingStats;
}

export interface PaginatedClientResult {
  clients: ClientResultType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}

export interface FreelancerTicketWithPagination {
  result: TicketType[];
  totalPages: number;
}

export interface FreelancerCounts {
  totalJob: number;
  completedJob: number;
  activeJob: number;
  avgEarnings: number;
  totalProposal: number;
}


export interface WeeklyPayment {
  earnings: number;
  projects: number;
  week: string;
}

export interface MonthlyStats {
  totalMonthlyEarnings: number;
  paymentCount: number;
}

export interface FreelacerTotalEarningsResponse {
  totalPayments: number;
  pendingPayments: number;
  weeklyPayments: WeeklyPayment[];
  monthlyStats: MonthlyStats;
}

export interface ProjectSummary {
  _id: string;             
  clientId: string;        
  title: string;
  budget: number;
  status?: string; 
  createdAt: Date;
}

export interface TotalProjectResponse {
  allProject: ProjectSummary[];
  totalProject: number;
  completedProject: number;
  activeProject: number;
}

