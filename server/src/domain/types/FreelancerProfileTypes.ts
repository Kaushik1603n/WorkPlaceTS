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
