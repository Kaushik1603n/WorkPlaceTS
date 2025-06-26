export interface JobTypes {
  _id: string;
  job_Id: string;
  title: string;
  stack: string;
  description: string;
  skills: string[];
  budget?: number;
  proposals?: string[];
  createdAt: string;
}
export interface PaginatedJobResponseTypes {
  result: JobTypes[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

export interface JobFilterTypes {
  searchQuery: {
    search?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    jobTypes?: string;
    skills?: string;
    experienceLevel?: string;
  };
  page: number;
  limit: number;
}

export type JobQueryParamsTypes = {
  search?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  jobTypes?: string;
  skills?: string;
  experienceLevel?: string;
  page: number;
  limit: number;
};

export interface Client {
  fullName?: string;
  email?: string;
}
export interface ProjectDetailsTypes {
  title?: string;
  description?: string;
  stack?: string;
  time?: string;
  reference?: string;
  requiredFeatures?: string;
  budgetType?: string;
  budget?: string | number;
  experienceLevel?: string;
  clientId?: Client;
}

export interface MarketPlaceClientProjectTypes {
  _id: string;
  contractId: string;
  budget: number;
  budgetType: string;
  time: string;
  status: string;
  title: string;
  description: string;
}

export interface freelancerProjectType {
  _id: string;
  contractId: string;
  budget: number;
  budgetType: string;
  time: string;
  status: string;
  title: string;
  description: string;
}