export interface ClientProfileType {
  _id?: string;
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
