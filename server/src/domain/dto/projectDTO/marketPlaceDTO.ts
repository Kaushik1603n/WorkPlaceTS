// src/interfaces/dtos/PaginatedJobResponseDTO.ts
import { Job } from "../../interfaces/entities/Job";
export interface PaginatedJobResponseDTO {
  result: Job[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

export interface JobFilterDTO {
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

export type JobQueryParamsDTO = {
  search?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  jobTypes?: string;
  skills?: string;
  experienceLevel?: string;
  page: number;
  limit: number;
};
